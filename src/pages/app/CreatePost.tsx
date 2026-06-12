import { PostComposer } from '../../components/app/PostComposer'
import { PageHeader } from '@/components/app/PageHeader'

export default function CreatePost() {
  return (
    <>
      <PageHeader title="Create post" description="Share a project, question, or technical idea" />
      <PostComposer />
    </>
  )
}
