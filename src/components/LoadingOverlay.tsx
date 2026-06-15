import { Spinner } from '@/components/ui/spinner'
import { useLoadingTransition } from '@/context/LoadingTransitionContext'

export function LoadingOverlay() {
  const { active, message } = useLoadingTransition()

  if (!active) return null

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-background/60 px-4 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-3 rounded-lg border border-border bg-popover px-4 py-3 text-sm font-medium text-popover-foreground shadow-md">
        <Spinner className="size-5" />
        <span>{message}</span>
      </div>
    </div>
  )
}
