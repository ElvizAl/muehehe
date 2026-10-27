import { Agent } from '@anvia/core'
import { PrismaMemoryStore } from '@anvia/memory-prisma'
import { prisma } from '../prisma.ts'
import { model } from './model.ts'
import { BASE_INSTRUCTIONS } from './prompt.ts'
import { searchPenyakit } from './tools/search_knowledge.ts'

export const memoryStore = new PrismaMemoryStore({ client: prisma })

export const assistantAgent = new Agent({
  id: 'anabulcare',
  name: 'Asisten Kesehatan Kucing',
  model,
  instructions: BASE_INSTRUCTIONS,
  tools: [searchPenyakit],
  memory: { store: memoryStore, savePolicy: 'turn' },
  maxTurns: 5,
})
