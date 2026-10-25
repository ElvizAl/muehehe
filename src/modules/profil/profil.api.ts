import { createServerFn } from '@tanstack/react-start'
import { dbMiddleware } from '#/shared/middleware/db.middleware'
import {
  profilSchema,
  profilIdSchema,
  updateProfilSchema,
} from './profil.schema'
import type {
  ProfilInput,
  ProfilIdInput,
  UpdateProfilInput,
} from './profil.schema'
import { getSession } from '../auth/auth.session'

export const createProfilServerFn = createServerFn({ method: 'POST' })
  .middleware([dbMiddleware])
  .validator((data: ProfilInput) => profilSchema.parse(data))
  .handler(async ({ data, context }) => {
    const session = await getSession()

    if (!session)
      return {
        success: false,
        message: 'Silakan login terlebih dahulu.',
      }

    try {
      const existingProfil = await context.db.cat.findFirst({
        where: {
          userId: session.user.id,
        },
      })

      if (existingProfil)
        return {
          success: false,
          message: 'Kamu sudah memiliki profil kucing.',
        }

      await context.db.cat.create({
        data: {
          ...data,
          userId: session.user.id,
        },
      })
      return {
        success: true,
        message: 'Profil kucing berhasil dibuat.',
      }
    } catch (error) {
      console.error('createProfil error:', error)
      return {
        success: false,
        message: 'Gagal memproses profil kucing, silakan coba lagi.',
      }
    }
  })

export const getProfilsServerFn = createServerFn({ method: 'GET' })
  .middleware([dbMiddleware])
  .handler(async ({ context }) => {
    try {
      const session = await getSession()
      if (!session)
        return {
          success: false,
          message: 'Silakan login terlebih dahulu.',
        }
      const profils = await context.db.cat.findMany({
        where: { userId: session.user.id },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      })
      return {
        success: true,
        message: 'Daftar profil kucing berhasil dimuat.',
        data: profils,
      }
    } catch (error) {
      console.error('getProfils error:', error)
      return {
        success: false,
        message: 'Gagal memproses profil kucing, silakan coba lagi.',
      }
    }
  })

export const getProfilServerFn = createServerFn({ method: 'GET' })
  .middleware([dbMiddleware])
  .validator((data: ProfilIdInput) => profilIdSchema.parse(data))
  .handler(async ({ data, context }) => {
    try {
      const session = await getSession()
      if (!session)
        return {
          success: false,
          message: 'Silakan login terlebih dahulu.',
        }
      const profil = await context.db.cat.findFirst({
        where: { id: data.id, userId: session.user.id },
      })
      if (!profil)
        return {
          success: false ,
          message: 'Profil kucing tidak ditemukan.',
        }
      return {
        success: true ,
        message: 'Profil kucing berhasil dimuat.',
        data: profil,
      }
    } catch (error) {
      console.error('getProfil error:', error)
      return {
        success: false,
        message: 'Gagal memproses profil kucing, silakan coba lagi.',
      }
    }
  })

export const updateProfilServerFn = createServerFn({ method: 'POST' })
  .middleware([dbMiddleware])
  .validator((data: UpdateProfilInput) => updateProfilSchema.parse(data))
  .handler(async ({ data, context }) => {
    try {
      const session = await getSession()
      if (!session)
        return {
          success: false as const,
          message: 'Silakan login terlebih dahulu.',
        }
      const { id, ...values } = data
      const result = await context.db.cat.updateMany({
        where: { id, userId: session.user.id },
        data: values,
      })
      if (result.count === 0)
        return {
          success: false as const,
          message: 'Profil kucing tidak ditemukan.',
        }
      return {
        success: true as const,
        message: 'Profil kucing berhasil diperbarui.',
      }
    } catch (error) {
      console.error('updateProfil error:', error)
      return {
        success: false as const,
        message: 'Gagal memproses profil kucing, silakan coba lagi.',
      }
    }
  })

export const deleteProfilServerFn = createServerFn({ method: 'POST' })
  .middleware([dbMiddleware])
  .validator((data: ProfilIdInput) => profilIdSchema.parse(data))
  .handler(async ({ data, context }) => {
    try {
      const session = await getSession()
      if (!session)
        return {
          success: false as const,
          message: 'Silakan login terlebih dahulu.',
        }
      const result = await context.db.cat.deleteMany({
        where: { id: data.id, userId: session.user.id },
      })
      if (result.count === 0)
        return {
          success: false as const,
          message: 'Profil kucing tidak ditemukan.',
        }
      return {
        success: true as const,
        message: 'Profil kucing berhasil dihapus.',
      }
    } catch (error) {
      console.error('deleteProfil error:', error)
      return {
        success: false as const,
        message: 'Gagal memproses profil kucing, silakan coba lagi.',
      }
    }
  })
