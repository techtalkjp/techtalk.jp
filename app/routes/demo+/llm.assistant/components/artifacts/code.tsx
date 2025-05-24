export const CodeArtifact = ({ content }: { content: string }) => (
  <div className="overflow-x-auto rounded-md bg-slate-950 p-4 font-mono text-sm text-slate-50">
    <pre className="whitespace-pre-wrap">{content}</pre>
  </div>
)
