import { useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from './ui/button'

export function BackButton({ title }: { title?: string }) {
  const router = useRouter()

  const handleBack = () => {
    const canGoBack =
      typeof window !== 'undefined' &&
      (window.history.state?.idx > 0 ||
        (window.history.state?.key !== undefined && window.history.length > 2))

    if (canGoBack) {
      router.history.back()
    } else {
      router.navigate({ to: '/feed' as any })
    }
  }

  return (
    <div className="relative flex items-center justify-center py-2 border">
      <Button
        type="button"
        variant="ghost"
        onClick={handleBack}
        className="absolute left-0 flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </Button>
      <span className="font-semibold text-lg">{title}</span>
    </div>
  )
}
