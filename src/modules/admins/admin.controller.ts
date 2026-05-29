import { Request, Response } from 'express'

import * as adminService from './admin.service'
import { apiResponse } from '@/utils/apiResponse'
import { AuthRequest } from '@/middlewares/auth.middleware'
import { sendVerificationEmail } from '@/services/email.service'

export const createAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const admin = await adminService.createAdmin(req.body)

    const { verificationToken, verificationTokenExpires, password, ...safeAdmin } = admin

    if (admin.verificationToken) {
      sendVerificationEmail(admin.email, admin.fullname, admin.verificationToken, req.body.password)
        .then(() => {
          console.log(`[ADMIN] Verification email sent to ${admin.email}`)
        })
        .catch((err) => {
          console.error(`[ADMIN] Failed to send verification email to ${admin.email}:`, err?.response?.body || err?.message || err)
        })
    }

    return apiResponse.success(res, { admin: safeAdmin }, 'Admin created', 201)
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
}

export const listAdmins = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    const result = await adminService.listAdmins(page, limit)

    return apiResponse.success(res, result)
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
}

export const getAdmin = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const adminId = (
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    ) as string

    const admin = await adminService.getAdmin(adminId)

    return apiResponse.success(res, { admin })
  } catch (error: any) {
    return apiResponse.error(res, error.message, 404)
  }
}

export const uploadAvatar = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const adminId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id

    const file = (req as any).file

    if (!file) {
      return apiResponse.error(res, 'No file uploaded', 400)
    }

    const avatar = `/uploads/articles/${file.filename}`

    const admin = await adminService.updateAvatar(
      adminId,
      avatar
    )

    return apiResponse.success(
      res,
      { admin },
      'Avatar uploaded'
    )
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
}

export const deleteAdmin = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const adminId = (
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    ) as string

    await adminService.deleteAdmin(adminId)

    return apiResponse.success(res, null, 'Admin deleted')
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
}

export const updateAdminStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const adminId = (
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    ) as string

    const { isActive } = req.body

    const admin = await adminService.updateAdminStatus(adminId, isActive)

    return apiResponse.success(res, { admin })
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
}

export const assignPermissions = async (
  req: Request,
  res: Response
) => {
  try {
    const adminId = (
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    ) as string

    const permissions = Array.isArray(req.body.permissions)
      ? req.body.permissions
      : typeof req.body.permissions === 'string'
      ? [req.body.permissions]
      : []

    const admin = await adminService.assignPermissions(
      adminId,
      permissions
    )

    return apiResponse.success(res, { admin })
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
}