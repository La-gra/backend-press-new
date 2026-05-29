import { Router } from 'express'

import prisma from '@/config/prisma'
import { apiResponse } from '@/utils/apiResponse'

const router = Router()

router.get('/categories', async (req, res) => {
  const categories =
    await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        _count: {
          select: {
            articles: {
              where: { status: 'PUBLISHED' }
            }
          }
        }
      }
    })

  return apiResponse.success(res, { categories })
})

router.post('/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return apiResponse.error(res, 'Email invalide', 400)
    }

    const existing = await prisma.subscriber.findUnique({ where: { email } })

    if (existing) {
      return apiResponse.success(res, { subscriber: existing }, 'Déjà inscrit')
    }

    const subscriber = await prisma.subscriber.create({ data: { email } })

    return apiResponse.success(res, { subscriber }, 'Inscription réussie', 201)
  } catch (error: any) {
    return apiResponse.error(res, error.message, 400)
  }
})

router.get('/articles', async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const search = String(req.query.search || '')
  const category = String(req.query.category || '')
  const skip = (page - 1) * limit

  const where: any = {
    status: 'PUBLISHED'
  }

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: 'insensitive'
        }
      },
      {
        content: {
          contains: search,
          mode: 'insensitive'
        }
      }
    ]
  }

  if (category) {
    where.category = {
      slug: category
    }
  }

  const [articles, total] =
    await Promise.all([
      prisma.article.findMany({
        where,

        include: {
          category: true,
          author: {
            select: {
              fullname: true
            }
          }
        },

        orderBy: {
          publishedAt: 'desc'
        },

        skip,
        take: limit
      }),
      prisma.article.count({
        where
      })
    ])

  return apiResponse.success(res, {
    data: articles,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  })
})

router.get('/articles/:slug', async (req, res) => {
    const slug = (
      Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug
    ) as string

    const article =
    await prisma.article.findFirst({
      where: {
        slug,
        status: 'PUBLISHED'
      },
      include: {
        category: true,
        author: {
          select: {
            fullname: true
          }
        }
      }
    })

  if (!article) {
    return apiResponse.error(res, 'Article not found', 404)
  }

  await prisma.article.update({
    where: {
      id: article.id
    },
    data: {
      views: {
        increment: 1
      }
    }
  })

  return apiResponse.success(res, { article })
})

router.get('/latest', async (req, res) => {
  const articles =
    await prisma.article.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            fullname: true,
            avatar: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 50
    })

  return apiResponse.success(res, { articles })
})

router.get('/trending', async (req, res) => {
  const articles =
    await prisma.article.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            fullname: true,
            avatar: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: {
        views: 'desc'
      },
      take: 50
    })

  return apiResponse.success(res, { articles })
})

router.get('/related/:slug', async (req, res) => {
    const slug = (
      Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug
    ) as string

    const article =
    await prisma.article.findUnique({
      where: {
        slug
      }
    })

  if (!article) {
    return apiResponse.error(res, 'Article not found', 404)
  }

  const related =
    await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        categoryId: article.categoryId,
        NOT: {
          id: article.id
        }
      },
      take: 4,
      orderBy: {
        publishedAt: 'desc'
      }
    })

  return apiResponse.success(res, { related })
})

export default router