import {
  Request,
  Response,
  NextFunction
} from 'express'

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error)

  return res.status(500).json({
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : error.message
  })
}