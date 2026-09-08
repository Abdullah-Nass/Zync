import ProtectedRoute from '#/components/protected-route'
import { UserListPaginatedView } from '#/components/user-list-paginated-view'
import { getFollowing } from '#/lib/api/users'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/$username/following')({
  head: ({ params }) => ({
    meta: [
      { title: `${params.username}'s following | Zync` },
      { name: 'description', content: `Who ${params.username} follows` },
    ],
  }),
  component: () => {
    const routeApi = getRouteApi('/profile/$username/following')
    const { username } = routeApi.useParams()

    return (
      <ProtectedRoute>
        <UserListPaginatedView
          queryKey={['following', username]}
          queryFn={(page) => getFollowing(username, page)}
          enabled={!!username}
          title="Following"
          emptyError="No following available"
        />
      </ProtectedRoute>
    )
  },
})
