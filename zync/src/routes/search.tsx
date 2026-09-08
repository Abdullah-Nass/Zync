import ProtectedRoute from '#/components/protected-route'
import { UserListPaginatedView } from '#/components/user-list-paginated-view'
import { searchUsers } from '#/lib/api/users'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'

const searchRouteApi = getRouteApi('/search')

export const Route = createFileRoute('/search')({
  head: () => ({
    meta: [
      { title: 'Search | Zync' },
      { name: 'description', content: 'Search for users to follow' },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === 'string' ? search.q : '',
  }),
  component: () => {
    const { q } = searchRouteApi.useSearch()
    return (
      <ProtectedRoute>
        <UserListPaginatedView
          queryKey={['users-search-full', q]}
          queryFn={(page) => searchUsers(q, page)}
          title="Search results"
          emptyError="No users found"
        />
      </ProtectedRoute>
    )
  },
})
