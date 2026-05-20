import prisma from '@/config/prisma'

import slugify from 'slugify'

export const listArticles = async (
  page: number,
  limit: number,
  status?: string
) => {
  const skip = (page - 1) * limit

  const where: any = {}

  if (status) {
    where.status = status
  }

  const [articles, total] =
    await Promise.all([
      prisma.article.findMany({
        where,

        include: {
          category: true,

          author: {
            select: {
              id: true,
              fullname: true
            }
          },

          tags: {
            include: {
              tag: true
            }
          },

          media: true
        },

        orderBy: {
          createdAt: 'desc'
        },

        skip,

        take: limit
      }),

      prisma.article.count({
        where
      })
    ])

  return {
    data: articles,

    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export const getArticle = async (
  articleId: string
) => {
  const article =
    await prisma.article.findUnique({
      where: {
        id: articleId
      },

      include: {
        category: true,

        author: {
          select: {
            id: true,
            fullname: true
          }
        },

        tags: {
          include: {
            tag: true
          }
        },

        media: true
      }
    })

  if (!article) {
    throw new Error('Article not found')
  }

  return article
}

export const createArticle = async (
  adminId: string,
  data: any
) => {
  const slug = slugify(data.title, {
    lower: true,
    strict: true
  })

  const existing =
    await prisma.article.findUnique({
      where: {
        slug
      }
    })

  if (existing) {
    throw new Error('Article slug already exists')
  }

  return prisma.article.create({
    data: {
      title: data.title,

      slug,

      excerpt: data.excerpt,

      content: data.content,

      featuredImage: data.featuredImage,

      seoTitle: data.seoTitle,

      seoDescription: data.seoDescription,

      videoUrl: data.videoUrl,

      status: 'DRAFT',

      authorId: adminId,

      categoryId: data.categoryId,

      tags: data.tags
        ? {
            create: data.tags.map(
              (tagId: string) => ({
                tag: {
                  connect: {
                    id: tagId
                  }
                }
              })
            )
          }
        : undefined,

      media: data.mediaIds
        ? {
            connect: data.mediaIds.map((mediaId: string) => ({
              id: mediaId
            }))
          }
        : undefined
    },

    include: {
      category: true,

      author: {
        select: {
          id: true,
          fullname: true
        }
      },

      tags: {
        include: {
          tag: true
        }
      },

      media: true
    }
  })
}

export const updateArticle = async (
  articleId: string,
  data: any
) => {
  const article =
    await prisma.article.findUnique({
      where: {
        id: articleId
      }
    })

  if (!article) {
    throw new Error('Article not found')
  }

  const updates: any = {
    excerpt: data.excerpt,
    content: data.content,
    featuredImage: data.featuredImage,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    videoUrl: data.videoUrl,
    categoryId: data.categoryId
  }

  if (data.title && data.title !== article.title) {
    const slug = slugify(data.title, {
      lower: true,
      strict: true
    })

    const existing =
      await prisma.article.findUnique({
        where: {
          slug
        }
      })

    if (existing && existing.id !== articleId) {
      throw new Error('Article slug already exists')
    }

    updates.title = data.title
    updates.slug = slug
  }

  return prisma.article.update({
    where: {
      id: articleId
    },
    data: {
      ...updates,
      tags: data.tags
        ? {
            deleteMany: {},
            create: data.tags.map((tagId: string) => ({
              tag: {
                connect: {
                  id: tagId
                }
              }
            }))
          }
        : undefined,
      media: data.mediaIds
        ? {
            set: data.mediaIds.map((mediaId: string) => ({
              id: mediaId
            }))
          }
        : undefined
    },
    include: {
      category: true,
      author: {
        select: {
          id: true,
          fullname: true
        }
      },
      tags: {
        include: {
          tag: true
        }
      },
      media: true
    }
  })
}

export const deleteArticle = async (
  articleId: string
) => {
  return prisma.article.delete({
    where: {
      id: articleId
    }
  })
}

export const publishArticle = async (
  articleId: string
) => {
  return prisma.article.update({
    where: {
      id: articleId
    },

    data: {
      status: 'PUBLISHED',

      publishedAt: new Date()
    }
  })
}