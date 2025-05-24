export const DocumentArtifact = ({ content }: { content: string }) => (
  <div className="bg-background rounded-md border p-4">
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap">
        {content}
      </pre>
    </div>
  </div>
)
