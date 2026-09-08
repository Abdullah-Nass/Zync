import { useEffect } from 'react'
import { getMe } from '@/lib/api/auth'
import { $user, setUser, clearUser, $authLoading } from '#/lib/auth'

export default function AuthInitializer() {
  useEffect(() => {
    if ($user.get()) {
      $authLoading.set(false)
      return
    }

    getMe()
      .then(({ safeUser }) => {
        setUser(safeUser)
      })
      .catch(() => {
        clearUser()
      })
  }, [])

  return null
}
