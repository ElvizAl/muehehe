import { createTool } from '@anvia/core'
import { z } from 'zod'
import { prisma } from '../../prisma.ts'

export function createCatConsultationTools(userId: string, sessionId: string) {
  if (!userId || !sessionId) {
    throw new Error('Identitas pengguna dan sesi konsultasi wajib tersedia.')
  }

  const getCatProfile = createTool({
    name: 'get_cat_profile',
    description:
      'Ambil profil kucing milik pengguna saat ini. Gunakan sebelum menilai gejala agar umur, vaksinasi, lingkungan, dan riwayat kesehatan tidak ditebak.',
    inputSchema: z.object({}),
    execute: async () => {
      const cat = await prisma.cat.findFirst({
        where: { userId },
        select: {
          id: true,
          name: true,
          ageMonths: true,
          breed: true,
          gender: true,
          vaccinated: true,
          environment: true,
          healthHistory: true,
        },
      })
      return cat ?? { message: 'Profil kucing belum tersedia.' }
    },
  })

  const saveConsultation = createTool({
    name: 'save_consultation',
    description:
      'Simpan ringkasan konsultasi awal ke profil kucing pengguna saat ini setelah penilaian cukup. Satu sesi percakapan menyimpan satu hasil terbaru.',
    inputSchema: z.object({
      symptoms: z.string().trim().min(1).max(4000),
      assessment: z.string().trim().min(1).max(4000),
      urgency: z.enum(['darurat', 'segera', 'terjadwal', 'pantau']),
      recommendation: z.string().trim().min(1).max(4000),
      sources: z
        .array(
          z.object({
            title: z.string().trim().min(1).max(200),
            page: z.number().int().positive(),
          }),
        )
        .max(20),
    }),
    execute: async (input) => {
      const cat = await prisma.cat.findFirst({
        where: { userId },
        select: { id: true },
      })
      if (!cat)
        return {
          saved: false,
          message:
            'Profil kucing belum tersedia. Hasil konsultasi belum disimpan.',
        }

      const consultation = await prisma.consultation.upsert({
        where: { userId_sessionId: { userId, sessionId } },
        create: { userId, catId: cat.id, sessionId, ...input },
        update: { catId: cat.id, ...input },
        select: { id: true, updatedAt: true },
      })
      return {
        saved: true,
        id: consultation.id,
        updatedAt: consultation.updatedAt.toISOString(),
      }
    },
  })

  const getConsultationHistory = createTool({
    name: 'get_consultation_history',
    description:
      'Ambil hingga lima ringkasan konsultasi terakhir milik pengguna saat ini jika keluhan sebelumnya relevan.',
    inputSchema: z.object({}),
    execute: async () => {
      const consultations = await prisma.consultation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          createdAt: true,
          symptoms: true,
          assessment: true,
          urgency: true,
          recommendation: true,
          sources: true,
          cat: { select: { name: true } },
        },
      })
      return consultations.map((consultation) => ({
        ...consultation,
        createdAt: consultation.createdAt.toISOString(),
      }))
    },
  })

  return { getCatProfile, saveConsultation, getConsultationHistory }
}
