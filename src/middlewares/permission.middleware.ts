import {
  Response,
  NextFunction
} from 'express'

import { AuthRequest } from './auth.middleware'

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
      return res.status(401).json({
        message: 'Unauthorized'
      })
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
      return res.status(403).json({
        message: 'Forbidden'
      })
    }

    next()
  }
}