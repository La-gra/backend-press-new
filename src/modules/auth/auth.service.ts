import prisma from '@/config/prisma'

import { comparePassword } from '@/utils/password'

import {
  generateAccessToken,
  generateRefreshToken
} from '@/utils/jwt'

export const loginAdmin = async (
  email: string,
  password: string
) => {
  const admin = await prisma.admin.findUnique({
    where: {
      email
    },

    include: {
      permissions: true
    }
  })

  if (!admin) {
    throw new Error('Invalid credentials')
  }

  const validPassword = await comparePassword(
    password,
    admin.password
  )

  if (!validPassword) {
    throw new Error('Invalid credentials')
  }

  if (!admin.isVerified && admin.role !== 'SUPER_ADMIN') {
    throw new Error('Email not verified')
  }

  const accessToken = generateAccessToken({
    adminId: admin.id,
    role: admin.role
  })

  const refreshToken = generateRefreshToken({
    adminId: admin.id,
    role: admin.role
  })

  return {
    accessToken,
    refreshToken,
    admin
  }
}