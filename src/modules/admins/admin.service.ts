import prisma from '@/config/prisma'

import { hashPassword } from '@/utils/password'

export const createAdmin = async (
  data: any
) => {
  const existing = await prisma.admin.findUnique({
    where: {
      email: data.email
    }
  })

  if (existing) {
    throw new Error('Email already exists')
  }

  const hashedPassword = await hashPassword(
    data.password
  )

  return prisma.admin.create({
    data: {
      fullname: data.fullname,
      email: data.email,
      password: hashedPassword,
      role: 'ADMIN'
    }
  })
}

export const assignPermissions = async (
  adminId: string,
  permissions: string[]
) => {
  const existingPermissions =
    await prisma.permission.findMany({
      where: {
        name: {
          in: permissions
        }
      }
    })

  return prisma.admin.update({
    where: {
      id: adminId
    },

    data: {
      permissions: {
        connect: existingPermissions.map(
          permission => ({
            id: permission.id
          })
        )
      }
    },

    include: {
      permissions: true
    }
  })
}