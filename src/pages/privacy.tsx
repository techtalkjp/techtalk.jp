import { NextPage } from 'next'

interface Props {
  content: string
}

const Privacy: NextPage<Props> = ({ content }) => {
  return <div>{content}</div>
}
export default Privacy

export const getStaticProps = () => {
  return {
    props: {
      content: 'プライバシー!'
    }
  }
}
