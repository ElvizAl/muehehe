type MarkdownPage =
  | { success: true; page_number: number; markdown: string }
  | { success: false; page_number: number; error: string }

export function preparePages(parsedPages: Array<MarkdownPage>) {
  const failedPages = parsedPages.filter((page) => !page.success)
  if (failedPages.length) {
    throw new Error(
      `OCR gagal pada halaman: ${failedPages.map((page) => page.page_number).join(', ')}. Coba parsing ulang sebelum ingest.`,
    )
  }
  const pages = parsedPages
    .filter((page) => page.success)
    .filter((page) => page.markdown.trim().length > 0)
  if (!pages.length) {
    throw new Error(
      'OCR tidak menghasilkan teks pada halaman mana pun. Periksa PDF dan hasil parsing.',
    )
  }
  return pages.map((page) => ({ page: page.page_number, text: page.markdown }))
}
