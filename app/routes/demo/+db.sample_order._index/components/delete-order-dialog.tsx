import { Form, href, Link, useNavigation } from 'react-router'
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
  const navigation = useNavigation()
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
              isLoading={
                navigation.formAction?.startsWith(
                  `${href('/demo/db/sample_order')}?index`,
                ) && navigation.formData?.get('intent') === 'del'
              }
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
