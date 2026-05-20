import { Router } from 'express'

import prisma from '@/config/prisma'

const router = Router()

router.get('/categories', async (req, res) => {
  const categories =
    await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    })

  return res.json(categories)
})

router.get('/articles', async (req, res) => {
  const page = Number(req.query.page) || 1

  const limit = Number(req.query.limit) || 10

  const skip = (page - 1) * limit

  const articles =
    await prisma.article.findMany({
      where: {
        status: 'PUBLISHED'
      },

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
    })

  return res.json(articles)
})

router.get(
  '/articles/:slug',

  async (req, res) => {
    const article =
      await prisma.article.findFirst({
        where: {
          slug: req.params.slug,

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
      return res.status(404).json({
        message: 'Article not found'
      })
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

    return res.json(article)
  }
)

router.get('/articles', async (req, res) => {
  const page = Number(req.query.page) || 1

  const limit = Number(req.query.limit) || 10

  const search =
    String(req.query.search || '')

  const category =
    String(req.query.category || '')

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

  return res.json({
    data: articles,

    meta: {
      total,

      page,

      limit,

      totalPages: Math.ceil(
        total / limit
      )
    }
  })
})
router.get('/latest', async (req, res) => {
  const articles =
    await prisma.article.findMany({
      where: {
        status: 'PUBLISHED'
      },

      include: {
        category: true
      },

      orderBy: {
        publishedAt: 'desc'
      },

      take: 10
    })

  return res.json(articles)
})
router.get('/trending', async (req, res) => {
  const articles =
    await prisma.article.findMany({
      where: {
        status: 'PUBLISHED'
      },

      include: {
        category: true
      },

      orderBy: {
        views: 'desc'
      },

      take: 10
    })

  return res.json(articles)
})

router.get(
  '/related/:slug',

  async (req, res) => {
    const article =
      await prisma.article.findUnique({
        where: {
          slug: req.params.slug
        }
      })

    if (!article) {
      return res.status(404).json({
        message: 'Article not found'
      })
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

    return res.json(related)
  }
)

export default router