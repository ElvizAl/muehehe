import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useServerFn } from '@tanstack/react-start'
import {
  Cat,
  Heart,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Loader2,
  ArrowLeft,
  ClipboardList,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Button } from '#/components/ui/button'
import { toast } from '#/components/ui/toast'
import { profilSchema } from '../profil.schema'
import type { ProfilInput } from '../profil.schema'
import {
  createProfilServerFn,
  updateProfilServerFn,
  deleteProfilServerFn,
} from '../profil.api'

type Profil = ProfilInput & { id: string }
const inputClass =
  'h-12 w-full rounded-xl border border-[#dce1d4] bg-white px-4 text-sm outline-none focus:border-[#718567] focus:ring-2 focus:ring-[#718567]/20'
const empty: ProfilInput = {
  name: '',
  ageMonths: null,
  breed: '',
  gender: '',
  vaccinated: null,
  environment: '',
  healthHistory: '',
}

export function ProfilPage({
  profil,
  refresh,
}: {
  profil: Profil | null
  refresh: () => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState('')
  const createProfilServerFnHandler = useServerFn(createProfilServerFn)
  const updateProfilServerFnHandler = useServerFn(updateProfilServerFn)
  const deleteProfilServerFnHandler = useServerFn(deleteProfilServerFn)
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfilInput>({
    resolver: zodResolver(profilSchema),
    defaultValues: profil ?? empty,
  })
  const draft = watch()
  const shown = editing ? draft : profil
  const busy = isSubmitting || deleting
  const age =
    shown?.ageMonths == null ? 'Umur belum diisi' : `${shown.ageMonths} bulan`

  async function handlerSaveProfil(data: ProfilInput) {
    setActionError('')
    try {
      const result = profil
        ? await updateProfilServerFnHandler({
            data: { ...data, id: profil.id },
          })
        : await createProfilServerFnHandler({ data })
      if (!result.success) {
        setActionError(result.message)
        toast.add({ type: 'error', title: result.message })
        return
      }
      toast.add({ type: 'success', title: result.message })
      await refresh()
      setEditing(false)
    } catch {
      const message =
        'Belum bisa menyimpan profil. Periksa koneksi dan coba lagi.'
      setActionError(message)
      toast.add({ type: 'error', title: message })
    }
  }

  async function handlerDeleteProfil() {
    if (!profil) return
    setDeleting(true)
    setActionError('')
    try {
      const result = await deleteProfilServerFnHandler({
        data: { id: profil.id },
      })
      if (!result.success) {
        setActionError(result.message)
        toast.add({ type: 'error', title: result.message })
        return
      }
      toast.add({ type: 'success', title: result.message })
      await refresh()
      setConfirmDelete(false)
    } catch {
      const message = 'Belum bisa menghapus profil. Silakan coba lagi.'
      setActionError(message)
      toast.add({ type: 'error', title: message })
    } finally {
      setDeleting(false)
    }
  }

  function startEditing() {
    reset(profil ?? empty)
    setActionError('')
    setConfirmDelete(false)
    setEditing(true)
  }

  return (
    <main className="min-h-[75vh] bg-[#fcfbf7] px-5 py-10 text-[#253e32] sm:px-8 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-xs text-[#737a70]"
        >
          <ArrowLeft size={14} /> Kembali ke beranda
        </Link>
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-[#718567]">
              KENALI SI KECIL LEBIH DEKAT
            </p>
            <h1 className="font-heading text-4xl font-semibold tracking-tight">
              Satu profil, banyak cerita.
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#737a70]">
              Simpan hal-hal kecil yang membuat kucingmu istimewa.
            </p>
          </div>
          {profil && !editing && (
            <div className="flex flex-wrap gap-3">
              <Link
                to="/hasil-konsultasi"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#dce1d4] bg-white px-5 text-sm text-[#284f3d] hover:bg-[#edf0e7]"
              >
                <ClipboardList size={16} /> Hasil konsultasi
              </Link>
              <Button
                onClick={startEditing}
                className="h-11 rounded-xl bg-[#284f3d] px-5 text-white"
              >
                <Pencil size={16} /> Edit profil
              </Button>
            </div>
          )}
        </div>
        {actionError && (
          <p
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            {actionError}
          </p>
        )}
        <div className="grid items-start gap-6 md:grid-cols-[300px_1fr]">
          <aside className="overflow-hidden rounded-3xl border border-[#e1e5d9] bg-white">
            <div className="flex h-44 items-center justify-center bg-[#e9ecdf]">
              <div className="flex size-24 items-center justify-center rounded-full bg-[#fcfbf7] text-[#718567]">
                <Cat size={52} strokeWidth={1.3} />
              </div>
            </div>
            <div className="p-7">
              <p className="mb-2 text-[10px] tracking-widest text-[#718567]">
                {editing ? 'PRATINJAU PROFIL' : 'TEMAN KECILMU'}
              </p>
              <h2 className="break-words text-2xl font-semibold">
                {shown?.name.trim() || 'Siapa nama si kecil?'}
              </h2>
              <p className="mt-2 text-sm text-[#737a70]">
                {shown?.breed?.trim() || 'Ras belum diisi'} · {age}
              </p>
              <div className="mt-6 flex items-center gap-2 rounded-xl bg-[#f5f6ef] p-3 text-xs">
                <Heart size={16} /> Dirawat dengan penuh sayang.
              </div>
            </div>
          </aside>
          {!profil && !editing ? (
            <section className="rounded-3xl border border-dashed border-[#ccd5c3] bg-white p-8 sm:p-12">
              <Plus className="mb-6 text-[#718567]" size={28} />
              <h2 className="text-2xl font-semibold">Mulai cerita si kecil</h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-[#737a70]">
                Tambahkan nama dan jenis kelamin kucingmu. Informasi lainnya
                bisa dilengkapi kapan saja.
              </p>
              <Button
                onClick={startEditing}
                className="mt-7 h-12 rounded-xl bg-[#284f3d] px-6 text-white"
              >
                Buat profil kucing <Plus size={16} />
              </Button>
            </section>
          ) : editing ? (
            <form
              onSubmit={handleSubmit(handlerSaveProfil)}
              noValidate
              className="rounded-3xl border border-[#e1e5d9] bg-white p-6 sm:p-8"
            >
              <h2 className="text-xl font-semibold">
                {profil ? 'Perbarui profil' : 'Kenalkan kucingmu'}
              </h2>
              <p className="mt-2 text-xs text-[#737a70]">
                Nama dan jenis kelamin wajib diisi.
              </p>
              <fieldset
                disabled={busy}
                className="mt-7 grid gap-5 sm:grid-cols-2 disabled:opacity-60"
              >
                <div>
                  <Label htmlFor="cat-name" className="mb-2 block text-sm">
                    Nama kucing *
                  </Label>
                  <Input
                    id="cat-name"
                    placeholder="Contoh: Milo"
                    className={inputClass}
                    {...register('name')}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p
                      id="name-error"
                      role="alert"
                      className="text-sm text-red-500"
                    >
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="cat-gender" className="mb-2 block text-sm">
                    Jenis kelamin *
                  </Label>
                  <select
                    id="cat-gender"
                    className={inputClass}
                    {...register('gender')}
                    aria-invalid={!!errors.gender}
                    aria-describedby={
                      errors.gender ? 'gender-error' : undefined
                    }
                  >
                    <option value="">Pilih jenis kelamin</option>
                    {profil?.gender &&
                      !['MALE', 'FEMALE', 'UNKNOWN'].includes(
                        profil.gender,
                      ) && (
                        <option value={profil.gender}>{profil.gender}</option>
                      )}
                    <option value="MALE">Jantan</option>
                    <option value="FEMALE">Betina</option>
                    <option value="UNKNOWN">Belum diketahui</option>
                  </select>
                  {errors.gender && (
                    <p
                      id="gender-error"
                      role="alert"
                      className="text-sm text-red-500"
                    >
                      {errors.gender.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="cat-age" className="mb-2 block text-sm">
                    Umur (total bulan)
                  </Label>
                  <Input
                    id="cat-age"
                    type="number"
                    min={0}
                    step={1}
                    placeholder="Contoh: 18"
                    className={inputClass}
                    {...register('ageMonths', {
                      setValueAs: (value) =>
                        value === '' || value == null ? null : Number(value),
                    })}
                    aria-invalid={!!errors.ageMonths}
                    aria-describedby={
                      errors.ageMonths ? 'ageMonths-error' : undefined
                    }
                  />
                  {errors.ageMonths && (
                    <p
                      id="ageMonths-error"
                      role="alert"
                      className="text-sm text-red-500"
                    >
                      {errors.ageMonths.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="cat-breed" className="mb-2 block text-sm">
                    Ras kucing
                  </Label>
                  <Input
                    id="cat-breed"
                    placeholder="Contoh: Domestik"
                    className={inputClass}
                    {...register('breed')}
                    aria-invalid={!!errors.breed}
                    aria-describedby={errors.breed ? 'breed-error' : undefined}
                  />
                  {errors.breed && (
                    <p
                      id="breed-error"
                      role="alert"
                      className="text-sm text-red-500"
                    >
                      {errors.breed.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="cat-vaccine" className="mb-2 block text-sm">
                    Status vaksinasi
                  </Label>
                  <select
                    id="cat-vaccine"
                    className={inputClass}
                    {...register('vaccinated', {
                      setValueAs: (value) =>
                        value === '' || value == null
                          ? null
                          : value === true || value === 'true',
                    })}
                    aria-invalid={!!errors.vaccinated}
                    aria-describedby={
                      errors.vaccinated ? 'vaccinated-error' : undefined
                    }
                  >
                    <option value="">Belum diketahui</option>
                    <option value="true">Sudah vaksin</option>
                    <option value="false">Belum vaksin</option>
                  </select>
                  {errors.vaccinated && (
                    <p
                      id="vaccinated-error"
                      role="alert"
                      className="text-sm text-red-500"
                    >
                      {errors.vaccinated.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="cat-environment"
                    className="mb-2 block text-sm"
                  >
                    Lingkungan tinggal
                  </Label>
                  <Input
                    id="cat-environment"
                    placeholder="Contoh: Di dalam rumah"
                    className={inputClass}
                    {...register('environment')}
                    aria-invalid={!!errors.environment}
                    aria-describedby={
                      errors.environment ? 'environment-error' : undefined
                    }
                  />
                  {errors.environment && (
                    <p
                      id="environment-error"
                      role="alert"
                      className="text-sm text-red-500"
                    >
                      {errors.environment.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="cat-history" className="mb-2 block text-sm">
                    Catatan kesehatan
                  </Label>
                  <textarea
                    id="cat-history"
                    rows={4}
                    placeholder="Alergi, perawatan sebelumnya, atau hal yang ingin kamu ingat..."
                    className={`${inputClass} h-auto resize-y py-3`}
                    {...register('healthHistory')}
                    aria-invalid={!!errors.healthHistory}
                    aria-describedby={
                      errors.healthHistory ? 'healthHistory-error' : undefined
                    }
                  />
                  {errors.healthHistory && (
                    <p
                      id="healthHistory-error"
                      role="alert"
                      className="text-sm text-red-500"
                    >
                      {errors.healthHistory.message}
                    </p>
                  )}
                </div>
              </fieldset>
              <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0e7] pt-5">
                <span className="text-xs text-[#737a70]" aria-live="polite">
                  {isDirty
                    ? 'Ada perubahan yang belum disimpan'
                    : 'Informasi tersimpan hanya setelah kamu menyimpan'}
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={busy}
                    onClick={() => {
                      reset(profil ?? empty)
                      setEditing(false)
                      setActionError('')
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={busy || (!!profil && !isDirty)}
                    className="h-11 rounded-xl bg-[#284f3d] px-5 text-white"
                  >
                    {isSubmitting && (
                      <Loader2 size={16} className="animate-spin" />
                    )}
                    {isSubmitting ? 'Menyimpan...' : 'Simpan profil'}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            profil && (
              <section className="rounded-3xl border border-[#e1e5d9] bg-white p-6 sm:p-8">
                <div className="mb-7 flex items-center gap-3">
                  <ShieldCheck className="text-[#718567]" />
                  <h2 className="text-xl font-semibold">
                    Tentang {profil.name}
                  </h2>
                </div>
                <dl className="grid gap-6 sm:grid-cols-2">
                  {[
                    [
                      'Jenis kelamin',
                      (
                        {
                          MALE: 'Jantan',
                          FEMALE: 'Betina',
                          UNKNOWN: 'Belum diketahui',
                        } as Record<string, string>
                      )[profil.gender] || profil.gender,
                    ],
                    [
                      'Vaksinasi',
                      profil.vaccinated == null
                        ? 'Belum diketahui'
                        : profil.vaccinated
                          ? 'Sudah vaksin'
                          : 'Belum vaksin',
                    ],
                    ['Lingkungan', profil.environment || 'Belum diisi'],
                    ['Umur', age],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs text-[#737a70]">{label}</dt>
                      <dd className="mt-2 break-words text-sm font-medium">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-7 border-t border-[#edf0e7] pt-6">
                  <h3 className="text-xs text-[#737a70]">Catatan kesehatan</h3>
                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7">
                    {profil.healthHistory ||
                      'Belum ada catatan. Kamu bisa menambahkannya lewat Edit profil.'}
                  </p>
                </div>
                <div className="mt-8 border-t border-[#edf0e7] pt-5">
                  {confirmDelete ? (
                    <div
                      role="group"
                      aria-label="Konfirmasi hapus profil"
                      className="rounded-xl bg-red-50 p-4"
                    >
                      <p className="text-sm font-medium text-red-900">
                        Hapus profil {profil.name}?
                      </p>
                      <p className="mt-2 text-xs leading-5 text-red-800">
                        Data profil akan dihapus permanen. Tindakan ini tidak
                        dapat dibatalkan.
                      </p>
                      <div className="mt-4 flex gap-3">
                        <Button
                          variant="outline"
                          disabled={busy}
                          onClick={() => setConfirmDelete(false)}
                        >
                          Batal
                        </Button>
                        <Button
                          disabled={busy}
                          onClick={handlerDeleteProfil}
                          className="bg-red-700 text-white hover:bg-red-800"
                        >
                          {deleting ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}{' '}
                          {deleting ? 'Menghapus...' : 'Ya, hapus profil'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="flex items-center gap-2 text-xs text-red-700"
                    >
                      <Trash2 size={14} /> Hapus profil
                    </button>
                  )}
                </div>
              </section>
            )
          )}
        </div>
      </div>
    </main>
  )
}
