import React from 'react'
import SidebarLayout from './navbar/sidebar-layout'
import { cn } from '#/lib/utils'
import { ScrollToTop } from './scroll-to-top'

export default function ContentWrapper({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <>
      <SidebarLayout />

      <div
        className={cn('container mx-auto space-y-5 px-5 md:px-16', className)}
        {...props}
      />

      <ScrollToTop />
    </>
  )
}
