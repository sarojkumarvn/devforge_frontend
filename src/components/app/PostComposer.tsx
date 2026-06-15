import { Globe2, ImagePlus, SendHorizonal, Tag, Users } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import { api, Community } from '@/lib/api'
import { AvatarName } from './AvatarName'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea } from '@/components/ui/input-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'

export function PostComposer({ onCreated, communityId }: { onCreated?: () => void; communityId?: number }) {
  const { user, userId } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [techStacks, setTechStacks] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [selectedCommunityId, setSelectedCommunityId] = useState(communityId ? String(communityId) : 'public')
  const [communities, setCommunities] = useState<Community[]>([])
  const [showDetails, setShowDetails] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.communities().then((page) => setCommunities(page.content)).catch(() => setCommunities([]))
  }, [])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!userId || !title.trim() || !description.trim()) return
    setError('')
    setLoading(true)
    try {
      const selectedId = selectedCommunityId === 'public' ? undefined : Number(selectedCommunityId)
      await api.createProject(userId, {
        title: title.trim(),
        description: description.trim(),
        isPublic: !selectedId,
        communityId: selectedId,
        photos: photoUrl.trim() ? [photoUrl.trim()] : undefined,
        techStacks: techStacks.split(',').map((item) => item.trim()).filter(Boolean),
      })
      setTitle('')
      setDescription('')
      setTechStacks('')
      setPhotoUrl('')
      setShowDetails(false)
      setSelectedCommunityId(communityId ? String(communityId) : 'public')
      toast.success('Post published')
      onCreated?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to create post'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="border-b border-border/70 bg-card p-4 sm:p-5" onSubmit={submit}>
      <div className="flex gap-3">
        <AvatarName user={user} />
        <FieldGroup className="min-w-0 flex-1 gap-3">
          <Field data-invalid={Boolean(error)}>
            <FieldLabel className="sr-only" htmlFor="post-title">Post title</FieldLabel>
            <InputGroup>
              <InputGroupInput id="post-title" value={title} maxLength={255} onChange={(event) => setTitle(event.target.value)} placeholder="Give your post a clear title" aria-invalid={Boolean(error)} />
            </InputGroup>
          </Field>
          <Field data-invalid={Boolean(error)}>
            <FieldLabel className="sr-only" htmlFor="post-content">Post content</FieldLabel>
            <InputGroup>
              <InputGroupTextarea id="post-content" className="min-h-24" value={description} maxLength={1290} onChange={(event) => setDescription(event.target.value)} placeholder="Share what you built, learned, or need help with..." aria-invalid={Boolean(error)} />
            </InputGroup>
          </Field>

          {showDetails && (
            <FieldGroup className="grid gap-2 sm:grid-cols-2">
              <Field>
                <FieldLabel className="sr-only" htmlFor="post-tags">Technology tags</FieldLabel>
                <InputGroup>
                  <InputGroupAddon><Tag /></InputGroupAddon>
                  <InputGroupInput id="post-tags" value={techStacks} onChange={(event) => setTechStacks(event.target.value)} placeholder="Tags, comma separated" />
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel className="sr-only" htmlFor="post-image">Image URL</FieldLabel>
                <InputGroup>
                  <InputGroupAddon><ImagePlus /></InputGroupAddon>
                  <InputGroupInput id="post-image" value={photoUrl} onChange={(event) => setPhotoUrl(event.target.value)} placeholder="Image URL" />
                </InputGroup>
              </Field>
            </FieldGroup>
          )}

          <Separator />
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="icon" type="button" onClick={() => setShowDetails((value) => !value)} aria-label="Add image or tags" aria-expanded={showDetails}>
              <ImagePlus />
            </Button>
            <Select value={selectedCommunityId} onValueChange={setSelectedCommunityId} disabled={Boolean(communityId)}>
              <SelectTrigger size="sm" aria-label="Post audience">
                {selectedCommunityId === 'public' ? <Globe2 /> : <Users />}
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="public">Anyone on DevForge</SelectItem>
                  {communities.map((community) => <SelectItem key={community.id} value={String(community.id)}>{community.name}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
            <span className="ml-auto text-xs text-muted-foreground tabular-nums">{description.length}/1290</span>
            <Button disabled={loading || !title.trim() || !description.trim()} type="submit">
              {loading ? <Spinner data-icon="inline-start" /> : <SendHorizonal data-icon="inline-start" />}
              Post
            </Button>
          </div>
          {error && <FieldError>{error}</FieldError>}
        </FieldGroup>
      </div>
    </form>
  )
}
