import { useEffect, useState } from 'react'
import type { MetaFunction } from 'react-router'
import { Footer } from '~/components/layout/Footer'
import { SITE_URL } from '~/config/site'
import { useScrollAnimation } from '~/hooks/useScrollAnimation'
import { useLocale } from '~/i18n/hooks/useLocale'
import { BiographyHero } from './components/BiographyHero'
import { BiographyNavigation } from './components/BiographyNavigation'
import { CareerTimeline } from './components/CareerTimeline'
import { MediaCoverage } from './components/MediaCoverage'
import { SocialLinks } from './components/SocialLinks'

export const meta: MetaFunction<typeof loader> = ({ params }) => {
  const lang = params.lang ?? 'ja'
  const isJapanese = lang === 'ja'
  const url = isJapanese
    ? `${SITE_URL}/biography`
    : `${SITE_URL}/${lang}/biography`
  const title = isJapanese
    ? '溝口 浩二 - Biography | TechTalk, Inc.'
    : 'Coji Mizoguchi - Biography | TechTalk, Inc.'
  const description = isJapanese
    ? '技術と事業の両面から0→1を生み出すことを専門としています。フリークアウト、IRIS、TechTalkでの経験。'
    : 'Specializing in creating 0→1 value from both technical and business perspectives. Experience at FreakOut, IRIS, and TechTalk.'

  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'profile' },
    { property: 'og:image', content: `${SITE_URL}/og-image.jpeg` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: `${SITE_URL}/og-image.jpeg` },
    { tagName: 'link', rel: 'canonical', href: url },
    {
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'ja',
      href: `${SITE_URL}/biography`,
    },
    {
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'en',
      href: `${SITE_URL}/en/biography`,
    },
    {
      tagName: 'link',
      rel: 'alternate',
      hrefLang: 'x-default',
      href: `${SITE_URL}/biography`,
    },
  ]
}

export const loader = ({ params }: { params: { lang?: string } }) => {
  const lang = params.lang

  // Validate lang parameter - only 'en' is supported, everything else defaults to 'ja'
  if (lang && lang !== 'en' && lang !== 'ja') {
    throw new Response('Not Found', { status: 404 })
  }

  // Normalize lang to ensure consistency
  const normalizedLang = lang === 'en' ? 'en' : 'ja'

  return { lang: normalizedLang }
}

export default function BiographyPage() {
  const { t } = useLocale()
  const [mounted, setMounted] = useState(false)

  // Synchronize with DOM: trigger animations after component mounts
  useScrollAnimation()

  // External synchronization: Track mounted state for hero animation
  useEffect(() => {
    setMounted(true)
  }, [])

  const articles = [
    {
      href: 'https://forbesjapan.com/articles/detail/22941',
      image:
        'https://shareboss.net/wp-content/uploads/2019/11/c0ef11a7611e6c1a64940ca869d9adf5.jpg',
      publisher: t('bio.media.forbes.title', 'Forbes JAPAN'),
      title: t(
        'bio.media.forbes.description',
        '合弁会社で世界へ タクシーメディアの掲げる野望',
      ),
    },
    {
      href: 'https://thebridge.jp/2014/06/takanori-oshiba-interview-series-vol-7',
      image: 'https://thebridge.jp/wp-content/uploads/2014/06/freakout1.jpg',
      publisher: t('bio.media.thebridge.title', 'THE BRIDGE'),
      title: t(
        'bio.media.thebridge.description',
        '「本田の描く広告の未来を実現する」ーー隠れたキーマンを調べるお・フリークアウト、溝口氏インタビュー',
      ),
    },
    {
      href: 'https://japan.cnet.com/article/20361283/',
      image:
        'https://japan.cnet.com/story_media/20361283/CNETJ/071117_niwango2.jpg',
      publisher: t('bio.media.cnet.title', 'CNET Japan'),
      title: t(
        'bio.media.cnet.description',
        'ニワンゴ技術責任者が語る、「ニコニコ動画」成功の鍵',
      ),
    },
  ]

  const careers = [
    {
      period: t('bio.career.techtalk.period', '2019年 - 現在'),
      title: t('bio.career.techtalk.title', '株式会社TechTalk 代表取締役'),
      description: t(
        'bio.career.techtalk.description',
        'ひとり法人として複数の企業に対して技術実装を提供。化学物質検索システム、AI活用MVP、データパイプライン、マーケティング統合など、幅広い領域で実装を継続。',
      ),
    },
    {
      period: t('bio.career.iris.period', '2016年 - 2019年'),
      title: t('bio.career.iris.title', '株式会社IRIS 代表取締役副社長'),
      description: t(
        'bio.career.iris.description',
        'FreakOutでの事業開発・アライアンス業務の中で、JapanTaxiとの合弁会社として設立。タクシーサイネージ事業を2名体制で立ち上げ、事業計画の立案から経営レベルのマネジメント、ハードウェア・動画広告・配信システムの統合まで、事業と技術のすべてを統括。',
      ),
    },
    {
      period: t('bio.career.freakout.period', '2013年 - 2019年'),
      title: t(
        'bio.career.freakout.title',
        '株式会社FreakOut(現 株式会社フリークアウト・ホールディングス)',
      ),
      description: t(
        'bio.career.freakout.description',
        '技術に基づいた事業開発やアライアンスに従事。DSPの入札ロジック構築では、データアナリストとしてビジネス要件を数値化し、機械学習チームとの橋渡しを担当。',
      ),
    },
    {
      period: t('bio.career.dwango.period', '1999年 - 2013年'),
      title: t(
        'bio.career.dwango.title',
        '株式会社ドワンゴ / 株式会社ニワンゴ',
      ),
      description: t(
        'bio.career.dwango.description',
        'エンジニア、プログラマーとしてキャリアをスタート。着メロサービス、動画サービス、ポータルサイトなどのエンジニアリングマネージャーを経験。ニワンゴでは技術担当取締役を担当。',
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-white">
      {/* Background Grid */}
      <div className="bg-grid fixed inset-0 opacity-30 dark:opacity-100" />

      {/* Content */}
      <div className="relative">
        <BiographyNavigation />
        <BiographyHero mounted={mounted} />
        <SocialLinks />
        <CareerTimeline careers={careers} />
        <MediaCoverage articles={articles} />
        <Footer />
      </div>
    </div>
  )
}
