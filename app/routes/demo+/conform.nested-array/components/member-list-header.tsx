import { cn } from '~/libs/utils'

type MemberListHeaderProps = React.ComponentProps<'div'>
export const MemberListHeader = ({
  className,
  children,
  ...rest
}: MemberListHeaderProps) => {
  return (
    <div
      className={cn(
        'text-muted-foreground col-span-full grid grid-cols-subgrid text-sm',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
