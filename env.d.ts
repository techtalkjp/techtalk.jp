declare module '*.mdx' {
  // biome-ignore lint/suspicious/noExplicitAny: mdx files can have any props
  let MDXComponent: (props: any) => JSX.Element
  // biome-ignore lint/suspicious/noExplicitAny: frontmatter can be any type
  export const frontmatter: any
  export default MDXComponent
}
