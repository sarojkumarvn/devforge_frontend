import { Flame, Radio, Sparkles, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EmptyState } from '../../components/app/EmptyState'
import { PostCard } from '../../components/app/PostCard'
import { PostComposer } from '../../components/app/PostComposer'
import { Button } from '../../components/ui/button'
import { Skeleton } from '../../components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAsync } from '../../hooks/useAsync'
import { api } from '../../lib/api'
import { useLoadingTransition } from '@/context/LoadingTransitionContext'

const filters = [
  { id: 'for-you', label: 'For you', icon: Sparkles },
  { id: 'following', label: 'Following', icon: Users },
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'latest', label: 'Latest', icon: Radio },
] as const

type Filter = typeof filters[number]['id']

export default function HomeFeed() {
  const [filter, setFilter] = useState<Filter>('for-you')
  const { finish } = useLoadingTransition()
  const feed = useAsync(async () => {
    if (filter === 'following') return api.feed('following')
    if (filter === 'trending') return api.projects('page=0&size=20&sortBy=score&direction=desc')
    if (filter === 'latest') return api.projects('page=0&size=20&sortBy=createdAt&direction=desc')
    return api.feed('for-you')
  }, [filter])

  const posts = feed.data?.content ?? []

  useEffect(() => {
    if (!feed.loading) void finish()
  }, [feed.loading, finish])

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border/70 bg-background/90 px-4 pt-3 backdrop-blur-md sm:px-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-balance font-heading text-lg font-medium">Home</h1>
            <p className="text-pretty text-xs text-muted-foreground">Ideas and work from your developer network</p>
          </div>
        </div>
        <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
        <TabsList variant="line" className="-mx-2 mt-2">
            {filters.map((item) => (
              <TabsTrigger key={item.id} value={item.id}>
                <item.icon data-icon="inline-start" />
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </header>

      <PostComposer onCreated={feed.reload} />

      {feed.loading && <SkeletonList />}

      {feed.error && (
        <div className="border-b p-6">
          <Alert variant="destructive">
            <AlertTitle>Unable to load feed</AlertTitle>
            <AlertDescription>{feed.error}</AlertDescription>
          </Alert>
          <Button className="mt-3" variant="outline" onClick={feed.reload}>Try again</Button>
        </div>
      )}

      {!feed.loading && !feed.error && posts.length === 0 && (
        <div className="p-5">
          <EmptyState
            icon={filter === 'following' ? Users : Sparkles}
            title={filter === 'following' ? 'Your following feed is quiet' : 'No posts here yet'}
            body={filter === 'following' ? 'Follow developers from the discovery panel to see their work here.' : 'Start the conversation by sharing a project, question, or technical idea.'}
          />
        </div>
      )}

      {posts.map((post) => <PostCard key={'projectId' in post ? post.projectId : post.id} post={post} onChanged={feed.reload} />)}
    </>
  )
}

function SkeletonList() {
  return (
    <div aria-label="Loading posts" aria-busy="true">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex gap-3 border-b border-border/70 px-5 py-5">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-3">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
