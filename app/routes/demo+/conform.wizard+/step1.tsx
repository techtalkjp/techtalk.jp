import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form, redirect } from 'react-router'
import { Button, Input, Label } from '~/components/ui'
import type { Route } from './+types/step1'
import { step1Schema } from './_shared/schema'
import { getWizardState, updateWizardState } from './_shared/storage.client'

// クライアント側のローダー - ローカルストレージから状態を読み込む
export const clientLoader = () => {
  const state = getWizardState()
  return {
    step1Data: state.step1Data || undefined,
  }
}
clientLoader.hydrate = true

// クライアント側のアクション - ローカルストレージに保存
export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema: step1Schema })

  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  // ウィザードの状態を更新して次のステップへ
  updateWizardState({
    currentStep: 'step2',
    step1Data: submission.value,
  })

  return redirect('/demo/conform/wizard/step2')
}

export default function Step1Route({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { step1Data } = loaderData
  const lastResult = actionData?.lastResult

  const [form, fields] = useForm({
    defaultValue: step1Data,
    lastResult: lastResult,
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: step1Schema }),
  })

  return (
    <div className="wizard-step">
      <h1>Step 1: 基本情報</h1>

      <Form method="post" {...getFormProps(form)}>
        <div className="form-field">
          <Label htmlFor={fields.name.id}>名前:</Label>
          <Input
            {...getInputProps(fields.name, { type: 'text' })}
            placeholder="山田 太郎"
          />
          {fields.name.errors && (
            <div className="error">{fields.name.errors}</div>
          )}
        </div>

        <div className="form-field">
          <Label htmlFor={fields.email.id}>メールアドレス:</Label>
          <Input
            {...getInputProps(fields.email, { type: 'email' })}
            placeholder="example@example.com"
          />
          {fields.email.errors && (
            <div className="error">{fields.email.errors}</div>
          )}
        </div>

        <div className="button-container">
          <Button type="submit">次へ</Button>
        </div>

        <div>{JSON.stringify(form.errors)}</div>
      </Form>
    </div>
  )
}
