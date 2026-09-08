import type { UserListProps } from '#/types/user'
import User from './user'

export function UserList({
  error = 'No users to follow',
  users,
  loadMoreRef,
  isFetchingNextPage,
}: UserListProps) {
  return (
    <div className="w-full">
      {users.length > 0 ? (
        <div className="divide-y">
          {users.map((user) => (
            <User key={user.username} user={user} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-muted-foreground">
          {error}
        </div>
      )}

      {loadMoreRef && (
        <div
          ref={loadMoreRef}
          className="flex h-12 items-center justify-center"
        >
          {isFetchingNextPage && (
            <span className="text-xs text-muted-foreground">
              Loading more...
            </span>
          )}
        </div>
      )}
    </div>
  )
}
