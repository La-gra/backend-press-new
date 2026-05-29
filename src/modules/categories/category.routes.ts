import { Router } from 'express'

import * as categoryController from './category.controller'

import { authenticate } from '@/middlewares/auth.middleware'

import { requirePermission } from '@/middlewares/permission.middleware'

import { validate } from '@/middlewares/validate.middleware'

import { createCategorySchema, updateCategorySchema } from './category.validation'

import { PERMISSIONS } from '@/constants/permissions'

const router = Router()

router.post(
  '/',

  authenticate,

  requirePermission(
    PERMISSIONS.CATEGORY_CREATE
  ),

  validate(createCategorySchema),

  categoryController.createCategory
)

router.get(
  '/',

  authenticate,

  categoryController.getCategories
)

router.patch(
  '/:id',

  authenticate,

  requirePermission(
    PERMISSIONS.CATEGORY_UPDATE
  ),

  validate(updateCategorySchema),

  categoryController.updateCategory
)

router.delete(
  '/:id',

  authenticate,

  requirePermission(
    PERMISSIONS.CATEGORY_DELETE
  ),

  categoryController.deleteCategory
)

export default router