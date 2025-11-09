import { Heading } from '~/components/typography'
import { HStack } from '~/components/ui'
import { useLocale } from '~/i18n/hooks/useLocale'
import { BiographyPopover } from '~/routes/_public+/($lang)._index/components/BiographyPopover'
import CoverPage from '~/routes/_public+/($lang)._index/components/CoverPage'

export const AboutPage = ({ className }: React.ComponentProps<'div'>) => {
  const { t } = useLocale()
  return (
    <CoverPage id="about" bgImage="/images/about.webp" className={className}>
      <Heading className="scroll-fade-in">
        {t('about.title', '会社概要')}
      </Heading>

      <dl className="scroll-fade-in mx-auto mt-8 max-w-2xl space-y-6 text-left">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
          <dt className="text-foreground/90 min-w-[120px] font-bold">
            {t('about.company', '会社名')}
          </dt>
          <dd className="text-foreground/80 flex-1">
            {t('techtalkinc', '株式会社TechTalk')}
          </dd>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
          <dt className="text-foreground/90 min-w-[120px] font-bold">
            {t('about.address', '所在地')}
          </dt>
          <dd className="text-foreground/80 flex-1">
            {t('companyaddress', '東京都中央区佃2-1-2')}
          </dd>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
          <dt className="text-foreground/90 min-w-[120px] font-bold">
            {t('about.representative', '代表')}
          </dt>
          <dd className="text-foreground/80 flex-1">
            <HStack>
              <p>{t('cojimizoguchi', '溝口 浩二')}</p>
              <BiographyPopover />
            </HStack>
          </dd>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
          <dt className="text-foreground/90 min-w-[120px] font-bold">
            {t('about.business', '事業内容')}
          </dt>
          <dd className="text-foreground/80 flex-1">
            <ul className="space-y-2">
              <li>{t('about.business.1', '技術に基づく新規事業開発支援')}</li>
              <li>
                {t('about.business.2', '事業仮説検証のためのMVP開発支援')}
              </li>
              <li>{t('about.business.3', 'アライアンス構築支援')}</li>
            </ul>
          </dd>
        </div>
      </dl>
    </CoverPage>
  )
}
