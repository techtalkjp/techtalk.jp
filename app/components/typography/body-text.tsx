import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '~/libs/utils'

const bodyTextVariants = cva('leading-relaxed', {
  variants: {
    size: {
      sm: 'text-sm leading-[1.7]',
      base: 'text-base leading-[1.8]',
      lg: 'text-lg leading-[1.85]',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    size: 'base',
    align: 'left',
  },
})

interface BodyTextProps
  extends
    HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof bodyTextVariants> {
  as?: 'p' | 'span' | 'div'
}

export const BodyText = ({
  as = 'p',
  size,
  align,
  className,
  children,
  ...rest
}: BodyTextProps) => {
  const As = as
  return (
    <As className={cn(bodyTextVariants({ size, align }), className)} {...rest}>
      {children}
    </As>
  )
}
