import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/libs/utils'

const headingVariants = cva('font-sans font-black', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-md',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
      '8xl': 'text-8xl',
    },
  },
  defaultVariants: {
    size: '2xl',
  },
})
interface HeadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}
export const Heading = ({
  as = 'h2',
  size,
  className,
  children,
  ...rest
}: HeadingProps) => {
  const As = as
  return (
    <As className={cn(headingVariants({ size }), className)} {...rest}>
      {children}
    </As>
  )
}
