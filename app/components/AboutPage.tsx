import { Button, chakra, Heading, Table, Tbody, Td, Tr } from '@chakra-ui/react'
import { useLocale } from '~/hooks/useLocale'
import CoverPage from './CoverPage'

export const AboutPage = () => {
  const { t } = useLocale()
  return (
    <CoverPage id="about" bgImage="/about.jpg">
      <Heading fontSize="5xl" fontWeight="black" lineHeight="1">
        {t('about.title', '会社概要')}
      </Heading>

      <Table variant="unstyled" colorScheme="white" size="sm" mt="8">
        <Tbody>
          <Tr>
            <Td fontWeight="bold">{t('about.company', '会社名')}</Td>
            <Td>{t('techtalkinc', '株式会社TechTalk')}</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">{t('about.address', '所在地')}</Td>
            <Td>{t('companyaddress', '東京都中央区佃2-1-2')}</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">{t('about.representative', '代表')}</Td>
            <Td>
              {t('cojimizoguchi', '溝口 浩二')}
              <chakra.a
                ml="4"
                href="https://shareboss.net/p/boss/koji-mizoguchi/"
                target="_blank"
              >
                <Button colorScheme="accent" size="xs">
                  {t('about.biography', '代表略歴')}
                </Button>
              </chakra.a>
            </Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">{t('about.business', '事業内容')}</Td>
            <Td>
              <chakra.ol lineHeight="5" ml="4">
                <li>{t('about.business.1', '技術に基づく新規事業構築支援')}</li>
                <li>
                  {t('about.business.2', '事業仮説検証のためのMVP開発支援')}
                </li>
                <li>{t('about.business.3', 'アライアンス構築支援')}</li>
                <li>
                  {t('about.business.4', 'クラウドサービスの企画・開発')}
                  <chakra.div ml="2">
                    <a
                      href="https://ima-ticket.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('about.business.4.1.title', 'イマチケ')}
                    </a>
                    <chakra.small ml="2">
                      {t(
                        'about.business.4.1.description',
                        'ライブチケット販売サービス'
                      )}
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
