import { BarChart3 } from 'lucide-react'

export const ChartArtifact = ({ title }: { title: string }) => (
  <div className="bg-background flex h-64 items-center justify-center rounded-md border p-8">
    <div className="text-muted-foreground text-center">
      <BarChart3 className="mx-auto mb-2 h-12 w-12" />
      <p className="font-medium">チャート表示エリア</p>
      <p className="mt-1 text-xs">{title}</p>
    </div>
  </div>
)
