import { Router } from 'express'

import { login, logout, me } from './auth.controller'
import { authenticate } from '@/middlewares/auth.middleware'

const router = Router()

router.post('/login', login)
router.post('/logout', logout)
router.get('/me', authenticate, me)

export default router