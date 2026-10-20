import { Eye, EyeOff } from 'lucide-react'
import { Input } from '#/components/ui/input.tsx'
import { cn } from '#/lib/utils.ts'
import { forwardRef, useState } from 'react'

export interface PasswordInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  'type'
> {}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          disabled={disabled}
          className={cn('pr-10', className)}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xs disabled:pointer-events-none disabled:opacity-50 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'
