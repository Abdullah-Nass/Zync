import type { UserResponse } from '#/types/user'
import { atom } from 'nanostores'

export const $user = atom<UserResponse | null>(null)
export const $authLoading = atom(true)

export function setUser(user: UserResponse) {
  $user.set(user)
  $authLoading.set(false)
}

export function clearUser() {
  $user.set(null)
  $authLoading.set(false)
}
