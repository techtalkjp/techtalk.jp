import { cn } from '~/libs/utils'

type MemberListProps = React.ComponentProps<'div'>
export const MemberList = ({
  className,
  children,
  ...rest
}: MemberListProps) => {
  return (
    <div
      className={cn(
        'grid grid-cols-[auto_auto_auto_auto_auto_auto] gap-x-2 gap-y-1',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
