import { followUser, unFollowUser } from '#/lib/api/users'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { InfiniteData } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Button } from './ui/button'
import type { UserResponse, UsersListResponse } from '#/types/user'
import { useEffect, useState } from 'react'

type FollowButtonProps = React.ComponentProps<typeof Button> & {
  username: string
  is_following: boolean
}

export default function FollowButton({
  username,
  is_following,
  className,
}: FollowButtonProps) {
  const queryClient = useQueryClient()
  const [currentIsFollowing, setCurrentIsFollowing] = useState(is_following)

  useEffect(() => {
    setCurrentIsFollowing(is_following)
  }, [is_following])

  useEffect(() => {
    const suggested = queryClient.getQueryData<InfiniteData<UsersListResponse>>(
      ['who-follow'],
    )

    const found = suggested?.pages
      .flatMap((page) => page.users)
      .find((u) => u.username === username)

    if (found) {
      setCurrentIsFollowing(found.is_following)
      return
    }

    const user = queryClient.getQueryData<UserResponse>(['user', username])
    if (user) setCurrentIsFollowing(user.is_following)
  }, [username, queryClient])

  const followMutation = useMutation({
    mutationFn: (targetIsFollowing: boolean) =>
      targetIsFollowing ? unFollowUser(username) : followUser(username),

    onMutate: async (targetIsFollowing) => {
      setCurrentIsFollowing(!targetIsFollowing)

      const singleUserKey = ['user', username]
      const suggestedUsersKey = ['who-follow']

      await Promise.all([
        queryClient.cancelQueries({ queryKey: singleUserKey }),
        queryClient.cancelQueries({ queryKey: suggestedUsersKey }),
      ])

      const previousUser = queryClient.getQueryData<UserResponse>(singleUserKey)
      const previousSuggested =
        queryClient.getQueryData<InfiniteData<UsersListResponse>>(
          suggestedUsersKey,
        )

      const nextState = !targetIsFollowing
      const updateUserObj = (u: UserResponse): UserResponse => {
        const currentCount = Number.parseInt(u.followers_count, 10) || 0
        const nextCount = nextState
          ? currentCount + 1
          : Math.max(0, currentCount - 1)

        return {
          ...u,
          is_following: nextState,
          followers_count: String(nextCount),
        }
      }

      queryClient.setQueryData<UserResponse>(singleUserKey, (old) => {
        return old ? updateUserObj(old) : old
      })

      queryClient.setQueryData<InfiniteData<UsersListResponse>>(
        suggestedUsersKey,
        (old) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              users: page.users.map((u) =>
                u.username === username ? updateUserObj(u) : u,
              ),
            })),
          }
        },
      )

      return {
        previousUser,
        previousSuggested,
        singleUserKey,
        suggestedUsersKey,
      }
    },

    onError: (_err, targetIsFollowing, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(context.singleUserKey, context.previousUser)
      }
      if (context?.previousSuggested) {
        queryClient.setQueryData(
          context.suggestedUsersKey,
          context.previousSuggested,
        )
      }
      setCurrentIsFollowing(targetIsFollowing)
      toast.error('Failed to update follow')
    },

    onSettled: (_data, _err, _vars, context) => {
      if (context?.singleUserKey) {
        queryClient.invalidateQueries({ queryKey: context.singleUserKey })
      }
      if (context?.suggestedUsersKey) {
        queryClient.invalidateQueries({ queryKey: context.suggestedUsersKey })
      }
      queryClient.invalidateQueries({ queryKey: ['followers'] })
      queryClient.invalidateQueries({ queryKey: ['following'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  const handleFollow = (e: React.MouseEvent, targetIsFollowing: boolean) => {
    e.preventDefault()
    e.stopPropagation()
    if (followMutation.isPending) return
    followMutation.mutate(targetIsFollowing)
  }

  return (
    <Button
      className={className}
      onClick={(e) => handleFollow(e, currentIsFollowing)}
      variant={currentIsFollowing ? 'outline' : 'default'}
      size="sm"
    >
      {currentIsFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  )
}
