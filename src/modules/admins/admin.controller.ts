import { Request, Response } from 'express'

import * as adminService from './admin.service'

export const createAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const admin = await adminService.createAdmin(
      req.body
    )

    return res.status(201).json(admin)
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export const assignPermissions = async (
  req: Request,
  res: Response
) => {
  try {
    const adminId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id

    const permissions = Array.isArray(req.body.permissions)
      ? req.body.permissions
      : typeof req.body.permissions === 'string'
      ? [req.body.permissions]
      : []

    const admin = await adminService.assignPermissions(
      adminId,
      permissions
    )

    return res.json(admin)
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    })
  }
}