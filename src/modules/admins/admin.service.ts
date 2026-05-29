import prisma from '@/config/prisma'

import { hashPassword } from '@/utils/password'
import { generateVerificationToken } from '@/services/email.service'

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

  const { token: verificationToken, expires: verificationTokenExpires } = generateVerificationToken()

  return prisma.admin.create({
    data: {
      fullname: data.fullname,
      email: data.email,
      password: hashedPassword,
      role: 'ADMIN',
      verificationToken,
      verificationTokenExpires
    }
  })
}

export const listAdmins = async (
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit

  const [admins, total] = await Promise.all([
    prisma.admin.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        avatar: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        permissions: {
          select: {
            name: true
          }
        }
      }
    }),
    prisma.admin.count()
  ])

  return {
    data: admins,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export const getAdmin = async (id: string) => {
  const admin = await prisma.admin.findUnique({
    where: { id },
    select: {
      id: true,
      fullname: true,
      email: true,
      avatar: true,
      role: true,
      isActive: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      permissions: {
        select: {
          name: true
        }
      }
    }
  })

  if (!admin) {
    throw new Error('Admin not found')
  }

  return admin
}

export const updateAvatar = async (
  adminId: string,
  avatar: string
) => {
  return prisma.admin.update({
    where: { id: adminId },
    data: { avatar },
    select: {
      id: true,
      fullname: true,
      email: true,
      avatar: true,
      role: true,
      isActive: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      permissions: {
        select: {
          name: true
        }
      }
    }
  })
}

export const deleteAdmin = async (id: string) => {
  const admin = await prisma.admin.findUnique({ where: { id } })
  if (!admin) throw new Error('Admin not found')

  await prisma.admin.delete({ where: { id } })
  return { message: 'Admin deleted' }
}

export const updateAdminStatus = async (id: string, isActive: boolean) => {
  const admin = await prisma.admin.findUnique({ where: { id } })
  if (!admin) throw new Error('Admin not found')

  return prisma.admin.update({
    where: { id },
    data: { isActive },
    select: {
      id: true,
      fullname: true,
      email: true,
      avatar: true,
      role: true,
      isActive: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      permissions: {
        select: { name: true }
      }
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
        set: existingPermissions.map(
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