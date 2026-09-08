import type { PostsResponse } from '#/types/posts'
import Post from './post'

interface PostsListProps {
  posts: PostsResponse[]
  loadMoreRef: React.Ref<HTMLDivElement>
  isFetchingNextPage: boolean
}
export default function PostsList({
  posts,
  loadMoreRef,
  isFetchingNextPage,
}: PostsListProps) {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}

      <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && <div>Loading more...</div>}
      </div>
    </div>
  )
}
