import { Router } from 'express'

import * as adminController from './admin.controller'

import { authenticate } from '@/middlewares/auth.middleware'

import { requirePermission } from '@/middlewares/permission.middleware'

import { PERMISSIONS } from '@/constants/permissions'

const router = Router()

router.post(
  '/',
  authenticate,

  requirePermission(
    PERMISSIONS.ADMIN_CREATE
  ),

  adminController.createAdmin
)
router.patch(
  '/:id/permissions',

  authenticate,

  requirePermission(
    PERMISSIONS.ADMIN_UPDATE
  ),

  adminController.assignPermissions
)

export default router