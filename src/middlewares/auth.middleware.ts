import { Request, Response, NextFunction } from 'express'

import jwt from 'jsonwebtoken'

import prisma from '@/config/prisma'
import { apiResponse } from '@/utils/apiResponse'

export interface AuthRequest extends Request {
  admin?: {
    id: string
    role: 'ADMIN' | 'SUPER_ADMIN'
    permissions?: { name: string }[]
  }
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.access_token

    if (!token) {
      return apiResponse.error(res, 'Unauthorized', 401)
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as any

    const admin = await prisma.admin.findUnique({
      where: {
        id: decoded.adminId
      },

      include: {
        permissions: true
      }
    })

    if (!admin || !admin.isActive) {
      return apiResponse.error(res, 'Unauthorized', 401)
    }

    req.admin = admin

    next()
  } catch {
    return apiResponse.error(res, 'Unauthorized', 401)
  }
}