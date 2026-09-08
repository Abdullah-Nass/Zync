import { cn } from '#/lib/utils.ts'
import { Button } from '#/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card.tsx'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field.tsx'
import { Input } from '#/components/ui/input.tsx'
import { useForm } from '@tanstack/react-form'
import type { LoginProps } from '#/types/auth'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { login } from '#/lib/api/auth'
import { setUser } from '#/lib/auth'
import { useSlide } from '../hooks/use-slide'

export interface FormField {
  handleChange: (value: any) => void
  handleBlur: () => void
  state: {
    meta: {
      errors: any[]
    }
  }
}
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [serverError, setServerError] = useState<string | null>(null)
  const navigate = useNavigate()
  const slideBoxRef = useSlide()
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } satisfies LoginProps,

    onSubmit: async ({ value }) => {
      try {
        setServerError(null)
        const data = await login(value)
        setUser(data.safeUser)
        navigate({ to: '/feed' })
      } catch (err) {
        setServerError(
          err instanceof Error ? err.message : 'Something went wrong',
        )
      }
    },
  })
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: FormField,
  ) => {
    setServerError(null)
    field.handleChange(e.target.value)
    if (field.state.meta.errors.length > 0) {
      field.handleBlur()
    }
  }
  return (
    <div
      className={cn(
        'flex relative min-h-screen items-center justify-center p-5 transform -translate-y-20 opacity-0 transition-all duration-700 ease-out',
        className,
      )}
      {...props}
      ref={slideBoxRef}
    >
      <h1 className="absolute top-5 left-1/2 -translate-x-1/2 text-primary font-bold text-4xl mb-3 select-none lg:hidden">
        Zync
      </h1>
      <Card className="w-full max-w-md ">
        <CardHeader className="text-center">
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field
                name="email"
                validators={{
                  onBlur: ({ value }) => {
                    if (!value) return 'Email is required'
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                      return 'Please enter a valid email address'
                    }
                    return undefined
                  },
                }}
              >
                {(field) => {
                  const hasError =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  return (
                    <Field data-invalid={hasError}>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        id="email"
                        autoComplete="username"
                        name="email"
                        type="email"
                        placeholder="e.g. abdula.naser04@gmail.com"
                        value={field.state.value}
                        onChange={(e) => {
                          handleChange(e, field)
                        }}
                        onBlur={field.handleBlur}
                      />
                      {hasError && (
                        <FieldError className="text-destructive">
                          {field.state.meta.errors[0]}
                        </FieldError>
                      )}
                    </Field>
                  )
                }}
              </form.Field>
              <form.Field
                name="password"
                validators={{
                  onBlur: ({ value }) =>
                    value.length < 8
                      ? 'Must be at least 8 characters long'
                      : undefined,
                }}
              >
                {(field) => {
                  const hasError =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  return (
                    <Field data-invalid={hasError}>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input
                        id="password"
                        autoComplete="current-password"
                        type="password"
                        name="password"
                        value={field.state.value}
                        onChange={(e) => {
                          handleChange(e, field)
                        }}
                        onBlur={field.handleBlur}
                      />
                      {hasError && (
                        <FieldError className="text-destructive">
                          {field.state.meta.errors[0]}
                        </FieldError>
                      )}
                    </Field>
                  )
                }}
              </form.Field>
              {serverError && <FieldError>{serverError}</FieldError>}
              <form.Subscribe
                selector={(state) => ({
                  isSubmitting: state.isSubmitting,
                  canSubmit: state.canSubmit,
                })}
              >
                {({ isSubmitting, canSubmit }) => (
                  <Field>
                    <Button type="submit" disabled={isSubmitting || !canSubmit}>
                      {isSubmitting ? 'Loading...' : 'Login'}
                    </Button>

                    <FieldDescription className="text-center">
                      Don't have an account?
                      <Link
                        to="/register"
                        className="text-primary text-xs !no-underline hover:!underline"
                      >
                        Register
                      </Link>
                    </FieldDescription>
                  </Field>
                )}
              </form.Subscribe>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
