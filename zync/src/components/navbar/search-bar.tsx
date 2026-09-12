import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Search, ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Input } from '#/components/ui/input'
import { useDebounce } from '#/components/hooks/use-debounce'
import { searchUsers } from '#/lib/api/users'
import UserAvatar from '../user-avatar'
import UsersSkeleton from '../skeletons/users-skeleton'

const PREVIEW_LIMIT = 5

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const debouncedQuery = useDebounce(query.trim(), 300)

  const { data, isFetching } = useQuery({
    queryKey: ['users-search-preview', debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery, 1, PREVIEW_LIMIT),
    enabled: debouncedQuery.length > 0,
    staleTime: 1000 * 60,
  })

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavigateToFullSearch = () => {
    if (!debouncedQuery) return
    setIsOpen(false)
    navigate({
      to: '/search',
      search: { q: debouncedQuery },
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleNavigateToFullSearch()
    }
  }

  const users = data?.users.slice(0, PREVIEW_LIMIT) ?? []
  const hasResults = users.length > 0

  return (
    <div
      ref={containerRef}
      className="relative w-full min-w-[200px] sm:min-w-[280px]"
    >
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          dir="auto"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Find people..."
          className="h-9 w-full rounded-md bg-muted pl-8 pr-8"
        />
      </div>

      {isOpen && debouncedQuery.length > 0 && (
        <div className="absolute left-0 top-full mt-2 w-full rounded-md border bg-popover text-popover-foreground shadow-lg z-50 overflow-hidden">
          {isFetching && !data ? (
            <UsersSkeleton length={4} />
          ) : hasResults ? (
            <div className="flex flex-col">
              <div className="p-1">
                {users.map((user) => (
                  <Link
                    key={user.id}
                    to="/profile/$username"
                    params={{ username: user.username }}
                    onClick={() => {
                      setIsOpen(false)
                      setQuery('')
                    }}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <UserAvatar url={user.avatar_url} username={user.name} />
                    <div className="flex flex-col overflow-hidden text-left">
                      <span className="font-medium truncate leading-tight">
                        {user.name || user.username}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        @{user.username}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <button
                type="button"
                onClick={handleNavigateToFullSearch}
                className="flex w-full items-center justify-center gap-2 border-t bg-muted/40 px-3 py-2.5 text-xs font-medium text-primary hover:bg-muted transition-colors"
              >
                <span>Show all results for &quot;{debouncedQuery}&quot;</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  )
}
