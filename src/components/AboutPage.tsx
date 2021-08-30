import React from 'react'
import { Heading, Button, Table, Tbody, Tr, Td, chakra } from '@chakra-ui/react'
import CoverPage from '../components/CoverPage'

const AboutPage: React.FC = () => {
  return (
    <CoverPage id="about" bgImage="/about.jpg">
      <Heading fontSize="5xl" fontWeight="black" lineHeight="1">
        About
      </Heading>

      <Table variant="unstyled" colorScheme="white" size="sm" mt="8">
        <Tbody>
          <Tr>
            <Td fontWeight="bold">会社名</Td>
            <Td>株式会社TechTalk</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">所在地</Td>
            <Td>東京都中央区佃2-1-2</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">代表</Td>
            <Td>
              溝口浩二
              <chakra.a
                ml="4"
                href="https://shareboss.net/p/boss/koji-mizoguchi/"
                target="_blank"
              >
                <Button colorScheme="accent" size="xs">
                  代表略歴
                </Button>
              </chakra.a>
            </Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">事業内容</Td>
            <Td>
              <chakra.ol lineHeight="5" ml="4">
                <li>技術に基づく新規事業構築支援</li>
                <li>事業仮説検証のためのMVP開発支援</li>
                <li>アライアンス構築支援</li>
                <li>
                  クラウドサービスの企画・開発
                  <chakra.div ml="2">
                    <a
                      href="https://ima-ticket.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      イマチケ
                    </a>
                    <chakra.small ml="2">
                      オンラインライブチケット販売サービス
                    </chakra.small>
                  </chakra.div>
                </li>
              </chakra.ol>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </CoverPage>
  )
}

export default AboutPage
