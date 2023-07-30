import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '~/libs/utils'

const stackVariants = cva('flex gap-2', {
  variants: {
    direction: {
      vertical: 'flex-col',
      horizontal: 'flex-row',
    },
  },
  defaultVariants: {
    direction: 'vertical',
  },
})

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, direction, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(stackVariants({ direction, className }))}
      {...props}
    />
  ),
)
Stack.displayName = 'Stack'
