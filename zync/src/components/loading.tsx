import { LoaderCircle } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-center justify-center">
        <LoaderCircle
          size={60}
          strokeWidth={0.5}
          className="animate-spin text-primary"
        />
      </div>
    </div>
  )
}
