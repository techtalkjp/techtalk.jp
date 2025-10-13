import type { MetaFunction } from 'react-router'
import { href, Link } from 'react-router'
import Content from '~/assets/privacy.mdx'
import { Heading, ProseContent } from '~/components/typography'
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

      <ProseContent variant="default">
        <Content />
      </ProseContent>

      <div className="mt-16 text-center">
        <Button variant="outline" className="rounded-xl" asChild>
          <Link to={href('/')}>トップに戻る</Link>
        </Button>
      </div>
    </div>
  )
}
