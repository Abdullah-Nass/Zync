import { CameraIcon, ThumbsUp } from 'lucide-react'
import type { EmptyPostsProps } from '#/types/posts'

export function EmptyPosts({ title = 'No posts yet', tab }: EmptyPostsProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] p-8 text-center">
      <div className="flex items-center justify-center mb-4 rounded-full ">
        {tab === 'posts' ? (
          <CameraIcon size={80} strokeWidth={1.2} />
        ) : (
          <ThumbsUp size={80} strokeWidth={1.2} />
        )}
      </div>

      <h3 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h3>
    </div>
  )
}
