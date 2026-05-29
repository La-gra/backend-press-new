import {
  Response,
  NextFunction
} from 'express'

import { AuthRequest } from './auth.middleware'
import { apiResponse } from '@/utils/apiResponse'

export const requirePermission = (
  permission: string
) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    // Vérifier admin connecté
    if (!req.admin) {
      return apiResponse.error(res, 'Unauthorized', 401)
    }

    // SUPER_ADMIN bypass
    if (req.admin.role === 'SUPER_ADMIN') {
      return next()
    }

    // Vérifier permissions
    const permissions =
      req.admin.permissions?.map(
        (permission: { name: string }) =>
          permission.name
      ) ?? []

    const hasPermission =
      permissions.includes(permission)

    if (!hasPermission) {
      return apiResponse.error(res, 'Forbidden', 403)
    }

    next()
  }
}