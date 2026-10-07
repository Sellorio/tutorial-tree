import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(32),
  password: z.string().min(1).max(200),
})

export const registrationSchema = z.object({
  ticket: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{6}$/),
  username: z
    .string()
    .trim()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_.-]+$/),
  name: z.string().trim().min(1).max(80),
  password: z.string().min(12).max(200),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(12).max(200),
})

export const resetPasswordSchema = z.object({
  userId: z.string().uuid(),
})
