import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

const MINIMUM_DURATION_MS = 1000

type LoadingTransitionContextValue = {
  active: boolean
  message: string
  start: (message: string) => void
  startTransient: (message: string) => void
  updateMessage: (message: string) => void
  finish: () => Promise<void>
}

const LoadingTransitionContext = createContext<LoadingTransitionContextValue | null>(null)

export function LoadingTransitionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false)
  const [message, setMessage] = useState('Loading...')
  const startedAt = useRef(0)
  const transitionId = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  useEffect(() => clearTimer, [clearTimer])

  const start = useCallback((nextMessage: string) => {
    clearTimer()
    transitionId.current += 1
    startedAt.current = Date.now()
    setMessage(nextMessage)
    setActive(true)
  }, [clearTimer])

  const finish = useCallback(() => {
    const currentTransition = transitionId.current
    const remaining = Math.max(0, MINIMUM_DURATION_MS - (Date.now() - startedAt.current))

    clearTimer()

    return new Promise<void>((resolve) => {
      timer.current = setTimeout(() => {
        timer.current = null
        if (transitionId.current === currentTransition) setActive(false)
        resolve()
      }, remaining)
    })
  }, [clearTimer])

  const startTransient = useCallback((nextMessage: string) => {
    start(nextMessage)
    void finish()
  }, [finish, start])

  const value = useMemo(
    () => ({ active, message, start, startTransient, updateMessage: setMessage, finish }),
    [active, finish, message, start, startTransient],
  )

  return <LoadingTransitionContext.Provider value={value}>{children}</LoadingTransitionContext.Provider>
}

export function useLoadingTransition() {
  const value = useContext(LoadingTransitionContext)
  if (!value) throw new Error('useLoadingTransition must be used inside LoadingTransitionProvider')
  return value
}
