import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { getSession } from '#/modules/auth/auth.session'
import { getProfilsServerFn } from '#/modules/profil/profil.api'
import { ProfilPage } from '#/modules/profil/components/profil-page'

export const Route = createFileRoute('/_home/profil')({
  beforeLoad: async () => {
    if (!(await getSession())) throw redirect({ to: '/login' })
  },
  loader: async () => {
    const result = await getProfilsServerFn()
    if (!result.success) throw new Error(result.message)
    return result.data.at(0) ?? null
  },
  pendingComponent: () => (
    <main className="mx-auto max-w-5xl p-12" role="status">
      Memuat profil kucing...
    </main>
  ),
  errorComponent: () => (
    <main className="mx-auto max-w-5xl p-12">
      <h1 className="text-2xl font-semibold">Profil belum bisa dimuat</h1>
      <p className="my-4">Periksa koneksi lalu coba kembali.</p>
      <button
        className="rounded-lg bg-[#284f3d] px-5 py-3 text-white"
        onClick={() => window.location.reload()}
      >
        Coba lagi
      </button>
    </main>
  ),
  component: ProfilRoute,
})

function ProfilRoute() {
  const profil = Route.useLoaderData()
  const router = useRouter()
  return (
    <ProfilPage
      key={profil ? `${profil.id}-${profil.updatedAt}` : 'new'}
      profil={profil}
      refresh={() => router.invalidate()}
    />
  )
}
