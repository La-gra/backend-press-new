import { Request, Response, NextFunction } from 'express'

import { ZodSchema } from 'zod'
import { apiResponse } from '@/utils/apiResponse'

export const validate = (
  schema: ZodSchema
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      schema.parse(req.body)

      next()
    } catch (error: any) {
      return apiResponse.error(
        res,
        'Validation failed',
        400,
        error.errors
      )
    }
  }
}