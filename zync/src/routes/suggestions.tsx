import ProtectedRoute from '#/components/protected-route'
import { UserListPaginatedView } from '#/components/user-list-paginated-view'
import { getWhoToFollow } from '#/lib/api/users'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/suggestions')({
  head: () => ({
    meta: [
      { title: 'Who to follow | Zync' },
      { name: 'description', content: 'Suggested users to follow' },
    ],
  }),
  component: () => {
    return (
      <ProtectedRoute>
        <UserListPaginatedView
          queryKey={['who-to-follow']}
          queryFn={(page) => getWhoToFollow(page)}
          title="Who to follow"
          emptyError="No users to follow available"
        />
      </ProtectedRoute>
    )
  },
})
