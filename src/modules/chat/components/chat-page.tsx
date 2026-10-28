import { useEffect, useRef, useState } from 'react'
import { createHttpClientTransport, messageText } from '@anvia/client'
import type { UIMessage } from '@anvia/client'
import { useChat } from '@anvia/react'
import { StreamMarkdown } from '@anvia/react-ui/stream'
import {
  Cat,
  Heart,
  Leaf,
  MessageCircle,
  PanelLeft,
  PawPrint,
  Sparkles,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '#/components/ui/sheet'
import { ChatSidebar } from './chat-sidebar'
import { ChatComposer } from './chat-composer'
import { ToolActivity } from './tool-activity'
import { loadChatConversation } from '../chat-history.api'

type Conversation = {
  id: string
  title: string
  messages: ReadonlyArray<UIMessage>
}
const transport = createHttpClientTransport({
  endpoint: '/api/chat',
  format: 'jsonl',
})
const topics = [
  {
    icon: Heart,
    title: 'Kenali kebiasaannya',
    text: 'Apa saja yang perlu dicatat saat kebiasaan kucing berubah?',
    color: 'text-[#a17b55]',
  },
  {
    icon: Leaf,
    title: 'Perawatan sehari-hari',
    text: 'Bantu saya menyusun rutinitas perawatan kucing.',
    color: 'text-[#718567]',
  },
  {
    icon: Cat,
    title: 'Kenalan dengan si kecil',
    text: 'Informasi apa yang perlu saya isi di profil kucing?',
    color: 'text-[#687e93]',
  },
]

export function ChatPage({
  name,
  initialConversations,
}: {
  name: string
  initialConversations: Array<{ id: string; title: string }>
}) {
  const chat = useChat({ transport })
  const [sidebar, setSidebar] = useState(true)
  const [mobile, setMobile] = useState(false)
  const [conversations, setConversations] = useState<Array<Conversation>>(() =>
    initialConversations.map((item) => ({ ...item, messages: [] })),
  )
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [suggestion, setSuggestion] = useState({ text: '', key: 0 })
  const bottom = useRef<HTMLDivElement>(null)
  const loadSequence = useRef(0)
  const active = conversations.find((item) => item.id === activeId)
  const busy = chat.status === 'submitted' || chat.status === 'streaming'
  const locked = busy || loadingId !== null
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [activeId, chat.messages])
  useEffect(() => {
    if (!activeId) return
    setConversations((items) =>
      items.map((item) =>
        item.id === activeId ? { ...item, messages: chat.messages } : item,
      ),
    )
  }, [activeId, chat.messages])
  function newChat() {
    if (busy) return
    loadSequence.current += 1
    setLoadingId(null)
    setHistoryError(null)
    chat.reset()
    setActiveId(null)
    setSuggestion((prev) => ({ text: '', key: prev.key + 1 }))
    setMobile(false)
  }
  async function selectChat(id: string) {
    if (busy) return
    const selected = conversations.find((item) => item.id === id)
    if (!selected) return
    const sequence = ++loadSequence.current
    setLoadingId(id)
    setHistoryError(null)
    try {
      const messages = await loadChatConversation({ data: { id } })
      if (sequence !== loadSequence.current) return
      chat.setMessages(messages)
      setActiveId(id)
      setSuggestion((prev) => ({ text: '', key: prev.key + 1 }))
      setMobile(false)
    } catch {
      if (sequence === loadSequence.current) {
        setHistoryError('Percakapan gagal dimuat. Silakan coba lagi.')
      }
    } finally {
      if (sequence === loadSequence.current) setLoadingId(null)
    }
  }
  function send(message: string) {
    if (locked) return
    setHistoryError(null)
    const id = activeId ?? crypto.randomUUID()
    if (!activeId) {
      chat.reset()
      setConversations((items) => [
        { id, title: message, messages: [] },
        ...items,
      ])
      setActiveId(id)
    }
    void chat.sendMessage({ text: message, metadata: { sessionId: id } })
  }
  const sidebarProps = {
    name,
    conversations,
    activeId,
    onSelect: selectChat,
    onNew: newChat,
    loadingId,
  }
  return (
    <div className="flex h-dvh overflow-hidden bg-[#fcfbf7] font-sans text-[#253e32] selection:bg-[#718567]/25">
      {sidebar && (
        <aside className="hidden w-[280px] shrink-0 border-r border-[#dce1d4] lg:block">
          <ChatSidebar {...sidebarProps} onClose={() => setSidebar(false)} />
        </aside>
      )}
      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent
          side="left"
          className="w-[290px] gap-0 border-[#dce1d4] bg-[#f1f3eb] p-0 text-[#253e32] [&>button]:hidden"
        >
          <SheetTitle className="sr-only">Navigasi AnabulCare</SheetTitle>
          <SheetDescription className="sr-only">
            Percakapan dan profil kucing
          </SheetDescription>
          <ChatSidebar {...sidebarProps} onClose={() => setMobile(false)} />
        </SheetContent>
      </Sheet>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-20 shrink-0 items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              aria-label="Buka navigasi"
              onClick={() => setMobile(true)}
              className="rounded-lg p-2 text-[#737a70] hover:bg-[#e9ecdf] lg:hidden"
            >
              <PanelLeft size={20} />
            </button>
            {!sidebar && (
              <button
                aria-label="Buka sidebar"
                onClick={() => setSidebar(true)}
                className="hidden rounded-lg p-2 text-[#737a70] hover:bg-[#e9ecdf] lg:block"
              >
                <PanelLeft size={20} />
              </button>
            )}
            <span className="hidden text-sm text-[#737a70] sm:block">
              Teman memahami kucingmu
            </span>
          </div>
          <nav
            aria-label="Ruang AnabulCare"
            className="flex rounded-full border border-[#dce1d4] bg-[#edf0e7] p-1 text-xs"
          >
            <span
              aria-current="page"
              className="flex items-center gap-2 rounded-full bg-[#284f3d] px-5 py-2.5 text-[#ffffff]"
            >
              <MessageCircle size={14} />
              Chat
            </span>
            <Link
              to="/profil"
              className="rounded-full px-5 py-2.5 text-[#737a70] transition hover:text-[#284f3d]"
            >
              Profil kucing
            </Link>
            <Link
              to="/hasil-konsultasi"
              className="rounded-full px-3 py-2.5 text-[#737a70] transition hover:text-[#284f3d] sm:px-5"
            >
              Hasil
            </Link>
          </nav>
          <span className="hidden items-center gap-2 rounded-full border border-[#dce1d4] px-3 py-1.5 text-[10px] text-[#52684a] sm:flex">
            <span className="size-1.5 rounded-full bg-[#718567]" /> ONLINE
          </span>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-8">
          {!active ? (
            <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center pb-12 pt-8 sm:pb-20">
              <div className="mb-7 flex size-16 items-center justify-center rounded-3xl border border-[#dce1d4]/40 bg-[#edf0e7] text-[#718567]">
                <PawPrint size={30} strokeWidth={1.5} />
              </div>
              <p className="mb-3 text-xs tracking-wide text-[#737a70]">
                HALO, {name.split(' ')[0].toUpperCase()}
              </p>
              <h1 className="text-3xl font-medium leading-tight tracking-tight sm:text-[42px]">
                Ada cerita apa
                <br />
                <span className="font-serif italic text-[#718567]">
                  tentang si kecil hari ini?
                </span>
              </h1>
              <p className="mb-8 mt-5 max-w-lg text-sm leading-7 text-[#737a70]">
                Dari kebiasaan unik sampai perawatan sehari-hari.
                <br className="hidden sm:block" /> Mulai percakapan, kenali
                anabulmu lebih dekat.
              </p>
              <ChatComposer
                key={suggestion.key}
                initialMessage={suggestion.text}
                onSend={send}
                disabled={locked}
              />
              {historyError && (
                <p role="alert" className="mt-4 text-xs text-red-700">
                  {historyError}
                </p>
              )}
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {topics.map((topic) => (
                  <button
                    key={topic.title}
                    onClick={() =>
                      setSuggestion((prev) => ({
                        text: topic.text,
                        key: prev.key + 1,
                      }))
                    }
                    className="group rounded-2xl border border-[#e1e5d9] bg-[#ffffff] p-4 text-left transition hover:-translate-y-1 hover:border-[#849b77]/40 hover:bg-[#edf0e7]"
                  >
                    <topic.icon size={19} className={`mb-3 ${topic.color}`} />
                    <span className="block text-xs font-medium text-[#253e32]">
                      {topic.title}
                    </span>
                    <span className="mt-2 block text-[11px] leading-5 text-[#737a70]">
                      {topic.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl py-8">
              <div className="mb-8 flex items-center gap-2 text-xs text-[#737a70]">
                <Sparkles size={14} /> Konsultasi awal
              </div>
              {chat.messages
                .filter(
                  (message) =>
                    message.role === 'user' || message.role === 'assistant',
                )
                .map((message) => (
                  <div key={message.id} className="mb-8">
                    {message.role === 'user' ? (
                      <div className="ml-auto max-w-[90%] rounded-3xl rounded-br-lg bg-[#e9ecdf] px-5 py-4 text-sm leading-7 whitespace-pre-wrap break-words">
                        {messageText(message)}
                      </div>
                    ) : (
                      <div className="mt-6 flex items-start gap-3">
                        <PawPrint
                          size={20}
                          className="mt-1 shrink-0 text-[#718567]"
                        />
                        <div className="min-w-0 max-w-xl">
                          <ToolActivity parts={message.parts} />
                          {messageText(message) && (
                            <StreamMarkdown
                              content={messageText(message)}
                              live={busy}
                              className="text-sm leading-7 text-[#253e32]"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              {busy && (
                <p role="status" className="mb-5 text-xs text-[#737a70]">
                  AnabulCare sedang menjawab…
                </p>
              )}
              {chat.error && (
                <p role="alert" className="mb-5 text-xs text-red-700">
                  Gagal mengirim pesan: {chat.error.message}
                </p>
              )}
              {historyError && (
                <p role="alert" className="mb-5 text-xs text-red-700">
                  {historyError}
                </p>
              )}
              <div ref={bottom} />
            </div>
          )}
        </div>
        {active && (
          <div className="mx-auto w-full max-w-[832px] px-5 pb-4 sm:px-8">
            <div className="flex flex-col gap-2">
              <ChatComposer
                key={`${activeId}-${suggestion.key}`}
                onSend={send}
                disabled={locked}
              />
              {busy && (
                <button
                  type="button"
                  onClick={chat.stop}
                  className="self-end text-xs text-[#52684a] hover:underline"
                >
                  Hentikan jawaban
                </button>
              )}
            </div>
          </div>
        )}
        <footer className="shrink-0 px-5 pb-5 text-center text-[10px] leading-5 text-[#737a70]">
          Percakapan tersimpan dan dapat dibuka kembali setelah halaman dimuat
          ulang.
          <span className="mx-2 hidden sm:inline">·</span>
          <br className="sm:hidden" /> Dibuat dengan peduli, untuk kamu dan
          kucingmu.
        </footer>
      </main>
    </div>
  )
}
