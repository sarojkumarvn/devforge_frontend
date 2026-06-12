import { useParams } from 'react-router-dom'
import { FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AvatarName } from '@/components/app/AvatarName'
import { CoverImage } from '@/components/app/CoverImage'
import { PostCard } from '@/components/app/PostCard'
import { PostComposer } from '@/components/app/PostComposer'
import { AvatarGroup } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/context/AuthContext'
import { useAsync } from '@/hooks/useAsync'
import { api } from '@/lib/api'

export default function CommunityDetail() {
  const id = Number(useParams().id)
  const { userId } = useAuth()
  const community = useAsync(() => api.community(id), [id])
  const posts = useAsync(() => api.communityPosts(id), [id])
  const members = useAsync(() => api.communityMembers(id), [id])
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)
  const [bannerUrl, setBannerUrl] = useState('')
  const [savingBanner, setSavingBanner] = useState(false)

  useEffect(() => {
    setBannerUrl(community.data?.bannerUrl ?? '')
  }, [community.data?.bannerUrl])

  const join = async () => {
    if (!userId || joining || joined) return
    setJoining(true)
    try {
      await api.joinCommunity(userId, id)
      setJoined(true)
      toast.success('Community joined')
      members.reload()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to join community')
    } finally {
      setJoining(false)
    }
  }

  const saveBanner = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!userId || !community.data || !community.data.canManage || savingBanner) return

    setSavingBanner(true)
    try {
      await api.updateCommunity(userId, id, {
        name: community.data.name,
        description: community.data.description,
        logoUrl: community.data.logoUrl,
        bannerUrl: bannerUrl.trim() || undefined,
        privacy: community.data.privacy,
      })
      await community.reload()
      toast.success('Community banner updated')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update community banner')
    } finally {
      setSavingBanner(false)
    }
  }

  return (
    <>
      <header className="border-b">
        <CoverImage className="h-36" src={community.data?.bannerUrl} alt={`${community.data?.name ?? 'Community'} banner`} />
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-heading text-2xl font-medium">{community.data?.name ?? 'Community'}</h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{community.data?.description}</p>
            </div>
            {!community.data?.canManage && (
              <Button onClick={join} disabled={joining || joined}>
                {joining && <Spinner data-icon="inline-start" />}
                {joined ? 'Joined' : joining ? 'Joining' : 'Join'}
              </Button>
            )}
          </div>
          {community.data?.canManage && (
            <form className="mt-4" onSubmit={saveBanner}>
              <FieldGroup className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <Field>
                  <FieldLabel htmlFor="community-detail-banner">Banner image URL</FieldLabel>
                  <Input
                    id="community-detail-banner"
                    type="url"
                    maxLength={500}
                    value={bannerUrl}
                    onChange={(event) => setBannerUrl(event.target.value)}
                    placeholder="https://example.com/banner.jpg"
                  />
                </Field>
                <Button type="submit" disabled={savingBanner}>
                  {savingBanner && <Spinner data-icon="inline-start" />}
                  {savingBanner ? 'Saving' : 'Save banner'}
                </Button>
              </FieldGroup>
            </form>
          )}
          <AvatarGroup className="mt-4">
            {(members.data?.content ?? []).slice(0, 8).map((member) => <AvatarName key={member.id} user={member} size="sm" />)}
          </AvatarGroup>
        </div>
      </header>
      <PostComposer communityId={id} onCreated={posts.reload} />
      {(posts.data?.content ?? []).map((post) => <PostCard key={post.id} post={post} onChanged={posts.reload} />)}
    </>
  )
}
