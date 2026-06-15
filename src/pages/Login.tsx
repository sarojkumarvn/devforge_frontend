import { ArrowRight, Code2, Lock, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AuthLink } from '@/components/AuthLink'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/context/AuthContext'
import { useLoadingTransition } from '@/context/LoadingTransitionContext'
import { ApiError, login, ServerUnavailableError } from '@/lib/authApi'

export default function Login() {
  const navigate = useNavigate()
  const { startSession } = useAuth()
  const { finish, start, updateMessage } = useLoadingTransition()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const canSubmit = useMemo(() => identifier.trim().length > 0 && password.length > 0 && !loading, [identifier, loading, password])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) {
      toast.error('Enter your login details', {
        description: 'Provide your email or username and password before continuing.',
        id: 'login-error',
      })
      return
    }
    setError('')
    setLoading(true)
    start('Signing in...')
    try {
      const result = await login({ email: identifier.trim(), password })
      startSession(result.jwt, result.userId)
      updateMessage('Loading your feed...')
      navigate('/app', { replace: true })
    } catch (err) {
      await finish()
      if (err instanceof ServerUnavailableError) {
        navigate('/server-unavailable', {
          replace: true,
          state: { returnTo: '/login' },
        })
        return
      }
      const message = err instanceof ApiError
        ? err.details?.join(', ') || err.message
        : 'Unable to login right now. Please try again.'
      setError(message)
      toast.error('Login failed', {
        description: message,
        id: 'login-error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 pb-12 pt-28 sm:px-6 lg:px-8">
      <section className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <aside className="flex flex-col gap-6">
          <div>
            <Badge variant="secondary">DevForge account</Badge>
            <h1 className="mt-4 max-w-md text-balance font-heading text-4xl font-medium leading-tight sm:text-5xl">Return to your projects, communities, and profile.</h1>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:max-w-md lg:grid-cols-1">
            {[
              { icon: UserRound, label: 'Developer profile' },
              { icon: Code2, label: 'Projects and posts' },
              { icon: ShieldCheck, label: 'Secure session' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-muted text-primary"><item.icon /></span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </aside>

        <Card>
          <CardHeader>
            <Badge className="mb-2" variant="outline">Login</Badge>
            <CardTitle className="text-3xl">Welcome back</CardTitle>
            <CardDescription className="text-pretty">Access your DevForge account or <AuthLink className="text-primary hover:underline" to="/signup">create a new one</AuthLink>.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              onInvalid={(event) => {
                event.preventDefault()
                toast.error('Enter your login details', {
                  description: 'Provide your email or username and password before continuing.',
                  id: 'login-error',
                })
              }}
            >
              <FieldGroup>
                <Field data-invalid={Boolean(error)}>
                  <FieldLabel htmlFor="login-identifier">Email or username</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon><Mail /></InputGroupAddon>
                    <InputGroupInput id="login-identifier" autoComplete="username" value={identifier} onChange={(event) => setIdentifier(event.target.value)} required aria-invalid={Boolean(error)} />
                  </InputGroup>
                </Field>
                <Field data-invalid={Boolean(error)}>
                  <FieldLabel htmlFor="login-password">Password</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon><Lock /></InputGroupAddon>
                    <InputGroupInput id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required aria-invalid={Boolean(error)} />
                  </InputGroup>
                  {error && <FieldError>{error}</FieldError>}
                </Field>
                {error && <Alert variant="destructive"><AlertTitle>Login failed</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? <Spinner data-icon="inline-start" /> : <ArrowRight data-icon="inline-start" />}
                  Login
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
