import { run } from 'remix/component'

// clientEntry のモジュールを読み込み、ページ全体のソフトナビゲーションを有効にする
const app = run({
  async loadModule(moduleUrl, exportName) {
    let mod = await import(moduleUrl)
    let component = mod[exportName]
    if (typeof component !== 'function') {
      throw new Error(`Unknown component: ${moduleUrl}#${exportName}`)
    }
    return component
  },
})

app.addEventListener('error', (event) => {
  console.error(event.error)
})

await app.ready()
