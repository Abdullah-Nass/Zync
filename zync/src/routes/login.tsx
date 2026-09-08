import { createFileRoute } from '@tanstack/react-router'
import GuestRoute from '#/components/guest-route'
import LoginLayout from '#/components/auth/login-layout'

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      { title: 'Login | Zync' },
      { name: 'description', content: 'Login to you Zync account' },
    ],
  }),
  component: () => (
    <GuestRoute>
      <LoginLayout />
    </GuestRoute>
  ),
})
