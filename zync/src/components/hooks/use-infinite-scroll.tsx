// hooks/use-infinite-scroll.ts
import { useEffect, useRef } from 'react'

type UseInfiniteScrollOptions = {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  rootMargin?: string
}

export function useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  rootMargin = '200px',
}: UseInfiniteScrollOptions) {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = loadMoreRef.current

    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        rootMargin,
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, rootMargin])

  return loadMoreRef
}
