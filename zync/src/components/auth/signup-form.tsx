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
import { Link, useNavigate } from '@tanstack/react-router'
import { register } from '#/lib/api/auth'
import { setUser } from '#/lib/auth'
import type { RegisterProps } from '#/types/auth'
import { useState } from 'react'
import { useSlide } from '../hooks/use-slide'
import type { FormField } from './login-form'

export function SignupForm({ className }: React.ComponentProps<'div'>) {
  const [serverError, setServerError] = useState<string | null>(null)
  const navigate = useNavigate()
  const slideBoxRef = useSlide()
  const form = useForm({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    } satisfies RegisterProps,

    onSubmit: async ({ value }) => {
      try {
        setServerError(null)
        const data = await register(value)
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
        'flex flex-col gap-5 min-h-screen items-center justify-center p-5',
        className,
      )}
    >
      <Card
        className="w-full max-w-md transform -translate-y-20 opacity-0 transition-all duration-700 ease-out"
        ref={slideBoxRef}
      >
        <CardHeader className="text-center">
          <h1 className="text-primary font-bold text-4xl mb-3 select-none">
            Zync
          </h1>
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
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
                name="name"
                validators={{
                  onBlur: ({ value }) => {
                    if (!value.trim()) return 'name is required'
                    if (value.length < 3)
                      return 'name must be at least 3 characters'
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
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Abdullah Naser"
                        value={field.state.value}
                        onChange={(e) => {
                          handleChange(e, field)
                        }}
                        onBlur={field.handleBlur}
                      />
                      {hasError && (
                        <FieldError>{field.state.meta.errors[0]}</FieldError>
                      )}
                    </Field>
                  )
                }}
              </form.Field>
              <form.Field
                name="username"
                validators={{
                  onBlur: ({ value }) => {
                    if (!value.trim()) return 'Username is required'
                    if (value.length < 3)
                      return 'Username must be at least 3 characters'
                    if (!/^[a-zA-Z0-9_]+$/.test(value))
                      return 'Only letters, numbers and underscores'
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
                      <FieldLabel htmlFor="username">Username</FieldLabel>
                      <Input
                        id="username"
                        type="text"
                        placeholder="abdullah_naser"
                        value={field.state.value}
                        onChange={(e) => {
                          handleChange(e, field)
                        }}
                        onBlur={field.handleBlur}
                      />
                      {hasError && (
                        <FieldError>{field.state.meta.errors[0]}</FieldError>
                      )}
                    </Field>
                  )
                }}
              </form.Field>
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
                        placeholder="abdula.naser04@gmail.com"
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
                        autoComplete="new-password"
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
                      {isSubmitting ? 'Creating account...' : 'Create Account'}
                    </Button>

                    <FieldDescription className="text-center">
                      Already have an account?
                      <Link
                        to="/login"
                        className="text-primary text-xs !no-underline hover:!underline"
                      >
                        Login
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
