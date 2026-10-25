import * as z from 'zod'

export const profilSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama kucing wajib diisi')
    .max(100, 'Nama maksimal 100 karakter'),
  ageMonths: z
    .number()
    .int('Umur harus berupa bilangan bulat')
    .min(0, 'Umur tidak boleh negatif')
    .nullish(),
  breed: z.string().trim().max(100, 'Ras maksimal 100 karakter').nullish(),
  gender: z
    .string()
    .trim()
    .min(1, 'Jenis kelamin wajib diisi')
    .max(50, 'Jenis kelamin maksimal 50 karakter'),
  vaccinated: z.boolean().nullish(),
  environment: z
    .string()
    .trim()
    .max(100, 'Lingkungan maksimal 100 karakter')
    .nullish(),
  healthHistory: z
    .string()
    .trim()
    .max(10000, 'Riwayat kesehatan maksimal 10.000 karakter')
    .nullish(),
})

export const profilIdSchema = z.object({
  id: z.string().trim().min(1, 'ID profil wajib diisi'),
})

export const updateProfilSchema = profilSchema.extend(profilIdSchema.shape)

export type ProfilInput = z.infer<typeof profilSchema>
export type ProfilIdInput = z.infer<typeof profilIdSchema>
export type UpdateProfilInput = z.infer<typeof updateProfilSchema>
