import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../providers/AuthProvider.jsx'
import { Button } from '../components/ui/Button.jsx'
import PageMetadata from '../components/PageMetadata.jsx'

/**
 * SignIn page
 *
 * Email + password form. The form calls `useAuth().signIn` and
 * navigates to the originally requested page (or /dashboard) on
 * success.
 */
export default function SignIn() {
  const { signIn, user, hydrated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const [email, setEmail] = useState('prayojan@vantage.np')
  const [password, setPassword] = useState('vantage')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // If already signed in, bounce to the destination
  useEffect(() => {
    if (hydrated && user) navigate(from, { replace: true })
  }, [hydrated, user, from, navigate])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    // Small UX delay so the spinner is visible
    await new Promise(r => setTimeout(r, 350))
    const result = await signIn({ email, password })
    setLoading(false)
    if (!result.ok) {
      setError(result.error || 'Could not sign in.')
      return
    }
    navigate(from, { replace: true })
  }

  const fillDemo = () => {
    setEmail('prayojan@vantage.np')
    setPassword('vantage')
    setError('')
  }

  return (
    <div>
      <PageMetadata title="Sign in | Vantage" description="Sign in to your Vantage news intelligence workspace." />

      <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text)]">
        Welcome back
      </h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        Sign in to your Vantage workspace.
      </p>

      <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
        {error ? (
          <div className="flex items-start gap-2 rounded-[var(--radius-lg)] border border-[var(--neg-line)] bg-[var(--neg-bg)] p-3 text-sm text-[var(--neg)]">
            <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <div>
          <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Work email
          </label>
          <div className="relative mt-1.5">
            <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@newsroom.np"
              className="field-input h-11 w-full pl-9"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Password
            </label>
            <Link to="/forgot-password" className="text-[11px] font-semibold text-[var(--brand-600)] hover:underline">
              Forgot?
            </Link>
          </div>
          <div className="relative mt-1.5">
            <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="field-input h-11 w-full pl-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-[var(--border)] accent-[var(--brand-600)]" />
          Keep me signed in for 30 days
        </label>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          rightIcon={loading ? <Loader2 size={14} className="anim-spin" /> : <ArrowRight size={15} />}
          className="w-full"
        >
          {loading ? 'Signing you in…' : 'Sign in'}
        </Button>

        <button
          type="button"
          onClick={fillDemo}
          className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-dashed border-[var(--brand-300)] bg-[var(--brand-50)]/40 px-3 py-2 text-xs font-semibold text-[var(--brand-700)] transition-colors hover:bg-[var(--brand-50)]"
        >
          <Sparkles size={12} /> Use the demo account (Prayojan)
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">or</span>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => alert('SSO with Google is a preview — wire up your IdP in Settings → Integrations.')}
        className="w-full"
      >
        Continue with Google
      </Button>

      <p className="mt-8 text-center text-sm text-[var(--text-muted)]">
        Don't have an account?{' '}
        <Link to="/sign-up" className="font-semibold text-[var(--brand-600)] hover:underline">
          Create one
        </Link>
      </p>
    </div>
  )
}
