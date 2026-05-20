import { Router } from 'express'

import * as articleController from './article.controller'

import { authenticate } from '@/middlewares/auth.middleware'

import { requirePermission } from '@/middlewares/permission.middleware'

import { validate } from '@/middlewares/validate.middleware'

import {
  createArticleSchema,
  updateArticleSchema
} from './article.validation'

import { PERMISSIONS } from '@/constants/permissions'

const router = Router()

router.post(
  '/',

  authenticate,

  requirePermission(
    PERMISSIONS.ARTICLE_CREATE
  ),

  validate(createArticleSchema),

  articleController.createArticle
)

router.get(
  '/',

  authenticate,

  requirePermission(
    PERMISSIONS.ARTICLE_READ
  ),

  articleController.listArticles
)

router.get(
  '/:id',

  authenticate,

  requirePermission(
    PERMISSIONS.ARTICLE_READ
  ),

  articleController.getArticle
)

router.patch(
  '/:id',

  authenticate,

  requirePermission(
    PERMISSIONS.ARTICLE_UPDATE
  ),

  validate(updateArticleSchema),

  articleController.updateArticle
)

router.delete(
  '/:id',

  authenticate,

  requirePermission(
    PERMISSIONS.ARTICLE_DELETE
  ),

  articleController.deleteArticle
)

router.patch(
  '/:id/publish',

  authenticate,

  requirePermission(
    PERMISSIONS.ARTICLE_PUBLISH
  ),

  articleController.publishArticle
)

export default router