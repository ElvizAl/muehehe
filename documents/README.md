# RAG AnabulCare

Mengikuti pola [ElvizAl/kucing](https://github.com/ElvizAl/kucing), commit
`a4181f005903a2aed902b2de8db53613ad69532e`: LlamaParse, dokumen per halaman,
embedding `text-embedding-3-small` (1536 dimensi), Qdrant, dan tool Anvia.

Gunakan Node.js 22.18+ atau 24+. Jalankan perintah dari root proyek.
Isi variabel dari `.env.example` ke `.env` tanpa menimpa konfigurasi yang ada:

- OCR: `LLAMA_CLOUD_API_KEY`.
- Ingest/pencarian: `SUMOPOD_API_KEY`, `SUMOPOD_BASE_URL`, `QDRANT_URL`,
  `QDRANT_API_KEY` jika Qdrant menggunakan autentikasi.
- Agent: `OPENAI_API_KEY`, `OPENAI_BASE_URL`; model mengikuti `model.ts`.
- `QDRANT_COLLECTION` opsional, default `penyakit`.

```sh
pnpm rag:ocr
pnpm rag:ingest
pnpm rag:search "kucing muntah dan tidak mau makan"
```

OCR mengirim `documents/m.pdf` ke LlamaParse dan menghasilkan `m.txt` serta
`m-pages.json`. Tinjau hasil OCR sebelum ingest.
Halaman yang sukses tetapi tanpa teks dilewati dengan peringatan; nomor halaman
asli dipertahankan. Halaman gagal atau hasil seluruhnya kosong menghentikan OCR.
Ingest mengirim teks ke layanan embedding dan menyimpan vector beserta sumber
dan nomor halaman ke Qdrant.
Satu halaman menjadi satu dokumen, tanpa chunking tambahan, seperti referensi.
Halaman yang terlalu panjang untuk model embedding perlu dipecah terlebih dahulu.

Ingest membuat index keyword `__anvia_document_id` sebelum upsert. ID halaman
stabil membuat ingest ulang mengganti halaman yang sama. Jika PDF baru lebih
pendek atau menggantikan sumber lama, gunakan collection baru agar halaman lama
tidak ikut menjadi hasil pencarian.

`src/lib/agent/agents.ts` mengekspor `assistantAgent` dengan tool `cari_penyakit`
dan maksimal lima turn. `rag/store.ts` hanya berisi konfigurasi; mengimpor tool
tidak menjalankan OCR atau ingest. Import agent hanya dari kode server.

Antarmuka `/chat` masih demo dan belum dihubungkan ke agent ini. Modul ini tidak
mengambil profil maupun menyimpan riwayat konsultasi. Hasil pencarian CLI dapat
dipakai memeriksa relevansi, sumber, dan halaman sebelum integrasi chat.
