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
        'text-muted-foreground col-span-full grid grid-cols-subgrid place-items-center text-sm',
        className,
      )}
      {...rest}
    >
      <div />
      <div>名前</div>
      <div>性別</div>
      <div>郵便番号</div>
      <div>電話番号</div>
      <div>Email</div>
      <div />
    </div>
  )
}
