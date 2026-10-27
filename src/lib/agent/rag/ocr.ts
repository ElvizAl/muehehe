import { createReadStream } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import LlamaCloud from '@llamaindex/llama-cloud'
import 'dotenv/config'
import { preparePages } from './ocr-pages.ts'

const client = new LlamaCloud({ apiKey: process.env.LLAMA_CLOUD_API_KEY! })

const result = await client.parsing.parse({
  upload_file: createReadStream('documents/m.pdf'),
  tier: 'cost_effective',
  version: 'latest',
  expand: ['markdown'],
  output_options: { markdown: { tables: { output_tables_as_markdown: true } } },
})

const parsedPages = result.markdown?.pages ?? []
const pageList = preparePages(parsedPages)
const emptyPages = parsedPages.filter(
  (page) => page.success && !page.markdown.trim(),
)
if (emptyPages.length) {
  console.warn(
    `Halaman tanpa teks dilewati: ${emptyPages.map((page) => page.page_number).join(', ')}. Periksa PDF jika halaman tersebut seharusnya berisi teks.`,
  )
}
const text = pageList.map((page) => page.text).join('\n\n')
await writeFile('documents/m.txt', text)

await writeFile('documents/m-pages.json', JSON.stringify(pageList, null, 2))
console.log(`${pageList.length} halaman berisi teks berhasil disimpan.`)
