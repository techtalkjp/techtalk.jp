const template = document.createElement('template')
template.innerHTML = `
<style>
  :host {
    display: block;
    font-family: var(--fts-font, system-ui, -apple-system, sans-serif);
    font-size: var(--fts-font-size, 14px);
    color: var(--fts-color, #1a1a1a);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .fts-container {
    max-width: var(--fts-max-width, 100%);
  }

  .fts-search-box {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .fts-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--fts-border-color, #d1d5db);
    border-radius: var(--fts-border-radius, 6px);
    font-size: inherit;
    font-family: inherit;
    color: inherit;
    background: var(--fts-input-bg, #fff);
    outline: none;
    transition: border-color 0.15s;
  }

  .fts-input:focus {
    border-color: var(--fts-focus-color, #3b82f6);
    box-shadow: 0 0 0 2px var(--fts-focus-ring, rgba(59, 130, 246, 0.2));
  }

  .fts-meta {
    font-size: 12px;
    color: var(--fts-meta-color, #6b7280);
    margin-bottom: 8px;
  }

  .fts-results {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .fts-item {
    padding: 12px;
    border: 1px solid var(--fts-border-color, #d1d5db);
    border-radius: var(--fts-border-radius, 6px);
    background: var(--fts-item-bg, #fff);
  }

  .fts-item-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .fts-item-title {
    font-weight: 600;
    font-size: 14px;
  }

  .fts-item-score {
    font-size: 11px;
    color: var(--fts-meta-color, #6b7280);
    background: var(--fts-score-bg, #f3f4f6);
    padding: 1px 6px;
    border-radius: 4px;
  }

  .fts-item-body {
    font-size: 13px;
    color: var(--fts-meta-color, #6b7280);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .fts-empty {
    text-align: center;
    padding: 24px;
    color: var(--fts-meta-color, #6b7280);
  }

  .fts-loading {
    text-align: center;
    padding: 16px;
    color: var(--fts-meta-color, #6b7280);
  }
</style>

<div class="fts-container">
  <div class="fts-search-box">
    <input class="fts-input" type="search" />
  </div>
  <div class="fts-meta"></div>
  <div class="fts-results"></div>
</div>
`

class FtsSearch extends HTMLElement {
  private input!: HTMLInputElement
  private resultsEl!: HTMLElement
  private metaEl!: HTMLElement
  private debounceTimer: ReturnType<typeof setTimeout> | null = null
  private abortController: AbortController | null = null

  static get observedAttributes() {
    return ['api-url', 'placeholder', 'limit']
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(template.content.cloneNode(true))

    this.input = shadow.querySelector('.fts-input')!
    this.resultsEl = shadow.querySelector('.fts-results')!
    this.metaEl = shadow.querySelector('.fts-meta')!

    this.input.placeholder =
      this.getAttribute('placeholder') ?? '検索キーワードを入力...'

    this.input.addEventListener('input', () => this.onInput())

    // 初期表示
    this.search('')
  }

  attributeChangedCallback(name: string, _old: string, val: string) {
    if (name === 'placeholder' && this.input) {
      this.input.placeholder = val
    }
  }

  private onInput() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(() => {
      this.search(this.input.value)
    }, 300)
  }

  private async search(query: string) {
    const apiUrl = this.getAttribute('api-url')
    if (!apiUrl) {
      this.resultsEl.innerHTML =
        '<div class="fts-empty">api-url 属性が設定されていません</div>'
      return
    }

    if (this.abortController) this.abortController.abort()
    this.abortController = new AbortController()

    this.resultsEl.innerHTML = '<div class="fts-loading">検索中...</div>'

    try {
      const limit = this.getAttribute('limit') ?? '20'
      const url = new URL(apiUrl, window.location.origin)
      if (query) url.searchParams.set('q', query)
      url.searchParams.set('limit', limit)

      const res = await fetch(url.toString(), {
        signal: this.abortController.signal,
      })
      const data = (await res.json()) as {
        results: Array<{
          id: number
          title: string
          body: string
          rank?: number
        }>
      }
      this.render(data.results, query)
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        this.resultsEl.innerHTML =
          '<div class="fts-empty">検索に失敗しました</div>'
      }
    }
  }

  private render(
    results: Array<{
      id: number
      title: string
      body: string
      rank?: number
    }>,
    query: string,
  ) {
    this.metaEl.textContent = query
      ? `「${query}」${results.length} 件`
      : `${results.length} 件`

    if (results.length === 0) {
      this.resultsEl.innerHTML = query
        ? `<div class="fts-empty">「${query}」に一致する結果がありません</div>`
        : '<div class="fts-empty">コンテンツがありません</div>'
      return
    }

    this.resultsEl.innerHTML = results
      .map(
        (item) => `
      <div class="fts-item">
        <div class="fts-item-header">
          <span class="fts-item-title">${this.escape(item.title)}</span>
          ${item.rank != null ? `<span class="fts-item-score">score: ${Math.abs(item.rank).toFixed(2)}</span>` : ''}
        </div>
        <div class="fts-item-body">${this.escape(item.body)}</div>
      </div>
    `,
      )
      .join('')
  }

  private escape(str: string): string {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }
}

if (!customElements.get('fts-search')) {
  customElements.define('fts-search', FtsSearch)
}
