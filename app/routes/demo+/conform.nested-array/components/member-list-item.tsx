import { getInputProps, useField, type FieldName } from '@conform-to/react'
import { memo } from 'react'
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

interface MemberProps extends React.ComponentProps<'div'> {
  formId: string
  name: FieldName<MemberSchema, FormSchema>
  removeButton: React.ReactNode
}
export const MemberListItem = memo(
  ({ formId, name, removeButton, className }: MemberProps) => {
    const [meta, form] = useField(name, { formId })
    const fields = meta.getFieldset()

    return (
      <div className={cn('col-span-full grid grid-cols-subgrid', className)}>
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
          <div id={fields.gender.errorId} className="text-destructive text-xs">
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
            <TooltipContent>Remove Item</TooltipContent>
          </Tooltip>
        </div>
      </div>
    )
  },
)
