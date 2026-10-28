import { Menu as DropdownMenu } from '@base-ui/react/menu'
import { toast } from '#/components/ui/toast'
import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Menu,
  PawPrint,
  ChevronDown,
  MessageCircle,
  Cat,
  ClipboardList,
  LogOut,
  Loader2,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '#/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'
import { authClient } from '#/modules/auth/auth-browser'

export function LandingHeader() {
  const { data: session, isPending } = authClient.useSession()
  const [menu, setMenu] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const itemClass =
    'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-sm outline-none data-highlighted:bg-[#edf0e7]'

  async function handlerSignOut() {
    if (signingOut) return
    setSigningOut(true)
    try {
      const result = await authClient.signOut()
      if (result.error) {
        toast.add({ type: 'error', title: 'Gagal keluar, silakan coba lagi.' })
        return
      }
      window.location.assign('/')
    } catch {
      toast.add({ type: 'error', title: 'Gagal keluar, periksa koneksi kamu.' })
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <header className="relative flex h-[78px] items-center justify-between gap-2 md:gap-6 md:h-[100px] mx-auto w-[calc(100%-40px)] max-w-[1180px] md:w-[calc(100%-48px)] lg:w-[calc(100%-80px)]">
      <a
        className="flex items-center text-xl sm:text-2xl font-bold tracking-[-1px] [&>span:first-child]:mr-2 [&>span:first-child]:flex [&>svg]:mr-2 [&>i]:mb-2 [&>i]:ml-1 [&>i]:size-[5px] [&>i]:self-end [&>i]:rounded-full [&>i]:bg-[#d6a866]"
        href="/#beranda"
        aria-label="AnabulCare beranda"
      >
        <span>
          <PawPrint size={22} />
        </span>
        Anabul<span className="text-[#69856b]">Care</span>
        <i />
      </a>
      <nav
        className="hidden gap-7 text-[13px] md:flex [&_a:hover]:text-[#8c704b]"
        aria-label="Navigasi utama"
      >
        <a href="/#beranda">Beranda</a>
        <a href="/#tentang">Tentang kami</a>
        <a href="/#cara-kerja">Cara kerja</a>
        <a href="/#faq">FAQ</a>
        {!session && !isPending && <Link to="/login">Masuk</Link>}
      </nav>
      <div className="flex min-w-0 items-center gap-2">
        {isPending ? (
          <span role="status" className="p-3">
            <Loader2 className="size-4 animate-spin" aria-label="Memuat akun" />
          </span>
        ) : session ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              disabled={signingOut}
              className="flex min-w-0 items-center gap-2 rounded-xl border border-[#dce1d4] bg-white px-3 py-2 text-sm text-[#284f3d] outline-none focus-visible:ring-2 focus-visible:ring-[#718567]"
              aria-label={`Menu akun ${session.user.name}`}
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#edf0e7] font-semibold"
                aria-hidden="true"
              >
                {session.user.name.trim().charAt(0).toUpperCase() || 'A'}
              </span>
              <span className="max-w-20 truncate sm:max-w-36">
                {session.user.name}
              </span>
              {signingOut ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ChevronDown className="size-4 shrink-0" />
              )}
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Positioner
                align="end"
                sideOffset={8}
                className="z-50"
              >
                <DropdownMenu.Popup className="w-60 max-w-[calc(100vw-24px)] rounded-2xl border border-[#dce1d4] bg-white p-2 text-[#253e32] shadow-lg outline-none">
                  <div className="mb-1 border-b border-[#edf0e7] px-3 py-3">
                    <p className="truncate text-sm font-semibold">
                      {session.user.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#737a70]">
                      {session.user.email}
                    </p>
                  </div>
                  <DropdownMenu.LinkItem
                    href="/chat"
                    closeOnClick
                    className={itemClass}
                  >
                    <MessageCircle size={17} /> Chat
                  </DropdownMenu.LinkItem>
                  <DropdownMenu.LinkItem
                    render={<Link to="/profil" />}
                    closeOnClick
                    className={itemClass}
                  >
                    <Cat size={17} /> Profil
                  </DropdownMenu.LinkItem>
                  <DropdownMenu.LinkItem
                    render={<Link to="/hasil-konsultasi" />}
                    closeOnClick
                    className={itemClass}
                  >
                    <ClipboardList size={17} /> Hasil konsultasi
                  </DropdownMenu.LinkItem>
                  <DropdownMenu.Item
                    disabled={signingOut}
                    onClick={handlerSignOut}
                    className={`${itemClass} mt-1 border-t border-[#edf0e7] text-red-700 data-disabled:opacity-50`}
                  >
                    <LogOut size={17} /> {signingOut ? 'Keluar...' : 'Keluar'}
                  </DropdownMenu.Item>
                </DropdownMenu.Popup>
              </DropdownMenu.Positioner>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ) : (
          <Button
            nativeButton={false}
            render={<Link to="/register" />}
            className="hidden h-11 rounded-lg bg-[#284f3d] px-5 text-white hover:bg-[#3c664e] lg:inline-flex"
          >
            Daftar sekarang <ArrowRight size={16} />
          </Button>
        )}
        <Sheet open={menu} onOpenChange={setMenu}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Buka menu"
              />
            }
          >
            <Menu />
          </SheetTrigger>
          <SheetContent className="bg-[#fcfbf7] text-[#253e32]">
            <SheetHeader>
              <SheetTitle>AnabulCare</SheetTitle>
              <SheetDescription>Teman memahami kucingmu.</SheetDescription>
            </SheetHeader>
            <nav
              aria-label="Navigasi mobile"
              className="flex flex-col gap-3 px-4"
            >
              {[
                { href: '/#beranda', label: 'Beranda' },
                { href: '/#tentang', label: 'Tentang kami' },
                { href: '/#cara-kerja', label: 'Cara kerja' },
                { href: '/#faq', label: 'FAQ' },
                ...(!session && !isPending
                  ? [
                      { href: '/login', label: 'Masuk' },
                      { href: '/register', label: 'Daftar sekarang' },
                    ]
                  : []),
              ].map((link) => (
                <SheetClose
                  key={link.href}
                  nativeButton={false}
                  render={
                    <a
                      href={link.href}
                      className="rounded-lg px-3 py-3 text-sm hover:bg-[#edf0e7]"
                    >
                      {link.label}
                    </a>
                  }
                >
                  {link.label}
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
