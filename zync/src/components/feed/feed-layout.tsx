import WhoToFollowSide from '#/components/feed/who-to-follow'
import ProfileMenu from '#/components/feed/profile-menu'
import PostsList from '#/components/posts-list'
import CreatePost from '#/components/feed/create-post'
import ContentWrapper from '#/components/content-wraper'
import { useInfiniteList } from '#/components/hooks/use-infinite-list'
import { getFeed } from '#/lib/api/posts'
import { PostListSkeleton } from '../skeletons/post-skeletons'
import { UserPlus } from 'lucide-react'

export default function FeedLayout() {
  const { data, isPending, loadMoreRef, isFetchingNextPage } = useInfiniteList({
    queryKey: ['feed'],
    queryFn: (page) => getFeed(page),
  })
  const posts = data?.pages.flatMap((page) => page.posts) ?? []

  return (
    <ContentWrapper className="grid grid-cols-[auto] lg:grid-cols-[280px_minmax(0,1fr)_280px] items-start gap-6 mt-[15px]">
      <aside className="sticky top-[81px] self-start">
        <ProfileMenu />
      </aside>

      <main className="space-y-5">
        <CreatePost />
        <hr />
        {isPending ? (
          <PostListSkeleton count={6} />
        ) : posts.length >= 1 ? (
          <PostsList
            posts={posts}
            loadMoreRef={loadMoreRef}
            isFetchingNextPage={isFetchingNextPage}
          />
        ) : (
          <>
            <div className="flex flex-col items-center justify-center gap-5">
              <div className="flex flex-col items-center justify-center">
                <UserPlus className="mb-3 h-8 w-8 text-gray-400 stroke-1" />
                <p className="text-sm">Follow people to see more posts here.</p>
              </div>
              <WhoToFollowSide showOnMoile={true} />
            </div>
          </>
        )}
      </main>
      <div>
        <WhoToFollowSide />
      </div>
    </ContentWrapper>
  )
}
