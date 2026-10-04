import { css, type Handle, type RemixNode } from 'remix/component'

import { languageName, otherLocale } from '../i18n/index.ts'
import { getI18n } from '../i18n/provider.tsx'
import { SectionNav } from '../islands/section-nav.tsx'
import { paths } from '../paths.ts'
import { ArrowUpRightIcon } from './icons.tsx'
import { container, externalLink, navWide, primaryButton } from './styles.ts'

/**
 * 社名のワードマーク。字を詰め、アクセントの青い点を句点として打つ
 */
export function Wordmark(handle: Handle<{ href?: string; size?: 'sm' }>) {
  return () => {
    let { href, size } = handle.props
    let style = css({
      display: 'inline-flex',
      alignItems: 'baseline',
      fontSize: size === 'sm' ? 'var(--t-16)' : 'var(--t-20)',
      fontWeight: 800,
      letterSpacing: '-0.04em',
      color: 'var(--text-strong)',
      '&::after': {
        content: '""',
        width: '0.3em',
        height: '0.3em',
        marginLeft: '0.08em',
        borderRadius: '50%',
        background: 'var(--accent)',
      },
    })
    return href ? (
      <a href={href} mix={style}>
        TechTalk
      </a>
    ) : (
      <span mix={style}>TechTalk</span>
    )
  }
}

/**
 * ヘッダーに出すトップの各セクションへのリンク。トップではハッシュだけにしてページ内を移動する。
 * スマホの幅に収まるよう 4 つまでにし、会社概要はフッターにだけ出す
 */
function sectionLinks(
  t: (ja: string) => string,
  base: string,
): { href: string; label: string }[] {
  return [
    { href: `${base}#when`, label: t('こんなとき') },
    { href: `${base}#approach`, label: t('進め方') },
    { href: `${base}#products`, label: t('プロダクト') },
    { href: `${base}#profile`, label: t('代表') },
  ]
}

/** もう一方の言語へのリンク。ページ全体を読み直して切り替える */
export function LanguageLink(handle: Handle<{ href: string }>) {
  return () => {
    let { locale } = getI18n(handle)
    let other = otherLocale(locale)
    return (
      <a
        href={handle.props.href}
        hrefLang={other}
        lang={other}
        data-rmx-document=""
        mix={css({
          paddingBlock: '10px',
          fontSize: 'var(--t-14)',
          color: 'var(--text-subtle)',
          transition: 'color 150ms ease-out',
          '&:hover': { color: 'var(--text-strong)' },
        })}
      >
        {languageName(other)}
      </a>
    )
  }
}

export interface SiteHeaderProps {
  /** トップページならハッシュだけのリンクにする */
  home?: boolean
  /** もう一方の言語の同じページ。なければ言語切替を出さない */
  languageHref?: string
}

export function SiteHeader(handle: Handle<SiteHeaderProps>) {
  return () => {
    let { t, locale } = getI18n(handle)
    let { home, languageHref } = handle.props
    let base = home ? '' : paths.home(locale)
    return (
      <header
        mix={css({
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
        })}
      >
        <div
          mix={[
            container,
            css({
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              columnGap: '16px',
              paddingTop: '12px',
              [navWide]: {
                flexWrap: 'nowrap',
                columnGap: '32px',
                height: '64px',
                paddingTop: 0,
              },
            }),
          ]}
        >
          <span mix={css({ marginRight: 'auto' })}>
            <Wordmark href={home ? '#top' : paths.home(locale)} />
          </span>
          <SectionNav
            label={t('ページ内')}
            links={sectionLinks(t, base)}
            extraSections={['#company', '#contact']}
          />
          <div
            mix={css({ display: 'flex', alignItems: 'center', gap: '20px' })}
          >
            {languageHref ? <LanguageLink href={languageHref} /> : null}
            <a
              href={`${base}#contact`}
              mix={[
                primaryButton,
                css({ height: '36px', paddingInline: '14px' }),
              ]}
            >
              {t('相談する')}
            </a>
          </div>
        </div>
      </header>
    )
  }
}

export function Footer(handle: Handle) {
  return () => {
    let { t, locale } = getI18n(handle)
    let linkHover = css({
      transition: 'color 150ms ease-out',
      '&:hover': { color: 'var(--text-strong)' },
    })
    return (
      <footer
        mix={css({
          borderTop: '1px solid var(--border)',
          padding: '40px 0 56px',
          fontSize: 'var(--t-14)',
          color: 'var(--text-subtle)',
        })}
      >
        <div
          mix={[
            container,
            css({
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '16px 32px',
            }),
          ]}
        >
          <Wordmark size="sm" />
          <nav
            aria-label={t('フッター')}
            mix={css({ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' })}
          >
            {[
              ...sectionLinks(t, paths.home(locale)),
              { href: `${paths.home(locale)}#company`, label: t('会社概要') },
            ].map((link) => (
              <a key={link.href} href={link.href} mix={linkHover}>
                {link.label}
              </a>
            ))}
            <a
              href="https://records.techtalk.jp"
              target="_blank"
              rel="noopener"
              mix={[linkHover, externalLink, css({ paddingBlock: 0 })]}
            >
              TechTalk Records
              <ArrowUpRightIcon size={12} />
            </a>
            <a href={paths.privacy()} mix={linkHover}>
              {t('プライバシーポリシー')}
            </a>
          </nav>
          <span>© 2019–{new Date().getFullYear()} TechTalk, Inc.</span>
        </div>
      </footer>
    )
  }
}

/** ページ全体の枠（ヘッダー、本文、フッター） */
export function PageShell(
  handle: Handle<SiteHeaderProps & { children?: RemixNode }>,
) {
  return () => {
    let { children, ...header } = handle.props
    return (
      <>
        <SiteHeader {...header} />
        {children}
        <Footer />
      </>
    )
  }
}
