import { SendHorizonal } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { PageHeader } from '@/components/app/PageHeader'
import { PostCard } from '@/components/app/PostCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useAsync } from '@/hooks/useAsync'
import { api } from '@/lib/api'

export default function PostDetail() {
  const id = Number(useParams().id)
  const post = useAsync(() => api.project(id), [id])
  const comments = useAsync(() => api.comments(id), [id])
  const [content, setContent] = useState('')

  const add = async (event: FormEvent) => {
    event.preventDefault()
    if (!content.trim()) return
    try {
      await api.addComment(id, content.trim())
      setContent('')
      toast.success('Comment posted')
      comments.reload()
      post.reload()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to post comment')
    }
  }

  return (
    <>
      <PageHeader title="Post" />
      {post.data && <PostCard post={post.data} onChanged={post.reload} />}
      <form className="border-b p-4" onSubmit={add}>
        <Field>
          <FieldLabel htmlFor="comment">Join the discussion</FieldLabel>
          <Textarea id="comment" value={content} onChange={(event) => setContent(event.target.value)} placeholder="Write a comment..." />
        </Field>
        <div className="mt-3 flex justify-end">
          <Button type="submit"><SendHorizonal data-icon="inline-start" /> Comment</Button>
        </div>
      </form>
      <div className="flex flex-col gap-3 p-4">
        {(comments.data?.content ?? []).map((comment) => (
          <Card key={comment.id} size="sm">
            <CardHeader>
              <CardTitle>{comment.userName}</CardTitle>
              <CardDescription>{new Date(comment.createdAt).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap leading-6">{comment.content}</CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
