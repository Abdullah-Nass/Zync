import { Link } from '@tanstack/react-router'
import ContentWrapper from '#/components/content-wraper'
import { getUser } from '#/lib/api/users'
import { $user } from '#/lib/auth'
import { cn } from '#/lib/utils'
import { useStore } from '@nanostores/react'
import { useQuery } from '@tanstack/react-query'
import ProfilePosts from '#/components/profile/profile-posts'
import { UserNotFound } from '#/components/user-not-found'
import { BackButton } from '#/components/back-button'
import ProfileHeader from '#/components/profile/profile-header'
import type { ProfileLayoutProps } from '#/types/posts'
import Sticky from '../stick'
import Loading from '../loading'

export default function ProfileLayout({ tab, username }: ProfileLayoutProps) {
  const currentUser = useStore($user)

  const canEdit = currentUser?.username === username

  const { data: fetchedUser, isPending } = useQuery({
    queryKey: ['user', username],
    queryFn: () => getUser(username),
    enabled: !!username,
    retry: false,
  })

  const profileUser = fetchedUser ?? (canEdit ? currentUser : null)
  if (isPending) return <Loading />

  if (!profileUser) {
    return <UserNotFound username={username} />
  }
  return (
    <ContentWrapper className="max-w-3xl">
      <Sticky>
        <BackButton title={username} />
        <ProfileHeader profileUser={profileUser} canEdit={canEdit} />

        <div className="flex gap-4 border-b mb-4 ">
          <Link
            from="/profile/$username/"
            search={{ tab: 'posts' }}
            className={cn(
              'px-4 py-2 hover:text-primary transition-colors',
              tab === 'posts' && 'text-primary border-b border-primary',
            )}
          >
            Posts
          </Link>

          <Link
            from="/profile/$username/"
            search={{ tab: 'liked' }}
            className={cn(
              'px-4 py-2 hover:text-primary transition-colors',
              tab === 'liked' && 'text-primary border-b border-primary',
            )}
          >
            Liked Posts
          </Link>
        </div>
      </Sticky>

      <div className="mt-4">
        <ProfilePosts tab={tab} profileUser={profileUser} />
      </div>
    </ContentWrapper>
  )
}
