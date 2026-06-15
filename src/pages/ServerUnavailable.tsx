import {
  ArrowLeft,
  ArrowRight,
  CloudOff,
  Code2,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { checkServerAvailability } from '@/lib/authApi'

type ServerUnavailableState = {
  returnTo?: '/login' | '/signup'
}

export default function ServerUnavailable() {
  const navigate = useNavigate()
  const location = useLocation()
  const [checking, setChecking] = useState(false)
  const [stillOffline, setStillOffline] = useState(false)
  const state = location.state as ServerUnavailableState | null
  const returnTo = state?.returnTo === '/signup' ? '/signup' : '/login'
  const actionLabel = returnTo === '/signup' ? 'create your account' : 'log in'

  const retry = async () => {
    setChecking(true)
    setStillOffline(false)
    const available = await checkServerAvailability()
    setChecking(false)

    if (available) {
      navigate(returnTo, { replace: true })
      return
    }

    setStillOffline(true)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-muted">
      <AuthPageBackdrop mode={returnTo === '/signup' ? 'signup' : 'login'} />
      <div aria-hidden="true" className="absolute inset-0 bg-background/35 backdrop-blur-[10px]" />
      <div className="relative grid min-h-screen place-items-center px-4 py-10 sm:px-6">
        <Card className="w-full max-w-xl border-border/80 bg-card/95 shadow-2xl shadow-foreground/10 backdrop-blur-xl">
          <CardHeader className="items-center text-center">
            <div className="relative mb-2 grid size-20 place-items-center rounded-2xl border bg-muted text-foreground shadow-sm">
              <CloudOff className="size-9" aria-hidden="true" />
              <span className="absolute -right-1 -top-1 size-4 rounded-full border-2 border-card bg-destructive" />
            </div>
            <Badge variant="outline">Connection interrupted</Badge>
            <CardTitle className="max-w-md text-balance text-3xl leading-tight sm:text-4xl">
              DevForge is taking a short break
            </CardTitle>
            <CardDescription className="max-w-md text-pretty text-base leading-7">
              We could not reach the server, so you cannot {actionLabel} yet. Nothing was submitted.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-3 rounded-xl border bg-muted/70 p-3">
              <span className="relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-background">
                <span className="size-2.5 rounded-full bg-destructive" />
                <span className="absolute size-2.5 animate-ping rounded-full bg-destructive motion-reduce:animate-none" />
              </span>
              <div className="min-w-0">
                <p className="font-medium">Server status: offline</p>
                <p aria-live="polite" className="text-sm text-muted-foreground">
                  {checking && 'Checking the connection now...'}
                  {stillOffline && !checking && 'Still offline. Wait a moment, then check again.'}
                  {!checking && !stillOffline && 'Your browser is working. The server is not responding.'}
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft data-icon="inline-start" />
                Back to home
              </Link>
            </Button>
            <Button onClick={retry} disabled={checking}>
              {checking ? <Spinner data-icon="inline-start" /> : <RefreshCw data-icon="inline-start" />}
              {checking ? 'Checking server' : 'Try again'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

function AuthPageBackdrop({ mode }: { mode: 'login' | 'signup' }) {
  const signup = mode === 'signup'

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none overflow-hidden bg-background opacity-75">
      <div className="absolute inset-x-0 top-0 h-24 border-b bg-background/90" />
      <div className="absolute left-5 top-5 flex items-center gap-2 font-heading font-semibold sm:left-10">
        <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Code2 />
        </span>
        DevForge
      </div>

      <section className="mx-auto grid min-h-screen w-full max-w-5xl gap-8 px-6 pb-12 pt-32 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <aside className="hidden flex-col gap-6 lg:flex">
          <div>
            <Badge variant="secondary">{signup ? 'DevForge profile' : 'DevForge account'}</Badge>
            <h1 className="mt-4 max-w-md text-balance font-heading text-5xl font-medium leading-tight">
              {signup ? 'Build the profile your projects attach to.' : 'Return to your projects, communities, and profile.'}
            </h1>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { icon: UserRound, label: signup ? 'Your public identity' : 'Developer profile' },
              { icon: Code2, label: 'Projects and posts' },
              { icon: ShieldCheck, label: signup ? 'Privacy controls' : 'Secure session' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-muted text-primary"><item.icon /></span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </aside>

        <Card className="mx-auto w-full max-w-xl">
          <CardHeader>
            <Badge className="mb-2" variant="outline">{signup ? 'Create account' : 'Login'}</Badge>
            <CardTitle className="text-3xl">{signup ? 'Start your profile' : 'Welcome back'}</CardTitle>
            <CardDescription>{signup ? 'Join the DevForge developer community.' : 'Access your DevForge account.'}</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <BackdropField icon={Mail} id="backdrop-email" label="Email" />
              {signup && <BackdropField icon={UserRound} id="backdrop-username" label="Username" />}
              <BackdropField icon={Lock} id="backdrop-password" label="Password" />
              <Button className="w-full" tabIndex={-1}>
                <ArrowRight data-icon="inline-start" />
                {signup ? 'Create profile' : 'Login'}
              </Button>
            </FieldGroup>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function BackdropField({ icon: Icon, id, label }: { icon: typeof Mail; id: string; label: string }) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupAddon><Icon /></InputGroupAddon>
        <InputGroupInput id={id} tabIndex={-1} />
      </InputGroup>
    </Field>
  )
}
