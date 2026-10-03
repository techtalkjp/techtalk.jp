import { createAppRouter } from './app/router.ts'

export { ContactWorkflow } from './workers/workflow/contact.ts'

let router: ReturnType<typeof createAppRouter> | undefined

export default {
  async fetch(request, env) {
    router ??= createAppRouter({
      bindings: { db: env.DB, contactWorkflow: env.CONTACT_WORKFLOW },
    })
    try {
      return await router.fetch(request)
    } catch (error) {
      console.error(error)
      return new Response('Internal Server Error', { status: 500 })
    }
  },
} satisfies ExportedHandler<Env>
