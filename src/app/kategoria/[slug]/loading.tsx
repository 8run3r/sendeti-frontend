export default function CategoryLoading() {
  return (
    <div className="min-h-screen">
      <div className="py-10 px-6" style={{ background: 'linear-gradient(135deg,#FEF9F4,#FDEEE5)' }}>
        <div className="max-w-content mx-auto">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-content mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #EBE3F0' }}>
              <div className="aspect-square bg-gray-100 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                <div className="h-8 bg-gray-100 rounded animate-pulse mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
