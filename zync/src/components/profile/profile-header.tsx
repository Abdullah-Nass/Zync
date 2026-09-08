import type { UserResponse } from '#/types/user'
import { Link } from '@tanstack/react-router'
import FollowButton from '../follow-button'
import { Button } from '../ui/button'
import UserAvatar from '../user-avatar'

export default function ProfileHeader({
  profileUser,
  canEdit,
}: {
  profileUser: UserResponse
  canEdit: boolean
}) {
  return (
    <div className="flex gap-6">
      <UserAvatar
        url={profileUser.avatar_url}
        username={profileUser.name}
        className="w-30 h-30 mb-4 ring-2 ring-gray-200 ring-offset-2"
      />
      <div className="flex flex-col md:flex-row justify-between space-x-5 space-y-3 flex-1 mt-5">
        <div className="space-y-4">
          <h2 className="font-bold text-lg">{profileUser.name}</h2>

          <p className="text-sm  mt-1.5 leading-relaxed max-w-[260px]">
            {profileUser.bio}
          </p>
          <div className="flex gap-5 items-center">
            <Link
              to="/profile/$username/followers"
              params={{ username: profileUser.username }}
              className="text-sm"
            >
              <div className="font-bold">{profileUser.followers_count}</div>
              <span>Followers</span>
            </Link>
            <div className="w-px bg-gray-300 h-7" />
            <Link
              to="/profile/$username/following"
              params={{ username: profileUser.username }}
              className="text-sm"
            >
              <div className="font-bold">{profileUser.following_count}</div>
              <span>Following</span>
            </Link>
          </div>
        </div>
        <div className="md:mx-auto md:mt-5">
          {canEdit ? (
            <Button variant={'outline'} asChild>
              <Link to="/profile/edit">Edit profile</Link>
            </Button>
          ) : (
            <FollowButton
              username={profileUser.username}
              is_following={profileUser.is_following}
            />
          )}
        </div>
      </div>
    </div>
  )
}
