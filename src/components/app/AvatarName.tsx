import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserProfile, UserSummary } from '@/lib/api'

export function AvatarName({ user, size = 'md' }: { user?: Partial<UserProfile | UserSummary> | null; size?: 'sm' | 'md' | 'lg' }) {
  const name = user?.userName?.trim() || 'developer'
  const avatarSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'

  return (
    <Avatar size={avatarSize} className={size === 'lg' ? 'size-20' : size === 'md' ? 'size-10' : undefined}>
      <AvatarImage src={user?.profilePictureUrl} alt={`${name}'s avatar`} />
      <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}
