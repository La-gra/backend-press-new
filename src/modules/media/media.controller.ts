import { Request, Response } from 'express'

import * as mediaService from './media.service'
import { apiResponse } from '@/utils/apiResponse'
import cloudinary from '@/config/cloudinary'

export const listMedia = async (
  req: Request,
  res: Response
) => {
  const media = await mediaService.listMedia()

  return apiResponse.success(res, { media })
}

export const getMedia = async (
  req: Request,
  res: Response
) => {
  try {
    const mediaId = (
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    ) as string

    const media = await mediaService.getMedia(mediaId)

    return apiResponse.success(res, { media })
  } catch (error: any) {
    return apiResponse.error(res, error.message, 404)
  }
}

export const getUploadSignature = (
  _req: Request,
  res: Response
) => {
  const timestamp = Math.round(Date.now() / 1000)
  const folder = 'press-new'

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  )

  return apiResponse.success(res, {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder,
  })
}

export const uploadImage = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
      return apiResponse.error(res, 'Aucun fichier fourni', 400)
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'press-new',
    })

    const media = await mediaService.createMedia({
      url: result.secure_url,
      type: 'IMAGE',
    })

    return apiResponse.success(res, { media })
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
}

export const deleteMedia = async (
  req: Request,
  res: Response
) => {
  try {
    const mediaId = (
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    ) as string

    await mediaService.deleteMedia(mediaId)

    return apiResponse.success(res, null, 'Media deleted')
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
}
