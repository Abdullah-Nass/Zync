import { createFileRoute } from '@tanstack/react-router'

import FeedLayout from '#/components/feed/feed-layout'
import ProtectedRoute from '#/components/protected-route'

export const Route = createFileRoute('/feed')({
  head: () => ({
    meta: [
      { title: 'Feed | Zync' },

      { name: 'description', content: 'Feed page of Zync' },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <FeedLayout />
    </ProtectedRoute>
  ),
})
