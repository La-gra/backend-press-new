import { Response } from 'express'

import * as articleService from './article.service'
import { apiResponse } from '@/utils/apiResponse'

import { AuthRequest } from '@/middlewares/auth.middleware'

export const listArticles = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const status = (
      Array.isArray(req.query.status)
        ? req.query.status[0]
        : typeof req.query.status === 'string'
        ? req.query.status
        : ''
    ) as string

    const categoryId = (
      Array.isArray(req.query.categoryId)
        ? req.query.categoryId[0]
        : typeof req.query.categoryId === 'string'
        ? req.query.categoryId
        : ''
    ) as string

    const authorId = (
      Array.isArray(req.query.authorId)
        ? req.query.authorId[0]
        : typeof req.query.authorId === 'string'
        ? req.query.authorId
        : ''
    ) as string

    const dateFrom = (
      Array.isArray(req.query.dateFrom)
        ? req.query.dateFrom[0]
        : typeof req.query.dateFrom === 'string'
        ? req.query.dateFrom
        : ''
    ) as string

    const dateTo = (
      Array.isArray(req.query.dateTo)
        ? req.query.dateTo[0]
        : typeof req.query.dateTo === 'string'
        ? req.query.dateTo
        : ''
    ) as string

    const articles =
      await articleService.listArticles(
        page,
        limit,
        status,
        {
          categoryId,
          authorId,
          dateFrom,
          dateTo
        }
      )

    return apiResponse.success(res, articles)
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
}

export const getArticle = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const articleId = (
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    ) as string

    const article = await articleService.getArticle(articleId)

    return apiResponse.success(res, { article })
  } catch (error: any) {
    return apiResponse.error(res, error.message, 404)
  }
}

export const createArticle = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const article =
      await articleService.createArticle(
        req.admin!.id,
        req.body
      )

    return apiResponse.success(
      res,
      { article },
      'Article created',
      201
    )
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
}

export const updateArticle = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const articleId = (
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    ) as string

    const article = await articleService.updateArticle(
      articleId,
      req.body
    )

    return apiResponse.success(res, { article })
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
}

export const deleteArticle = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const articleId = (
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    ) as string

    await articleService.deleteArticle(articleId)

    return apiResponse.success(res, null, 'Article deleted')
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
}

export const publishArticle = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const articleId = (
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    ) as string

    const article = await articleService.publishArticle(articleId)

    return apiResponse.success(res, { article })
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
}