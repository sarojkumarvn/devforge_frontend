import { Plus, Users } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { PageHeader } from '@/components/app/PageHeader'
import { CoverImage } from '@/components/app/CoverImage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { useAsync } from '@/hooks/useAsync'
import { api } from '@/lib/api'

export default function Communities() {
  const { userId } = useAuth()
  const communities = useAsync(() => api.communities(), [])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')

  const create = async (event: FormEvent) => {
    event.preventDefault()
    if (!userId || !name.trim()) return
    try {
      await api.createCommunity(userId, {
        name: name.trim(),
        description: description.trim(),
        bannerUrl: bannerUrl.trim() || undefined,
        privacy: 'PUBLIC',
      })
      setName('')
      setDescription('')
      setBannerUrl('')
      toast.success('Community created')
      communities.reload()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to create community')
    }
  }

  return (
    <>
      <PageHeader title="Communities" description="Build and join focused developer groups" />
      <form className="border-b border-border/70 p-4" onSubmit={create}>
        <FieldGroup className="grid gap-3 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="community-name">Community name</FieldLabel>
            <Input id="community-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Community name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="community-description">Description</FieldLabel>
            <Input id="community-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" />
          </Field>
          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="community-banner">Banner image URL</FieldLabel>
            <Input id="community-banner" type="url" maxLength={500} value={bannerUrl} onChange={(event) => setBannerUrl(event.target.value)} placeholder="https://example.com/banner.jpg" />
          </Field>
          <Button className="sm:col-span-2 sm:justify-self-end" type="submit"><Plus data-icon="inline-start" /> Create</Button>
        </FieldGroup>
      </form>
      <div className="grid gap-4 p-4">
        {(communities.data?.content ?? []).map((community) => (
          <Card key={community.id}>
            <CoverImage className="h-28" src={community.bannerUrl} alt={`${community.name} banner`} />
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-muted text-primary">
                  {community.logoUrl ? <img className="size-full rounded-xl object-cover" src={community.logoUrl} alt="" /> : <Users />}
                </div>
                <div>
                  <CardTitle><Link to={`/app/communities/${community.id}`}>{community.name}</Link></CardTitle>
                  <CardDescription className="text-pretty">{community.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">{community.privacy}</CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
