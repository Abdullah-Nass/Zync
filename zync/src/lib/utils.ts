import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(dateString: string): string {
  const now = new Date()
  if (!dateString) return ''

  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    console.warn('Invalid date:', dateString)
    return ''
  }

  // Get the difference in seconds
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 10) {
    return 'Just now'
  }

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h` // e.g., 2h
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 365) {
    return `${diffInDays}d` // e.g., 3d
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears}y` // e.g., 1y
}

export function fallbackAvatar(username: string): string {
  return username.slice(0, 2).toUpperCase()
}
