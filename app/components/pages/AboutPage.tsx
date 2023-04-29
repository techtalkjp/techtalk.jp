import {
  HStack,
  Heading,
  List,
  ListItem,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
} from '@chakra-ui/react'
import { useLocale } from '~/features/i18n/hooks/useLocale'
import { BiographyPopover } from '../BiographyPopover'
import CoverPage from '../CoverPage'

export const AboutPage = () => {
  const { t } = useLocale()
  return (
    <CoverPage id="about" bgImage="/images/about.webp">
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
              <HStack>
                <Text>{t('cojimizoguchi', '溝口 浩二')}</Text>
                <BiographyPopover />
              </HStack>
            </Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">{t('about.business', '事業内容')}</Td>
            <Td>
              <List lineHeight="5">
                <ListItem>
                  {t('about.business.1', '技術に基づく新規事業構築支援')}
                </ListItem>
                <ListItem>
                  {t('about.business.2', '事業仮説検証のためのMVP開発支援')}
                </ListItem>
                <ListItem>
                  {t('about.business.3', 'アライアンス構築支援')}
                </ListItem>
              </List>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </CoverPage>
  )
}
