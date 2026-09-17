import { useState } from 'react'
import { Bot, User, Copy, RotateCw, Check } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function ChatMessage({ role, content, isError, onRetry }) {
  const [copied, setCopied] = useState(false)
  const isUser = role === 'user'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard may be unavailable; fail silently
    }
  }

  return (
    <div className={cn('flex gap-3 max-w-3xl', isUser ? 'ml-auto flex-row-reverse' : '')}>
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary-dark dark:text-primary',
        )}
      >
        {isUser ? <User size={15} /> : <Bot size={15} />}
      </div>
      <div className={cn('group min-w-0', isUser && 'flex flex-col items-end')}>
        <div
          className={cn(
            'rounded-lg px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words',
            isUser
              ? 'bg-primary text-white rounded-tr-sm'
              : isError
                ? 'bg-critical-bg text-critical border border-critical/20 rounded-tl-sm'
                : 'bg-surface-alt text-ink rounded-tl-sm',
          )}
        >
          {content}
        </div>
        {!isUser && (
          <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              aria-label="Copy response"
              className="p-1 text-muted hover:text-ink rounded"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </button>
            {isError && onRetry && (
              <button onClick={onRetry} aria-label="Retry" className="p-1 text-muted hover:text-ink rounded">
                <RotateCw size={13} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
