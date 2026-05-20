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

export const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export const updateCategory = async (
  id: string,
  data: any
) => {
  const slug = slugify(data.name, {
    lower: true,
    strict: true
  })

  return prisma.category.update({
    where: {
      id
    },

    data: {
      name: data.name,
      slug,
      description: data.description
    }
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