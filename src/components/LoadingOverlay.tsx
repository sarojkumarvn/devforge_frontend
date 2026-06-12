import { Spinner } from '@/components/ui/spinner'
import { useLoadingTransition } from '@/context/LoadingTransitionContext'

export function LoadingOverlay() {
  const { active, message } = useLoadingTransition()

  if (!active) return null

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-background/35 px-4 backdrop-blur-md"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-3 rounded-full border bg-background/80 px-5 py-3 text-sm font-medium shadow-lg backdrop-blur-xl">
        <Spinner className="size-5" />
        <span>{message}</span>
      </div>
    </div>
  )
}
