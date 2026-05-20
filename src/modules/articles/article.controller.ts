import { Response } from 'express'

import * as articleService from './article.service'

import { AuthRequest } from '@/middlewares/auth.middleware'

export const listArticles = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const status = String(req.query.status || '')

    const articles =
      await articleService.listArticles(
        page,
        limit,
        status
      )

    return res.json(articles)
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export const getArticle = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const articleId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id

    const article =
      await articleService.getArticle(
        articleId
      )

    return res.json(article)
  } catch (error: any) {
    return res.status(404).json({
      message: error.message
    })
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

    return res.status(201).json(article)
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export const updateArticle = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const articleId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id

    const article =
      await articleService.updateArticle(
        articleId,
        req.body
      )

    return res.json(article)
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export const deleteArticle = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const articleId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id

    await articleService.deleteArticle(
      articleId
    )

    return res.json({
      message: 'Article deleted'
    })
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export const publishArticle = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const articleId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id

    const article =
      await articleService.publishArticle(
        articleId
      )

    return res.json(article)
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    })
  }
}