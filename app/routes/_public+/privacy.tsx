import type { MetaFunction } from 'react-router'
import { href, Link } from 'react-router'
import Content from '~/assets/privacy.mdx'
import { Button, Heading } from '~/components/ui'

export const meta: MetaFunction = () => [
  { title: 'プライバシーポリシー - TechTalk' },
]

export default function Privacy() {
  return (
    <>
      <Heading className="my-16 text-center text-4xl">
        TechTalkプライバシーポリシー
      </Heading>

      <div className="markdown prone container">
        <Content />

        <div className="my-16 text-center">
          <Button asChild>
            <Link to={href('/')}>トップに戻る</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
