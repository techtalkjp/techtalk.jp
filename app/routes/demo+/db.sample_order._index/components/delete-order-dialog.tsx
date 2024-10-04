import { Form, Link } from 'react-router'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from '~/components/ui'
import type { SampleOrder } from '../schema'

export function DeleteOrderDialog({ order }: { order: SampleOrder }) {
  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {order.name}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this record?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Form method="POST">
            <input type="hidden" name="id" value={order.id} />
            <Button
              className="w-full"
              type="submit"
              name="intent"
              value="del"
              variant="destructive"
            >
              Delete
            </Button>
          </Form>
          <Button type="button" variant="ghost" asChild>
            <Link to="?tab=list" preventScrollReset>
              Cancel
            </Link>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
