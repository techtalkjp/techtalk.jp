import pdfjsWorkerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url'
import { Button, Stack } from '~/components/ui'
import type { Route } from './+types/route'
import { usePdfViewer } from './hooks/use-pdf-viewer'

export const clientLoader = async () => {
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc
  return { pdfjs }
}
clientLoader.hydrate = true as const

export const HydrationFallback = () => {
  return <div>Loading...</div>
}

export default function PdfPage({
  loaderData: { pdfjs },
}: Route.ComponentProps) {
  const pdfViewer = usePdfViewer({
    pdfjsLib: pdfjs,
    pdfUrl: '/dummy.pdf',
    initialScale: 1.5,
    initialPage: 1,
  })

  return (
    <Stack gap="lg">
      {pdfViewer.isPdfLoaded && ( // PDFがロードされてからコントロールを表示
        <>
          <div>
            <Button
              type="button"
              onClick={pdfViewer.goToPrevPage}
              disabled={pdfViewer.pageNum <= 1 || pdfViewer.pageRendering}
            >
              Previous
            </Button>
            <span style={{ margin: '0 10px' }}>
              Page {pdfViewer.pageNum} of {pdfViewer.numPages}
            </span>
            <Button
              type="button"
              onClick={pdfViewer.goToNextPage}
              disabled={
                pdfViewer.pageNum >= pdfViewer.numPages ||
                pdfViewer.pageRendering
              }
            >
              Next
            </Button>
          </div>
          <div style={{ margin: '10px 0' }}>
            <Button
              type="button"
              onClick={pdfViewer.zoomOut}
              disabled={pdfViewer.pageRendering}
            >
              Zoom Out
            </Button>
            <span style={{ margin: '0 10px' }}>
              Scale: {pdfViewer.pdfScale.toFixed(2)}x
            </span>
            <Button
              type="button"
              onClick={pdfViewer.zoomIn}
              disabled={pdfViewer.pageRendering}
            >
              Zoom In
            </Button>
          </div>
        </>
      )}
      {pdfViewer.pageRendering && <p>Rendering page...</p>}

      <div className="mt-5 inline-block max-h-[70vh] overflow-auto rounded-md border border-gray-300">
        <canvas ref={pdfViewer.canvasRef} />
      </div>
    </Stack>
  )
}
