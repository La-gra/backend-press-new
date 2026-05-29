import { Request, Response } from 'express'

import * as categoryService from './category.service'
import { apiResponse } from '@/utils/apiResponse'

export const createCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const category = await categoryService.createCategory(req.body)

    return apiResponse.success(
      res,
      { category },
      'Category created',
      201
    )
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
}

export const getCategories = async (
  req: Request,
  res: Response
) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10

  const result = await categoryService.getCategories(
    page,
    limit
  )

  return apiResponse.success(res, result)
}

export const updateCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const categoryId = (
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    ) as string

    const category = await categoryService.updateCategory(
      categoryId,
      req.body
    )

    return apiResponse.success(res, { category })
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
}

export const deleteCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const categoryId = (
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    ) as string

    await categoryService.deleteCategory(categoryId)

    return apiResponse.success(
      res,
      null,
      'Category deleted'
    )
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
}