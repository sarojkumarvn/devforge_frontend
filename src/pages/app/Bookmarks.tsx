import { Bookmark } from 'lucide-react'
import { EmptyState } from '../../components/app/EmptyState'
import { PostCard } from '../../components/app/PostCard'
import { PageHeader } from '@/components/app/PageHeader'
import { useAuth } from '../../context/AuthContext'
import { useAsync } from '../../hooks/useAsync'
import { api } from '../../lib/api'

export default function Bookmarks() {
  const { userId } = useAuth()
  const bookmarks = useAsync(() => (userId ? api.bookmarks(userId) : Promise.resolve([])), [userId])
  return (
    <>
      <PageHeader title="Bookmarks" description="Your private reading list" />
      {!bookmarks.loading && (bookmarks.data ?? []).length === 0 && (
        <div className="p-4"><EmptyState icon={Bookmark} title="No bookmarks yet" body="Bookmark posts from the feed to build a private reading list." /></div>
      )}
      {(bookmarks.data ?? []).map((post) => <PostCard key={post.id} post={post} onChanged={bookmarks.reload} />)}
    </>
  )
}
