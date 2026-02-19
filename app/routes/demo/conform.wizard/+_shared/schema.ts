// app/schemas.ts
import { z } from 'zod'

// ステップ1のスキーマ定義
export const step1Schema = z.object({
  name: z.string().min(1, '名前は必須です'),
  email: z
    .email({ error: '有効なメールアドレスを入力してください' })
    .min(1, 'メールアドレスは必須です'),
})

// ステップ2のスキーマ定義
export const step2Schema = z.object({
  address: z.string().min(1, '住所は必須です'),
  city: z.string().min(1, '市区町村は必須です'),
  postalCode: z
    .string()
    .min(1, '郵便番号は必須です')
    .regex(/^\d{3}-?\d{4}$/, '有効な郵便番号を入力してください'),
})

// ステップ3のスキーマ定義
export const step3Schema = z.object({
  comments: z.string().optional(),
  agreement: z.literal(true, {
    error: '利用規約に同意する必要があります',
  }),
})

// 全体のスキーマ定義（最終的な送信データ用）
export const wizardSchema = z.object({
  step1Data: step1Schema,
  step2Data: step2Schema,
  step3Data: step3Schema,
})

// 各ステップの型をエクスポート
export type Step1Data = z.infer<typeof step1Schema>
export type Step2Data = z.infer<typeof step2Schema>
export type Step3Data = z.infer<typeof step3Schema>
export type WizardData = z.infer<typeof wizardSchema>

// ウィザードのステップタイプ
export type WizardStep = 'step1' | 'step2' | 'step3' | 'complete'

// ステップの進行状態を管理するための型
export interface WizardState {
  currentStep: WizardStep
  step1Data?: Step1Data
  step2Data?: Step2Data
  step3Data?: Step3Data
}
