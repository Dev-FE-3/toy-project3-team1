import { AlertTriangle } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="bg-c900 relative flex h-full flex-col items-center justify-center gap-12 py-4">
            <div className="flex flex-col items-center justify-center">
              <AlertTriangle size={48} className="text-c400 mb-4" />
              <h3 className="text-c300 text-h3 mb-2">무언가 잘못된 것 같아요</h3>
              <p className="text-c400 text-textR">새로고침 해주세요</p>
            </div>
            <Button
              variant="outline"
              type="button"
              onClick={() => window.location.reload()}
              className="bg-c600 text-c200 h-10"
            >
              새로고침
            </Button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
