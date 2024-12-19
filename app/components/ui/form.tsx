import { twc } from 'react-twc'
import { Stack } from './stack'

export const FormField = twc(Stack).attrs({
  gap: 'sm',
  align: 'left',
  full: true,
})``

export const FormFieldError = twc.div`text-[0.8rem] text-red-500 font-medium`
