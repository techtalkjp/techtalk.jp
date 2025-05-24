export const HtmlArtifact = ({
  content,
  title,
}: {
  content: string
  title: string
}) => (
  <div className="overflow-hidden rounded-md border">
    <iframe
      srcDoc={content}
      className="h-96 w-full"
      sandbox="allow-scripts allow-same-origin"
      title={title}
    />
  </div>
)
