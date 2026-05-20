import prisma from '@/config/prisma'

export const listMedia = async () => {
  return prisma.media.findMany({
    include: {
      article: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export const getMedia = async (id: string) => {
  const media = await prisma.media.findUnique({
    where: { id },
    include: {
      article: true
    }
  })

  if (!media) {
    throw new Error('Media not found')
  }

  return media
}

export const deleteMedia = async (id: string) => {
  return prisma.media.delete({
    where: { id }
  })
}
