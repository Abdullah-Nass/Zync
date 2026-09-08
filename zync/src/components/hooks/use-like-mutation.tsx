import { likePost, unlikePost } from '#/lib/api/posts'
import type { PostsListResponse, PostsResponse } from '#/types/posts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { InfiniteData } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export function useLikeMutation(post: PostsResponse) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      post.liked_by_me ? unlikePost(post.id) : likePost(post.id),

    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ['feed'] }),
        queryClient.cancelQueries({ queryKey: ['posts'] }),
        queryClient.cancelQueries({ queryKey: ['liked'] }),
      ])

      const previousFeed = queryClient.getQueryData<
        InfiniteData<PostsListResponse>
      >(['feed'])
      const previousPosts = queryClient.getQueriesData<
        InfiniteData<PostsListResponse>
      >({
        queryKey: ['posts'],
      })
      const previousLiked = queryClient.getQueriesData<
        InfiniteData<PostsListResponse>
      >({
        queryKey: ['liked'],
      })

      const isLiking = !post.liked_by_me

      const updatePostInCache = (
        oldData: InfiniteData<PostsListResponse> | undefined,
      ) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((p) => {
              if (p.id === post.id) {
                return {
                  ...p,
                  liked_by_me: isLiking,
                  like_count: isLiking
                    ? p.like_count + 1
                    : Math.max(0, p.like_count - 1),
                }
              }
              return p
            }),
          })),
        }
      }

      queryClient.setQueriesData<InfiniteData<PostsListResponse>>(
        { queryKey: ['feed'] },
        updatePostInCache,
      )
      queryClient.setQueriesData<InfiniteData<PostsListResponse>>(
        { queryKey: ['posts'] },
        updatePostInCache,
      )
      queryClient.setQueriesData<InfiniteData<PostsListResponse>>(
        { queryKey: ['liked'] },
        updatePostInCache,
      )

      return { previousFeed, previousPosts, previousLiked }
    },

    onError: (_err, _vars, context) => {
      toast.error('Failed to update like')
      if (!context) return
      if (context.previousFeed) {
        queryClient.setQueryData(['feed'], context.previousFeed)
      }
      context.previousPosts.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
      context.previousLiked.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
    },
  })
}
