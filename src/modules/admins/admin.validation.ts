import { z } from 'zod'

export const createAdminSchema = z.object({
  fullname: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
})

export const assignPermissionsSchema = z.object({
  permissions: z.array(z.string())
})
