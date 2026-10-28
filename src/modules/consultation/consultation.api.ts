import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { z } from 'zod'
import { prisma } from '#/lib/prisma'
import { auth } from '#/modules/auth/auth.utils'

const sourceSchema = z.object({
  title: z.string().trim().min(1),
  page: z.number().int().positive(),
})

function readableSources(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    const result = sourceSchema.safeParse(item)
    return result.success ? [result.data] : []
  })
}

export const listSavedConsultations = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await auth.api.getSession({ headers: getRequestHeaders() })
    if (!session) throw new Error('Silakan login terlebih dahulu.')

    const consultations = await prisma.consultation.findMany({
      where: { userId: session.user.id },
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        symptoms: true,
        assessment: true,
        urgency: true,
        recommendation: true,
        sources: true,
        createdAt: true,
        updatedAt: true,
        cat: { select: { name: true } },
      },
    })

    return consultations.map((item) => ({
      id: item.id,
      catName: item.cat.name,
      symptoms: item.symptoms,
      assessment: item.assessment,
      urgency: item.urgency,
      recommendation: item.recommendation,
      sources: readableSources(item.sources),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }))
  },
)
