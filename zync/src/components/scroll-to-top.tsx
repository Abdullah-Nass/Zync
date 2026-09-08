import * as React from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface ScrollToTopProps {
  threshold?: number
  className?: string
}

export function ScrollToTop({ threshold = 300, className }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      aria-label="Scroll to top"
      onClick={scrollToTop}
      className={cn(
        'lg:hidden fixed bottom-6 left-6 z-50 rounded-full shadow-md transition-all duration-300',
        isVisible
          ? 'opacity-100 scale-100 pointer-events-auto'
          : 'opacity-0 scale-75 pointer-events-none',
        className,
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}
