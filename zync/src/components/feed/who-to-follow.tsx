import { getWhoToFollow } from '#/lib/api/users'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import User from '../user'
import { useInfiniteList } from '../hooks/use-infinite-list'
import type { UsersListResponse } from '#/types/user'
import { Link } from '@tanstack/react-router'
import UsersSkeleton from '../skeletons/users-skeleton'
import { cn } from '#/lib/utils'

export default function WhoToFollowSide({
  showOnMoile = false,
}: {
  showOnMoile?: boolean
}) {
  const { data, isPending, isError } = useInfiniteList<UsersListResponse>({
    queryKey: ['who-follow'],
    queryFn: (page) => getWhoToFollow(page, 6),
  })

  const users = data?.pages.flatMap((page) => page.users) ?? []
  return (
    <Card
      className={cn(
        'w-full max-w-sm hidden lg:flex',
        showOnMoile && 'flex lg:hidden',
      )}
    >
      <CardHeader>
        <CardTitle className="text-lg font-bold">Who to follow</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isPending ? (
          <UsersSkeleton length={5} />
        ) : isError || users.length < 1 ? (
          <div className="text-md text-red-500">No users to suggest</div>
        ) : (
          <>
            <div className="divide-y">
              {users.slice(0, 5).map((user) => (
                <User AvatarSize="sm" key={user.username} user={user} />
              ))}
            </div>
            {users.length > 5 && (
              <Button
                variant="ghost"
                className="text-primary/90 hover:text-primary"
                asChild
              >
                <Link to="/suggestions">Show more</Link>
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
