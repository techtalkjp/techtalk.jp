import { locales } from '~/i18n/utils/detectLocale'
import { Navigation } from '~/routes/_public+/($lang)._index/components/Navigation'
import type { Route } from './+types/route'
import { AboutPage, ContactPage, HeroPage } from './components/pages'

export const loader = ({ params }: Route.LoaderArgs) => {
  if (!locales.includes(params.lang ?? 'ja'))
    throw new Response('404 Not Found', { status: 404 })
  return {}
}

export default function Index() {
  return (
    <div className="relative h-screen">
      <Navigation />

      <main className="h-screen snap-y snap-mandatory overflow-auto">
        <HeroPage />
        <AboutPage />
        <ContactPage />
      </main>
    </div>
  )
}
