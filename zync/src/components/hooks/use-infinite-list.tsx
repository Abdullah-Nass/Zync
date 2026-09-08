import { useInfiniteQuery } from '@tanstack/react-query'
import { useInfiniteScroll } from './use-infinite-scroll'
import type { PaginatedResponse, UseInfiniteListOptions } from '#/types/posts'

export function useInfiniteList<TPage extends PaginatedResponse>({
  queryKey,
  queryFn,
  rootMargin = '200px',
  enabled = true,
}: UseInfiniteListOptions<TPage>) {
  const query = useInfiniteQuery({
    queryKey,
    initialPageParam: 1,

    queryFn: ({ pageParam }) => queryFn(pageParam),

    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) {
        return undefined
      }

      return lastPage.page + 1
    },
    enabled,
  })

  const loadMoreRef = useInfiniteScroll({
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    rootMargin,
  })

  return {
    ...query,
    loadMoreRef,
  }
}
