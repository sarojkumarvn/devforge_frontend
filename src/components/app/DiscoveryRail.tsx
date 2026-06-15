import { ArrowUpRight, Search, TrendingUp, Users } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import { CoverImage } from '@/components/app/CoverImage'
import { useAsync } from '@/hooks/useAsync'
import { api } from '@/lib/api'
import { AvatarName } from './AvatarName'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'

export function DiscoveryRail() {
  const { userId } = useAuth()
  const users = useAsync(() => api.users(), [])
  const communities = useAsync(() => api.communities(), [])
  const projects = useAsync(() => api.projects('page=0&size=5&sortBy=likeCount&direction=desc'), [])
  const [followed, setFollowed] = useState<number[]>([])
  const [following, setFollowing] = useState<number[]>([])

  const follow = async (id: number) => {
    if (followed.includes(id) || following.includes(id)) return
    setFollowing((current) => [...current, id])
    try {
      await api.follow(id)
      setFollowed((current) => [...current, id])
      toast.success('Developer followed')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to follow developer')
    } finally {
      setFollowing((current) => current.filter((userId) => userId !== id))
    }
  }

  const suggestedUsers = (users.data?.content ?? []).filter((user) => user.id !== userId).slice(0, 4)
  const hasError = users.error || communities.error || projects.error

  return (
    <div className="flex flex-col gap-4">
      <Button variant="outline" className="h-10 w-full justify-start text-muted-foreground" asChild>
        <Link to="/app/explore" aria-label="Search DevForge">
          <Search data-icon="inline-start" />
          Search DevForge
        </Link>
      </Button>

      {hasError && (
        <Alert variant="destructive">
          <AlertTitle>Discovery is unavailable</AlertTitle>
          <AlertDescription>Some suggestions could not be loaded.</AlertDescription>
        </Alert>
      )}

      <RailSection title="Trending now" icon={TrendingUp}>
        {projects.loading && <RailSkeleton />}
        {(projects.data?.content ?? []).map((post, index) => (
          <div key={post.id}>
            {index > 0 && <Separator />}
            <Link to={`/app/posts/${post.id}`} className="group block py-3">
              <p className="text-xs text-muted-foreground tabular-nums">#{index + 1} in DevForge</p>
              <p className="line-clamp-2 text-pretty text-sm font-medium group-hover:text-primary">{post.title}</p>
              <p className="mt-1 text-xs text-muted-foreground tabular-nums">{post.likeCount ?? 0} likes · {post.commentCount ?? 0} replies</p>
            </Link>
          </div>
        ))}
      </RailSection>

      <RailSection title="Who to follow" icon={Users}>
        {users.loading && <RailSkeleton />}
        {suggestedUsers.map((user, index) => {
          const isFollowing = following.includes(user.id)
          const isFollowed = followed.includes(user.id)
          return (
            <div key={user.id}>
              {index > 0 && <Separator />}
              <div className="flex items-center gap-2 py-3">
                <Link to={`/app/profile/${user.id}`} aria-label={`View ${user.userName}'s profile`}>
                  <AvatarName user={user} size="sm" />
                </Link>
                <Link to={`/app/profile/${user.id}`} className="min-w-0 flex-1 truncate text-sm font-medium hover:underline">
                  {user.userName}
                </Link>
                <Button
                  size="sm"
                  variant={isFollowed ? 'secondary' : 'default'}
                  onClick={() => follow(user.id)}
                  disabled={isFollowed || isFollowing}
                >
                  {isFollowing && <Spinner data-icon="inline-start" />}
                  {isFollowed ? 'Following' : isFollowing ? 'Following' : 'Follow'}
                </Button>
              </div>
            </div>
          )
        })}
      </RailSection>

      {(communities.loading || (communities.data?.content ?? []).length > 0) && (
        <RailSection title="Discover groups" icon={Users}>
          {communities.loading && <RailSkeleton />}
          {(communities.data?.content ?? []).slice(0, 3).map((community, index) => (
            <div key={community.id}>
              {index > 0 && <Separator />}
              <Link to={`/app/communities/${community.id}`} className="group flex items-start justify-between gap-3 py-3">
                <CoverImage className="size-10 shrink-0 rounded-xl" src={community.bannerUrl} alt={`${community.name} banner`} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium group-hover:text-primary">{community.name}</p>
                  <p className="line-clamp-1 text-pretty text-xs text-muted-foreground">{community.description || 'DevForge community'}</p>
                </div>
                <ArrowUpRight className="shrink-0 text-muted-foreground" />
              </Link>
            </div>
          ))}
        </RailSection>
      )}

      <footer className="flex flex-wrap gap-x-3 gap-y-1 px-2 pb-2 text-xs text-muted-foreground">
        <Link className="hover:text-foreground" to="/app/settings">Privacy</Link>
        <Link className="hover:text-foreground" to="/app/settings">Terms</Link>
        <Link className="hover:text-foreground" to="/app/communities">Communities</Link>
        <span>© 2026 DevForge</span>
      </footer>
    </div>
  )
}

function RailSection({ title, icon: Icon, children }: { title: string; icon: typeof Search; children: React.ReactNode }) {
  return (
    <Card size="sm" className="rounded-xl shadow-sm">
      <CardHeader className="border-b border-border/70">
        <CardTitle className="flex items-center gap-2"><Icon /> {title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function RailSkeleton() {
  return (
    <div className="flex flex-col gap-3 py-3" aria-label="Loading suggestions" aria-busy="true">
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}
