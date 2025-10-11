import type { MetaFunction } from 'react-router'
import { href, Link } from 'react-router'
import Content from '~/assets/privacy.mdx'
import { Heading } from '~/components/typography'
import { Button } from '~/components/ui'

export const meta: MetaFunction = () => [
  { title: 'プライバシーポリシー - TechTalk' },
]

export default function Privacy() {
  return (
    <div className="container mx-auto max-w-3xl px-6 py-24">
      <Heading as="h1" size="4xl" className="mb-12 text-center leading-tight">
        TechTalkプライバシーポリシー
      </Heading>

      <div className="[&_a]:text-primary hover:[&_a]:text-primary/80 [&_h2]:border-primary/60 dark:[&_h2]:border-primary/40 max-w-none text-base leading-[1.85] [&_a]:font-medium [&_a]:underline [&_a]:transition-colors [&_h1]:mt-16 [&_h1]:mb-8 [&_h1]:text-3xl [&_h1]:leading-tight [&_h1]:font-bold [&_h2]:mt-16 [&_h2]:mb-8 [&_h2]:border-l-[3px] [&_h2]:pl-4 [&_h2]:text-xl [&_h2]:leading-snug [&_h2]:font-bold [&_h2:first-child]:mt-0 [&_p]:my-6 [&_p]:text-left [&_p]:leading-[1.85]">
        <Content />
      </div>

      <div className="mt-16 text-center">
        <Button variant="outline" className="rounded-xl" asChild>
          <Link to={href('/')}>トップに戻る</Link>
        </Button>
      </div>
    </div>
  )
}
