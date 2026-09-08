import type { QueryKey } from '@tanstack/react-query'
import type { UserResponse } from './user'

export interface PostsResponse {
  id: string
  user_id: string
  content: string
  created_at: string
  username: string
  name: string
  avatar_url: string | null
  like_count: number
  liked_by_me: boolean
}

export interface PostsListResponse {
  posts: PostsResponse[]
  page: number
  hasMore: boolean
}

export interface EmptyPostsProps {
  tab?: Tab
  title?: string
}

export interface PaginatedResponse {
  page: number
  hasMore: boolean
}

export interface UseInfiniteListOptions<TPage extends PaginatedResponse> {
  queryKey: QueryKey
  queryFn: (page: number) => Promise<TPage>
  rootMargin?: string
  enabled?: boolean
}

type Tab = 'posts' | 'liked'

export interface ProfileSearch {
  tab?: Tab
}
export interface RenderContentProps {
  tab?: Tab
  profileUser: UserResponse
}
export interface ProfileLayoutProps {
  tab?: Tab
  username: string
}
