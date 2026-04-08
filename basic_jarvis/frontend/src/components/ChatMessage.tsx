import type { ChatEntry } from '../api/client'

interface ChatMessageProps {
  entry: ChatEntry
}

export function ChatMessage({ entry }: ChatMessageProps) {
  const isUser = entry.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`
          max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-gray-800 text-gray-100 rounded-bl-sm'
          }
        `}
      >
        {!isUser && (
          <span className="text-xs text-gray-400 font-medium block mb-1">Jarvis</span>
        )}
        {entry.text}
      </div>
    </div>
  )
}
