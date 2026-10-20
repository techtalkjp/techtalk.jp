import { css, type Handle, type RemixNode } from 'remix/component'

import type { Locale } from '../../i18n/index.ts'

/**
 * Artifact Share でサンプルの技術検証レポートを開いた画面を、ブラウザの枠ごと HTML で描く。
 * 中身は公開しているサンプル（ja: /a/kblg7hwkv2、en: /a/0w3cy597f1）の冒頭と、
 * そこに付いているコメントのやり取り（質問に答えて v2 に更新した返信）に合わせている。
 * 上のバーとコメント欄は Artifact Share の閲覧画面（viewer-chrome、comment-panel）の並びと色に合わせた。
 *
 * 寸法はすべて u()（枠の幅から決めた 1px 相当の長さ --px の倍数）で書き、全体を縮める（画面写真のように縮小される）。
 * 狭い枠では小さくなりすぎないよう、仮想の画面幅を狭くし、コメント欄を隠して並びを詰める
 */
export function ProductPreview(
  handle: Handle<{ locale: Locale; label: string }>,
) {
  return () => {
    let { locale, label } = handle.props
    let s = samples[locale]
    return (
      <div role="img" aria-label={label} mix={frameStyle}>
        <div mix={browserBarStyle}>
          <span mix={dotsStyle}>
            <span />
            <span />
            <span />
          </span>
          <span mix={addressStyle}>
            <LockIcon />
            {s.url}
          </span>
        </div>

        <div mix={viewerStyle}>
          <header mix={topbarStyle}>
            <span mix={homeStyle}>
              <img
                src="/images/artifact-share-mark.svg"
                alt=""
                width={20}
                height={20}
              />
              <span mix={wideOnly}>Artifact Share</span>
            </span>
            <span mix={fileBadgeStyle}>HTML</span>
            <span mix={titleBlockStyle}>
              <span mix={titleStyle}>{s.title}</span>
              <span mix={metaStyle}>
                <img
                  src="/images/coji.webp"
                  alt=""
                  width={14}
                  height={14}
                  mix={ownerAvatarStyle}
                />
                Coji Mizoguchi
              </span>
            </span>
            <span mix={css({ flex: 1 })} />
            <span mix={chipStyle}>
              <TablerIcon size={13}>
                <path d="M9 15l6 -6" />
                <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
                <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
              </TablerIcon>
              {s.linkSharing}
            </span>
            <span mix={ghostButtonStyle}>
              <MessageIcon size={15} />
              <span mix={wideOnly}>{s.comments}</span>
              <span mix={countStyle}>1</span>
            </span>
            <span mix={primaryStyle}>
              <TablerIcon size={14}>
                <path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
                <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
              </TablerIcon>
              <span mix={wideOnly}>{s.copyLink}</span>
            </span>
          </header>

          <div mix={bodyStyle}>
            <div mix={reportStyle}>
              <div mix={docStyle}>
                <p mix={reportMetaStyle}>{s.meta}</p>
                <p mix={reportTitleStyle}>{s.title}</p>
                <div mix={pathStyle}>
                  <div mix={stepStyle}>
                    <div mix={stepLabelStyle}>{s.tech.label}</div>
                    <div mix={stepTitleStyle}>{s.tech.title}</div>
                    <div mix={stepNoteStyle}>{s.tech.note}</div>
                  </div>
                  <Arrow />
                  <div mix={stepStyle}>
                    <div mix={stepLabelStyle}>{s.proof.label}</div>
                    <div mix={proofListStyle}>
                      {s.proof.items.map((item) => (
                        <div key={item.label} mix={proofRowStyle}>
                          <b>
                            {item.value}
                            <small>{item.unit}</small>
                          </b>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Arrow />
                  <div mix={[stepStyle, seedStyle]}>
                    <div mix={stepLabelStyle}>{s.seed.label}</div>
                    <div mix={stepTitleStyle}>{s.seed.title}</div>
                    <div mix={stepNoteStyle}>{s.seed.note}</div>
                    <div mix={seedPriceStyle}>{s.seed.price}</div>
                  </div>
                </div>
                <p mix={verdictStyle}>
                  {s.verdict}
                  <span>{s.verdictNext}</span>
                </p>
              </div>

              <span mix={versionWidgetStyle}>
                <TablerIcon size={14}>
                  <path d="M12 8l0 4l2 2" />
                  <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
                </TablerIcon>
                v2
              </span>
            </div>

            <aside mix={panelStyle}>
              <div mix={panelHeaderStyle}>
                <MessageIcon size={16} />
                {s.comments}
              </div>
              <div mix={threadStyle}>
                <div mix={threadTopStyle}>
                  <span mix={openPillStyle}>{s.open}</span>
                </div>
                <div mix={quoteStyle}>{s.thread.quote}</div>
                <Message
                  name="Coji Mizoguchi"
                  time={s.thread.askedAt}
                  body={s.thread.question}
                />
                <div mix={replyStyle}>
                  <Message
                    name="Coji Mizoguchi"
                    agent="Claude"
                    time={s.thread.answeredAt}
                    body={s.thread.answer}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    )
  }
}

/** コメントの 1 件。名前の横に、エージェント経由の投稿ならその名前の札を付ける */
function Message(
  handle: Handle<{ name: string; agent?: string; time: string; body: string }>,
) {
  return () => {
    let { name, agent, time, body } = handle.props
    return (
      <div mix={messageStyle}>
        <img
          src="/images/coji.webp"
          alt=""
          width={22}
          height={22}
          mix={messageAvatarStyle}
        />
        <div>
          <div mix={messageMetaStyle}>
            <b>{name}</b>
            {agent ? <span mix={agentBadgeStyle}>{agent}</span> : null}
            <span>{time}</span>
          </div>
          <p mix={messageBodyStyle}>{body}</p>
        </div>
      </div>
    )
  }
}

function Arrow() {
  return () => (
    <div mix={arrowStyle} aria-hidden="true">
      <TablerIcon size={18}>
        <path d="M5 12h14" />
        <path d="M13 6l6 6l-6 6" />
      </TablerIcon>
    </div>
  )
}

function MessageIcon(handle: Handle<{ size: number }>) {
  return () => (
    <TablerIcon size={handle.props.size}>
      <path d="M8 9h8" />
      <path d="M8 13h6" />
      <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />
    </TablerIcon>
  )
}

const samples = {
  ja: {
    url: 'artifactshare.com/a/kblg7hwkv2',
    title: '問い合わせを読む AI から、通販向けの製品はつくれるか',
    linkSharing: 'リンク共有',
    comments: 'コメント',
    copyLink: '共有リンクをコピー',
    open: '未解決',
    meta: 'サンプル · 技術検証レポート · 更新 2026-09-30',
    tech: {
      label: '試した技術',
      title: '問い合わせとレビューを AI で読み、購買データと合わせる',
      note: '架空の食品通販 1 社のデータで試した。',
    },
    proof: {
      label: '確かめたこと',
      items: [
        {
          value: '1.5',
          unit: '倍',
          label: '離反の当たり（購買データだけと比べて）',
        },
        { value: '91', unit: '%', label: '不満の分類が、人の判定と一致' },
        { value: '0.3', unit: '円', label: '1 件を読む費用' },
      ],
    },
    seed: {
      label: '製品の種',
      title: '通販向け「離反の兆し」サービス',
      note: 'EC と問い合わせ管理につなぐだけで、離れそうな顧客とその理由が毎週届く。',
      price: '料金の仮説 月 3 万円〜 · 原価 月 3,000 円前後',
    },
    verdict:
      'つくれる。どの通販でもデータの形がほぼ同じなので、1 社の改善で終わらず製品になる。',
    verdictNext: 'まず 3 社のデータで、同じ当たりが出るかを確かめる。',
    thread: {
      quote: '文章を書く顧客の割合で、伸びが変わる',
      question:
        '書く人が少ない店だと、どれくらい落ちる？ 3 社を選ぶ前に知りたい。',
      askedAt: '2 時間前',
      answer:
        '今回のデータから文章を間引いて試算し、「書く顧客が少ない店では、どうなるか」の節を追記しました（v2）。書く顧客が 2 割を切ると、伸びは 1.3 倍以下に落ちます。3 社を選ぶ条件に「書く顧客が 2 割以上」を加えました。',
      answeredAt: '1 時間前',
    },
  },
  en: {
    url: 'artifactshare.com/a/0w3cy597f1',
    title:
      'Can AI that reads support messages become a product for online stores?',
    linkSharing: 'Link sharing',
    comments: 'Comments',
    copyLink: 'Copy link',
    open: 'Open',
    meta: 'Sample · Technical validation report · Updated 2026-09-30',
    tech: {
      label: 'Technology tested',
      title:
        'Read support messages and reviews with AI, and combine them with purchase data',
      note: 'Tested on data from one fictional online food store.',
    },
    proof: {
      label: 'What we measured',
      items: [
        {
          value: '1.5',
          unit: '×',
          label: 'Churn hit rate vs. purchase data alone',
        },
        {
          value: '91',
          unit: '%',
          label: 'Complaint labels matching human review',
        },
        { value: '¥0.3', unit: '', label: 'Cost to read one message' },
      ],
    },
    seed: {
      label: 'Product seed',
      title: 'Churn Signals for online stores',
      note: 'Connect your store and help desk, and get a weekly list of customers likely to leave, with the reason.',
      price: 'Price hypothesis from ¥30,000/mo · Cost about ¥3,000/mo',
    },
    verdict:
      'Yes. Online stores share almost the same data shape, so this can be a product rather than a one-off fix. ',
    verdictNext:
      'Next, check that the same hit rate holds on data from three stores.',
    thread: {
      quote: 'The gain depends on how many customers write to you',
      question:
        'How much does it drop for stores where fewer customers write? I want to know before we pick the three stores.',
      askedAt: '2 hours ago',
      answer:
        'I thinned out the text in this data set to estimate it and added a "What if fewer customers write?" section (v2). Below 20% of customers writing, the gain falls to 1.3× or less. I added "at least 20% of customers write" to the criteria for picking the three stores.',
      answeredAt: '1 hour ago',
    },
  },
} satisfies Record<Locale, unknown>

/** Artifact Share の画面の px を、この部品の長さに直す */
function u(px: number) {
  return `calc(var(--px) * ${px})`
}

function TablerIcon(handle: Handle<{ size: number; children?: RemixNode }>) {
  return () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={2}
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      mix={css({
        flex: 'none',
        width: u(handle.props.size),
        height: u(handle.props.size),
      })}
    >
      {handle.props.children}
    </svg>
  )
}

function LockIcon() {
  return () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={2}
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      mix={css({ flex: 'none', width: '11px', height: '11px' })}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

/** 狭い枠（仮想の画面幅を詰めたとき）では隠す */
const narrow = '@container product-preview (width < 640px)'
const wideOnly = css({ [narrow]: { display: 'none' } })

const frameStyle = css({
  containerType: 'inline-size',
  containerName: 'product-preview',
  // 描いた画面の中の文字は選ばせない（画面写真の代わりなので）
  userSelect: 'none',
})

const browserBarStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  height: '36px',
  paddingInline: '14px',
  borderBottom: '1px solid var(--border)',
  background: 'var(--surface)',
})

const dotsStyle = css({
  display: 'flex',
  gap: '6px',
  '& > span': {
    width: '9px',
    height: '9px',
    borderRadius: '50%',
    background: 'var(--border-strong)',
  },
})

const addressStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  minWidth: 0,
  maxWidth: '28rem',
  flex: 1,
  marginInline: 'auto',
  height: '24px',
  paddingInline: '10px',
  borderRadius: 'var(--r-control)',
  background: 'var(--bg)',
  color: 'var(--text-subtle)',
  fontSize: 'var(--t-12)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  // 3 つの点の分だけ右にもずらし、アドレス欄を枠の真ん中に置く
  marginRight: '45px',
  [narrow]: { marginRight: 0 },
})

// Artifact Share の閲覧画面の色（light / dark）
const viewerStyle = css({
  '--as-bg': '#ffffff',
  '--as-fg': '#37352f',
  '--as-muted': '#f7f6f3',
  '--as-muted-fg': 'rgba(55, 53, 47, 0.86)',
  '--as-border': 'rgba(55, 53, 47, 0.1)',
  '--as-divider': 'rgba(55, 53, 47, 0.06)',
  '--as-primary': '#1766ad',
  '--as-primary-fg': '#ffffff',
  '--as-link': '#116bb1',
  '--as-warning': '#8a5a00',
  '--as-warning-soft': 'rgba(203, 145, 47, 0.1)',
  '@media (prefers-color-scheme: dark)': {
    '--as-bg': '#111315',
    '--as-fg': '#e7e2d8',
    '--as-muted': '#181b1e',
    '--as-muted-fg': 'rgba(231, 226, 216, 0.77)',
    '--as-border': 'rgba(231, 226, 216, 0.13)',
    '--as-divider': 'rgba(231, 226, 216, 0.08)',
    '--as-primary': '#7db7ff',
    '--as-primary-fg': '#111315',
    '--as-link': '#7db7ff',
    '--as-warning': '#e5b35d',
    '--as-warning-soft': 'rgba(229, 179, 93, 0.16)',
  },
  // 幅 1120px の画面として描く。狭い枠では 576px 相当にして並びを詰める
  '--px': 'calc(100cqi / 1120)',
  [narrow]: { '--px': 'calc(100cqi / 576)' },
  fontSize: u(16),
  lineHeight: 1.5,
  letterSpacing: 0,
  color: 'var(--as-fg)',
  background: 'var(--as-bg)',
})

const topbarStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: u(6),
  minHeight: u(52),
  paddingInline: u(8),
  borderBottom: '1px solid var(--as-divider)',
  background: 'var(--as-bg)',
  whiteSpace: 'nowrap',
})

const homeStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: u(6),
  height: u(28),
  paddingInline: u(6),
  fontSize: u(14),
  fontWeight: 700,
  color: 'var(--as-muted-fg)',
  '& > img': {
    width: u(20),
    height: u(20),
    borderRadius: '3px',
  },
})

const fileBadgeStyle = css({
  display: 'grid',
  placeItems: 'center',
  flex: 'none',
  width: u(20),
  height: u(20),
  border: '1px solid var(--as-divider)',
  borderRadius: '3px',
  background: 'var(--as-muted)',
  color: 'var(--as-muted-fg)',
  fontSize: u(6.5),
  fontWeight: 700,
  letterSpacing: '0.02em',
})

const titleBlockStyle = css({
  display: 'grid',
  minWidth: 0,
  maxWidth: u(480),
})

const titleStyle = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: u(14),
  fontWeight: 700,
  lineHeight: 1.35,
})

const metaStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: `0 ${u(6)}`,
  fontSize: u(12),
  color: 'var(--as-muted-fg)',
})

const ownerAvatarStyle = css({
  width: u(14),
  height: u(14),
  borderRadius: '50%',
})

const chipStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: u(4),
  paddingBlock: u(4),
  paddingInline: u(8),
  borderRadius: '999px',
  background: 'var(--as-warning-soft)',
  color: 'var(--as-warning)',
  fontSize: u(12),
  fontWeight: 700,
  // wideOnly と組み合わせると display の指定がぶつかるので、ここで隠す
  [narrow]: { display: 'none' },
})

const ghostButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: u(6),
  height: u(28),
  paddingInline: u(8),
  fontSize: u(13),
  color: 'var(--as-muted-fg)',
})

const countStyle = css({
  display: 'grid',
  placeItems: 'center',
  minWidth: u(18),
  height: u(18),
  paddingInline: u(5),
  borderRadius: '999px',
  background: 'color-mix(in srgb, var(--as-link) 14%, transparent)',
  color: 'var(--as-link)',
  fontSize: u(11),
  fontWeight: 700,
})

const primaryStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: u(6),
  height: u(28),
  paddingInline: u(12),
  marginRight: u(4),
  borderRadius: '3px',
  background: 'var(--as-primary)',
  color: 'var(--as-primary-fg)',
  fontSize: u(13),
  fontWeight: 700,
})

// 本文（共有された文書）とコメント欄を横に並べる。狭い枠ではコメント欄を隠す
const bodyStyle = css({
  display: 'flex',
  height: u(540),
  [narrow]: { height: u(560) },
})

// 共有された文書の側。サンプルはライトの配色だけなので、ダークでは少し落として白く浮かせない
const reportStyle = css({
  position: 'relative',
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  padding: `${u(36)} ${u(28)} 0`,
  background: '#ffffff',
  color: '#16181d',
  fontFamily:
    "'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic UI', system-ui, sans-serif",
  lineHeight: 1.7,
  '@media (prefers-color-scheme: dark)': {
    filter: 'brightness(0.93)',
  },
  [narrow]: { padding: `${u(28)} ${u(20)} 0` },
})

const docStyle = css({ maxWidth: u(880), marginInline: 'auto' })

const reportMetaStyle = css({ fontSize: u(12), color: '#656b76' })

const reportTitleStyle = css({
  marginTop: u(6),
  fontSize: u(27),
  fontWeight: 800,
  lineHeight: 1.3,
  letterSpacing: '-0.02em',
  textWrap: 'balance',
  [narrow]: { fontSize: u(24) },
})

const pathStyle = css({
  display: 'grid',
  gridTemplateColumns: `minmax(0, 1fr) ${u(24)} minmax(0, 1.3fr) ${u(24)} minmax(0, 1.1fr)`,
  marginTop: u(22),
  borderTop: `${u(3)} solid #16181d`,
  [narrow]: { gridTemplateColumns: 'minmax(0, 1fr)' },
})

const stepStyle = css({ padding: `${u(16)} 0 ${u(18)}` })

const stepLabelStyle = css({
  fontSize: u(11.5),
  fontWeight: 700,
  color: '#656b76',
})

const stepTitleStyle = css({
  marginTop: u(3),
  fontSize: u(15),
  fontWeight: 800,
  lineHeight: 1.5,
  textWrap: 'balance',
})

const stepNoteStyle = css({
  marginTop: u(5),
  fontSize: u(12),
  color: '#4a4f59',
})

const arrowStyle = css({
  display: 'grid',
  placeItems: 'center',
  color: '#7d8da0',
  [narrow]: { display: 'none' },
})

const proofListStyle = css({
  display: 'grid',
  gap: u(8),
  marginTop: u(8),
  [narrow]: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
})

const proofRowStyle = css({
  display: 'grid',
  gridTemplateColumns: `${u(72)} 1fr`,
  alignItems: 'center',
  gap: u(8),
  '& b': {
    fontSize: u(25),
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: '-0.03em',
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  '& b small': { fontSize: u(13), letterSpacing: 0, marginLeft: u(1) },
  '& span': { fontSize: u(11.5), lineHeight: 1.45, color: '#4a4f59' },
  [narrow]: { gridTemplateColumns: 'minmax(0, 1fr)', gap: u(4) },
})

const seedStyle = css({
  padding: `${u(16)} ${u(18)} ${u(18)}`,
  borderRadius: `0 0 ${u(6)} ${u(6)}`,
  background: '#1766ad',
  color: '#ffffff',
  '& > div:first-child': { color: '#e3eef9' },
  '& > div:nth-child(3)': { color: '#e3eef9' },
  [narrow]: { borderRadius: u(6), marginTop: u(4) },
})

const seedPriceStyle = css({
  marginTop: u(10),
  paddingTop: u(10),
  borderTop: '1px solid rgba(255, 255, 255, 0.28)',
  fontSize: u(11.5),
  fontWeight: 700,
})

const verdictStyle = css({
  marginTop: u(16),
  fontSize: u(14),
  fontWeight: 700,
  lineHeight: 1.6,
  '& span': { fontWeight: 400, color: '#4a4f59' },
  // 狭い枠では版の札と重なるので、製品の種で区切る
  [narrow]: { display: 'none' },
})

const versionWidgetStyle = css({
  position: 'absolute',
  right: u(12),
  bottom: u(14),
  display: 'flex',
  alignItems: 'center',
  gap: u(6),
  minHeight: u(28),
  paddingInline: `${u(8)} ${u(10)}`,
  border: '1px solid rgba(55, 53, 47, 0.1)',
  borderRadius: u(6),
  background: '#ffffff',
  boxShadow: 'rgba(15, 15, 15, 0.06) 0 2px 8px',
  color: 'rgba(55, 53, 47, 0.86)',
  fontSize: u(13),
  fontWeight: 700,
})

// コメント欄（Artifact Share の右のパネル）
const panelStyle = css({
  flex: 'none',
  width: u(340),
  padding: u(12),
  borderLeft: '1px solid var(--as-border)',
  background: 'var(--as-bg)',
  color: 'var(--as-fg)',
  overflow: 'hidden',
  [narrow]: { display: 'none' },
})

const panelHeaderStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: u(6),
  paddingBottom: u(10),
  marginBottom: u(12),
  borderBottom: '1px solid var(--as-divider)',
  fontSize: u(15),
  fontWeight: 700,
})

const threadStyle = css({
  display: 'grid',
  gap: u(10),
  padding: u(12),
  border: '1px solid var(--as-link)',
  borderRadius: u(6),
  background:
    'linear-gradient(color-mix(in srgb, var(--as-link) 10%, transparent), transparent 40%)',
})

const threadTopStyle = css({ display: 'flex' })

const openPillStyle = css({
  display: 'grid',
  placeItems: 'center',
  height: u(22),
  paddingInline: u(8),
  borderRadius: '999px',
  background: 'color-mix(in srgb, var(--as-link) 14%, transparent)',
  color: 'var(--as-link)',
  fontSize: u(11.5),
  fontWeight: 700,
})

const quoteStyle = css({
  padding: `${u(9)} ${u(10)}`,
  border: '1px solid color-mix(in srgb, var(--as-link) 34%, var(--as-divider))',
  borderRadius: u(6),
  color: 'var(--as-link)',
  fontSize: u(12),
  lineHeight: 1.5,
})

const messageStyle = css({
  display: 'grid',
  gridTemplateColumns: `${u(22)} 1fr`,
  gap: u(8),
})

const messageAvatarStyle = css({
  width: u(22),
  height: u(22),
  borderRadius: '50%',
})

const messageMetaStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: u(7),
  fontSize: u(12),
  color: 'var(--as-muted-fg)',
  '& b': { color: 'var(--as-fg)', fontWeight: 700 },
})

const agentBadgeStyle = css({
  paddingInline: u(5),
  borderRadius: '3px',
  background: 'rgba(107, 92, 231, 0.08)',
  color: 'var(--as-muted-fg)',
  fontSize: u(10),
  fontWeight: 500,
})

const messageBodyStyle = css({
  marginTop: u(2),
  fontSize: u(13),
  lineHeight: 1.6,
})

const replyStyle = css({
  position: 'relative',
  paddingTop: u(10),
  paddingLeft: u(20),
  borderTop: '1px solid var(--as-divider)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: u(10),
    bottom: 0,
    left: u(7),
    width: u(2),
    background: 'color-mix(in srgb, var(--as-link) 22%, var(--as-divider))',
  },
})
