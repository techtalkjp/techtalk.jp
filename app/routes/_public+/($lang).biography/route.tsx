import {
  ArrowLeftIcon,
  FacebookIcon,
  GithubIcon,
  TwitterIcon,
} from 'lucide-react'
import type { MetaFunction } from 'react-router'
import { Link } from 'react-router'
import BiographyContentEn from '~/assets/biography.en.mdx'
import BiographyContentJa from '~/assets/biography.mdx'
import { Header } from '~/components/Header'
import { Heading, ProseContent } from '~/components/typography'
import { Avatar, AvatarImage, Button, Stack } from '~/components/ui'
import { useLocale } from '~/i18n/hooks/useLocale'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const locale = data?.locale || 'ja'
  const title = locale === 'en' ? 'Biography - TechTalk' : '代表略歴 - TechTalk'
  const description =
    locale === 'en'
      ? 'Biography of Koji Mizoguchi, CEO of TechTalk Inc.'
      : '株式会社TechTalk代表 溝口浩二の略歴'

  return [{ title }, { name: 'description', content: description }]
}

export const loader = ({ params }: { params: { lang?: string } }) => {
  return { locale: params.lang || 'ja' }
}

interface Article {
  year: string
  title: string
  url: string
  image: string
  excerpt: string
}

const articles: Record<'ja' | 'en', Article[]> = {
  ja: [
    {
      year: '2018年 Forbes JAPAN',
      title: '合弁会社で世界へ　タクシーメディアの掲げる野望',
      url: 'https://forbesjapan.com/articles/detail/22941',
      image:
        'https://shareboss.net/wp-content/uploads/2019/11/c0ef11a7611e6c1a64940ca869d9adf5.jpg',
      excerpt:
        '2015年10月、JapanTaxi CMO・金高恩氏とフリークアウト・ホールディングス 執行役員・溝口浩二氏はランチの席にいた。JapanTaxiのとある優秀なエンジニアを引き抜くためだった。ところが思惑は外れ、溝口氏は仕方なしに自社の事業を紹介することに。これが後にタクシーのデジタルサイネージ事業を手がける合弁会社、IRIS（以下、IRIS）設立につながることになる。',
    },
    {
      year: '2014年 THE BRIDGE',
      title:
        '「本田の描く広告の未来を実現する」ーー隠れたキーマンを調べるお・フリークアウト、溝口氏インタビュー',
      url: 'https://thebridge.jp/2014/06/takanori-oshiba-interview-series-vol-7',
      image: 'https://thebridge.jp/wp-content/uploads/2014/06/freakout1.jpg',
      excerpt:
        '国内屈指のDSP（Demand Side Platform）として名をはせるフリークアウト。創業からわずか3年半で東証マザーズに上場し、その勢いは増すばかりです。そのフリークアウトと言えばかつてブレイナーを創業し、ヤフーに売却した経験を持つ創業者の本田謙氏と、Googleなどを経て創業に参画したCOO（最高執行責任者）の佐藤裕介氏がよく知られています。そんな同社の「隠れたキーマン」として今回ご紹介するのは溝口浩二氏。社内を横断的に動き、開発、企画、採用など幅広くカバーしながら本田、佐藤両氏を支える同氏にスポットライトをあててみました。',
    },
    {
      year: '2007年 CNET JAPAN',
      title: 'ニワンゴ技術責任者が語る、「ニコニコ動画」成功の鍵',
      url: 'https://japan.cnet.com/article/20361283/',
      image:
        'https://japan.cnet.com/story_media/20361283/CNETJ/071117_niwango2.jpg',
      excerpt:
        'ニコニコ動画はどのようにして生まれ、どういった点が成功の鍵を握ったのか。また、ニコニコ動画のようなサービスを開発する上で求められる人材像とはどんなものなのだろうか。ニワンゴ技術担当取締役の溝口浩二氏が11月17日に東京都内で開催された就職支援イベント「ミリオンタイムズスクウェア キャリアアップセミナー」の講演で明らかにした。',
    },
  ],
  en: [
    {
      year: '2018 Forbes JAPAN',
      title: 'Joint Venture Going Global: The Ambition of Taxi Media',
      url: 'https://forbesjapan.com/articles/detail/22941',
      image:
        'https://shareboss.net/wp-content/uploads/2019/11/c0ef11a7611e6c1a64940ca869d9adf5.jpg',
      excerpt:
        "In October 2015, JapanTaxi CMO Kim Ko-eun and FreakOut Holdings Executive Officer Koji Mizoguchi were at a lunch meeting. It was intended to recruit a talented engineer from JapanTaxi. However, when that plan fell through, Mizoguchi ended up introducing his company's business instead. This eventually led to the establishment of IRIS, a joint venture handling digital signage business for taxis.",
    },
    {
      year: '2014 THE BRIDGE',
      title:
        "\"Realizing Honda's Vision of Advertising's Future\" - Interview with FreakOut's Hidden Key Person, Mizoguchi",
      url: 'https://thebridge.jp/2014/06/takanori-oshiba-interview-series-vol-7',
      image: 'https://thebridge.jp/wp-content/uploads/2014/06/freakout1.jpg',
      excerpt:
        'FreakOut is renowned as one of Japan\'s leading DSP (Demand Side Platform) companies. The company went public on the Tokyo Stock Exchange Mothers just 3.5 years after its founding, and its momentum continues to grow. FreakOut is well-known for founder Ken Honda, who previously founded Brainer and sold it to Yahoo, and COO Yusuke Sato, who joined the founding team after working at Google and other companies. This time, we spotlight Koji Mizoguchi, the company\'s "hidden key person" who supports both Honda and Sato while working across the organization, covering development, planning, recruitment, and more.',
    },
    {
      year: '2007 CNET JAPAN',
      title: 'Niwango\'s CTO Discusses the Key to "Niconico Douga\'s" Success',
      url: 'https://japan.cnet.com/article/20361283/',
      image:
        'https://japan.cnet.com/story_media/20361283/CNETJ/071117_niwango2.jpg',
      excerpt:
        'How was Niconico Douga born, and what were the keys to its success? What kind of talent is required to develop services like Niconico Douga? Koji Mizoguchi, CTO of Niwango, revealed these insights at the "Million Times Square Career Up Seminar," a job support event held in Tokyo on November 17.',
    },
  ],
}

export default function BiographyPage() {
  const { t, locale } = useLocale()

  const BiographyContent =
    locale === 'en' ? BiographyContentEn : BiographyContentJa
  const currentArticles = locale === 'en' ? articles.en : articles.ja

  return (
    <>
      <Header
        left={
          <Button variant="ghost" size="sm" className="text-white" asChild>
            <Link
              to={locale === 'ja' ? '/' : `/${locale}`}
              viewTransition
              preventScrollReset={false}
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              {t('common.back', '戻る')}
            </Link>
          </Button>
        }
      />

      <div className="container px-6 py-24">
        <Stack className="mx-auto max-w-3xl gap-24">
          <Stack className="gap-8">
            <Stack className="items-start gap-6 sm:flex-row sm:items-center">
              <Avatar className="h-24 w-24 flex-shrink-0 rounded-xl">
                <AvatarImage src="/images/coji.webp" loading="lazy" />
              </Avatar>
              <Stack className="min-w-0 flex-1 gap-3">
                <Heading size="2xl" className="leading-tight break-words">
                  {locale === 'en' ? 'Koji Mizoguchi (coji)' : '溝口浩二 coji'}
                </Heading>
                <p className="text-muted-foreground text-base">
                  {locale === 'en'
                    ? 'CEO, TechTalk Inc.'
                    : '株式会社TechTalk 代表取締役'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border/20 text-foreground/60 hover:border-border/40 hover:text-foreground cursor-pointer rounded-xl transition-colors"
                    asChild
                  >
                    <a
                      href="https://twitter.com/techtalkjp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5"
                    >
                      <TwitterIcon className="h-4 w-4" />
                      <span className="text-xs">Twitter</span>
                    </a>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border/20 text-foreground/60 hover:border-border/40 hover:text-foreground cursor-pointer rounded-xl transition-colors"
                    asChild
                  >
                    <a
                      href="https://www.facebook.com/mizoguchi.coji"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5"
                    >
                      <FacebookIcon className="h-4 w-4" />
                      <span className="text-xs">Facebook</span>
                    </a>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border/20 text-foreground/60 hover:border-border/40 hover:text-foreground cursor-pointer rounded-xl transition-colors"
                    asChild
                  >
                    <a
                      href="https://github.com/coji"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5"
                    >
                      <GithubIcon className="h-4 w-4" />
                      <span className="text-xs">GitHub</span>
                    </a>
                  </Button>
                </div>
              </Stack>
            </Stack>

            <ProseContent variant="rich">
              <BiographyContent />
            </ProseContent>
          </Stack>

          <Stack className="gap-10">
            <div className="max-w-none">
              <h2 className="bg-muted/50 rounded-xl px-6 py-4 text-xl leading-snug font-bold backdrop-blur-sm">
                {t('biography.articles', '掲載記事')}
              </h2>
            </div>

            <Stack className="gap-10">
              {currentArticles.map((article) => (
                <a
                  key={article.url}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-card/50 hover:bg-card/80 block rounded-xl border p-6 backdrop-blur-sm transition-all hover:shadow-lg"
                >
                  <p className="text-muted-foreground mb-3 text-sm">
                    {article.year}
                  </p>
                  <h3 className="text-primary group-hover:text-primary/80 mb-4 text-base leading-snug font-semibold break-words transition-colors sm:text-lg">
                    {article.title}
                  </h3>
                  <Stack className="items-start gap-4 sm:flex-row">
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      className="aspect-[3/2] w-full flex-shrink-0 rounded-xl object-cover sm:w-48"
                    />
                    <blockquote className="text-muted-foreground border-primary/40 min-w-0 flex-1 border-l-[3px] pl-4 text-sm leading-relaxed">
                      {article.excerpt}
                    </blockquote>
                  </Stack>
                </a>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </div>
    </>
  )
}
