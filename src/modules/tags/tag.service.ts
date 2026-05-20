import prisma from '@/config/prisma'

import slugify from 'slugify'

export const listTags = async () => {
  return prisma.tag.findMany({
    include: {
      articles: true
    },

    orderBy: {
      createdAt: 'desc'
    }
  })
}

export const createTag = async (data: any) => {
  const slug = slugify(data.name, {
    lower: true,
    strict: true
  })

  const existing = await prisma.tag.findUnique({
    where: {
      slug
    }
  })

  if (existing) {
    throw new Error('Tag already exists')
  }

  return prisma.tag.create({
    data: {
      name: data.name,
      slug
    }
  })
}

export const updateTag = async (
  id: string,
  data: any
) => {
  const tag = await prisma.tag.findUnique({
    where: {
      id
    }
  })

  if (!tag) {
    throw new Error('Tag not found')
  }

  const updates: any = {}

  if (data.name && data.name !== tag.name) {
    const slug = slugify(data.name, {
      lower: true,
      strict: true
    })

    const existing = await prisma.tag.findUnique({
      where: {
        slug
      }
    })

    if (existing && existing.id !== id) {
      throw new Error('Tag slug already exists')
    }

    updates.name = data.name
    updates.slug = slug
  }

  return prisma.tag.update({
    where: {
      id
    },

    data: updates
  })
}

export const deleteTag = async (id: string) => {
  return prisma.tag.delete({
    where: {
      id
    }
  })
}
