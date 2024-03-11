import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import Content from '~/assets/privacy.md'
import { Button, Heading } from '~/components/ui'

export const meta: MetaFunction = () => [
  { title: 'プライバシーポリシー - TechTalk' },
]

export default function Privacy() {
  return (
    <>
      <Heading className="my-16 text-center text-4xl font-black">
        TechTalkプライバシーポリシー
      </Heading>

      <div className="markdown prone container">
        <Content />

        <div className="my-16 text-center">
          <Button asChild>
            <Link to="/">トップに戻る</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
