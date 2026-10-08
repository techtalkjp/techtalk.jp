import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { readFile, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const manifest = JSON.parse(
  await readFile(resolve(root, 'scripts/fonts-manifest.json'), 'utf8'),
)
const paths = (await readdir(resolve(root, 'app'), { recursive: true }))
  .filter((path) => /\.(ts|tsx|json)$/.test(path) && path !== 'ui/fonts.ts')
  .map((path) => `app/${path}`)
  .sort()
const sha256 = (data) => createHash('sha256').update(data).digest('hex')
const changed = []
for (const path of paths) {
  if (sha256(await readFile(resolve(root, path))) !== manifest.sources[path])
    changed.push(path)
}
for (const path of Object.keys(manifest.sources)) {
  if (!paths.includes(path)) changed.push(path)
}
for (const [file, digest] of Object.entries(manifest.fonts)) {
  if (sha256(await readFile(resolve(root, 'public/fonts', file))) !== digest)
    changed.push(file)
}
if (changed.length && process.argv.includes('--ensure')) {
  console.log('Site sources changed; regenerating font subsets...')
  const result = spawnSync('uv', ['run', 'scripts/build-fonts.py'], {
    cwd: root,
    stdio: 'inherit',
  })
  if (result.error)
    console.error(
      'Font regeneration requires uv: https://docs.astral.sh/uv/getting-started/installation/',
    )
  process.exitCode = result.status ?? 1
} else if (changed.length) {
  console.error(
    `Font subsets are stale. Run pnpm fonts:build.\n${changed.join('\n')}`,
  )
  process.exitCode = 1
} else {
  console.log('Font subsets match the site sources.')
}
