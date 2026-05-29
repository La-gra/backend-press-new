import { Router } from 'express'

import { changePassword, login, logout, me, refresh, verifyEmail } from './auth.controller'
import { authenticate } from '@/middlewares/auth.middleware'
import { authRateLimit } from '@/middlewares/security/auth-rate-limit'
import { validate } from '@/middlewares/validate.middleware'
import { changePasswordSchema, loginSchema } from './auth.validation'

const router = Router()

router.post('/login', authRateLimit, validate(loginSchema), login)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.post('/verify-email', verifyEmail)
router.post('/change-password', authenticate, validate(changePasswordSchema), changePassword)
router.get('/me', authenticate, me)

export default router