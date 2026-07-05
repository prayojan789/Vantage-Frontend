import { Component } from 'react'

export default class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{ padding:'32px', border:'1px solid var(--border)', borderRadius:16, background:'var(--surface-1)' }}>
          <p style={{ fontWeight:700, color:'var(--text)', marginBottom:8 }}>Something went wrong.</p>
          <p style={{ color:'var(--muted)', fontSize:'0.9rem', lineHeight:1.6 }}>
            {this.state.error?.message || 'An unexpected error occurred while loading this section.'}
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
