import prisma from '@/config/prisma'

import { comparePassword } from '@/utils/password'

import { generateAccessToken } from '@/utils/jwt'

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

  const token = generateAccessToken({
    adminId: admin.id,
    role: admin.role
  })

  return {
    token,
    admin
  }
}