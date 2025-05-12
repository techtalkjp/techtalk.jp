import { getInputProps, useField, type FieldName } from '@conform-to/react'
import { DragHandleDots2Icon } from '@radix-ui/react-icons'
import type React from 'react'
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui'
import { cn } from '~/libs/utils'
import { ZipInput } from '~/routes/demo+/resources.zip-input/route'
import type { FormSchema, MemberSchema } from '../schema'
import { SortableItem } from './sortable-item'

interface MemberProps extends React.ComponentProps<'div'> {
  formId: string
  name: FieldName<MemberSchema, FormSchema>
  removeButton: React.ReactNode
}
export const MemberListItem = ({
  formId,
  name,
  removeButton,
  className,
}: MemberProps) => {
  const [meta, form] = useField(name, { formId })
  const fields = meta.getFieldset()

  return (
    <SortableItem
      id={meta.id}
      className={cn('col-span-full grid grid-cols-subgrid', className)}
    >
      {({ attributes, listeners }) => (
        <>
          <DragHandleDots2Icon
            {...attributes}
            {...listeners}
            className="text-muted-foreground cursor-grab self-center rounded-md"
          />
          <div>
            <Input
              {...getInputProps(fields.name, {
                type: 'text',
              })}
            />
            <div id={fields.name.errorId} className="text-destructive text-xs">
              {fields.name.errors}
            </div>
          </div>
          <div>
            <Select
              name={fields.gender.name}
              defaultValue={fields.gender.initialValue}
              onValueChange={(value) => {
                form.update({
                  name: fields.gender.name,
                  value,
                })
              }}
            >
              <SelectTrigger id={fields.gender.id}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">男性</SelectItem>
                <SelectItem value="female">女性</SelectItem>
                <SelectItem value="non-binary">その他</SelectItem>
              </SelectContent>
            </Select>
            <div
              id={fields.gender.errorId}
              className="text-destructive text-xs"
            >
              {fields.gender.errors}
            </div>
          </div>
          <div>
            <input
              {...getInputProps(fields.zip, {
                type: 'hidden',
              })}
            />
            <ZipInput
              defaultValue={fields.zip.value}
              onChange={(value) => {
                form.update({
                  name: fields.zip.name,
                  value,
                })
              }}
            />
            <div id={fields.zip.errorId} className="text-destructive text-xs">
              {fields.zip.errors}
            </div>
          </div>
          <div>
            <Input
              {...getInputProps(fields.tel, {
                type: 'text',
              })}
            />
            <div id={fields.tel.errorId} className="text-destructive text-xs">
              {fields.tel.errors}
            </div>
          </div>
          <div>
            <Input
              {...getInputProps(fields.email, {
                type: 'text',
              })}
            />
            <div id={fields.email.errorId} className="text-destructive text-xs">
              {fields.email.errors}
            </div>
          </div>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>{removeButton}</TooltipTrigger>
              <TooltipContent>Remove a member</TooltipContent>
            </Tooltip>
          </div>
        </>
      )}
    </SortableItem>
  )
}
