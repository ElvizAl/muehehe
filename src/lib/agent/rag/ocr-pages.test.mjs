import assert from 'node:assert/strict'
import test from 'node:test'
import { preparePages } from './ocr-pages.ts'

test('keeps successful text when the final page is empty', () => {
  assert.deepEqual(
    preparePages([
      { success: true, page_number: 1, markdown: 'Referensi kucing' },
      { success: true, page_number: 5, markdown: '  \n' },
    ]),
    [{ page: 1, text: 'Referensi kucing' }],
  )
})

test('preserves source page numbers after skipping an empty page', () => {
  assert.deepEqual(
    preparePages([
      { success: true, page_number: 1, markdown: '' },
      { success: true, page_number: 2, markdown: 'Gejala' },
    ]),
    [{ page: 2, text: 'Gejala' }],
  )
})

test('rejects failed pages even when other pages have text', () => {
  assert.throws(() =>
    preparePages([
      { success: true, page_number: 1, markdown: 'Gejala' },
      { success: false, page_number: 2, error: 'Parsing failed' },
    ]),
  )
})

test('rejects missing and entirely blank results', () => {
  assert.throws(() => preparePages([]))
  assert.throws(() =>
    preparePages([{ success: true, page_number: 1, markdown: '  ' }]),
  )
})
