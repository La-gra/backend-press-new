import { Request, Response } from 'express'

import * as mediaService from './media.service'

export const listMedia = async (
  req: Request,
  res: Response
) => {
  const media = await mediaService.listMedia()

  return res.json(media)
}

export const getMedia = async (
  req: Request,
  res: Response
) => {
  try {
    const mediaId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id

    const media = await mediaService.getMedia(mediaId)

    return res.json(media)
  } catch (error: any) {
    return res.status(404).json({
      message: error.message
    })
  }
}

export const uploadImage = async (
  req: Request,
  res: Response
) => {
  if (!req.file) {
    return res.status(400).json({
      message: 'No file uploaded'
    })
  }

  return res.json({
    url: `/uploads/articles/${req.file.filename}`
  })
}

export const deleteMedia = async (
  req: Request,
  res: Response
) => {
  try {
    const mediaId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id

    await mediaService.deleteMedia(mediaId)

    return res.json({
      message: 'Media deleted'
    })
  } catch (error: any) {
    return res.status(400).json({
      message: error.message
    })
  }
}
