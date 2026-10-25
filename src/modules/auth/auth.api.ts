import { createServerFn } from '@tanstack/react-start'
import { registerSchema, type RegisterInput } from './auth.schema'
import { auth } from './auth.utils'
import { dbMiddleware } from '#/shared/middleware/db.middleware'

export const registerFn = createServerFn({ method: 'POST' })
  .validator((data: RegisterInput) => registerSchema.parse(data))
  .middleware([dbMiddleware])
  .handler(async ({ data, context }) => {

    const existingUser = await context.db.user.findUnique({
      where: {
        email: data.email
      }
    })

    if (existingUser) {
      throw new Error('Email sudah digunakan, silakan gunakan email lain.')
    }

    await auth.api.signUpEmail({
        body: {
            name: data.name,
            email: data.email,
            password: data.password
        }
    })

    return {
      success: true,
      message: 'Registrasi berhasil redirect ke halaman login'
    }

    
  })
