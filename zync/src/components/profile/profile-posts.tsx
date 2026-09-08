import type { RenderContentProps } from '#/types/posts'
import PostsList from '../posts-list'
import { EmptyPosts } from '../empty-posts'
import { getLikedPosts, getUserPosts } from '#/lib/api/posts'
import { useInfiniteList } from '../hooks/use-infinite-list'
import { PostListSkeleton } from '../skeletons/post-skeletons'

export default function ProfilePosts({
  tab = 'posts',
  profileUser,
}: RenderContentProps) {
  const {
    data: postsData,
    isPending: postsPending,
    loadMoreRef: postsRef,
    isFetchingNextPage: postsNextPage,
  } = useInfiniteList({
    queryKey: ['posts', profileUser.username],
    queryFn: (page) => getUserPosts(profileUser.username, page),
    enabled: tab === 'posts',
  })
  const posts = postsData?.pages.flatMap((page) => page.posts) ?? []

  const {
    data: likedData,
    isPending: likedPending,
    loadMoreRef: likedRef,
    isFetchingNextPage: likedNextPage,
  } = useInfiniteList({
    queryKey: ['liked', profileUser.username],
    queryFn: (page) => getLikedPosts(profileUser.username, page),
    enabled: tab === 'liked',
  })
  const liked = likedData?.pages.flatMap((page) => page.posts) ?? []

  const isPostsTab = tab === 'posts'
  const activePosts = isPostsTab ? posts : liked
  const activeRef = isPostsTab ? postsRef : likedRef
  const activeNextPage = isPostsTab ? postsNextPage : likedNextPage
  const emptyMessage = isPostsTab ? 'No posts yet' : 'No liked posts yet'
  const isActivePending = isPostsTab ? postsPending : likedPending
  if (isActivePending) return <PostListSkeleton />
  if (activePosts.length === 0) {
    return <EmptyPosts title={emptyMessage} tab={tab} />
  }
  return (
    <PostsList
      posts={activePosts}
      loadMoreRef={activeRef}
      isFetchingNextPage={activeNextPage}
    />
  )
}
