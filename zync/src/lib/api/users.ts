import type { UserResponse, UsersListResponse } from '#/types/user'
import { api } from '../api'

export async function getWhoToFollow(
  page = 1,
  limit = 10,
): Promise<UsersListResponse> {
  return api.get<UsersListResponse>('/users/suggestions', {
    params: { page, limit },
  })
}
export async function getFollowers(
  username: string,
  page = 1,
  limit = 20,
): Promise<UsersListResponse> {
  return api.get<UsersListResponse>(`/users/${username}/followers`, {
    params: { page, limit },
  })
}
export async function getFollowing(
  username: string,
  page = 1,
  limit = 20,
): Promise<UsersListResponse> {
  return api.get<UsersListResponse>(`/users/${username}/following`, {
    params: { page, limit },
  })
}

export async function getUser(username: string): Promise<UserResponse> {
  return api.get(`/users/${username}`)
}
export async function followUser(username: string): Promise<UserResponse> {
  return api.post(`/users/${username}/follow`, {})
}
export async function unFollowUser(username: string): Promise<UserResponse> {
  return api.delete(`/users/${username}/follow`)
}

export async function editUser(body: {
  name?: string
  username?: string
  bio?: string
  avatar_url?: string
}): Promise<UserResponse> {
  return api.put(`/users/edit`, body)
}

export async function searchUsers(
  query: string,
  page = 1,
  limit = 10,
): Promise<UsersListResponse> {
  if (!query.trim()) {
    return { users: [], page: 1, hasMore: false }
  }

  return api.get<UsersListResponse>('/users/search', {
    params: { q: query.trim(), page, limit },
  })
}
