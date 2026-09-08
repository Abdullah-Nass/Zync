// src/hooks/useSlide.ts
import { useEffect, useRef } from 'react'

interface SlideOptions {
  from?: string
  to?: string
}

export function useSlide({
  from = '-translate-y-20 opacity-0',
  to = 'translate-y-0 opacity-100',
}: SlideOptions = {}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const fromClasses = from.split(' ').filter(Boolean)
    const toClasses = to.split(' ').filter(Boolean)

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove(...fromClasses)
          entry.target.classList.add(...toClasses)
          observer.unobserve(entry.target)
        }
      })
    })

    observer.observe(el)
    return () => observer.unobserve(el)
  }, [from, to])

  return ref
}
