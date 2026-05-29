import { Response } from 'express'

export const apiResponse = {
  success: (
    res: Response,
    data: any = null,
    message = 'Success',
    status = 200
  ) =>
    res.status(status).json({
      success: true,
      message,
      data
    }),

  error: (
    res: Response,
    message = 'Error',
    status = 400,
    errors: any = null
  ) =>
    res.status(status).json({
      success: false,
      message,
      errors
    })
}
