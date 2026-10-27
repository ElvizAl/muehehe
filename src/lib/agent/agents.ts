import { Agent } from '@anvia/core'
import { PrismaMemoryStore } from '@anvia/memory-prisma'
import { prisma } from '../prisma.ts'
import { model } from './model.ts'
import { BASE_INSTRUCTIONS } from './prompt.ts'
import { createCatConsultationTools } from './tools/cat_consultation.ts'
import { searchPenyakit } from './tools/search_knowledge.ts'

export const memoryStore = new PrismaMemoryStore({ client: prisma })

export function createAssistantAgent(userId: string, sessionId: string) {
  const { getCatProfile, saveConsultation, getConsultationHistory } =
    createCatConsultationTools(userId, sessionId)

  return new Agent({
    id: 'anabulcare',
    name: 'Asisten Kesehatan Kucing',
    model,
    instructions: BASE_INSTRUCTIONS,
    tools: [
      getCatProfile,
      getConsultationHistory,
      searchPenyakit,
      saveConsultation,
    ],
    memory: { store: memoryStore, savePolicy: 'turn' },
    maxTurns: 6,
  })
}
