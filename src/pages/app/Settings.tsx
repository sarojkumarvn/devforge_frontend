import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/app/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldGroup, FieldLabel, FieldTitle } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'

export default function Settings() {
  const { user, userId, refreshUser } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()
  const [bio, setBio] = useState(user?.bio ?? '')
  const [location, setLocation] = useState(user?.location ?? '')
  const [coverPictureUrl, setCoverPictureUrl] = useState(user?.coverPictureUrl ?? '')
  const [saving, setSaving] = useState(false)
  const dark = resolvedTheme === 'dark'

  useEffect(() => {
    setBio(user?.bio ?? '')
    setLocation(user?.location ?? '')
    setCoverPictureUrl(user?.coverPictureUrl ?? '')
  }, [user])

  const save = async () => {
    if (!userId || saving) return
    setSaving(true)
    try {
      await api.updateUser(userId, {
        bio,
        location,
        coverPictureUrl: coverPictureUrl.trim(),
      })
      await refreshUser()
      toast.success('Profile saved')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader title="Settings" description="Manage your profile and preferences" />
      <section className="flex flex-col gap-5 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose the appearance used across DevForge.</CardDescription>
          </CardHeader>
          <CardContent>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>{dark ? 'Dark mode' : 'Light mode'}</FieldTitle>
                <p className="text-sm text-muted-foreground">Switch between light and dark semantic themes.</p>
              </FieldContent>
              {dark ? <Moon /> : <Sun />}
              <Switch checked={dark} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} aria-label="Toggle dark mode" />
            </Field>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update the details shown on your public profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="profile-bio">Bio</FieldLabel>
                <Textarea id="profile-bio" value={bio} onChange={(event) => setBio(event.target.value)} />
              </Field>
              <Field>
                <FieldLabel htmlFor="profile-location">Location</FieldLabel>
                <Input id="profile-location" value={location} onChange={(event) => setLocation(event.target.value)} />
              </Field>
              <Field>
                <FieldLabel htmlFor="profile-cover">Profile cover URL</FieldLabel>
                <Input id="profile-cover" type="url" maxLength={500} value={coverPictureUrl} onChange={(event) => setCoverPictureUrl(event.target.value)} />
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button onClick={save} disabled={saving}>
              {saving && <Spinner data-icon="inline-start" />}
              {saving ? 'Saving' : 'Save profile'}
            </Button>
          </CardFooter>
        </Card>
      </section>
    </>
  )
}
