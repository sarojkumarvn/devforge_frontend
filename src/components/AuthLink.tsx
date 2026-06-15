import { MouseEvent } from 'react'
import { Link, LinkProps, useNavigate } from 'react-router-dom'
import { useLoadingTransition } from '@/context/LoadingTransitionContext'
import { checkServerAvailability } from '@/lib/authApi'

export function AuthLink({ onClick, to, ...props }: LinkProps) {
  const navigate = useNavigate()
  const { finish, start, updateMessage } = useLoadingTransition()

  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
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
    if (destination !== '/login' && destination !== '/signup') return

    event.preventDefault()
    start('Checking server availability...')
    const available = await checkServerAvailability()

    if (available) {
      updateMessage(destination === '/signup' ? 'Opening signup...' : 'Opening login...')
      navigate(destination)
    } else {
      updateMessage('Server unavailable')
      navigate('/server-unavailable', {
        state: { returnTo: destination },
      })
    }

    await finish()
  }

  return <Link {...props} to={to} onClick={handleClick} />
}
