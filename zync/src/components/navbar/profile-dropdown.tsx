import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, User, LogOut, Heart } from 'lucide-react'
import { useStore } from '@nanostores/react'
import { $user } from '#/lib/auth'
import { Link } from '@tanstack/react-router'
import UserAvatar from '../user-avatar'

export default function ProfileDropdown() {
  const user = useStore($user)
  if (!user) return
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md outline-none hover:opacity-80 transition-opacity">
        <UserAvatar url={user.avatar_url} username={user.name} />
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="cursor-pointer">
          <Link
            to="/profile/$username"
            params={{ username: user.username }}
            search={{ tab: 'posts' }}

            className="flex gap-2 w-full"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Link
            to="/profile/edit"

            className="flex gap-2 w-full"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Edit profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer ">
          <Link
            to="/profile/$username"
            params={{ username: user.username }}
            search={{ tab: 'liked' }}
            className="flex gap-2 w-full"
          >
            <Heart className="mr-2 h-4 w-4" />
            <span>Liked posts</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
          <Link to="/logout" className="flex gap-2 w-full">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
