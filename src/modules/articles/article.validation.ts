import { z } from 'zod'

const videoUrlSchema = z
  .string()
  .url()
  .refine(
    value =>
      /^(https:\/\/)?(www\.)?youtube\.com\/embed\/.+/.test(value) ||
      /^(https:\/\/)?(www\.)?facebook\.com\/plugins\/video\.php\?.+/.test(value),
    {
      message:
        'Video URL must be a YouTube or Facebook embed URL'
    }
  )

export const createArticleSchema = z.object({
  title: z.string().min(5),

  excerpt: z.string().optional(),

  content: z.string().min(10),

  featuredImage: z.string().optional(),

  seoTitle: z.string().optional(),

  seoDescription: z.string().optional(),

  videoUrl: videoUrlSchema.optional(),

  categoryId: z.string(),

  tags: z.array(z.string()).optional(),

  mediaIds: z.array(z.string()).optional()
})

export const updateArticleSchema = z.object({
  title: z.string().min(5).optional(),

  excerpt: z.string().optional(),

  content: z.string().min(10).optional(),

  featuredImage: z.string().optional(),

  seoTitle: z.string().optional(),

  seoDescription: z.string().optional(),

  videoUrl: videoUrlSchema.optional(),

  categoryId: z.string().optional(),

  tags: z.array(z.string()).optional(),

  mediaIds: z.array(z.string()).optional()
})