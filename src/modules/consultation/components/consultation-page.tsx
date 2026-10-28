import { Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  ClipboardList,
  PawPrint,
} from 'lucide-react'
import type { listSavedConsultations } from '../consultation.api'

type SavedConsultation = Awaited<
  ReturnType<typeof listSavedConsultations>
>[number]

const urgencyLabels: Record<string, string> = {
  darurat: 'Darurat',
  segera: 'Perlu segera diperiksa',
  terjadwal: 'Pemeriksaan terjadwal',
  pantau: 'Pantau kondisi',
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Asia/Makassar',
})

export function ConsultationPage({
  consultations,
}: {
  consultations: Array<SavedConsultation>
}) {
  return (
    <main className="min-h-[75vh] bg-[#fcfbf7] px-5 py-10 text-[#253e32] sm:px-8 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/profil"
          className="mb-8 inline-flex items-center gap-2 text-xs text-[#737a70] hover:text-[#284f3d]"
        >
          <ArrowLeft size={14} /> Kembali ke profil
        </Link>
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-[#718567]">
              RIWAYAT KONSULTASI
            </p>
            <h1 className="font-heading text-4xl font-semibold tracking-tight">
              Catatan kesehatan si kecil.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#737a70]">
              Baca kembali hasil penilaian awal yang pernah disimpan selama
              konsultasi.
            </p>
          </div>
          <Link
            to="/chat"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#284f3d] px-5 text-sm text-white hover:bg-[#3c664e]"
          >
            Buka chat <ArrowRight size={16} />
          </Link>
        </div>

        {consultations.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-[#ccd5c3] bg-white p-8 sm:p-12">
            <PawPrint className="mb-6 text-[#718567]" size={28} />
            <h2 className="text-2xl font-semibold">
              Belum ada hasil tersimpan
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-[#737a70]">
              Setelah penilaian awal selesai dan agent menyimpan hasilnya,
              catatan konsultasi akan muncul di sini.
            </p>
          </section>
        ) : (
          <div className="space-y-4">
            {consultations.map((item) => (
              <details
                key={item.id}
                className="group rounded-3xl border border-[#e1e5d9] bg-white p-6 shadow-sm sm:p-8"
              >
                <summary className="cursor-pointer list-none marker:hidden [&::-webkit-details-marker]:hidden">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="mb-3 flex items-center gap-2 text-xs text-[#718567]">
                        <CalendarDays size={14} />{' '}
                        {dateFormatter.format(new Date(item.createdAt))}
                      </p>
                      <h2 className="text-xl font-semibold">{item.catName}</h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#737a70]">
                        {item.symptoms}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#edf0e7] px-3 py-1.5 text-xs font-medium text-[#284f3d]">
                      {urgencyLabels[item.urgency] ?? item.urgency}
                    </span>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-[#52684a] group-open:hidden">
                    Lihat detail <ArrowRight size={13} />
                  </span>
                  <span className="mt-5 hidden text-xs font-medium text-[#52684a] group-open:inline">
                    Tutup detail
                  </span>
                </summary>

                <div className="mt-6 grid gap-6 border-t border-[#e1e5d9] pt-6 sm:grid-cols-2">
                  <section>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <ClipboardList size={16} /> Penilaian awal
                    </h3>
                    <p className="text-sm leading-7 whitespace-pre-wrap text-[#526052]">
                      {item.assessment}
                    </p>
                  </section>
                  <section>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <PawPrint size={16} /> Rekomendasi
                    </h3>
                    <p className="text-sm leading-7 whitespace-pre-wrap text-[#526052]">
                      {item.recommendation}
                    </p>
                  </section>
                  <section className="sm:col-span-2">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <BookOpen size={16} /> Sumber yang disimpan
                    </h3>
                    {item.sources.length ? (
                      <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-[#526052]">
                        {item.sources.map((source, index) => (
                          <li key={`${source.title}-${source.page}-${index}`}>
                            {source.title}, halaman {source.page}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-[#737a70]">
                        Tidak ada sumber yang disimpan pada hasil ini.
                      </p>
                    )}
                  </section>
                </div>
                <p className="mt-6 border-t border-[#e1e5d9] pt-4 text-xs leading-5 text-[#737a70]">
                  Hasil ini merupakan penilaian awal dan bukan diagnosis dokter
                  hewan.
                </p>
              </details>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
