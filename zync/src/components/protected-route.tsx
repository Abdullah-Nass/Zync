import { $authLoading, $user } from '#/lib/auth'
import { useStore } from '@nanostores/react'
import { Navigate } from '@tanstack/react-router'
import Loading from './loading'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const user = useStore($user)
  const loading = useStore($authLoading)

  if (loading) return <Loading />

  if (!user) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}
