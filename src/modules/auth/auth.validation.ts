import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Ancien mot de passe requis'),
  newPassword: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
})
