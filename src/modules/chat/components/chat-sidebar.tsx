import { Link } from '@tanstack/react-router'
import {
  Cat,
  ChevronDown,
  LogOut,
  MessageCircle,
  PanelLeftClose,
  PawPrint,
  Search,
  SquarePen,
} from 'lucide-react'
import { Menu } from '@base-ui/react/menu'
import { useState } from 'react'
import { authClient } from '#/modules/auth/auth.client'
import { toast } from '#/components/ui/toast'

export function ChatSidebar({
  name,
  conversations,
  activeId,
  onSelect,
  onNew,
  onClose,
}: {
  name: string
  conversations: Array<{ id: string; title: string }>
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onClose: () => void
}) {
  const [search, setSearch] = useState('')
  const [signingOut, setSigningOut] = useState(false)
  async function handlerSignOut() {
    setSigningOut(true)
    try {
      const result = await authClient.signOut()
      if (result.error) throw new Error('Logout failed')
      window.location.assign('/')
    } catch {
      toast.add({
        type: 'error',
        title: 'ยัง'.replace('ยัง', 'Gagal keluar. Silakan coba lagi.'),
      })
    } finally {
      setSigningOut(false)
    }
  }
  const filtered = conversations.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  )
  return (
    <div className="flex h-full flex-col bg-[#f1f3eb] text-[#253e32]">
      <div className="flex h-20 shrink-0 items-center justify-between px-5">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-semibold tracking-tight"
        >
          <PawPrint size={23} className="text-[#718567]" /> Anabul
          <span className="-ml-2 text-[#718567]">Care</span>
        </Link>
        <button
          onClick={onClose}
          aria-label="Tutup sidebar"
          className="rounded-lg p-2 text-[#737a70] hover:bg-[#e9ecdf]"
        >
          <PanelLeftClose size={19} />
        </button>
      </div>
      <div className="space-y-3 px-3">
        <button
          onClick={onNew}
          className="flex w-full items-center gap-3 rounded-xl bg-[#284f3d] px-4 py-3 text-sm text-[#ffffff] transition hover:bg-[#3c664e]"
        >
          <SquarePen size={18} /> Chat baru{' '}
          <span className="ml-auto text-lg text-[#e9ecdf]">+</span>
        </button>
        <label className="flex items-center gap-3 rounded-xl border border-[#dce1d4] px-4 py-2.5 text-[#737a70]">
          <Search size={16} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari percakapan"
            aria-label="Cari percakapan"
            className="w-full bg-transparent text-xs text-[#253e32] outline-none placeholder:text-[#737a70]"
          />
        </label>
        <Link
          to="/profil"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-[#e9ecdf]"
        >
          <Cat size={18} /> Profil kucing
        </Link>
      </div>
      <div className="mt-8 min-h-0 flex-1 overflow-y-auto px-3">
        <p className="px-4 text-[10px] font-medium tracking-[0.15em] text-[#737a70]">
          PERCAKAPAN
        </p>
        <div className="mt-3 space-y-1">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              aria-current={activeId === item.id ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${activeId === item.id ? 'bg-[#e2e8d9] text-[#284f3d]' : 'text-[#737a70] hover:bg-[#e9ecdf]'}`}
            >
              <MessageCircle size={15} className="shrink-0" />
              <span className="truncate">{item.title}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-4 py-4 text-xs leading-6 text-[#737a70]">
              {search
                ? 'Tidak ada percakapan yang cocok.'
                : 'Cerita pertama si kecil dimulai di sini.'}
            </p>
          )}
        </div>
      </div>
      <div className="m-4 rounded-xl border border-[#dce1d4] bg-[#e9ecdf] p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-[#284f3d]">
          <PawPrint size={14} /> Ruang cerita si kecil
        </div>
        <p className="text-[11px] leading-5 text-[#737a70]">
          Mode demo. Riwayat akan hilang saat halaman dimuat ulang.
        </p>
      </div>
      <Menu.Root>
        <Menu.Trigger
          disabled={signingOut}
          className="flex w-full items-center gap-3 border-t border-[#dce1d4] px-5 py-4 text-left hover:bg-[#e9ecdf]"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e2e8d9] text-sm text-[#284f3d]">
            {name.trim().charAt(0).toUpperCase() || 'A'}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm">{name}</span>
            <span className="text-[11px] text-[#737a70]">
              Sahabat AnabulCare
            </span>
          </span>
          <ChevronDown size={16} />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner side="top" sideOffset={8} className="z-50">
            <Menu.Popup className="w-56 rounded-xl border border-[#dce1d4] bg-[#ffffff] p-2 text-sm text-[#253e32] shadow-xl">
              <Menu.LinkItem
                render={<Link to="/profil" />}
                closeOnClick
                className="flex items-center gap-3 rounded-lg p-3 outline-none data-highlighted:bg-[#edf0e7]"
              >
                <Cat size={16} /> Profil
              </Menu.LinkItem>
              <Menu.Item
                disabled={signingOut}
                onClick={handlerSignOut}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-3 text-red-700 outline-none data-highlighted:bg-[#edf0e7]"
              >
                <LogOut size={16} />
                {signingOut ? 'Keluar...' : 'Keluar'}
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  )
}
