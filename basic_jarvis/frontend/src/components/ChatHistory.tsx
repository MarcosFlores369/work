import { useEffect, useRef } from 'react'
import { ChatMessage } from './ChatMessage'
import type { ChatEntry } from '../api/client'

interface ChatHistoryProps {
  history: ChatEntry[]
  loading: boolean
}

export function ChatHistory({ history, loading }: ChatHistoryProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, loading])

  return (
    <div className="w-full max-w-2xl flex-1 overflow-y-auto mb-6 min-h-[400px] max-h-[60vh] px-2">
      {history.length === 0 && !loading && (
        <div className="flex items-center justify-center h-full text-gray-600 text-sm">
          Presioná el botón para hablar con Jarvis
        </div>
      )}
      {history.map((entry, i) => (
        <ChatMessage key={i} entry={entry} />
      ))}
      {loading && (
        <div className="flex justify-start mb-3">
          <div className="bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
            <span className="text-xs text-gray-400 font-medium block mb-1">Jarvis</span>
            <span className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </span>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
