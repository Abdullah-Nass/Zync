export default function UsersSkeleton({ length }: { length: number }) {
  return (
    <div className="p-1 space-y-1">
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-md px-3 py-2 animate-pulse"
        >
          <div className="h-8 w-8 rounded-full bg-muted shrink-0" />

          <div className="flex flex-col gap-1.5 w-full overflow-hidden">
            <div className="h-3.5 w-28 rounded-sm bg-muted" />
            <div className="h-2.5 w-16 rounded-sm bg-muted/70" />
          </div>
        </div>
      ))}
    </div>
  )
}
