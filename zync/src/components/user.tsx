import FollowButton from './follow-button'
import { Link } from '@tanstack/react-router'
import type { UserResponse } from '#/types/user'
import { useStore } from '@nanostores/react'
import { $user } from '#/lib/auth'
import UserAvatar from './user-avatar'

export default function User({
  user,
  AvatarSize,
}: {
  user: UserResponse
  AvatarSize?: 'sm' | 'lg'
}) {
  const userSigned = useStore($user)
  const isMe = user.username === userSigned?.username
  return (
    <div
      key={user.id}
      className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/40"
    >
      <Link
        to="/profile/$username"
        params={{ username: user.username }}
        className="flex items-center gap-3 min-w-0"
      >
        <UserAvatar
          url={user.avatar_url}
          username={user.name}
          className="h-15 w-15 shrink-0"
          size={AvatarSize}
        />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium leading-none truncate">
            {user.name}
          </span>
          <span className="text-xs text-muted-foreground truncate mt-1">
            @{user.username}
          </span>
        </div>
      </Link>
      {!isMe && (
        <FollowButton
          is_following={user.is_following}
          username={user.username}
        />
      )}
    </div>
  )
}
