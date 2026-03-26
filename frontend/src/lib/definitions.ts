import { z } from 'zod/v4'

export const SignupFormSchema = z.object({
  email: z.email({ error: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters.' })
    .regex(/[a-zA-Z]/, { error: 'Must contain at least one letter.' })
    .regex(/[0-9]/, { error: 'Must contain at least one number.' }),
})

export const LoginFormSchema = z.object({
  email: z.email({ error: 'Please enter a valid email.' }),
  password: z.string().min(1, { error: 'Password is required.' }),
})

export type FormState =
  | {
      errors?: Record<string, string[]>
      message?: string
    }
  | undefined

export type User = {
  id: number
  username: string
  email: string
  date_joined: string
}

export type Category = {
  id: number
  name: string
  color: string
  note_count: number
}

export type Note = {
  id: number
  title: string
  content: string
  category: number | null
  category_name: string | null
  category_color: string | null
  created_at: string
  updated_at: string
}
