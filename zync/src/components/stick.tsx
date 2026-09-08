import { cn } from '#/lib/utils'
import React from 'react'

export default function Sticky({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('sticky top-[65px] bg-base z-40 space-y-3', className)}
      {...props}
    />
  )
}
