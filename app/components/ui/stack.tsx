import { cva, type VariantProps } from 'class-variance-authority'
import { twc, type TwcComponentProps } from 'react-twc'

const stack = cva('flex flex-col', {
  variants: {
    gap: {
      xl: 'gap-6',
      lg: 'gap-4',
      md: 'gap-2',
      sm: 'gap-1',
      xs: 'gap-0.5',
    },
  },
  defaultVariants: {
    gap: 'md',
  },
})
type StackProps = TwcComponentProps<'div'> & VariantProps<typeof stack>
export const Stack = twc.div<StackProps>(({ gap }) => stack({ gap }))

const hstack = cva('flex flex-row items-center', {
  variants: {
    gap: {
      xl: 'gap-6',
      lg: 'gap-4',
      md: 'gap-2',
      sm: 'gap-1',
      xs: 'gap-0.5',
    },
  },
  defaultVariants: {
    gap: 'md',
  },
})
type HStackProps = TwcComponentProps<'div'> & VariantProps<typeof hstack>
export const HStack = twc.div<HStackProps>(({ gap }) => hstack({ gap }))
