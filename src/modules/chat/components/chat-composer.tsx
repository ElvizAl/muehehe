import { ArrowUp, PawPrint } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const messageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Tulis pesan terlebih dahulu.')
    .max(4000, 'Pesan maksimal 4.000 karakter.'),
})
type MessageInput = z.infer<typeof messageSchema>

export function ChatComposer({
  onSend,
  initialMessage = '',
  disabled = false,
}: {
  onSend: (message: string) => void
  initialMessage?: string
  disabled?: boolean
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<MessageInput>({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: initialMessage },
  })
  function handlerSendMessage(data: MessageInput) {
    onSend(data.message)
    reset({ message: '' })
  }
  return (
    <form
      onSubmit={handleSubmit(handlerSendMessage)}
      noValidate
      className="rounded-[26px] border border-[#dce1d4] bg-[#ffffff] p-3 shadow-lg shadow-[#284f3d]/5 focus-within:border-[#718567]"
    >
      <textarea
        {...register('message')}
        disabled={disabled}
        aria-label="Pesan untuk AnabulCare"
        aria-invalid={!!errors.message}
        aria-describedby={errors.message ? 'message-error' : undefined}
        rows={2}
        placeholder="Ceritakan tentang si kecil..."
        className="max-h-44 min-h-16 w-full resize-y bg-transparent px-3 py-2 text-[15px] leading-6 text-[#253e32] outline-none placeholder:text-[#737a70]"
        onKeyDown={(event) => {
          if (
            event.key === 'Enter' &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault()
            void handleSubmit(handlerSendMessage)()
          }
        }}
      />
      {errors.message && (
        <p
          id="message-error"
          role="alert"
          className="px-3 pb-2 text-xs text-red-700"
        >
          {errors.message.message}
        </p>
      )}
      <div className="flex items-center justify-between px-1">
        <span className="flex items-center gap-2 px-2 text-xs text-[#737a70]">
          <PawPrint size={15} /> Teman cerita anabulmu
        </span>
        <button
          type="submit"
          disabled={disabled || !watch('message').trim()}
          aria-label="Kirim pesan"
          className="flex size-10 items-center justify-center rounded-full bg-[#284f3d] text-white transition hover:bg-[#3c664e] disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#718567]"
        >
          <ArrowUp size={21} />
        </button>
      </div>
    </form>
  )
}
