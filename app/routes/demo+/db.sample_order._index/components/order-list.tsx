import { EllipsisVerticalIcon } from 'lucide-react'
import { Link } from 'react-router'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HStack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui'
import type { SampleOrder } from '../schema'

export function OrderList({ sampleOrders }: { sampleOrders: SampleOrder[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Created At</TableHead>
          <TableHead>Region</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Country</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {sampleOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="whitespace-nowrap">
              {order.createdAt}
            </TableCell>
            <TableCell>{order.region}</TableCell>
            <TableCell>{order.name}</TableCell>
            <TableCell>{order.country}</TableCell>
            <TableCell>
              <HStack>
                <Button size="xs" variant="link" asChild>
                  <Link to={`${order.id}`}>Details</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" type="button" size="xs">
                      <EllipsisVerticalIcon size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link
                        className="text-destructive"
                        to={`?tab=list&del=${order.id}`}
                        preventScrollReset
                      >
                        Delete
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </HStack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
