import { cn } from '~/libs/utils'

interface ProseContentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'rich'
}

export const ProseContent = ({
  variant = 'default',
  className,
  children,
  ...rest
}: ProseContentProps) => {
  const baseStyles =
    'max-w-none text-base leading-[1.85] [&_a]:font-medium [&_a]:text-primary [&_a]:transition-colors [&_h1]:mt-16 [&_h1]:mb-8 [&_h1]:text-3xl [&_h1]:leading-tight [&_h1]:font-bold [&_h2]:mt-16 [&_h2]:mb-8 [&_h2]:text-xl [&_h2]:leading-snug [&_h2]:font-bold [&_h2:first-child]:mt-0 [&_p]:my-6 [&_p]:text-left [&_p]:leading-[1.85]'

  const variantStyles = {
    default:
      '[&_a]:underline hover:[&_a]:text-primary/80 [&_h2]:border-l-[3px] [&_h2]:border-primary/60 [&_h2]:pl-4 dark:[&_h2]:border-primary/40',
    rich: '[&_a]:no-underline hover:[&_a]:underline [&_blockquote]:my-6 [&_blockquote]:rounded-xl [&_blockquote]:border-l-[3px] [&_blockquote]:border-primary/60 [&_blockquote]:bg-muted/50 [&_blockquote]:p-6 [&_blockquote]:text-sm [&_blockquote]:leading-relaxed [&_blockquote]:italic [&_blockquote]:backdrop-blur-sm [&_blockquote_p]:my-2 [&_h2]:rounded-xl [&_h2]:bg-muted/50 [&_h2]:px-6 [&_h2]:py-4 [&_h2]:backdrop-blur-sm [&_img]:h-auto [&_img]:w-full [&_img]:max-w-xs [&_img]:rounded-xl [&_img]:object-cover',
  }

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      {...rest}
    >
      {children}
    </div>
  )
}
