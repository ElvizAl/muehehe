import { readFile } from 'node:fs/promises'
import { ingestVectorDocuments } from '@anvia/core/vector-store'
import { z } from 'zod'
import { embeddingModel, qdrantClient, store } from './store.ts'

const pagesSchema = z
  .array(
    z.object({
      page: z.number().int().nonnegative(),
      text: z.string().trim().min(1),
    }),
  )
  .min(1)

try {
  const pages = pagesSchema.parse(
    JSON.parse(await readFile('documents/m-pages.json', 'utf8')),
  )
  if (new Set(pages.map((page) => page.page)).size !== pages.length) {
    throw new Error('Nomor halaman dokumen harus unik.')
  }

  await store.ensure()
  // Anvia replaces documents using this payload field.
  await qdrantClient.createPayloadIndex(store.options.collectionName, {
    field_name: '__anvia_document_id',
    field_schema: 'keyword',
    wait: true,
  })

  const pageDocuments = pages.map((page) => ({
    id: `m-page-${page.page}`,
    text: page.text,
    metadata: {
      source: 'm.pdf',
      title: 'Pengetahuan Kesehatan Kucing',
      page: page.page,
      version: 1,
    },
  }))

  await ingestVectorDocuments({
    store,
    documents: pageDocuments,
    embeddingModel,
    chunking: { strategy: 'none' },
  })
  console.log(
    `${pages.length} halaman berhasil dimasukkan ke ${store.options.collectionName}.`,
  )
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
