interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Spacer = ({ ...rest }: SpacerProps) => (
  <div className="flex-1 block self-stretch" {...rest} />
)
