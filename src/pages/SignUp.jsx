import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, ArrowRight, User, Loader2, AlertCircle, Check, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../providers/AuthProvider.jsx'
import { Button } from '../components/ui/Button.jsx'
import PageMetadata from '../components/PageMetadata.jsx'

/**
 * SignUp page
 *
 * New account form with name, email, password, and a confirmation
 * field. On success the user is signed in and redirected to the
 * originally requested page.
 */
export default function SignUp() {
  const { signUp, user, hydrated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [accepted, setAccepted] = useState(true)

  useEffect(() => {
    if (hydrated && user) navigate(from, { replace: true })
  }, [hydrated, user, from, navigate])

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const strength = scorePassword(form.password)
  const strengthLabel = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][strength.score]
  const strengthColor = ['bg-[var(--red-500)]', 'bg-[var(--red-500)]', 'bg-[var(--yellow-500)]', 'bg-[var(--blue-500)]', 'bg-[var(--green-500)]'][strength.score]

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (!accepted) {
      setError('Please accept the terms to continue.')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 350))
    const result = await signUp({
      name: form.name,
      email: form.email,
      password: form.password,
    })
    setLoading(false)
    if (!result.ok) {
      setError(result.error || 'Could not create your account.')
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div>
      <PageMetadata title="Create account | Vantage" description="Sign up for a free Vantage news intelligence workspace." />

      <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text)]">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        14-day free trial · No credit card required.
      </p>

      <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
        {error ? (
          <div className="flex items-start gap-2 rounded-[var(--radius-lg)] border border-[var(--neg-line)] bg-[var(--neg-bg)] p-3 text-sm text-[var(--neg)]">
            <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <div>
          <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Full name
          </label>
          <div className="relative mt-1.5">
            <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={set('name')}
              placeholder="Prayojan Puri"
              className="field-input h-11 w-full pl-9"
            />
          </div>
        </div>

        <div>
          <label htmlFor="su-email" className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Work email
          </label>
          <div className="relative mt-1.5">
            <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              id="su-email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={set('email')}
              placeholder="you@newsroom.np"
              className="field-input h-11 w-full pl-9"
            />
          </div>
        </div>

        <div>
          <label htmlFor="su-password" className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Password
          </label>
          <div className="relative mt-1.5">
            <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              id="su-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={form.password}
              onChange={set('password')}
              placeholder="At least 6 characters"
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

          {/* Password strength meter */}
          {form.password ? (
            <div className="mt-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 flex-1 rounded-full transition-colors',
                      i < strength.score ? strengthColor : 'bg-[var(--surface-sunken)]',
                    )}
                  />
                ))}
              </div>
              <p className="mt-1 text-[10px] font-semibold text-[var(--text-muted)]">
                {strengthLabel} — use 8+ chars with letters, numbers, and symbols.
              </p>
            </div>
          ) : null}
        </div>

        <div>
          <label htmlFor="su-confirm" className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Confirm password
          </label>
          <div className="relative mt-1.5">
            <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              id="su-confirm"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={form.confirm}
              onChange={set('confirm')}
              placeholder="Repeat your password"
              className="field-input h-11 w-full pl-9 pr-10"
            />
            {form.confirm && form.confirm === form.password ? (
              <Check size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--green-600)]" />
            ) : null}
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
          <input
            type="checkbox"
            checked={accepted}
            onChange={e => setAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[var(--border)] accent-[var(--brand-600)]"
          />
          <span>
            I agree to the <a href="#" className="font-semibold text-[var(--brand-600)] hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-[var(--brand-600)] hover:underline">Privacy Policy</a>.
          </span>
        </label>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          rightIcon={loading ? <Loader2 size={14} className="anim-spin" /> : <ArrowRight size={15} />}
          className="w-full"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--text-muted)]">
        Already have an account?{' '}
        <Link to="/sign-in" className="font-semibold text-[var(--brand-600)] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

function scorePassword(p) {
  if (!p) return { score: 0 }
  let s = 0
  if (p.length >= 6) s++
  if (p.length >= 10) s++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++
  if (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) s++
  return { score: Math.min(s, 4) }
}

// Tiny cn helper to keep the file self-contained
function cn(...args) { return args.filter(Boolean).join(' ') }
