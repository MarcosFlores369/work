import { useState } from 'react'
import { useAudioRecorder } from './hooks/useAudioRecorder'
import { RecordButton } from './components/RecordButton'
import { ChatHistory } from './components/ChatHistory'
import { sendAudio } from './api/client'
import type { ChatEntry } from './api/client'

export default function App() {
  const [history, setHistory] = useState<ChatEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { isRecording, startRecording, stopRecording } = useAudioRecorder({
    onStop: async (blob) => {
      setLoading(true)
      setError(null)
      try {
        const result = await sendAudio(blob)
        setHistory((prev) => [
          ...prev,
          { role: 'user', text: result.transcript },
          { role: 'agent', text: result.response, audioUrl: result.audio_url },
        ])
        if (result.audio_url) {
          new Audio(result.audio_url).play()
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error processing audio')
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-2 tracking-tight">Basic Jarvis</h1>
      <p className="text-gray-400 text-sm mb-8">Asistente de voz con IA</p>

      <ChatHistory history={history} loading={loading} />

      {error && (
        <div className="mb-4 px-4 py-2 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <RecordButton
        isRecording={isRecording}
        loading={loading}
        onStart={startRecording}
        onStop={stopRecording}
      />
    </div>
  )
}
