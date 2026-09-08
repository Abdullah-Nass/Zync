import type { RefObject } from 'react'

export interface UserResponse {
  id: string
  name: string
  username: string
  avatar_url: string | null
  bio: string | null
  followers_count: string
  following_count: string
  is_following: boolean
}

export interface UserNotFoundProps {
  username: string
}

export interface UsersListResponse {
  users: UserResponse[]
  page: number
  hasMore: boolean
}

export interface UserListProps {
  title?: string
  error?: string
  users: UserResponse[]
  loadMoreRef?: RefObject<HTMLDivElement | null>
  isFetchingNextPage?: boolean
  hasNextPage?: boolean
}

export interface UserAvatarProps {
  url: string | null
  username: string
  size?: 'sm' | 'lg'
  className?: string
}

export interface UserListPaginatedViewProps {
  queryKey: unknown[]
  queryFn: (page: number) => Promise<UsersListResponse>
  title: string
  emptyError: string
  enabled?: boolean
  className?: string
}
