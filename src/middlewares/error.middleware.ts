import {
  Request,
  Response,
  NextFunction
} from 'express'

import { apiResponse } from '@/utils/apiResponse'

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error)

  return apiResponse.error(
    res,
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message,
    500
  )
}