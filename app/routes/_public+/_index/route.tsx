import { Navigation } from '~/routes/_public+/_index/components/Navigation'
import { AboutPage, ContactPage, HeroPage } from './components/pages'

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
