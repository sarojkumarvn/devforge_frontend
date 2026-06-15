import { Bookmark, ExternalLink, Github, Heart, Link2, MessageCircle, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../../context/AuthContext'
import { api, FeedPost, Project } from '../../lib/api'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AvatarName } from './AvatarName'

type PostLike = FeedPost | Project

function normalize(post: PostLike) {
  return {
    id: 'projectId' in post ? post.projectId : post.id,
    title: post.title,
    description: post.description,
    photos: post.photos ?? [],
    userId: post.userId,
    userName: post.userName,
    createdAt: post.createdAt,
    likeCount: post.likeCount ?? 0,
    commentCount: post.commentCount ?? 0,
    bookmarkCount: 'bookmarkCount' in post ? post.bookmarkCount ?? 0 : 0,
    isLiked: 'isLiked' in post ? Boolean(post.isLiked) : false,
    isBookmarked: 'isBookmarked' in post ? Boolean(post.isBookmarked) : false,
    communityId: 'communityId' in post ? post.communityId : undefined,
    techStacks: 'techStacks' in post ? post.techStacks ?? [] : [],
    githubLink: 'githubLink' in post ? post.githubLink : undefined,
    liveDemoLink: 'liveDemoLink' in post ? post.liveDemoLink : undefined,
  }
}

function relativeTime(value: string) {
  const timestamp = new Date(value).getTime()
  if (Number.isNaN(timestamp)) return ''
  const seconds = Math.round((timestamp - Date.now()) / 1000)
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const ranges: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31_536_000],
    ['month', 2_592_000],
    ['week', 604_800],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
  ]
  for (const [unit, size] of ranges) {
    if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit)
  }
  return 'just now'
}

export function PostCard({ post, onChanged }: { post: PostLike; onChanged?: () => void }) {
  const { userId } = useAuth()
  const item = normalize(post)
  const [liked, setLiked] = useState(item.isLiked)
  const [bookmarked, setBookmarked] = useState(item.isBookmarked)
  const [likeCount, setLikeCount] = useState(item.likeCount)
  const [bookmarkCount, setBookmarkCount] = useState(item.bookmarkCount)
  const [following, setFollowing] = useState(false)
  const [liking, setLiking] = useState(false)
  const [bookmarking, setBookmarking] = useState(false)
  const [followPending, setFollowPending] = useState(false)

  const toggleLike = async () => {
    if (liking) return
    setLiking(true)
    const next = !liked
    setLiked(next)
    setLikeCount((count) => Math.max(0, count + (next ? 1 : -1)))
    try {
      if (next) await api.likeProject(item.id)
      else if (userId) await api.unlikeProject(item.id, userId)
      onChanged?.()
    } catch {
      setLiked(!next)
      setLikeCount((count) => Math.max(0, count + (next ? -1 : 1)))
      toast.error('Unable to update like')
    } finally {
      setLiking(false)
    }
  }

  const toggleBookmark = async () => {
    if (!userId || bookmarking) return
    setBookmarking(true)
    const next = !bookmarked
    setBookmarked(next)
    setBookmarkCount((count) => Math.max(0, count + (next ? 1 : -1)))
    try {
      if (next) await api.bookmarkProject(item.id)
      else await api.removeBookmark(userId, item.id)
      onChanged?.()
    } catch {
      setBookmarked(!next)
      setBookmarkCount((count) => Math.max(0, count + (next ? -1 : 1)))
      toast.error('Unable to update bookmark')
    } finally {
      setBookmarking(false)
    }
  }

  const follow = async () => {
    if (item.userId === userId || following || followPending) return
    setFollowPending(true)
    try {
      await api.follow(item.userId)
      setFollowing(true)
      toast.success(`Following ${item.userName}`)
    } catch {
      setFollowing(false)
      toast.error('Unable to follow developer')
    } finally {
      setFollowPending(false)
    }
  }

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#/app/posts/${item.id}`
    try {
      if (navigator.share) await navigator.share({ title: item.title, url })
      else {
        await navigator.clipboard.writeText(url)
        toast.success('Post link copied')
      }
    } catch {
      // Dismissing the native share dialog requires no UI response.
    }
  }

  return (
    <article className="group border-b border-border/70 px-4 py-5 transition-colors hover:bg-muted/30 sm:px-5">
      <div className="flex gap-3">
        <div className="relative flex shrink-0 flex-col items-center">
          <Link to={`/app/profile/${item.userId}`} aria-label={`View ${item.userName}'s profile`}>
            <AvatarName user={{ userName: item.userName }} />
          </Link>
          <Separator orientation="vertical" className="mt-2 flex-1 group-last:hidden" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1.5 text-sm">
            <Link to={`/app/profile/${item.userId}`} className="truncate font-medium hover:underline">
              {item.userName}
            </Link>
            <span className="text-muted-foreground">·</span>
            <time className="shrink-0 text-muted-foreground" dateTime={item.createdAt} title={new Date(item.createdAt).toLocaleString()}>
              {relativeTime(item.createdAt)}
            </time>
            {item.communityId && (
              <Link to={`/app/communities/${item.communityId}`} className="ml-auto truncate text-xs font-medium text-primary hover:underline">
                Community #{item.communityId}
              </Link>
            )}
          </div>

          <Link to={`/app/posts/${item.id}`} className="block">
            <h2 className="mt-1.5 text-balance font-heading text-[1.05rem] font-medium leading-6">{item.title}</h2>
            <p className="mt-1.5 whitespace-pre-wrap text-pretty text-sm leading-6 text-muted-foreground">{item.description}</p>
          </Link>

          {item.techStacks.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.techStacks.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag.replace(/\s+/g, '')}
                </Badge>
              ))}
            </div>
          )}

          {item.photos[0] && (
            <Link to={`/app/posts/${item.id}`} className="mt-3 block overflow-hidden rounded-xl border border-border/70 bg-muted">
              <img className="max-h-[440px] w-full object-cover" src={item.photos[0]} alt={`Attached to ${item.title}`} />
            </Link>
          )}

          {(item.githubLink || item.liveDemoLink) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.githubLink && <ExternalResource href={item.githubLink} icon={Github} label="Source code" />}
              {item.liveDemoLink && <ExternalResource href={item.liveDemoLink} icon={ExternalLink} label="Live demo" />}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-muted-foreground" aria-label="Post actions">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/app/posts/${item.id}`} aria-label={`${item.commentCount} comments`}>
                <MessageCircle data-icon="inline-start" /> <span className="tabular-nums">{item.commentCount}</span>
              </Link>
            </Button>
            <Button className={cn(liked && 'text-destructive')} variant="ghost" size="sm" type="button" onClick={toggleLike} aria-label={liked ? 'Unlike post' : 'Like post'} aria-pressed={liked} disabled={liking}>
              <Heart data-icon="inline-start" fill={liked ? 'currentColor' : 'none'} /> <span className="tabular-nums">{likeCount}</span>
            </Button>
            <Button className={cn(bookmarked && 'text-primary')} variant="ghost" size="sm" type="button" onClick={toggleBookmark} aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark post'} aria-pressed={bookmarked} disabled={bookmarking}>
              <Bookmark data-icon="inline-start" fill={bookmarked ? 'currentColor' : 'none'} /> <span className="tabular-nums">{bookmarkCount || ''}</span>
            </Button>
            <Button variant="ghost" size="icon-sm" type="button" onClick={share} aria-label="Share post">
              <Link2 />
            </Button>
            {item.userId !== userId && (
              <Button className={cn(following && 'text-primary')} variant="ghost" size="icon-sm" type="button" onClick={follow} aria-label={following ? `Following ${item.userName}` : `Follow ${item.userName}`} disabled={following || followPending}>
                <UserPlus />
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function ExternalResource({ href, icon: Icon, label }: { href: string; icon: typeof Github; label: string }) {
  return (
    <Button variant="outline" size="sm" asChild>
      <a href={href} target="_blank" rel="noreferrer"><Icon data-icon="inline-start" /> {label}</a>
    </Button>
  )
}
