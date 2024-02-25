import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form, useNavigation } from '@remix-run/react'
import { ActionFunctionArgs } from '@vercel/remix'
import { jsonWithError, jsonWithSuccess } from 'remix-toast'
import { setTimeout } from 'timers/promises'
import { z } from 'zod'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Input,
  Label,
} from '~/components/ui'

const schema = z.object({
  email: z.string().email(),
})

export const action = async ({ request }: ActionFunctionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return jsonWithError(submission.reply(), { message: 'Invalid form submission' })
  }

  // Simulate a slow server
  await setTimeout(2000)

  return jsonWithSuccess(submission.reply(), { message: 'Form submitted successfully' })
}

export default function DemoConformAlert() {
  const [form, { email }] = useForm({
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })
  const navigation = useNavigation()

  return (
    <Form method="POST" className="grid grid-cols-1 gap-4" {...getFormProps(form)}>
      <div>
        <Label htmlFor={email.id}>Email</Label>
        <Input {...getInputProps(email, { type: 'email' })} />
        <div className="text-sm text-destructive">{email.errors}</div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            {...form.validate.getButtonProps({
              name: email.name,
            })}
            disabled={navigation.state === 'submitting'}
          >
            {navigation.state === 'submitting' ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alert</AlertDialogTitle>
            <AlertDialogDescription>Are you sure?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit" form={form.id}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  )
}
