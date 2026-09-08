import type { LoginProps, RegisterProps } from '#/types/auth'
import type { UserResponse } from '#/types/user'
import { api } from '../api'

export type AuthResponse = {
  safeUser: UserResponse
}
export async function register({
  name,
  username,
  email,
  password,
}: RegisterProps): Promise<AuthResponse> {
  return api.post('/auth/register', {
    name,
    username,
    email,
    password,
  })
}

export async function login({
  email,
  password,
}: LoginProps): Promise<AuthResponse> {
  return api.post('/auth/login', {
    email,
    password,
  })
}

export async function logout(): Promise<{ message: string }> {
  return api.post('/auth/logout', {})
}

export async function getMe(): Promise<AuthResponse> {
  return api.get('/auth/me')
}
