import React from 'react'

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
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-red-500">오류가 발생했습니다</h2>
              <p className="mt-2 text-sm text-gray-500">{this.state.error?.message}</p>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
