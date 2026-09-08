import { cn } from '@/lib/utils'

export function PostSkeleton() {
  return (
    <article
      className={cn(
        'w-full p-4 bg-card border rounded-xl shadow-sm space-y-4 animate-pulse',
      )}
    >
      <div className="flex items-center gap-3 w-fit">
        <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-28 rounded-sm bg-muted" />
          <div className="h-2.5 w-16 rounded-sm bg-muted/70" />
        </div>
      </div>

      <div className="space-y-2 px-2">
        <div className="h-3.5 w-full rounded-sm bg-muted" />
        <div className="h-3.5 w-[92%] rounded-sm bg-muted" />
        <div className="h-3.5 w-[65%] rounded-sm bg-muted/80" />
      </div>

      <div className="pt-2 border-t flex items-center">
        <div className="flex items-center gap-2 h-9 px-3">
          <div className="w-5 h-5 rounded-full bg-muted shrink-0" />
          <div className="h-3 w-14 rounded-sm bg-muted/70" />
        </div>
      </div>
    </article>
  )
}

export function PostListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="w-full space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  )
}
