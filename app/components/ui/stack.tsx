import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '~/libs/utils'

const stackVariants = cva('flex', {
  variants: {
    direction: {
      column: 'flex-col',
      'column-reverse': 'flex-col-reverse',
      row: 'flex-row',
      'row-reverse': 'flex-row-reverse',
    },
    gap: {
      '0': 'gap-0',
      '1': 'gap-1',
      '2': 'gap-2',
      '3': 'gap-3',
      '4': 'gap-4',
      '5': 'gap-5',
      '6': 'gap-6',
      '8': 'gap-8',
      '10': 'gap-10',
      '12': 'gap-12',
      '16': 'gap-16',
    },
  },
  defaultVariants: {
    direction: 'column',
    gap: '2',
  },
})

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, gap, direction, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(stackVariants({ direction, gap, className }))}
      {...props}
    />
  ),
)
Stack.displayName = 'Stack'

export interface HStackProps extends React.HTMLAttributes<HTMLDivElement> {}
export const HStack = React.forwardRef<HTMLDivElement, HStackProps>(
  ({ className, ...props }, ref) => (
    <Stack
      ref={ref}
      className={cn(
        stackVariants({ direction: 'row', className }),
        'items-center',
      )}
      {...props}
    />
  ),
)
HStack.displayName = 'HStack'
