'use client'

import { Component, ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <p className="text-5xl mb-4">😔</p>
            <h2 className="font-display text-2xl font-bold mb-2" style={{ color: '#1C1917' }}>
              Niečo sa pokazilo
            </h2>
            <p className="text-sm mb-6 font-sans" style={{ color: '#78716C' }}>
              Prepáčte, nastala neočakávaná chyba. Skúste obnoviť stránku.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 text-white rounded-xl font-semibold font-sans transition-colors"
              style={{ background: '#F7A072' }}
            >
              Obnoviť stránku
            </button>
            <a
              href="tel:+421905449916"
              className="block mt-3 text-sm hover:text-coral transition-colors font-sans"
              style={{ color: '#78716C' }}
            >
              alebo zavolajte: +421 905 449 916
            </a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
