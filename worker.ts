import { createAppRouter } from './app/router.ts'

let router: ReturnType<typeof createAppRouter> | undefined

export default {
  async fetch(request) {
    router ??= createAppRouter()
    try {
      return await router.fetch(request)
    } catch (error) {
      console.error(error)
      return new Response('Internal Server Error', { status: 500 })
    }
  },
} satisfies ExportedHandler<Env>
