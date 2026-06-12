import { MouseEvent } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { useLoadingTransition } from '@/context/LoadingTransitionContext'

export function AuthLink({ onClick, to, ...props }: LinkProps) {
  const { startTransient } = useLoadingTransition()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
    ) return

    const destination = typeof to === 'string' ? to : to.pathname
    startTransient(destination === '/signup' ? 'Opening signup...' : 'Opening login...')
  }

  return <Link {...props} to={to} onClick={handleClick} />
}
