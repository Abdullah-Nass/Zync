import { cn } from '#/lib/utils'
import { useStore } from '@nanostores/react'
import { Link } from '@tanstack/react-router'
import { User, UserPen, Heart, LogOut, UserPlus } from 'lucide-react'
import { $user } from '#/lib/auth'
import UserAvatar from '../user-avatar'

export default function Sidebar({
  isOpen,
  closeMenu,
}: {
  isOpen: boolean
  closeMenu: () => void
}) {
  const user = useStore($user)

  if (!user) return
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-49 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeMenu}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 start-0 z-50 flex flex-col w-[90%] md:w-[85%] h-screen border-r px-3 py-4 bg-card transform transition-transform duration-300 ease-in-out',
          'lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Link
          to="/profile/$username"
          params={{ username: user.username }}
          search={{ tab: 'posts' }}
          className="border-b-1 py-2 mb-5 active:bg-gray-300"
        >
          <div className="flex items-center gap-3">
            <UserAvatar
              className="w-20 h-20"
              url={user.avatar_url}
              username={user.name}
            />
            <div className="flex flex-col ">
              <span className="text-lg font-semibold active:underline">
                {user.name}
              </span>
              <span className="text-md text-muted-foreground">
                @{user.username}
              </span>
            </div>
          </div>
        </Link>
        <nav className="flex flex-col gap-4 p-4">
          <Link
            to="/profile/$username"
            params={{ username: user.username }}
            search={{ tab: 'posts' }}
            className="flex items-center justify-start gap-3 active:bg-gray-200 p-1 rounded"
          >
            <User size={20} />
            <span className="text-lg">Profile</span>
          </Link>
          <Link
            to="/profile/edit"
            className="flex items-center justify-start gap-3 active:bg-gray-200 p-1 rounded"
          >
            <UserPen size={20} />
            <span className="text-lg">Edit profile</span>
          </Link>
          <Link
            to="/profile/$username"
            params={{ username: user.username }}
            search={{ tab: 'liked' }}
            className="flex items-center justify-start gap-3 active:bg-gray-200 p-1 rounded"
          >
            <Heart size={20} />
            <span className="text-lg">Liked posts</span>
          </Link>
          <Link
            to="/suggestions"
            params={{ username: user.username }}
            search={{ tab: 'liked' }}
            className="flex items-center justify-start gap-3 active:bg-gray-200 p-1 rounded"
          >
            <UserPlus size={20} />
            <span className="text-lg">Who to follow</span>
          </Link>
        </nav>

        <div className="border-t p-5">
          <Link
            to="/logout"
            className="flex items-center justify-start gap-3 text-destructive"
          >
            <LogOut size={20} />
            <span className="text-lg">Logout</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
