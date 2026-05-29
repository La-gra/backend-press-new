import { Request, Response } from 'express'

import prisma from '@/config/prisma'
import { loginAdmin } from './auth.service'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '@/utils/jwt'
import { apiResponse } from '@/utils/apiResponse'
import { AuthRequest } from '@/middlewares/auth.middleware'
import { comparePassword, hashPassword } from '@/utils/password'

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body

    const {
      accessToken,
      refreshToken,
      admin
    } = await loginAdmin(email, password)

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000
    })

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return apiResponse.success(res, { admin }, 'Login successful')
  } catch (error: any) {
    return apiResponse.error(
      res,
      error.message || 'Invalid credentials',
      401
    )
  }
}

export const refresh = async (
  req: Request,
  res: Response
) => {
  try {
    const token = req.cookies.refresh_token

    if (!token) {
      return apiResponse.error(res, 'Unauthorized', 401)
    }

    const decoded = verifyRefreshToken(token) as any

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId },
      include: { permissions: true }
    })

    if (!admin || !admin.isActive) {
      return apiResponse.error(res, 'Unauthorized', 401)
    }

    const accessToken = generateAccessToken({
      adminId: admin.id,
      role: admin.role
    })

    const refreshToken = generateRefreshToken({
      adminId: admin.id,
      role: admin.role
    })

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000
    })

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return apiResponse.success(res, { admin }, 'Token refreshed')
  } catch (error: any) {
    return apiResponse.error(res, error.message || 'Unauthorized', 401)
  }
}

export const logout = async (
  req: Request,
  res: Response
) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  })

  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  })

  return apiResponse.success(res, null, 'Déconnecté')
}

export const verifyEmail = async (
  req: Request,
  res: Response
) => {
  try {
    const { token } = req.body

    const admin = await prisma.admin.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: { gt: new Date() }
      }
    })

    if (!admin) {
      return apiResponse.error(res, 'Token invalide ou expiré', 400)
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null
      }
    })

    return apiResponse.success(res, null, 'Email vérifié avec succès')
  } catch (err) {
    return apiResponse.error(res, 'Erreur serveur', 500)
  }
}

export const changePassword = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { oldPassword, newPassword } = req.body

    const admin = await prisma.admin.findUnique({
      where: { id: req.admin!.id }
    })

    if (!admin) {
      return apiResponse.error(res, 'Admin introuvable', 404)
    }

    const valid = await comparePassword(oldPassword, admin.password)

    if (!valid) {
      return apiResponse.error(res, 'Ancien mot de passe incorrect', 400)
    }

    const hashed = await hashPassword(newPassword)

    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashed }
    })

    return apiResponse.success(res, null, 'Mot de passe modifié avec succès')
  } catch (err) {
    return apiResponse.error(res, 'Erreur serveur', 500)
  }
}

export const me = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin!.id },
      include: { permissions: true }
    })

    if (!admin) {
      return apiResponse.error(res, 'Admin introuvable', 404)
    }

    return apiResponse.success(res, { admin })
  } catch (err: any) {
    return apiResponse.error(res, 'Erreur serveur', 500)
  }
}