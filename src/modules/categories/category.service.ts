import prisma from '@/config/prisma'

import slugify from 'slugify'

export const createCategory = async (
  data: any
) => {
  const slug = slugify(data.name, {
    lower: true,
    strict: true
  })

  const existing =
    await prisma.category.findUnique({
      where: {
        slug
      }
    })

  if (existing) {
    throw new Error(
      'Category already exists'
    )
  }

  return prisma.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description
    }
  })
}

export const getCategories = async (
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    }),
    prisma.category.count()
  ])

  return {
    data: categories,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export const updateCategory = async (
  id: string,
  data: any
) => {
  const updates: any = {}

  if (data.name) {
    updates.name = data.name
    updates.slug = slugify(data.name, {
      lower: true,
      strict: true
    })
  }

  if (typeof data.description !== 'undefined') {
    updates.description = data.description
  }

  return prisma.category.update({
    where: {
      id
    },

    data: updates
  })
}

export const deleteCategory = async (
  id: string
) => {
  return prisma.category.delete({
    where: {
      id
    }
  })
}