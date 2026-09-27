import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import test from 'node:test'

// Workflowをそのまま実行し、外部通知とAIだけを隔離する。
const state = {
  calls: [],
  llm: null,
  stored: null,
  dbFails: false,
  shadowFails: false,
  shadowOverride: null,
}
globalThis.__shadowFlowTest = state
const moduleUrl = (source) =>
  `data:text/javascript,${encodeURIComponent(source)}`
const actualShadow = new URL(
  '../workers/workflow/services/classify-shadow.ts',
  import.meta.url,
).href
const cloudflare = moduleUrl(
  `export const env = { AI: {}, DB: { prepare(sql) { return { bind(...values) { return { async run() { const s=globalThis.__shadowFlowTest; if(s.dbFails) throw new Error('DB unavailable'); s.stored={sql,values}; return {success:true}; } }; } }; } } }; export class WorkflowEntrypoint {}`,
)
const mocks = {
  './services/classify': moduleUrl(
    'export async function classifyInquiry() { return globalThis.__shadowFlowTest.llm; }',
  ),
  './services/classify-shadow': moduleUrl(
    `import { classifyShadow as actual } from ${JSON.stringify(actualShadow)}; export function classifyShadow(message) { if(globalThis.__shadowFlowTest.shadowFails) throw new Error('shadow unavailable'); return globalThis.__shadowFlowTest.shadowOverride ?? actual(message); }`,
  ),
  './services/email': moduleUrl(
    "export async function sendNotificationEmail() { globalThis.__shadowFlowTest.calls.push('notification'); return {isErr:()=>false}; } export async function sendReplyEmail() { globalThis.__shadowFlowTest.calls.push('reply'); return {isErr:()=>false}; }",
  ),
  './services/slack': moduleUrl(
    "export async function sendSlack() { globalThis.__shadowFlowTest.calls.push('slack'); return {isErr:()=>false,value:'stub'}; }",
  ),
}
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'cloudflare:workers')
      return { url: cloudflare, shortCircuit: true }
    if (context.parentURL?.endsWith('/workers/workflow/contact.ts')) {
      if (mocks[specifier]) return { url: mocks[specifier], shortCircuit: true }
      if (specifier === './services/evaluations')
        return {
          url: new URL(
            '../workers/workflow/services/evaluations.ts',
            import.meta.url,
          ).href,
          shortCircuit: true,
        }
    }
    return nextResolve(specifier, context)
  },
})
const { ContactWorkflow } = await import('../workers/workflow/contact.ts')
hooks.deregister()

const run = async (verdict, message, options = {}) => {
  Object.assign(state, {
    calls: [],
    stored: null,
    dbFails: false,
    shadowFails: false,
    shadowOverride: null,
    ...options,
    llm: {
      verdict,
      confidence: verdict === 'normal' && options.failOpen ? 0 : 90,
      reason: 'fixture',
      model: 'llm-fixture',
      succeeded: !options.failOpen,
    },
  })
  const payload = {
    name: 'fixture',
    email: 'fixture@example.invalid',
    message,
    rule: { score: 0, tier: 'low', reasons: [] },
  }
  const steps = []
  await new ContactWorkflow().run(
    { payload },
    {
      do: async (name, callback) => {
        steps.push(name)
        return await callback()
      },
    },
  )
  return steps
}

test('LLM normal still sends all notifications when the local model says sales', async () => {
  await run('normal', '任意の本文', {
    shadowOverride: {
      verdict: 'sales',
      score: 0.8,
      model: 'fixture',
      error: null,
    },
  })
  assert.equal(state.stored.values[12], 'sales')
  assert.equal(state.stored.values[11], 'normal')
  assert.deepEqual(state.calls, ['slack', 'notification', 'reply'])
})

test('LLM sales still stops all notifications when the local model says normal', async () => {
  await run('sales', '任意の本文', {
    shadowOverride: {
      verdict: 'normal',
      score: 0.8,
      model: 'fixture',
      error: null,
    },
  })
  assert.equal(state.stored.values[12], 'normal')
  assert.equal(state.stored.values[11], 'sales')
  assert.deepEqual(state.calls, [])
})

test('LLM gray and fail-open normal continue notifying', async () => {
  for (const verdict of ['gray', 'normal']) {
    await run(verdict, 'ご相談があります', { failOpen: true })
    assert.deepEqual(state.calls, ['slack', 'notification', 'reply'])
  }
})

test('shadow prediction or logging failure cannot stop the notification flow', async () => {
  for (const options of [{ shadowFails: true }, { dbFails: true }]) {
    await run('normal', '問い合わせ', options)
    assert.deepEqual(state.calls, ['slack', 'notification', 'reply'])
  }
})
