import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import dayjs from 'dayjs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui'
import { ImageEndpointUrl, list } from './services/r2'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const objects = await list()
  return json({ objects, ImageEndpointUrl })
}

export default function ImageUploadDemoPage() {
  const { objects, ImageEndpointUrl } = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>Image Upload Demo</h1>
      <p>Upload an image</p>

      <Table>
        <TableHeader>
          <TableHead>Key</TableHead>
          <TableHead>LastModified</TableHead>
          <TableHead>Size</TableHead>
        </TableHeader>
        <TableBody>
          {objects?.map((object) => (
            <TableRow key={object.Key}>
              <TableCell>
                {object.Key}
                <img
                  src={`${ImageEndpointUrl}${object.Key}`}
                  alt={object.Key}
                />
              </TableCell>
              <TableCell>{dayjs(object.LastModified).format()}</TableCell>
              <TableCell>
                {object.Size?.toLocaleString()}
                <small> bytes</small>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
