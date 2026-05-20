import { Request, Response } from 'express'

import * as tagService from './tag.service'

export const listTags = async (
  req: Request,
  res: Response
) => {
  const tags = await tagService.listTags()

  return res.json(tags)
}

export const createTag = async (
  req: Request,
  res: Response
) => {
  try {
    const tag = await tagService.createTag(req.body)

    return res.status(201).json(tag)
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export const updateTag = async (
  req: Request,
  res: Response
) => {
  try {
    const tagId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id

    const tag = await tagService.updateTag(
      tagId,
      req.body
    )

    return res.json(tag)
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    })
  }
}

export const deleteTag = async (
  req: Request,
  res: Response
) => {
  try {
    const tagId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id

    await tagService.deleteTag(tagId)

    return res.json({
      message: 'Tag deleted'
    })
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    })
  }
}
