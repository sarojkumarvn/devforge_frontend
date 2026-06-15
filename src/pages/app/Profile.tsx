import { CalendarDays, MapPin } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { AvatarName } from '@/components/app/AvatarName'
import { CoverImage } from '@/components/app/CoverImage'
import { PostCard } from '@/components/app/PostCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/context/AuthContext'
import { useAsync } from '@/hooks/useAsync'
import { api } from '@/lib/api'

export default function Profile() {
  const params = useParams()
  const { userId } = useAuth()
  const id = params.id ? Number(params.id) : userId
  const profile = useAsync(() => api.user(id!), [id])
  const posts = useAsync(() => api.projects(`userId=${id}&size=30&sortBy=createdAt&direction=desc`), [id])
  const likes = useAsync(() => (id ? api.likedProjects(id) : Promise.resolve([])), [id])
  const [tab, setTab] = useState('posts')
  const [following, setFollowing] = useState(false)
  const [followPending, setFollowPending] = useState(false)

  const follow = async () => {
    if (!id || following || followPending) return
    setFollowPending(true)
    try {
      await api.follow(id)
      setFollowing(true)
      toast.success('Developer followed')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to follow developer')
    } finally {
      setFollowPending(false)
    }
  }

  const tabs = [
    { value: 'posts', label: 'Posts', count: posts.data?.totalElements ?? 0 },
    { value: 'replies', label: 'Replies', count: 0 },
    { value: 'media', label: 'Media', count: posts.data?.content.filter((post) => post.photos?.length).length ?? 0 },
    { value: 'likes', label: 'Likes', count: likes.data?.length ?? 0 },
  ]

  const visiblePosts = tab === 'media'
    ? (posts.data?.content ?? []).filter((post) => post.photos?.length)
    : tab === 'likes'
      ? (likes.data ?? [])
      : tab === 'posts'
        ? (posts.data?.content ?? [])
        : []

  return (
    <>
      <header className="border-b border-border/70">
        <CoverImage
          className="h-40"
          src={profile.data?.coverPictureUrl}
          alt={`${profile.data?.userName ?? 'Developer'} profile cover`}
        />
        <div className="px-4 pb-4">
          <div className="-mt-10 flex items-end justify-between">
            <AvatarName user={profile.data} size="lg" />
            {id !== userId && (
              <Button variant={following ? 'secondary' : 'default'} onClick={follow} disabled={following || followPending}>
                {followPending && <Spinner data-icon="inline-start" />}
                {following ? 'Following' : followPending ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>
          <h1 className="mt-4 text-balance font-heading text-2xl font-medium">{profile.data?.userName}</h1>
          <p className="mt-2 text-pretty leading-6 text-muted-foreground">{profile.data?.bio ?? 'No bio yet.'}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {profile.data?.location && <span className="flex items-center gap-1"><MapPin /> {profile.data.location}</span>}
            <span className="flex items-center gap-1"><CalendarDays /> DevForge member</span>
          </div>
          <div className="mt-3 flex gap-4 text-sm">
            <span><b className="tabular-nums">{profile.data?.followingCount ?? 0}</b> Following</span>
            <span><b className="tabular-nums">{profile.data?.followerCount ?? 0}</b> Followers</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(profile.data?.skills ?? []).map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}
          </div>
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList variant="line" className="w-full justify-start px-4">
            {tabs.map((item) => <TabsTrigger key={item.value} value={item.value}>{item.label} <span className="tabular-nums">{item.count}</span></TabsTrigger>)}
          </TabsList>
        </Tabs>
      </header>
      {visiblePosts.map((post) => <PostCard key={post.id} post={post} onChanged={posts.reload} />)}
    </>
  )
}
