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
import { Avatar, AvatarImage, Button, Heading, Stack } from '~/components/ui'
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

      <div className="container px-4 py-12 pt-24">
        <Stack className="mx-auto max-w-4xl gap-8">
          <Stack className="gap-6">
            <Stack className="items-start gap-6 sm:flex-row">
              <Avatar className="h-24 w-24 flex-shrink-0">
                <AvatarImage src="/images/coji.webp" loading="lazy" />
              </Avatar>
              <Stack className="min-w-0 flex-1 gap-2">
                <Heading size="2xl" className="break-words">
                  {locale === 'en' ? 'Koji Mizoguchi (coji)' : '溝口浩二 coji'}
                </Heading>
                <p className="text-muted-foreground">
                  {locale === 'en'
                    ? 'CEO, TechTalk Inc.'
                    : '株式会社TechTalk 代表取締役'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="cursor-pointer text-white/50 hover:text-white"
                    asChild
                  >
                    <a
                      href="https://twitter.com/techtalkjp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <TwitterIcon className="h-4 w-4" />{' '}
                      <p className="ml-1 text-xs">Twitter</p>
                    </a>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="cursor-pointer text-white/50 hover:text-white"
                    asChild
                  >
                    <a
                      href="https://www.facebook.com/mizoguchi.coji"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <FacebookIcon className="h-4 w-4" />{' '}
                      <p className="ml-1 text-xs">Facebook</p>
                    </a>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="cursor-pointer text-white/50 hover:text-white"
                    asChild
                  >
                    <a
                      href="https://github.com/coji"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <GithubIcon className="h-4 w-4" />{' '}
                      <p className="ml-1 text-xs">GitHub</p>
                    </a>
                  </Button>
                </div>
              </Stack>
            </Stack>

            <div className="max-w-none [&_a]:mb-2 [&_a]:inline-block [&_a]:font-medium [&_a]:text-blue-500 [&_a]:no-underline [&_a]:transition-colors dark:[&_a]:text-blue-400 [&_a:hover]:text-blue-700 [&_a:hover]:underline dark:[&_a:hover]:text-blue-300 [&_blockquote]:my-4 [&_blockquote]:rounded-lg [&_blockquote]:border-l-[3px] [&_blockquote]:border-blue-500 [&_blockquote]:bg-slate-500/5 [&_blockquote]:p-4 [&_blockquote]:text-sm [&_blockquote]:leading-normal [&_blockquote]:italic dark:[&_blockquote]:border-blue-400 dark:[&_blockquote]:bg-slate-500/[0.08] [&_blockquote_p]:my-1 [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:leading-tight [&_h1]:font-bold [&_h2]:mt-8 [&_h2]:mb-6 [&_h2]:rounded-lg [&_h2]:bg-slate-500/[0.08] [&_h2]:px-4 [&_h2]:py-3 [&_h2]:text-xl [&_h2]:leading-snug [&_h2]:font-bold dark:[&_h2]:bg-slate-500/10 [&_h2:first-child]:mt-0 [&_img]:h-auto [&_img]:w-full [&_img]:max-w-xs [&_img]:rounded-lg [&_img]:object-cover [&_img]:shadow [&_p]:my-3 [&_p]:text-left [&_p]:leading-relaxed">
              <BiographyContent />
            </div>

            <div className="space-y-6">
              <div className="max-w-none">
                <h2 className="mt-8 mb-6 rounded-lg bg-slate-500/[0.08] px-4 py-3 text-xl leading-snug font-bold dark:bg-slate-500/10">
                  {t('biography.articles', '掲載記事')}
                </h2>
              </div>

              {currentArticles.map((article) => (
                <div
                  key={article.url}
                  className="bg-card rounded-lg border p-4 transition-shadow hover:shadow-md sm:p-6"
                >
                  <p className="text-muted-foreground mb-2 text-sm">
                    {article.year}
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-4 block text-base font-semibold break-words text-blue-600 hover:text-blue-700 sm:text-lg dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {article.title}
                  </a>
                  <Stack className="items-start gap-4 sm:flex-row">
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      className="h-48 w-full flex-shrink-0 rounded object-cover sm:h-32 sm:w-32"
                    />
                    <blockquote className="text-muted-foreground min-w-0 flex-1 border-l-4 border-blue-500 pl-4 text-sm italic">
                      {article.excerpt}
                    </blockquote>
                  </Stack>
                </div>
              ))}
            </div>
          </Stack>
        </Stack>
      </div>
    </>
  )
}
