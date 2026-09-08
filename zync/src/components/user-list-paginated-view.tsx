// #/components/user-list-paginated-view.tsx
import { BackButton } from '#/components/back-button'
import ContentWrapper from '#/components/content-wraper'
import { useInfiniteList } from '#/components/hooks/use-infinite-list'
import { UserList } from '#/components/user-list'
import type {
  UserListPaginatedViewProps,
  UsersListResponse,
} from '#/types/user'
import UsersSkeleton from './skeletons/users-skeleton'

export function UserListPaginatedView({
  queryKey,
  queryFn,
  enabled = true,
  title,
  emptyError,
  className = 'max-w-3xl',
}: UserListPaginatedViewProps) {
  const { data, isPending, isError, isFetchingNextPage, loadMoreRef } =
    useInfiniteList<UsersListResponse>({
      queryKey,
      queryFn,
      enabled,
    })

  if (isPending) {
    return (
      <ContentWrapper className={className}>
        <BackButton title={title} />
        <UsersSkeleton length={10} />
      </ContentWrapper>
    )
  }
  if (isError) {
    return (
      <ContentWrapper className={className}>
        <BackButton title={title} />
        <div className="text-center">Could not load {title} page</div>
      </ContentWrapper>
    )
  }
  const users = data.pages.flatMap((page) => page.users)

  return (
    <ContentWrapper className={className}>
      <BackButton title={title} />
      <UserList
        users={users}
        loadMoreRef={loadMoreRef}
        isFetchingNextPage={isFetchingNextPage}
        error={emptyError}
      />
    </ContentWrapper>
  )
}
