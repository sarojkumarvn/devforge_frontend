import { Search } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AvatarName } from '@/components/app/AvatarName'
import { CoverImage } from '@/components/app/CoverImage'
import { PageHeader } from '@/components/app/PageHeader'
import { PostCard } from '@/components/app/PostCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Skeleton } from '@/components/ui/skeleton'
import { useAsync } from '@/hooks/useAsync'
import { api } from '@/lib/api'

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQuery)
  const [submitted, setSubmitted] = useState(initialQuery)
  const projects = useAsync(() => api.projects(submitted ? `keyword=${encodeURIComponent(submitted)}&size=30` : 'page=0&size=20&sortBy=createdAt&direction=desc'), [submitted])
  const users = useAsync(() => api.users(), [])
  const communities = useAsync(() => api.communities(), [])

  const search = (event: FormEvent) => {
    event.preventDefault()
    const nextQuery = query.trim()
    setSubmitted(nextQuery)
    setSearchParams(nextQuery ? { q: nextQuery } : {})
  }

  return (
    <>
      <PageHeader title="Explore" description="Search posts, people, and communities" />
      <form className="border-b p-4" onSubmit={search}>
        <Field>
          <FieldLabel className="sr-only" htmlFor="explore-search">Search DevForge</FieldLabel>
          <InputGroup>
            <InputGroupAddon><Search /></InputGroupAddon>
            <InputGroupInput id="explore-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search posts, people, communities" />
          </InputGroup>
        </Field>
      </form>
      <section className="border-b p-4">
        <h2 className="mb-3 font-heading text-base font-medium">People</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(users.data?.content ?? []).filter((user) => user.userName.toLowerCase().includes(submitted.toLowerCase())).slice(0, 6).map((user) => (
            <Card key={user.id} size="sm">
              <CardContent>
                <Link to={`/app/profile/${user.id}`} className="flex items-center gap-3">
                  <AvatarName user={user} />
                  <span className="font-medium">{user.userName}</span>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="border-b p-4">
        <h2 className="mb-3 font-heading text-base font-medium">Communities</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(communities.data?.content ?? []).filter((community) => `${community.name} ${community.description}`.toLowerCase().includes(submitted.toLowerCase())).slice(0, 6).map((community) => (
            <Card key={community.id} size="sm">
              <CoverImage className="h-20" src={community.bannerUrl} alt={`${community.name} banner`} />
              <CardHeader>
                <CardTitle><Link to={`/app/communities/${community.id}`}>{community.name}</Link></CardTitle>
                <CardDescription className="line-clamp-2">{community.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
      <h2 className="p-4 font-heading text-base font-medium">Posts</h2>
      {projects.loading && <div className="flex flex-col gap-3 p-4"><Skeleton className="h-24" /><Skeleton className="h-24" /></div>}
      {(projects.data?.content ?? []).map((post) => <PostCard key={post.id} post={post} onChanged={projects.reload} />)}
    </>
  )
}
