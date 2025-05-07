import type {
  PDFDocumentProxy,
  RenderParameters,
} from 'pdfjs-dist/types/src/display/api'
import { useCallback, useEffect, useRef, useState } from 'react'

interface UsePdfViewerProps {
  pdfjsLib: typeof import('pdfjs-dist')
  pdfUrl: string
  initialScale?: number
  initialPage?: number
}

interface UsePdfViewerReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  loading: boolean
  error: string | null
  pageNum: number
  numPages: number
  pdfScale: number
  pageRendering: boolean
  goToPrevPage: () => void
  goToNextPage: () => void
  setPageNum: (num: number) => void
  zoomIn: () => void
  zoomOut: () => void
  isPdfLoaded: boolean // pdfDocがロードされたかどうかのフラグ
}

export function usePdfViewer({
  pdfjsLib,
  pdfUrl,
  initialScale = 1.5,
  initialPage = 1,
}: UsePdfViewerProps): UsePdfViewerReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null)
  const [pageNum, setPageNumState] = useState(initialPage)
  const [numPages, setNumPages] = useState(0)
  const [pageRendering, setPageRendering] = useState(false)
  const [pageNumPending, setPageNumPending] = useState<number | null>(null)
  const [pdfScale, setPdfScale] = useState(initialScale)
  const [loading, setLoading] = useState(true) // 初期ロード状態
  const [error, setError] = useState<string | null>(null)

  // PDFドキュメントの読み込み
  useEffect(() => {
    const loadDocument = async () => {
      if (!pdfUrl) {
        setError('PDF URL is not provided.')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        setError(null)
        setPdfDoc(null) // 再読み込みの場合にリセット
        setNumPages(0)
        setPageNumState(initialPage)

        const loadingTask = pdfjsLib.getDocument(pdfUrl)
        const loadedPdfDoc = await loadingTask.promise

        setPdfDoc(loadedPdfDoc)
        setNumPages(loadedPdfDoc.numPages)
        setPageNumState(Math.min(initialPage, loadedPdfDoc.numPages)) // 初期ページが総ページ数を超えないように
        setLoading(false)
      } catch (err: unknown) {
        console.error('Error loading PDF:', err)
        setError(err instanceof Error ? err.message : 'Failed to load PDF.')
        setLoading(false)
      }
    }

    loadDocument()

    return () => {
      // pdfDoc?.destroy() は、pdfDocが変更されたときに実行される別のuseEffectで行う
      // ここでdestroyすると、pdfUrlが変更されたときに古いドキュメントをdestroyする前に新しいのがロードされようとして問題になる可能性がある
    }
  }, [pdfjsLib.getDocument, pdfUrl, initialPage]) // pdfUrlやinitialPageが変わったら再読み込み

  // pdfDoc が変更されたら (新しいPDFがロードされたら) 古いドキュメントを破棄
  useEffect(() => {
    return () => {
      // このuseEffectはpdfDocがアンマウントされる時、またはpdfDoc自体が変更される直前に実行される
      // (pdfUrl変更による再ロードでpdfDocがnullになる時など)
      if (pdfDoc && typeof pdfDoc.destroy === 'function') {
        pdfDoc.destroy()
      }
    }
  }, [pdfDoc])

  // ページのレンダリング
  const renderPage = useCallback(
    async (num: number) => {
      if (!pdfDoc || !canvasRef.current) return

      // ページ番号が範囲外の場合は何もしない
      if (num < 1 || num > pdfDoc.numPages) {
        console.warn(
          `Page number ${num} is out of range (1-${pdfDoc.numPages})`,
        )
        return
      }

      setPageRendering(true)
      setError(null) // レンダリング開始時にエラーをクリア

      try {
        const page = await pdfDoc.getPage(num)
        const viewport = page.getViewport({ scale: pdfScale })
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        if (!context) {
          throw new Error('Failed to get 2D context from canvas.')
        }

        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderContext: RenderParameters = {
          canvasContext: context,
          viewport: viewport,
        }
        await page.render(renderContext).promise
        setPageRendering(false)

        if (pageNumPending !== null) {
          setPageNumState(pageNumPending) // ここでページ番号を更新
          setPageNumPending(null)
        }
      } catch (err: unknown) {
        console.error(`Error rendering page ${num}:`, err)
        setError(
          err instanceof Error ? err.message : `Failed to render page ${num}.`,
        )
        setPageRendering(false)
      }
    },
    [pdfDoc, pdfScale, pageNumPending],
  ) // pageNumPendingを依存配列に追加

  useEffect(() => {
    if (pdfDoc && numPages > 0) {
      // pdfDocがロードされ、総ページ数が確定してからレンダリング
      renderPage(pageNum)
    }
  }, [pdfDoc, pageNum, renderPage, numPages]) // renderPageがuseCallbackなので依存配列に追加しても安全

  const queueOrSetPage = (newNum: number) => {
    if (newNum < 1 || (numPages > 0 && newNum > numPages)) return // numPagesが0のときはまだロード中なので上限チェックしない

    if (pageRendering) {
      setPageNumPending(newNum)
    } else {
      setPageNumState(newNum)
    }
  }

  const goToPrevPage = () => {
    if (pageNum <= 1) return
    queueOrSetPage(pageNum - 1)
  }

  const goToNextPage = () => {
    if (numPages > 0 && pageNum >= numPages) return // numPagesが0のときはまだロード中
    queueOrSetPage(pageNum + 1)
  }

  const setPageNum = (num: number) => {
    queueOrSetPage(num)
  }

  const zoomIn = () =>
    setPdfScale((prevScale) => Math.min(prevScale * 1.2, 5.0))
  const zoomOut = () =>
    setPdfScale((prevScale) => Math.max(prevScale / 1.2, 0.2))

  return {
    canvasRef,
    loading: loading || (pdfDoc === null && !error), // pdfDocがnullでエラーもない場合はロード中と見なす
    error,
    pageNum,
    numPages,
    pdfScale,
    pageRendering,
    goToPrevPage,
    goToNextPage,
    setPageNum,
    zoomIn,
    zoomOut,
    isPdfLoaded: !!pdfDoc, // pdfDocが存在すればtrue
  }
}
