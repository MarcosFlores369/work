export interface ChatEntry {
  role: 'user' | 'agent'
  text: string
  audioUrl?: string
}

export interface ChatResponse {
  transcript: string
  response: string
  audio_url: string
}

export async function sendAudio(blob: Blob): Promise<ChatResponse> {
  const form = new FormData()
  form.append('audio', blob, 'recording.webm')

  const res = await fetch('/api/chat', { method: 'POST', body: form })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? `Error ${res.status}`)
  }
  return res.json()
}
