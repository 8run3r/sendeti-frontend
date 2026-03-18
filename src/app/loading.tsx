export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-coral/20 border-t-coral animate-spin" />
        <p className="text-sm font-medium font-sans" style={{ color: '#78716C' }}>
          Načítavanie...
        </p>
      </div>
    </div>
  )
}
