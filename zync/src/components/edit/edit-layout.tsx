import { useNavigate } from '@tanstack/react-router'
import { useStore } from '@nanostores/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import toast from 'react-hot-toast'

import { $user, setUser } from '#/lib/auth'
import { editUser } from '#/lib/api/users'
import { uploadImage } from '#/lib/cloudinary'

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Textarea } from '#/components/ui/textarea'
import ContentWrapper from '../content-wraper'
import { BackButton } from '../back-button'
import Sticky from '../stick'
import UserAvatar from '../user-avatar'

export default function EditLayout() {
  const user = useStore($user)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  if (!user) return
  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onError: () => {
      toast.error('Failed to upload image')
    },
  })
  const initialValues = {
    name: user.name,
    username: user.username,
    bio: user.bio ?? '',
    avatar_url: user.avatar_url ?? '',
  }

  const editUserMutation = useMutation({
    mutationFn: async (values: {
      name: string
      username: string
      bio?: string
      avatar_url?: string
    }) => {
      return await editUser(values)
    },
    onSuccess: async (updated) => {
      setUser(updated)
      await queryClient.invalidateQueries({
        queryKey: ['user', updated.username],
      })
      await queryClient.invalidateQueries({
        queryKey: ['feed'],
      })
      navigate({
        to: '/profile/$username',
        params: { username: updated.username },
      })
      toast.success('Profile updated!')
    },
  })

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: ({ value }) => {
      editUserMutation.mutate(value)
    },
  })

  return (
    <ContentWrapper className="max-w-3xl">
      <Sticky>
        <BackButton title="Edit Profile" />
      </Sticky>

      <form
        className="py-6"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <FieldGroup>
          <form.Field
            name="name"
            validators={{
              onBlur: ({ value }) =>
                !value.trim() ? 'Name is required' : undefined,
            }}
          >
            {(field) => {
              const hasError =
                field.state.meta.isTouched && field.state.meta.errors.length > 0
              return (
                <Field data-invalid={hasError}>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Your name"
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
                field.state.meta.isTouched && field.state.meta.errors.length > 0
              return (
                <Field data-invalid={hasError}>
                  <FieldLabel>Username</FieldLabel>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="username"
                  />
                  {hasError && (
                    <FieldError>{field.state.meta.errors[0]}</FieldError>
                  )}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name="bio">
            {(field) => (
              <Field>
                <FieldLabel>Bio</FieldLabel>
                <Textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Tell people about yourself"
                  className="resize-none"
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="avatar_url">
            {(field) => (
              <Field>
                <FieldLabel>Avatar</FieldLabel>
                <div className="flex items-center gap-4">
                  <UserAvatar
                    username={user.name}
                    url={field.state.value}
                    className="size-16 shrink-0"
                  />

                  <div className="flex flex-col gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      disabled={
                        uploadMutation.isPending || editUserMutation.isPending
                      }
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        uploadMutation.mutate(file, {
                          onSuccess: (url) => {
                            field.handleChange(url)
                          },
                        })
                      }}
                    />
                    {uploadMutation.isPending && (
                      <span className="text-xs text-muted-foreground">
                        Uploading...
                      </span>
                    )}
                  </div>
                </div>
              </Field>
            )}
          </form.Field>

          {editUserMutation.isError && (
            <FieldError>
              {editUserMutation.error instanceof Error
                ? editUserMutation.error.message
                : 'Something went wrong'}
            </FieldError>
          )}

          <form.Subscribe
            selector={(state) => ({
              values: state.values,
              isSubmitting: state.isSubmitting,
              canSubmit: state.canSubmit,
            })}
          >
            {({ values, isSubmitting, canSubmit }) => {
              const isPending = isSubmitting || editUserMutation.isPending

              const hasChanges =
                values.name !== initialValues.name ||
                values.username !== initialValues.username ||
                values.bio !== initialValues.bio ||
                values.avatar_url !== initialValues.avatar_url

              return (
                <div className="flex items-center gap-3 pt-4">
                  <Button
                    type="submit"

                    disabled={isPending || !canSubmit || !hasChanges}
                  >
                    {isPending ? 'Saving...' : 'Save Changes'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() =>
                      navigate({
                        to: '/profile/$username',
                        params: { username: user.username },
                      })
                    }
                  >
                    Cancel
                  </Button>
                </div>
              )
            }}
          </form.Subscribe>
        </FieldGroup>
      </form>
    </ContentWrapper>
  )
}
