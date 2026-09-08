import { Card, CardContent } from '@/components/ui/card'
import { Heart, Plus, UserRoundPen, LogOut } from 'lucide-react'
import { useStore } from '@nanostores/react'
import { $user } from '#/lib/auth'
import { Link } from '@tanstack/react-router'
import UserAvatar from '../user-avatar'

export default function ProfileMenu() {
  const user = useStore($user)
  if (!user) return
  return (
    <div className="hidden lg:flex flex-col gap-4 min-w-[280px]">
      <Card>
        <CardContent className="p-6 flex flex-col items-center text-center">
          <Link
            to="/profile/$username"
            params={{ username: user.username }}
            className="flex flex-col items-center w-full"
          >
            <UserAvatar
              url={user.avatar_url}
              username={user.name}
              className="w-24 h-24 mb-4 ring-2 ring-gray-200 ring-offset-2"
            />
            <h2 className="text-lg font-bold leading-none truncate">
              {user.name}
            </h2>
            <h3 className="text-sm text-muted-foreground truncate mt-1">
              @{user.username}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
            {user.bio ?? (
              <Link
                to="/profile/edit"
                className="flex items-center p-3 mt-4 border border-dashed border-slate-400 h-8 text-xs font-semibold text-slate-600 rounded hover:bg-slate-50 hover:border-slate-500"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add bio
              </Link>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-4 py-2 text-sm font-semibold text-gray-500 space-y-3">
          <Link
            to="/profile/edit"
            className="flex items-center gap-3  hover:bg-gray-100 rounded py-0.5 px-2 cursor-pointer transition-colors"
          >
            <UserRoundPen size={17} />
            Edit profile
          </Link>
          <Link
            to="/profile/$username"
            params={{ username: user.username }}
            search={{ tab: 'liked' }}
            className="flex items-center gap-3 hover:bg-gray-100 rounded py-0.5 px-2 cursor-pointer transition-colors"
          >
            <Heart size={17} />
            Liked posts
          </Link>
          <div className=" mt-4 border-t-1 w-full py-1.5">
            <Link
              to="/logout"
              className="flex items-center gap-3 w-full hover:bg-red-100 rounded hover:text-destructive cursor-pointer transition-colors px-2 py-0.5"
            >
              <LogOut size={17} />
              Logout
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
