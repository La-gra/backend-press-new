import { Request, Response } from 'express'

import * as tagService from './tag.service'
import { apiResponse } from '@/utils/apiResponse'

export const listTags = async (
  req: Request,
  res: Response
) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10

  const result = await tagService.listTags(page, limit)

  return apiResponse.success(res, result)
}

export const createTag = async (
  req: Request,
  res: Response
) => {
  try {
    const tag = await tagService.createTag(req.body)

    return apiResponse.success(res, { tag }, 'Tag created', 201)
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
}

export const updateTag = async (
  req: Request,
  res: Response
) => {
  try {
    const tagId = (
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    ) as string

    const tag = await tagService.updateTag(tagId, req.body)

    return apiResponse.success(res, { tag })
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
}

export const deleteTag = async (
  req: Request,
  res: Response
) => {
  try {
    const tagId = (
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    ) as string

    await tagService.deleteTag(tagId)

    return apiResponse.success(res, null, 'Tag deleted')
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
}
