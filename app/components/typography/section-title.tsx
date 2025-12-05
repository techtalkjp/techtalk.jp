import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '~/libs/utils'

const sectionTitleVariants = cva('font-sans font-bold', {
  variants: {
    size: {
      sm: 'text-lg',
      md: 'text-xl',
      lg: 'text-2xl',
      xl: 'text-3xl',
    },
    spacing: {
      default: 'mt-16 mb-8',
      compact: 'mt-8 mb-4',
      loose: 'mt-24 mb-12',
    },
  },
  defaultVariants: {
    size: 'lg',
    spacing: 'default',
  },
})

interface SectionTitleProps
  extends
    HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof sectionTitleVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export const SectionTitle = ({
  as = 'h2',
  size,
  spacing,
  className,
  children,
  ...rest
}: SectionTitleProps) => {
  const As = as
  return (
    <As
      className={cn(sectionTitleVariants({ size, spacing }), className)}
      {...rest}
    >
      {children}
    </As>
  )
}
