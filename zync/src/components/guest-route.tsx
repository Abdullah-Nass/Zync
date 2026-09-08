import { $authLoading, $user } from '#/lib/auth'
import { useStore } from '@nanostores/react'
import { Navigate } from '@tanstack/react-router'

export default function GuestRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const user = useStore($user)
  const loading = useStore($authLoading)

  if (loading) return null
  if (user) return <Navigate to="/feed" />

  return <>{children}</>
}
