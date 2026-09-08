import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import ContentWrapper from '#/components/content-wraper'
import { UserX, ArrowLeft } from 'lucide-react'
import type { UserNotFoundProps } from '#/types/user'

export function UserNotFound({ username }: UserNotFoundProps) {
  return (
    <ContentWrapper>
      <div className="flex flex-col items-center justify-center min-h-[460px] py-16 px-4 text-center">
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute h-24 w-24 rounded-full bg-muted/60 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center ">
            <UserX className="h-10 w-10 text-muted-foreground/80 stroke-[1.75]" />
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Account doesn&apos;t exist
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed">
          We couldn&apos;t find an account for
          <span className="font-semibold text-foreground">@{username}</span>.
          The handle might have been changed, deleted, or mistyped.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" asChild className="gap-2">
            <Link to="/feed">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </ContentWrapper>
  )
}
