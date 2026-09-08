import ProtectedRoute from '#/components/protected-route'
import { UserListPaginatedView } from '#/components/user-list-paginated-view'
import { getFollowers } from '#/lib/api/users'

import { createFileRoute, getRouteApi } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/$username/followers')({
  head: ({ params }) => ({
    meta: [
      { title: `${params.username}'s followers | Zync` },
      { name: 'description', content: `Who follows ${params.username}` },
    ],
  }),
  component: () => {
    const routeApi = getRouteApi('/profile/$username/followers')
    const { username } = routeApi.useParams()

    return (
      <ProtectedRoute>
        <UserListPaginatedView
          queryKey={['followers', username]}
          queryFn={(page) => getFollowers(username, page)}
          enabled={!!username}
          title="Followers"
          emptyError="No followers available"
        />
      </ProtectedRoute>
    )
  },
})
