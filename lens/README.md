# Lens lokal

Direktori ini memakai template Compose resmi Anvia Lens. Konfigurasi lokal berada di `lens/.env` (diabaikan Git): release `0.4.1`, origin `http://localhost:3002`, dan secret acak yang berbeda untuk tiap layanan.

1. Jalankan Docker Desktop sampai `docker info` berhasil.
2. Dari direktori ini, jalankan `docker compose up -d` lalu `docker compose ps`.
3. Buka `http://localhost:3002`, buat akun owner, buat project **AnabulCare**, lalu buat ingestion key melalui **Connect**.
4. Isi `ANVIA_LENS_BASE_URL=http://localhost:3002`, `ANVIA_LENS_PUBLIC_KEY`, dan `ANVIA_LENS_SECRET_KEY` di `.env` aplikasi pada direktori induk. Jangan taruh key di kode browser.
5. Jalankan aplikasi dan kirim satu pesan chat. Buka **Traces** di Lens untuk memeriksa run agent, model, dan tool. Capture aman sengaja tidak mengirim isi prompt atau jawaban.

Jika stack gagal sehat, jalankan `docker compose logs --tail=100 migrate api worker web`. Setelah tracing terbukti, dataset dan eval suite dapat ditambahkan menggunakan project yang sama.
