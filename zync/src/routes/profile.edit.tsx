import { createFileRoute } from '@tanstack/react-router'
import EditLayout from '#/components/edit/edit-layout'
import ProtectedRoute from '#/components/protected-route'

export const Route = createFileRoute('/profile/edit')({
  head: () => ({
    meta: [
      { title: 'Edit profile | Zync' },
      { name: 'description', content: 'Edit profile info' },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <EditLayout />
    </ProtectedRoute>
  ),
})
