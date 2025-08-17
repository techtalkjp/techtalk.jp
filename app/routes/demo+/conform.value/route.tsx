import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { setTimeout } from 'node:timers/promises'
import { Form, href, useNavigation } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  Button,
  FormField,
  FormMessage,
  HStack,
  Input,
  Label,
} from '~/components/ui'
import type { Route } from './+types/route'

// フォーム要素のスキーマ定義
const schema = z.object({
  zip1: z.string().max(3),
  zip2: z.string().max(4),
  prefecture: z.string(),
  city: z.string(),
  street: z.string().optional(),
})

/**
 * 郵便番号から住所を取得する
 *
 * 郵便番号 REST API を利用。
 * https://postcode.teraren.com/
 *
 * @param postalCode
 * @returns 住所情報
 */
const lookupAddress = async (postalCode: string) => {
  const res = await fetch(
    `https://postcode.teraren.com/postcodes/${postalCode}.json`,
  ).catch(() => null)
  if (!res || !res.ok) return null
  return (await res.json()) as {
    prefecture: string
    city: string
    suburb: string
    street_address: string | null
  }
}

export const action = async ({ request }: Route.ActionArgs) => {
  await setTimeout(1000)
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  return dataWithSuccess(
    { lastResult: submission.reply({ resetForm: true }) },
    {
      message: '登録しました',
    },
  )
}

export default function ConformValueDemoPage({
  actionData,
}: Route.ComponentProps) {
  const [form, { zip1, zip2, prefecture, city, street }] = useForm({
    lastResult: actionData?.lastResult,
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })
  const navigation = useNavigation()

  // value はレンダリングのときに都度参照していないと更新されず undefined になるので、ここで参照しておく
  // ref: https://github.com/edmundhung/conform/pull/467
  const postalCode = `${zip1.value}${zip2.value}`

  const fillAddressByPostalCode = async () => {
    // 郵便番号から住所を取得
    const address = await lookupAddress(postalCode)
    if (!address) {
      toast.error('郵便番号から住所が見つかりませんでした', {
        description: postalCode,
      })
      return
    }

    // 住所をフォームに反映する
    form.update({
      name: prefecture.name,
      value: address.prefecture,
    })
    form.update({
      name: city.name,
      value: `${address.city}${address.suburb}`,
    })
    form.update({
      name: street.name,
      value: address.street_address ?? '',
    })
    toast.info('郵便番号をもとに住所を更新しました', {
      description: `${postalCode} -> ${address.prefecture ?? ''}${address.city ?? ''}${address.suburb ?? ''}${address.street_address ?? ''}`,
    })
  }

  return (
    <Form method="POST" className="flex flex-col gap-4" {...getFormProps(form)}>
      <FormField>
        <Label htmlFor={zip1.id}>郵便番号</Label>
        <HStack align="top">
          <div>
            <Input className="w-16" {...getInputProps(zip1, { type: 'tel' })} />
            <FormMessage>{zip1.errors}</FormMessage>
          </div>
          <div>-</div>
          <div>
            <Input className="w-24" {...getInputProps(zip2, { type: 'tel' })} />
            <FormMessage>{zip2.errors}</FormMessage>
          </div>
          <Button
            type="button"
            variant="outline"
            className="whitespace-nowrap"
            onClick={() => fillAddressByPostalCode()}
          >
            住所検索
          </Button>
        </HStack>
      </FormField>

      <FormField>
        <Label htmlFor={prefecture.id}>都道府県</Label>
        <Input {...getInputProps(prefecture, { type: 'text' })} />
        <FormMessage>{prefecture.errors}</FormMessage>
      </FormField>

      <FormField>
        <Label htmlFor={city.id}>市区町村</Label>
        <Input {...getInputProps(city, { type: 'text' })} />
        <FormMessage>{city.errors}</FormMessage>
      </FormField>

      <FormField>
        <Label htmlFor={street.id}>番地</Label>
        <Input {...getInputProps(street, { type: 'text' })} />
        <FormMessage>{street.errors}</FormMessage>
      </FormField>

      <Button
        className="mt-2 w-full"
        isLoading={navigation.formAction === href('/demo/conform/value')}
      >
        登録
      </Button>
    </Form>
  )
}
