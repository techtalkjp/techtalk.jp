import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '~/libs/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        xs: 'h-6 rounded-md px-2 py-1 text-xs',
        sm: 'h-8 rounded-md px-3 text-sm',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
      isLoading: {
        true: 'opacity-50 pointer-events-none cursor-wait',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      isLoading: false,
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  leftIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      children,
      leftIcon,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, isLoading, className }))}
        ref={ref}
        {...(isLoading === true && { disabled: true })}
        {...props}
      >
        {isLoading ? (
          <span className="border-background mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
        ) : (
          leftIcon
        )}
        <Slottable>{children}</Slottable>
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
