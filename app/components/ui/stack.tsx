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
    align: {
      left: 'items-start',
      center: 'items-center',
      right: 'items-end',
      stretch: 'items-stretch',
      auto: '',
    },
    full: {
      true: 'w-full',
    },
  },
  defaultVariants: {
    gap: 'md',
    align: 'auto',
    full: true,
  },
})
type StackProps = TwcComponentProps<'div'> & VariantProps<typeof stack>
export const Stack = twc.div.transientProps([
  'gap',
  'align',
  'full',
])<StackProps>(({ gap, align, full }) => stack({ gap, align, full }))

const hstack = cva('flex flex-row', {
  variants: {
    gap: {
      xl: 'gap-6',
      lg: 'gap-4',
      md: 'gap-2',
      sm: 'gap-1',
      xs: 'gap-0.5',
    },
    align: {
      top: 'items-start',
      center: 'items-center',
      bottom: 'items-end',
      stretch: 'items-stretch',
    },
    full: {
      true: 'h-full',
    },
  },
  defaultVariants: {
    gap: 'md',
    align: 'center',
    full: false,
  },
})
type HStackProps = TwcComponentProps<'div'> & VariantProps<typeof hstack>
export const HStack = twc.div.transientProps([
  'gap',
  'align',
  'full',
])<HStackProps>(({ gap, align, full }) => hstack({ gap, align, full }))
