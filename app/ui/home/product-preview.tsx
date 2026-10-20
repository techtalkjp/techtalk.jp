import { css, type Handle, type RemixNode } from 'remix/component'

import type { Locale } from '../../i18n/index.ts'

/**
 * Artifact Share でサンプルのレポートを開いた画面を、ブラウザの枠ごと HTML で描く。
 * 中身は公開しているサンプル（ja: /a/z0pxvsducu、en: /a/owcpuixuqq）の文言と数値、
 * 画面の上のバーは Artifact Share の閲覧画面（viewer-chrome）の並びと色に合わせている。
 *
 * 寸法はすべて u()（枠の幅から決めた 1px 相当の長さ --px の倍数）で書き、全体を縮める（画面写真のように縮小される）。
 * 狭い枠では小さくなりすぎないよう、仮想の画面幅を狭くして並びを詰める
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
                {s.views}
                <span aria-hidden="true">·</span>
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
              <TablerIcon size={15}>
                <path d="M8 9h8" />
                <path d="M8 13h6" />
                <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />
              </TablerIcon>
              <span mix={wideOnly}>{s.comments}</span>
              <span mix={countStyle}>2</span>
            </span>
            <span mix={primaryStyle}>
              <TablerIcon size={14}>
                <path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
                <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
              </TablerIcon>
              {s.copyLink}
            </span>
          </header>

          <div mix={reportStyle}>
            <div mix={docStyle}>
              <h3 mix={reportTitleStyle}>{s.title}</h3>
              <p mix={reportMetaStyle}>
                <span mix={versionPillStyle}>v23</span>
                {s.subtitle}
              </p>
              <div mix={statsStyle}>
                {s.stats.map((stat) => (
                  <div key={stat.label} mix={cardStyle}>
                    <div mix={statLabelStyle}>{stat.label}</div>
                    <div mix={statValueStyle}>{stat.value}</div>
                    <div
                      mix={css({
                        fontSize: u(11.5),
                        color: stat.up ? '#1766ad' : '#8f8c84',
                      })}
                    >
                      {stat.delta}
                    </div>
                  </div>
                ))}
              </div>
              <h4 mix={reportHeadingStyle}>{s.trend}</h4>
              <div mix={[cardStyle, css({ padding: 0 })]}>
                <div mix={chartStyle}>
                  {bars.map((bar, index) => (
                    <span key={index} mix={barColumnStyle}>
                      <span
                        mix={css({
                          position: 'relative',
                          height: `${bar.height}%`,
                          borderRadius: `${u(4)} ${u(4)} 0 0`,
                          background:
                            bar.value === '9.1M' ? '#1766ad' : '#ddd9d0',
                        })}
                      >
                        {bar.value ? (
                          <span mix={barValueStyle}>{bar.value}</span>
                        ) : null}
                      </span>
                    </span>
                  ))}
                </div>
                <div mix={axisStyle}>
                  {s.months.map((month) => (
                    <span key={month}>{month}</span>
                  ))}
                </div>
              </div>
            </div>

            <span mix={versionWidgetStyle}>
              <TablerIcon size={14}>
                <path d="M12 8l0 4l2 2" />
                <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
              </TablerIcon>
              v23
            </span>
          </div>
        </div>
      </div>
    )
  }
}

const samples = {
  ja: {
    url: 'artifactshare.com/a/z0pxvsducu',
    title: '月次売上とプラン別内訳 2026-08',
    views: '閲覧 212 回',
    linkSharing: 'リンク共有',
    comments: 'コメント',
    copyLink: '共有リンクをコピー',
    subtitle: 'サンプル · KPI レポートのユースケース例 · 更新 2026-09-01',
    stats: [
      { label: '売上(8月)', value: '¥9.1M', delta: '+11% 前月比', up: true },
      { label: '新規契約', value: '38 社', delta: '+9 社', up: true },
      { label: '解約率', value: '1.2%', delta: '±0.0pt', up: false },
    ],
    trend: '月次推移',
    months: ['4月', '5月', '6月', '7月', '8月'],
  },
  en: {
    url: 'artifactshare.com/a/owcpuixuqq',
    title: 'Monthly Revenue & Plan Mix 2026-08',
    views: '277 views',
    linkSharing: 'Link sharing',
    comments: 'Comments',
    copyLink: 'Copy link',
    subtitle: 'Sample · KPI report use case · Updated 2026-09-01',
    stats: [
      { label: 'Revenue (Aug)', value: '¥9.1M', delta: '+11% MoM', up: true },
      { label: 'New contracts', value: '38', delta: '+9', up: true },
      { label: 'Churn', value: '1.2%', delta: '±0.0pt', up: false },
    ],
    trend: 'Monthly trend',
    months: ['Apr', 'May', 'Jun', 'Jul', 'Aug'],
  },
} satisfies Record<Locale, unknown>

/** サンプルの棒の高さ（グラフの高さに対する %）と、上に出す値 */
const bars = [
  { height: 38 },
  { height: 56 },
  { height: 47 },
  { height: 74, value: '8.2M' },
  { height: 92, value: '9.1M' },
]

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
  // 幅 840px の画面として描く。狭い枠では 576px 相当にして並びを詰める
  '--px': 'calc(100cqi / 840)',
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

// 共有された文書の側。サンプルはライトの配色だけなので、ダークでは少し落として白く浮かせない
const reportStyle = css({
  position: 'relative',
  height: u(600),
  overflow: 'hidden',
  paddingTop: u(48),
  paddingInline: u(24),
  background: '#fbfaf8',
  color: '#37352f',
  '@media (prefers-color-scheme: dark)': {
    filter: 'brightness(0.93)',
  },
  [narrow]: { height: u(640), paddingTop: u(32) },
})

const docStyle = css({ maxWidth: u(760), marginInline: 'auto' })

const reportTitleStyle = css({
  fontSize: u(27),
  fontWeight: 700,
  lineHeight: 1.4,
  letterSpacing: '-0.01em',
  textWrap: 'balance',
})

const reportMetaStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: u(10),
  marginTop: u(4),
  fontSize: u(12),
  color: '#8f8c84',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
})

const versionPillStyle = css({
  flex: 'none',
  paddingInline: u(10),
  borderRadius: '999px',
  background: 'rgba(23, 102, 173, 0.08)',
  color: '#1766ad',
  fontSize: u(11),
  fontWeight: 700,
})

const statsStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: u(12),
  marginTop: u(32),
})

const cardStyle = css({
  padding: `${u(16)} ${u(18)}`,
  borderRadius: u(8),
  background: '#ffffff',
  boxShadow:
    'rgba(15, 15, 15, 0.05) 0 0 0 1px, rgba(15, 15, 15, 0.06) 0 2px 8px',
})

const statLabelStyle = css({
  fontSize: u(11),
  fontWeight: 700,
  letterSpacing: '0.06em',
  color: '#8f8c84',
})

const statValueStyle = css({
  fontSize: u(26),
  fontWeight: 700,
  lineHeight: 1.3,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
})

const reportHeadingStyle = css({
  marginTop: u(36),
  marginBottom: u(14),
  fontSize: u(16),
  fontWeight: 700,
})

const chartStyle = css({
  display: 'flex',
  alignItems: 'flex-end',
  gap: u(18),
  height: u(190),
  padding: `${u(28)} ${u(20)} 0`,
})

const barColumnStyle = css({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'flex-end',
  height: '100%',
})

const barValueStyle = css({
  position: 'absolute',
  top: u(-22),
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: u(11.5),
  fontWeight: 700,
  color: '#52514b',
  fontVariantNumeric: 'tabular-nums',
})

const axisStyle = css({
  display: 'flex',
  gap: u(18),
  padding: `${u(6)} ${u(20)} ${u(14)}`,
  fontSize: u(11),
  color: '#8f8c84',
  textAlign: 'center',
  '& > span': { flex: 1 },
})

const versionWidgetStyle = css({
  position: 'absolute',
  right: u(12),
  bottom: u(18),
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
