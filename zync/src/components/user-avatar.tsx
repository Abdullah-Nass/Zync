import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { fallbackAvatar } from '#/lib/utils'
import type { UserAvatarProps } from '#/types/user'

export default function UserAvatar({
  url,
  username,
  size,
  className,
}: UserAvatarProps) {
  return (
    <Avatar size={size ?? 'default'} className={className}>
      <AvatarImage src={url || '/no-profile.jpg'} />
      <AvatarFallback>{fallbackAvatar(username)}</AvatarFallback>
    </Avatar>
  )
}
