import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import type { ProfileSearch } from '#/types/posts'
import ProfileLayout from '#/components/profile/profile-layout'
import ProtectedRoute from '#/components/protected-route'

const profileRouteApi = getRouteApi('/profile/$username/')

export const Route = createFileRoute('/profile/$username/')({
  validateSearch: (search: Record<string, unknown>): ProfileSearch => {
    return {
      tab: search.tab === 'liked' ? 'liked' : 'posts',
    }
  },
  head: ({ params }) => ({
    meta: [
      { title: `${params.username} profile | Zync` },
      { name: 'description', content: `${params.username} profile` },
    ],
  }),
  component: () => {
    const { username } = profileRouteApi.useParams()
    const { tab = 'posts' } = profileRouteApi.useSearch()
    return (
      <ProtectedRoute>
        <ProfileLayout username={username} tab={tab} />
      </ProtectedRoute>
    )
  },
})
