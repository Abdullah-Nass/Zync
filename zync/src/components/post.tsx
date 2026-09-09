import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, formatTimeAgo } from '@/lib/utils'
import type { PostsResponse } from '#/types/posts'
import { Link } from '@tanstack/react-router'
import { useLikeMutation } from './hooks/use-like-mutation'
import UserAvatar from './user-avatar'
import DeletePost from './delete-post'
import { useStore } from '@nanostores/react'
import { $user } from '#/lib/auth'

export default function Post({ post }: { post: PostsResponse }) {
  const likeMutation = useLikeMutation(post)
  const user = useStore($user)
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (likeMutation.isPending) return
    likeMutation.mutate()
  }
  return (
    <article className="w-full p-4 bg-card text-card-foreground border rounded-xl shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <Link
          to="/profile/$username"
          params={{ username: post.username }}
          search={{ tab: 'posts' }}
          className="flex items-center gap-3 w-fit"
        >
          <UserAvatar url={post.avatar_url} username={post.name} />
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{post.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(post.created_at)}
            </span>
          </div>
        </Link>

        {user?.username === post.username && (
          <DeletePost id={post.id} username={post.username} />
        )}
      </div>

      <p
        dir="auto"

        className="px-2 text-sm leading-relaxed whitespace-pre-wrap"
      >
        {post.content}
      </p>

      <div className="pt-2 border-t flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={cn(
            'gap-2 text-muted-foreground hover:text-foreground transition-colors select-none',
            post.liked_by_me &&
              'text-red-500 hover:text-red-600 hover:bg-red-500/10 dark:hover:bg-red-500/20',
          )}
        >
          <Heart
            className={cn(
              'w-5 h-5 transition-transform active:scale-75 duration-150',
              post.liked_by_me && 'fill-current',
            )}
          />
          <span className="font-medium">
            {post.like_count} {post.like_count === 1 ? 'Like' : 'Likes'}
          </span>
        </Button>
      </div>
    </article>
  )
}
