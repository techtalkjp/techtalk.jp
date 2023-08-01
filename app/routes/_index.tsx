import { Navigation } from '~/components/Navigation'
import { AboutPage, ContactPage, HeroPage } from '~/components/pages'

export default function Index() {
  return (
    <div className="relative h-screen text-white">
      <Navigation />

      <main className="h-screen snap-y snap-mandatory overflow-auto">
        <HeroPage />
        <AboutPage />
        <ContactPage />
      </main>
    </div>
  )
}
