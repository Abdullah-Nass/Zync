import { clearUser } from '#/lib/auth'
import { logout } from '#/lib/api/auth'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/logout')({
  component: Logout,
})

export default function Logout() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    logout().finally(() => {
      clearUser()
      setDone(true)
    })
  }, [])

  if (done) return <Navigate to="/login" />
  return null
}
