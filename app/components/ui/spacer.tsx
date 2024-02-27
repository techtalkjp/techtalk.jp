interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Spacer = ({ ...rest }: SpacerProps) => (
  <div className="block flex-1 self-stretch" {...rest} />
)
