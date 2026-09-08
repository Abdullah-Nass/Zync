import { createFileRoute } from '@tanstack/react-router'
import { SignupForm } from '#/components/auth/signup-form'
import GuestRoute from '#/components/guest-route'

export const Route = createFileRoute('/register')({
  head: () => ({
    meta: [
      { title: 'Register | Zync' },
      { name: 'description', content: 'Register to Zync' },
    ],
  }),
  component: () => (
    <GuestRoute>
      <SignupForm />
    </GuestRoute>
  ),
})
