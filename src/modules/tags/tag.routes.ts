import { Router } from 'express'

import * as tagController from './tag.controller'

import { authenticate } from '@/middlewares/auth.middleware'

import { requirePermission } from '@/middlewares/permission.middleware'

import { validate } from '@/middlewares/validate.middleware'

import {
  createTagSchema,
  updateTagSchema
} from './tag.validation'

import { PERMISSIONS } from '@/constants/permissions'

const router = Router()

router.get(
  '/',

  authenticate,

  requirePermission(
    PERMISSIONS.TAG_READ
  ),

  tagController.listTags
)

router.post(
  '/',

  authenticate,

  requirePermission(
    PERMISSIONS.TAG_CREATE
  ),

  validate(createTagSchema),

  tagController.createTag
)

router.patch(
  '/:id',

  authenticate,

  requirePermission(
    PERMISSIONS.TAG_UPDATE
  ),

  validate(updateTagSchema),

  tagController.updateTag
)

router.delete(
  '/:id',

  authenticate,

  requirePermission(
    PERMISSIONS.TAG_DELETE
  ),

  tagController.deleteTag
)

export default router
