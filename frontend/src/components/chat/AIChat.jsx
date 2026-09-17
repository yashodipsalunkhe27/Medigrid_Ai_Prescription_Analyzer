import { useEffect, useRef, useState } from 'react'
import { Send, Trash2, Bot } from 'lucide-react'
import ChatMessage from './ChatMessage'
import Button from '../ui/Button'
import ConfirmDialog from '../ui/ConfirmDialog'
import { sendChatMessage } from '../../services/api'
import { cn } from '../../lib/utils'

const SUGGESTED_PROMPTS = [
  'Check drug interactions',
  'Explain this prescription',
  'Summarize patient history',
  'Find dosage warnings',
  'Find nearby pharmacy',
]

function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-3xl">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-dark dark:text-primary">
        <Bot size={15} />
      </div>
      <div className="rounded-lg rounded-tl-sm bg-surface-alt px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-muted animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi, I'm the MediGrid AI Assistant. Ask me about medicines, prescriptions, interactions, or anything saved in your records.",
    },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

  async function handleSend(overrideText) {
    const text = (overrideText ?? input).trim()
    if (!text || sending) return

    setMessages((m) => [...m, { role: 'user', content: text }])
    setInput('')
    setSending(true)

    try {
      const data = await sendChatMessage(text)
      const reply = data?.response
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: reply && String(reply).trim() ? String(reply) : "I didn't get a response that time. Please try again.",
        },
      ])
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: err?.message || 'Unable to reach the AI assistant. Please try again.',
          isError: true,
          retryText: text,
        },
      ])
    } finally {
      setSending(false)
    }
  }

  function handleRetry(text) {
    handleSend(text)
  }

  function clearChat() {
    setMessages([
      {
        role: 'assistant',
        content: 'Chat cleared. What would you like to know?',
      },
    ])
    setConfirmClear(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-11.5rem)] rounded-lg border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary-dark dark:text-primary">
            <Bot size={17} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink font-display">MediGrid AI Assistant</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" icon={Trash2} onClick={() => setConfirmClear(true)}>
          Clear chat
        </Button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {messages.map((m, i) => (
          <ChatMessage
            key={i}
            role={m.role}
            content={m.content}
            isError={m.isError}
            onRetry={m.isError ? () => handleRetry(m.retryText) : undefined}
          />
        ))}
        {sending && <TypingIndicator />}
      </div>

      {messages.length <= 1 && (
        <div className="px-5 pb-3 flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              className="text-xs rounded-full border border-border px-3 py-1.5 text-muted hover:text-ink hover:border-primary/40 hover:bg-primary/5 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="border-t border-border p-3 flex items-end gap-2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          rows={1}
          placeholder="Ask about medicines, prescriptions, interactions..."
          aria-label="Message the AI assistant"
          className={cn(
            'flex-1 resize-none rounded-md border border-border bg-surface-alt/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus:border-primary max-h-32',
          )}
        />
        <Button type="submit" icon={Send} disabled={!input.trim()} loading={sending} aria-label="Send message">
          Send
        </Button>
      </form>

      <ConfirmDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={clearChat}
        title="Clear conversation?"
        description="This will remove all messages in this session. This can't be undone."
        confirmLabel="Clear chat"
        danger
      />
    </div>
  )
}
