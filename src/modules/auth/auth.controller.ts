import { Request, Response } from 'express'

import prisma from '@/config/prisma'
import { loginAdmin } from './auth.service'
import { AuthRequest } from '@/middlewares/auth.middleware'

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body

    const { token, admin } = await loginAdmin(
      email,
      password
    )

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    })

    return res.json({ admin })
  } catch (error: any) {
    return res.status(401).json({
      message: error.message
    })
  }
}

export const logout = async (
  req: Request,
  res: Response
) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })

  return res.json({ message: 'Déconnecté' })
}

export const me = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin!.id },
      include: { permissions: true },
    })

    if (!admin) {
      return res.status(404).json({
        message: 'Admin introuvable'
      })
    }

    return res.json({ admin })
  } catch (err) {
    return res.status(500).json({
      message: 'Erreur serveur'
    })
  }
}