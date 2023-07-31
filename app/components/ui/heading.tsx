interface HeadingProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Heading = ({ children, ...rest }: HeadingProps) => (
  <h2 className="font-sans text-5xl font-black" {...rest}>
    {children}
  </h2>
)
