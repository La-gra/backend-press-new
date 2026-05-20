import { Request, Response } from 'express'

import * as categoryService from './category.service'

export const createCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const category =
      await categoryService.createCategory(
        req.body
      )

    return res.status(201).json(category)
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export const getCategories = async (
  req: Request,
  res: Response
) => {
  const categories =
    await categoryService.getCategories()

  return res.json(categories)
}

export const updateCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const categoryId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id

    const category =
      await categoryService.updateCategory(
        categoryId,
        req.body
      )

    return res.json(category)
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export const deleteCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const categoryId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id

    await categoryService.deleteCategory(
      categoryId
    )

    return res.json({
      message: 'Category deleted'
    })
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    })
  }
}