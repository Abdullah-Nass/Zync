import { $authLoading, $user } from '#/lib/auth'
import { useStore } from '@nanostores/react'
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const user = useStore($user)
  const loading = useStore($authLoading)

  if (loading) return null
  if (!user) return <Navigate to="/login" />
  return <Navigate to="/feed" />
}
