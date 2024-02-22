import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { ActionFunction, json } from '@vercel/remix'
import { jsonWithToast } from 'remix-toast'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button, HStack, Input, Label, Stack } from '~/components/ui'

const schema = z.object({
  zip1: z.string().max(3),
  zip2: z.string().max(4),
  prefecture: z.string(),
  city: z.string(),
  suburb: z.string(),
  street: z.string().optional(),
})

const lookupAddress = async (postalCode: string) => {
  const res = await fetch(`https://postcode.teraren.com/postcodes/${postalCode}.json`).catch((e) => null)
  if (!res) return
  if (res.ok) {
    return (await res.json()) as {
      postcode_type: 'area'
      jis: string
      old: string
      new: string
      prefecture_kana: string
      city_kana: string
      suburb_kana: string
      prefecture: string
      city: string
      suburb: string
      street_address: string | null
      office: string | null
      office_kana: string | null
      post_type: string | null
      is_separated_suburb: number
      is_koaza: number
      is_chome: number
      is_include_area: number
      status: number
      reason: number
      created_at: string
      updated_at: string
    }
  }
}

export const action: ActionFunction = async ({ request }) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return json(submission.reply())
  }

  const address = `${submission.value.prefecture}${submission.value.city}${submission.value.suburb}${submission.value.street ?? ''}`

  return jsonWithToast(submission.reply(), {
    message: '登録しました！',
    description: address,
    type: 'success',
  })
}

export default function ConformValueDemoPage() {
  const lastResult = useActionData<typeof action>()
  const [form, { zip1, zip2, prefecture, city, suburb, street }] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })
  const navigation = useNavigation()

  const postalCode = `${zip1.value}${zip2.value}`
  const handleClickLookupPostalCode = async () => {
    const address = await lookupAddress(postalCode)
    if (!address) return

    form.update({
      name: prefecture.name,
      value: address.prefecture,
    })
    form.update({
      name: city.name,
      value: address.city,
    })
    form.update({
      name: suburb.name,
      value: address.suburb,
    })
    form.update({
      name: street.name,
      value: address.street_address ?? '',
    })
    toast.info('郵便番号をもとに住所を更新しました')
  }

  return (
    <div>
      <Form method="POST" {...getFormProps(form)}>
        <Stack>
          <div>
            <Label htmlFor={zip1.id}>郵便番号</Label>
            <HStack>
              <Input className="w-16" {...getInputProps(zip1, { type: 'tel' })} />
              <div>-</div>
              <Input className="w-24" {...getInputProps(zip2, { type: 'tel' })} />
              <Button
                type="button"
                variant="outline"
                className="whitespace-nowrap"
                onClick={() => {
                  handleClickLookupPostalCode()
                }}
              >
                住所検索
              </Button>
            </HStack>
          </div>

          <div>
            <Label htmlFor={prefecture.id}>都道府県</Label>
            <Input {...getInputProps(prefecture, { type: 'text' })} key={prefecture.initialValue} />
            <div className="text-destructive">{prefecture.errors}</div>
          </div>
          <div>
            <Label htmlFor={city.id}>市区町村</Label>
            <Input {...getInputProps(city, { type: 'text' })} key={city.initialValue} />
            <div className="text-destructive">{city.errors}</div>
          </div>
          <div>
            <Label htmlFor={suburb.id}>町域</Label>
            <Input {...getInputProps(suburb, { type: 'text' })} key={suburb.initialValue} />
            <div className="text-destructive">{suburb.errors}</div>
          </div>
          <div>
            <Label htmlFor={street.id}>番地</Label>
            <Input {...getInputProps(street, { type: 'text' })} key={street.initialValue} />
            <div className="text-destructive">{street.errors}</div>
          </div>
        </Stack>

        <div className="mt-8 text-center">
          <Button className="w-full" disabled={navigation.state === 'submitting'}>
            {navigation.state === 'submitting' ? '登録しています...' : '登録'}
          </Button>
        </div>
      </Form>
    </div>
  )
}
