import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  CalendarDays,
  Check,
  Code2,
  Eye,
  EyeOff,
  Image,
  Lock,
  Mail,
  MapPin,
  MessageSquareText,
  Shield,
  User,
} from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AuthLink } from '@/components/AuthLink'
import { CoverImage } from '@/components/app/CoverImage'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useAuth } from '@/context/AuthContext'
import { useLoadingTransition } from '@/context/LoadingTransitionContext'
import { ApiError, signup, UserInterest } from '@/lib/authApi'

const interestOptions: { value: UserInterest; label: string }[] = [
  { value: 'FRONTEND', label: 'Frontend' }, { value: 'BACKEND', label: 'Backend' },
  { value: 'FULLSTACK', label: 'Fullstack' }, { value: 'DEVOPS', label: 'DevOps' },
  { value: 'DATA_SCIENCE', label: 'Data Science' }, { value: 'MACHINE_LEARNING', label: 'Machine Learning' },
  { value: 'AI', label: 'AI' }, { value: 'MOBILE_DEVELOPMENT', label: 'Mobile' },
  { value: 'GAME_DEVELOPMENT', label: 'Game Dev' }, { value: 'CLOUD_COMPUTING', label: 'Cloud' },
  { value: 'CYBERSECURITY', label: 'Security' }, { value: 'BLOCKCHAIN', label: 'Blockchain' },
  { value: 'OTHER', label: 'Other' },
]

const steps = [
  { title: 'Account', icon: AtSign },
  { title: 'Profile', icon: Image },
  { title: 'Bio', icon: MessageSquareText },
  { title: 'Stack', icon: Code2 },
]

const yesterday = () => {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return date.toISOString().slice(0, 10)
}

export default function Signup() {
  const navigate = useNavigate()
  const { startSession } = useAuth()
  const { finish, start, updateMessage } = useLoadingTransition()
  const [activeStep, setActiveStep] = useState(0)
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [profilePictureUrl, setProfilePictureUrl] = useState('')
  const [coverPictureUrl, setCoverPictureUrl] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [skillsInput, setSkillsInput] = useState('')
  const [interests, setInterests] = useState<UserInterest[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const skills = useMemo(() => Array.from(new Set(skillsInput.split(',').map((skill) => skill.trim()).filter(Boolean))).slice(0, 50), [skillsInput])
  const accountValid = email.trim().length > 0 && userName.trim().length >= 2 && userName.trim().length <= 20 && password.length >= 8
  const profileValid = profilePictureUrl.trim().length <= 500 && coverPictureUrl.trim().length <= 500 && location.trim().length <= 120
  const bioValid = bio.trim().length <= 500
  const stackValid = skills.length <= 50 && interests.length <= 20
  const canCreate = accountValid && profileValid && bioValid && stackValid && !loading

  const stepIsValid = (step: number) => step === 0 ? accountValid : step === 1 ? profileValid : step === 2 ? bioValid : stackValid

  const showError = (message: string, title = 'Check your details') => {
    setError(message)
    toast.error(title, {
      description: message,
      id: 'signup-error',
    })
  }

  const nextStep = () => {
    if (!stepIsValid(activeStep)) {
      showError(stepError(activeStep))
      return
    }
    setError('')
    setActiveStep((step) => Math.min(step + 1, steps.length - 1))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (activeStep < steps.length - 1) return nextStep()
    if (!canCreate) {
      showError('Complete the required account fields before creating the profile.')
      return
    }
    setError('')
    setLoading(true)
    start('Creating your account...')
    try {
      const result = await signup({
        email: email.trim(),
        password,
        userName: userName.trim(),
        profilePictureUrl: profilePictureUrl.trim() || undefined,
        coverPictureUrl: coverPictureUrl.trim() || undefined,
        dateOfBirth: dateOfBirth || undefined,
        isPrivate,
        bio: bio.trim() || undefined,
        location: location.trim() || undefined,
        skills: skills.length ? skills : undefined,
        interests: interests.length ? interests : undefined,
      })
      startSession(result.jwt, result.id, result.userName)
      updateMessage('Loading your feed...')
      navigate('/app', { replace: true })
    } catch (err) {
      await finish()
      const message = err instanceof ApiError
        ? err.details?.join(', ') || err.message
        : 'Unable to reach the backend. Confirm it is running and try again.'
      showError(message, 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen px-4 pb-12 pt-28 sm:px-6 lg:px-8">
      <section className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
          <div>
            <Badge variant="secondary">DevForge profile</Badge>
            <h1 className="mt-4 max-w-lg font-heading text-4xl font-medium leading-tight sm:text-5xl">Build the profile your projects attach to.</h1>
          </div>
          <Card>
            <CoverImage className="h-28" src={coverPictureUrl.trim() || undefined} alt={`${userName.trim() || 'Developer'} cover`} />
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="size-16">
                  <AvatarImage src={profilePictureUrl.trim()} alt="" />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <CardTitle className="truncate text-xl">{userName.trim() || 'developer'}</CardTitle>
                  <CardDescription className="truncate">{location.trim() || 'Location open'} · {isPrivate ? 'private' : 'public'}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="line-clamp-4 text-sm leading-6 text-muted-foreground">{bio.trim() || 'Your bio preview will appear here as you move through signup.'}</p>
              <div className="flex flex-wrap gap-2">
                {(skills.length ? skills.slice(0, 6) : ['Java', 'React', 'PostgreSQL']).map((skill) => <Badge key={skill} variant="outline">{skill}</Badge>)}
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-3">
            {steps.map((step, index) => {
              const Icon = step.icon
              const complete = index < activeStep || (index === activeStep && stepIsValid(index))
              return (
                <div key={step.title} className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-muted text-muted-foreground">
                    {complete ? <Check /> : <Icon />}
                  </span>
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
              )
            })}
          </div>
        </aside>

        <Card>
          <CardHeader>
            <Badge variant="outline">Step {activeStep + 1} of {steps.length}</Badge>
            <CardTitle className="text-3xl">{steps[activeStep].title}</CardTitle>
            <CardDescription>Already registered? <AuthLink className="text-primary hover:underline" to="/login">Login instead</AuthLink>.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              onInvalid={(event) => {
                event.preventDefault()
                showError(stepError(activeStep))
              }}
            >
              <div className="min-h-[390px]">
                {activeStep === 0 && (
                  <FieldGroup className="grid gap-4 sm:grid-cols-2">
                    <IconField id="signup-email" label="Email" icon={Mail}>
                      <InputGroupInput id="signup-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                    </IconField>
                    <IconField id="signup-username" label="Username" icon={User}>
                      <InputGroupInput id="signup-username" autoComplete="username" minLength={2} maxLength={20} value={userName} onChange={(event) => setUserName(event.target.value)} required />
                    </IconField>
                    <IconField className="sm:col-span-2" id="signup-password" label="Password" icon={Lock}>
                      <InputGroupInput id="signup-password" type="password" autoComplete="new-password" minLength={8} maxLength={100} value={password} onChange={(event) => setPassword(event.target.value)} required />
                    </IconField>
                  </FieldGroup>
                )}
                {activeStep === 1 && (
                  <FieldGroup className="grid gap-4 sm:grid-cols-2">
                    <IconField className="sm:col-span-2" id="signup-image" label="Profile image URL" icon={Image}>
                      <InputGroupInput id="signup-image" type="url" maxLength={500} value={profilePictureUrl} onChange={(event) => setProfilePictureUrl(event.target.value)} />
                    </IconField>
                    <IconField className="sm:col-span-2" id="signup-cover" label="Profile cover URL" icon={Image}>
                      <InputGroupInput id="signup-cover" type="url" maxLength={500} value={coverPictureUrl} onChange={(event) => setCoverPictureUrl(event.target.value)} />
                    </IconField>
                    <IconField id="signup-dob" label="Date of birth" icon={CalendarDays}>
                      <InputGroupInput id="signup-dob" type="date" max={yesterday()} value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} />
                    </IconField>
                    <IconField id="signup-location" label="Location" icon={MapPin}>
                      <InputGroupInput id="signup-location" maxLength={120} value={location} onChange={(event) => setLocation(event.target.value)} />
                    </IconField>
                  </FieldGroup>
                )}
                {activeStep === 2 && (
                  <Field>
                    <FieldLabel htmlFor="signup-bio">Bio</FieldLabel>
                    <Textarea id="signup-bio" className="min-h-52" maxLength={500} value={bio} onChange={(event) => setBio(event.target.value)} />
                    <FieldDescription className="text-right">{bio.length}/500</FieldDescription>
                  </Field>
                )}
                {activeStep === 3 && (
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="signup-skills">Skills</FieldLabel>
                      <Input id="signup-skills" value={skillsInput} onChange={(event) => setSkillsInput(event.target.value)} placeholder="React, Java, PostgreSQL" />
                      <FieldDescription>Separate skills with commas.</FieldDescription>
                    </Field>
                    <FieldSet>
                      <FieldLegend variant="label">Interests</FieldLegend>
                      <ToggleGroup type="multiple" variant="outline" value={interests} onValueChange={(values) => setInterests(values as UserInterest[])} className="flex-wrap justify-start">
                        {interestOptions.map((interest) => <ToggleGroupItem key={interest.value} value={interest.value}>{interest.label}</ToggleGroupItem>)}
                      </ToggleGroup>
                    </FieldSet>
                    <FieldSet>
                      <FieldLegend variant="label">Visibility</FieldLegend>
                      <ToggleGroup type="single" variant="outline" value={isPrivate ? 'private' : 'public'} onValueChange={(value) => value && setIsPrivate(value === 'private')} className="grid w-full grid-cols-2">
                        <ToggleGroupItem value="public"><Eye data-icon="inline-start" /> Public</ToggleGroupItem>
                        <ToggleGroupItem value="private"><EyeOff data-icon="inline-start" /> Private</ToggleGroupItem>
                      </ToggleGroup>
                    </FieldSet>
                  </FieldGroup>
                )}
              </div>

              {error && (
                <Alert className="mt-5" variant="destructive">
                  <AlertTitle>Check your details</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {error && <FieldError className="sr-only">{error}</FieldError>}

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button disabled={activeStep === 0 || loading} type="button" variant="outline" onClick={() => { setError(''); setActiveStep((step) => Math.max(step - 1, 0)) }}>
                  <ArrowLeft data-icon="inline-start" /> Back
                </Button>
                <Button type="submit" disabled={loading || (activeStep === steps.length - 1 && !canCreate)}>
                  {loading ? <Spinner data-icon="inline-start" /> : activeStep === steps.length - 1 ? <Shield data-icon="inline-start" /> : <ArrowRight data-icon="inline-start" />}
                  {activeStep === steps.length - 1 ? 'Create profile' : 'Next'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

function IconField({ id, label, icon: Icon, className, children }: { id: string; label: string; icon: typeof Mail; className?: string; children: React.ReactNode }) {
  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupAddon><Icon /></InputGroupAddon>
        {children}
      </InputGroup>
    </Field>
  )
}

function stepError(step: number) {
  if (step === 0) return 'Enter a valid email, a 2-20 character username, and a password with at least 8 characters.'
  if (step === 1) return 'Profile and cover image URLs can be up to 500 characters, and location can be up to 120 characters.'
  if (step === 2) return 'Bio can be up to 500 characters.'
  return 'Choose up to 50 skills and up to 20 interests.'
}
