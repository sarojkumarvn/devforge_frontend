import { Bell, Mail } from 'lucide-react'
import { EmptyState } from '../../components/app/EmptyState'
import { PageHeader } from '@/components/app/PageHeader'

export function NotificationsPage() {
  return (
    <>
      <PageHeader title="Notifications" />
      <div className="p-4">
        <EmptyState icon={Bell} title="Notifications API is not available yet" body="The backend currently supports likes, comments, follows, bookmarks, users, communities, and posts, but it does not expose notification endpoints." />
      </div>
    </>
  )
}

export function MessagesPage() {
  return (
    <>
      <PageHeader title="Messages" />
      <div className="p-4">
        <EmptyState icon={Mail} title="Messages API is not available yet" body="Direct messages and conversations are intentionally shown as an empty state because no backend messaging endpoints exist in this project." />
      </div>
    </>
  )
}
