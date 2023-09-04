import { Heading, HStack } from '~/components/ui'
import { useLocale } from '~/features/i18n/hooks/useLocale'
import { BiographyPopover } from '../BiographyPopover'
import CoverPage from '../CoverPage'

export const AboutPage = () => {
  const { t } = useLocale()
  return (
    <CoverPage id="about" bgImage="/images/about.webp">
      <Heading>{t('about.title', '会社概要')}</Heading>

      <table className="mt-4 text-left">
        <tbody>
          <tr>
            <td className="p-1 font-bold sm:p-4">{t('about.company', '会社名')}</td>
            <td className="p-1 sm:p-4">{t('techtalkinc', '株式会社TechTalk')}</td>
          </tr>
          <tr>
            <td className="p-1 font-bold sm:p-4">{t('about.address', '所在地')}</td>
            <td className="p-1 sm:p-4">{t('companyaddress', '東京都中央区佃2-1-2')}</td>
          </tr>
          <tr>
            <td className="p-1 font-bold sm:p-4">{t('about.representative', '代表')}</td>
            <td className="p-1 sm:p-4">
              <HStack>
                <p>{t('cojimizoguchi', '溝口 浩二')}</p>
                <BiographyPopover />
              </HStack>
            </td>
          </tr>
          <tr>
            <td className="p-1 font-bold sm:p-4">{t('about.business', '事業内容')}</td>
            <td className="p-1 sm:p-4">
              <ul>
                <li>{t('about.business.1', '技術に基づく新規事業開発支援')}</li>
                <li>{t('about.business.2', '事業仮説検証のためのMVP開発支援')}</li>
                <li>{t('about.business.3', 'アライアンス構築支援')}</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </CoverPage>
  )
}
