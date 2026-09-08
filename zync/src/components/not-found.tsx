// src/components/not-found.tsx
import { Link } from '@tanstack/react-router'
import ContentWrapper from '#/components/content-wraper'
import { FileQuestion, Home } from 'lucide-react'

export function NotFound() {
  return (
    <ContentWrapper className="flex min-h-[calc(100vh-65px)] max-w-2xl flex-col items-center justify-center text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-primary mb-2">
        <FileQuestion className="h-10 w-10" />
      </div>

      <span className="text-sm font-semibold tracking-wider uppercase text-primary">
        404 Error
      </span>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="text-muted-foreground max-w-md text-sm sm:text-base">
        Sorry, we couldn’t find the page you’re looking for. It might have been
        removed, had its name changed, or is temporarily unavailable.
      </p>

      <div className="mt-4 flex items-center gap-3">
        <Link
          to="/feed"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
        >
          <Home className="h-4 w-4" />
          Back to Feed
        </Link>
      </div>
    </ContentWrapper>
  )
}
