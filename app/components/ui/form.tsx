import { twc } from 'react-twc'
import { Stack } from './stack'

export const FormField = twc(Stack).attrs({
  gap: 'sm',
  align: 'left',
})``

export const FormDescription = twc.div`text-[0.8rem] text-muted-foregrond`

export const FormMessage = twc.div`text-[0.8rem] text-red-500 font-medium`
