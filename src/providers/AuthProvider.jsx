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

  const signIn = useCallback(async ({ email, password }) => {
    const users = readUsers()
    const found = users.find(
      u => u.email.toLowerCase() === (email || '').toLowerCase() && u.password === password,
    )
    if (!found) {
      return { ok: false, error: 'Invalid email or password.' }
    }
    const session = {
      name: found.name,
      email: found.email,
      role: found.role,
      signedInAt: new Date().toISOString(),
    }
    setUser(session)
    writeSession(session)
    return { ok: true, user: session }
  }, [])

  const signUp = useCallback(async ({ name, email, password }) => {
    if (!name?.trim()) return { ok: false, error: 'Please enter your name.' }
    if (!email?.trim()) return { ok: false, error: 'Please enter your email.' }
    if (!password || password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters.' }
    }
    const users = readUsers()
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase())
    if (exists) return { ok: false, error: 'An account with that email already exists.' }

    const newUser = {
      name: name.trim(),
      email: email.trim(),
      password,
      role: 'Newsroom · Research',
      createdAt: new Date().toISOString(),
    }
    writeUsers([...users, newUser])

    const session = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
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
   * Ensure the demo "Prayojan" account exists. Called once on first
   * load so the user can sign in with the seeded credentials and
   * see data immediately.
   */
  useEffect(() => {
    const users = readUsers()
    if (users.length === 0) {
      const seed = {
        name: 'Prayojan',
        email: 'prayojan@vantage.np',
        password: 'vantage',
        role: 'Newsroom · Research Lead',
        createdAt: new Date().toISOString(),
      }
      writeUsers([seed])
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
