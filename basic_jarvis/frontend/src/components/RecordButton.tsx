interface RecordButtonProps {
  isRecording: boolean
  loading: boolean
  onStart: () => void
  onStop: () => void
}

export function RecordButton({ isRecording, loading, onStart, onStop }: RecordButtonProps) {
  const handleClick = () => {
    if (isRecording) onStop()
    else onStart()
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        relative w-20 h-20 rounded-full flex items-center justify-center
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${isRecording
          ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900'
          : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900'
        }
      `}
    >
      {loading ? (
        <span className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      ) : isRecording ? (
        <>
          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-40" />
          <span className="w-5 h-5 bg-white rounded-sm" />
        </>
      ) : (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      )}
    </button>
  )
}
