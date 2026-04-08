import { useRef, useState } from 'react'

interface UseAudioRecorderOptions {
  onStop: (blob: Blob) => void
}

export function useAudioRecorder({ onStop }: UseAudioRecorderOptions) {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder
    chunksRef.current = []

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      stream.getTracks().forEach((t) => t.stop())
      onStop(blob)
    }

    mediaRecorder.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  return { isRecording, startRecording, stopRecording }
}
