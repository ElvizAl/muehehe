import { createServerFn } from '@tanstack/react-start'
import type { RegisterInput } from './auth.schema'
import { registerSchema } from './auth.schema'
import { auth } from './auth.utils'
import { dbMiddleware } from '#/shared/middleware/db.middleware'

export const registerServerFn = createServerFn({ method: 'POST' })
  .validator((data: RegisterInput) => registerSchema.parse(data))
  .middleware([dbMiddleware])
  .handler(async ({ data, context }) => {
    try {
      const existingUser = await context.db.user.findUnique({
        where: {
          email: data.email,
        },
      })

      if (existingUser) {
        return {
          success: false,
          message: 'Email sudah digunakan, silakan gunakan email lain.',
        }
      }

      await auth.api.signUpEmail({
        body: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      })

      return {
        success: true,
        message: 'Registrasi berhasil redirect ke halaman login',
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message:'Registrasi gagal, silakan coba lagi.',
      }
    }
  })
