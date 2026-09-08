import { api } from '../api'
import type { PostsListResponse, PostsResponse } from '#/types/posts'

export async function getFeed(page = 1): Promise<PostsListResponse> {
  const response = await api.get<any>(`/feed?page=${page}`)

  return {
    ...response,
    posts: response.posts.map((post: PostsResponse) => ({
      ...post,
      like_count: Number(post.like_count),
    })),
  }
}

export async function createPost(content: string): Promise<PostsResponse> {
  return api.post('/posts', { content })
}

export async function deletePost(id: string): Promise<{ message: string }> {
  return api.delete(`/posts/${id}`)
}

export async function getPost(id: string): Promise<PostsResponse> {
  return api.get(`/posts/${id}`)
}

export async function getUserPosts(
  username: string,
  page = 1,
): Promise<PostsListResponse> {
  const response = await api.get<any>(`/posts/user/${username}?page=${page}`)

  return {
    ...response,
    posts: response.posts.map((post: PostsResponse) => ({
      ...post,
      like_count: Number(post.like_count),
    })),
  }
}
export async function getLikedPosts(
  username: string,
  page = 1,
): Promise<PostsListResponse> {
  const response = await api.get<any>(`/posts/liked/${username}?page=${page}`)
  return {
    ...response,
    posts: response.posts.map((post: PostsResponse) => ({
      ...post,
      like_count: Number(post.like_count),
    })),
  }
}

export async function likePost(id: string): Promise<{ message: string }> {
  return api.post(`/posts/${id}/like`, {})
}

export async function unlikePost(id: string): Promise<{ message: string }> {
  return api.delete(`/posts/${id}/like`)
}
