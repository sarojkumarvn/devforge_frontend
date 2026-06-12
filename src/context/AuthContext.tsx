import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { api, clearSession, getSessionUserId, getToken, saveSession, UserProfile } from '../lib/api'

type AuthContextValue = {
  token: string | null
  userId: number | null
  user: UserProfile | null
  loading: boolean
  startSession: (token: string, userId: number, userName?: string) => void
  refreshUser: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => getToken())
  const [userId, setUserId] = useState(() => getSessionUserId())
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(Boolean(token && userId))

  const refreshUser = async () => {
    const currentToken = getToken()
    const currentUserId = getSessionUserId()
    setToken(currentToken)
    setUserId(currentUserId)

    if (!currentToken || !currentUserId) {
      setUser(null)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      setUser(await api.user(currentUserId))
    } catch {
      clearSession()
      setToken(null)
      setUserId(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const value = useMemo(
    () => ({
      token,
      userId,
      user,
      loading,
      startSession: (nextToken: string, nextUserId: number, userName?: string) => {
        saveSession(nextToken, nextUserId, userName)
        setToken(nextToken)
        setUserId(nextUserId)
        setUser(null)
        setLoading(false)
      },
      refreshUser,
      logout: () => {
        clearSession()
        setToken(null)
        setUserId(null)
        setUser(null)
      },
    }),
    [token, userId, user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
