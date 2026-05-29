import { Router } from 'express'

import authRoutes from '@/modules/auth/auth.routes'
import adminRoutes from '@/modules/admins/admin.routes'
import categoryRoutes from '@/modules/categories/category.routes'
import publicRoutes from '@/modules/public/public.routes'
import articleRoutes from '@/modules/articles/article.routes'
import mediaRoutes from '@/modules/media/media.routes'
import tagRoutes from '@/modules/tags/tag.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/admins', adminRoutes)
router.use('/categories', categoryRoutes)
router.use('/public', publicRoutes)
router.use('/articles', articleRoutes)
router.use('/admin/articles', articleRoutes)
router.use('/admin/categories', categoryRoutes)
router.use('/admin/tags', tagRoutes)
router.use('/media', mediaRoutes)
router.use('/tags', tagRoutes)

export default router