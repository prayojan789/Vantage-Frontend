import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'vantage-auth-user'

const DEMO_USERS_KEY = 'vantage-auth-users'

/**
 * Read the list of registered users from localStorage.
 * Returns an array of { name, email, password, createdAt }.
 */
function readUsers() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(DEMO_USERS_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeUsers(users) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))
}

function readSession() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeSession(user) {
  if (typeof window === 'undefined') return
  if (user) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } else {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

/**
 * AuthProvider — minimal client-side auth for the demo workspace.
 *
 * Persists a "users" list (so sign-up → sign-in works) and a single
 * active session in localStorage. NOT secure for production — this
 * is a stand-in until a real backend is wired up.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSession())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => { setHydrated(true) }, [])

  const signIn = useCallback(async ({ email, password, remember = true }) => {
    const normalizedEmail = (email || '').trim().toLowerCase()
    if (!normalizedEmail) return { ok: false, error: 'Please enter your email.' }
    if (!password) return { ok: false, error: 'Please enter your password.' }
    // Simple shape check — full RFC validation happens server-side
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { ok: false, error: 'That email address doesn\u2019t look right.' }
    }

    const users = readUsers()
    const found = users.find(
      u => u.email.toLowerCase() === normalizedEmail && u.password === password,
    )
    if (!found) {
      return { ok: false, error: 'Invalid email or password.' }
    }
    const session = {
      name: found.name,
      email: found.email,
      role: found.role,
      remember: !!remember,
      signedInAt: new Date().toISOString(),
    }
    setUser(session)
    writeSession(session)
    return { ok: true, user: session }
  }, [])

  const signUp = useCallback(async ({ name, email, password }) => {
    const cleanName = (name || '').trim()
    const normalizedEmail = (email || '').trim().toLowerCase()
    if (!cleanName) return { ok: false, error: 'Please enter your name.' }
    if (!normalizedEmail) return { ok: false, error: 'Please enter your email.' }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { ok: false, error: 'That email address doesn\u2019t look right.' }
    }
    if (!password || password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters.' }
    }
    const users = readUsers()
    const exists = users.some(u => u.email.toLowerCase() === normalizedEmail)
    if (exists) return { ok: false, error: 'An account with that email already exists.' }

    const newUser = {
      name: cleanName,
      email: normalizedEmail,
      password,
      role: 'Newsroom \u00b7 Research',
      createdAt: new Date().toISOString(),
    }
    writeUsers([...users, newUser])

    const session = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      remember: true,
      signedInAt: new Date().toISOString(),
    }
    setUser(session)
    writeSession(session)
    return { ok: true, user: session }
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    writeSession(null)
  }, [])

  /**
   * Ensure the demo "Prayojan" account exists. Called on mount so
   * the user can sign in with the seeded credentials and see data
   * immediately, even if they've cleared localStorage.
   */
  useEffect(() => {
    const users = readUsers()
    const seed = {
      name: 'Prayojan',
      email: 'prayojan@vantage.np',
      password: 'vantage',
      role: 'Newsroom \u00b7 Research Lead',
      createdAt: new Date().toISOString(),
    }
    if (!users.some(u => u.email.toLowerCase() === seed.email)) {
      writeUsers([...users, seed])
    }
  }, [])

  const value = useMemo(
    () => ({ user, hydrated, signIn, signUp, signOut }),
    [user, hydrated, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    // Fallback when the provider is not mounted (e.g. on the Landing page)
    return {
      user: null,
      hydrated: false,
      signIn: async () => ({ ok: false, error: 'Auth not available' }),
      signUp: async () => ({ ok: false, error: 'Auth not available' }),
      signOut: () => {},
    }
  }
  return ctx
}
