import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createPost } from '#/lib/api/posts'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useStore } from '@nanostores/react'
import { $user } from '#/lib/auth'
import { Card } from '../ui/card'
import { useForm } from '@tanstack/react-form'
import { Field } from '@/components/ui/field'

import toast from 'react-hot-toast'
import UserAvatar from '../user-avatar'

export default function CreatePost() {
  const [open, setOpen] = useState(false)
  const user = useStore($user)
  const queryClient = useQueryClient()
  const createPostMutation = useMutation({
    mutationFn: async (content: string) => {
      await createPost(content.trim())
    },
    onSuccess: async () => {
      setOpen(false)
      await queryClient.invalidateQueries({
        queryKey: ['feed'],
      })
      form.reset()
      toast.success('Post created!')
    },
    onError: () => {
      toast.error('Failed to create post')
    },
  })
  const form = useForm({
    defaultValues: {
      content: '',
    },

    onSubmit: ({ value }) => {
      createPostMutation.mutate(value.content)
    },
  })
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) form.reset()
  }
  const handleClose = () => {
    setOpen(false)
    form.reset()
  }
  if (!user) return
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Card className="flex flex-row items-center p-4">
        <UserAvatar
          url={user.avatar_url}
          username={user.name}
          className="size-15"
        />
        <DialogTrigger asChild>
          <button
            type="button"
            className="ml-3 flex-1 cursor-pointer rounded-full border border-dashed bg-gray-100 px-3 py-1.5 text-left hover:bg-gray-200"
          >
            Create Post
          </button>
        </DialogTrigger>
      </Card>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
          <DialogDescription>
            Share something with your followers.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4 "
        >
          <form.Field
            name="content"
            validators={{
              onChange: ({ value }) => {
                if (!value || !value.trim()) return 'Content is required!'
                if (value.length > 500) {
                  return 'Content cannot exceed 500 characters'
                }
                return undefined
              },
            }}
          >
            {(field) => {
              const hasError =
                field.state.meta.isTouched && field.state.meta.errors.length > 0
              return (
                <Field data-invalid={hasError}>
                  <Textarea
                    dir="auto"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                    }}

                    placeholder="What's on your mind?"
                    className="min-h-32 max-h-40 resize-none overflow-y-auto whitespace-pre-wrap break-all text-gray-700"
                  />
                  <div className="flex justify-between items-center text-xs">
                    <span>{hasError && field.state.meta.errors[0]}</span>
                    <span className="text-muted-foreground">
                      {field.state.value.length}/500
                    </span>
                  </div>
                </Field>
              )
            }}
          </form.Field>

          <DialogFooter>
            <div className="flex gap-3 flex-col md:flex-row">
              <Button
                type="submit"
                className="md:w-22"
                disabled={createPostMutation.isPending}
              >
                {createPostMutation.isPending ? 'Posting...' : 'Post'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createPostMutation.isPending}
                className="md:w-22"
              >
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
