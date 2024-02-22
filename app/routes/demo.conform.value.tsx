import { getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form } from '@remix-run/react'
import { z } from 'zod'
import { Button, HStack, Input, Label } from '~/components/ui'

const schema = z.object({
  zip1: z.string().max(3),
  zip2: z.string().max(4),
  prefecture: z.string(),
  city: z.string(),
  suburb: z.string(),
  street: z.string(),
})

export default function ConformValueDemoPage() {
  const [form, { zip1, zip2, prefecture, city, suburb, street }] = useForm({
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  return (
    <div>
      <Form method="POST">
        <div>
          <Label htmlFor={zip1.id}>郵便番号</Label>
          <HStack>
            <Input {...getInputProps(zip1, { type: 'tel' })} />
            <div>-</div>
            <Input {...getInputProps(zip2, { type: 'tel' })} />
            <Button type="button" variant="outline" className="whitespace-nowrap" onClick={() => {}}>
              住所検索
            </Button>
          </HStack>
        </div>
      </Form>
    </div>
  )
}
