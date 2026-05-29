import { Router } from 'express'

import {
  listMedia,
  getMedia,
  getUploadSignature,
  uploadImage,
  deleteMedia
} from './media.controller'

import { authenticate } from '@/middlewares/auth.middleware'

import { requirePermission } from '@/middlewares/permission.middleware'

import { PERMISSIONS } from '@/constants/permissions'

const router = Router()

router.get(
  '/',

  authenticate,

  requirePermission(
    PERMISSIONS.MEDIA_READ
  ),

  listMedia
)

router.get(
  '/signature',

  authenticate,

  requirePermission(
    PERMISSIONS.MEDIA_UPLOAD
  ),

  getUploadSignature
)

router.get(
  '/:id',

  authenticate,

  requirePermission(
    PERMISSIONS.MEDIA_READ
  ),

  getMedia
)

router.post(
  '/upload',

  authenticate,

  requirePermission(
    PERMISSIONS.MEDIA_UPLOAD
  ),

  uploadImage
)

router.delete(
  '/:id',

  authenticate,

  requirePermission(
    PERMISSIONS.MEDIA_DELETE
  ),

  deleteMedia
)

export default router