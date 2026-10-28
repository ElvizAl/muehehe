import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '#/modules/auth/auth.session'
import { listSavedConsultations } from '#/modules/consultation/consultation.api'
import { ConsultationPage } from '#/modules/consultation/components/consultation-page'

export const Route = createFileRoute('/_home/hasil-konsultasi')({
  beforeLoad: async () => {
    if (!(await getSession())) throw redirect({ to: '/login' })
  },
  loader: () => listSavedConsultations(),
  pendingComponent: () => (
    <main className="mx-auto max-w-5xl p-12" role="status">
      Memuat hasil konsultasi...
    </main>
  ),
  errorComponent: () => (
    <main className="mx-auto max-w-5xl p-12">
      <h1 className="text-2xl font-semibold">
        Hasil konsultasi belum bisa dimuat
      </h1>
      <p className="my-4">Periksa koneksi lalu coba kembali.</p>
      <button
        className="rounded-lg bg-[#284f3d] px-5 py-3 text-white"
        onClick={() => window.location.reload()}
      >
        Coba lagi
      </button>
    </main>
  ),
  component: ConsultationRoute,
})

function ConsultationRoute() {
  const consultations = Route.useLoaderData()
  return <ConsultationPage consultations={consultations} />
}
