import { Router } from 'express'

import * as adminController from './admin.controller'

import { authenticate } from '@/middlewares/auth.middleware'

import upload from '@/config/multer'

import { validate } from '@/middlewares/validate.middleware'

import { requirePermission } from '@/middlewares/permission.middleware'

import { PERMISSIONS } from '@/constants/permissions'

import {
  createAdminSchema,
  assignPermissionsSchema
} from './admin.validation'

const router = Router()

router.post(
  '/',
  authenticate,

  requirePermission(
    PERMISSIONS.ADMIN_CREATE
  ),

  validate(createAdminSchema),

  adminController.createAdmin
)

router.get(
  '/',
  authenticate,

  requirePermission(
    PERMISSIONS.ADMIN_READ
  ),

  adminController.listAdmins
)

router.get(
  '/:id',
  authenticate,

  requirePermission(
    PERMISSIONS.ADMIN_READ
  ),

  adminController.getAdmin
)

router.patch(
  '/:id/avatar',
  authenticate,

  requirePermission(
    PERMISSIONS.ADMIN_UPDATE
  ),

  upload.single('avatar'),

  adminController.uploadAvatar
)

router.patch(
  '/:id/permissions',

  authenticate,

  requirePermission(
    PERMISSIONS.ADMIN_UPDATE
  ),

  validate(assignPermissionsSchema),

  adminController.assignPermissions
)

router.delete(
  '/:id',
  authenticate,

  requirePermission(
    PERMISSIONS.ADMIN_DELETE
  ),

  adminController.deleteAdmin
)

router.patch(
  '/:id/status',
  authenticate,

  requirePermission(
    PERMISSIONS.ADMIN_UPDATE
  ),

  adminController.updateAdminStatus
)

export default router