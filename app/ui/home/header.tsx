import { css, type Handle } from 'remix/component'

import { getI18n } from '../../i18n/provider.tsx'
import { MobileMenu } from '../../islands/mobile-menu.tsx'
import { Brand, LanguageLink, ThemeSwitcher } from '../layout.tsx'
import { container, md } from '../styles.ts'

export function HomeHeader(handle: Handle<{ languageHref: string }>) {
  return () => {
    let { t, locale } = getI18n(handle)
    let links = [
      { href: '#top', label: t('Top') },
      { href: '#products', label: t('Products') },
      { href: '#services', label: t('Services') },
      { href: '#profile', label: t('Profile') },
      { href: '#company', label: t('Company') },
    ]
    let contact = { href: '#contact', label: 'Contact' }

    return (
      <header
        mix={css({
          position: 'fixed',
          top: 0,
          zIndex: 50,
          width: '100%',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-translucent)',
          backdropFilter: 'blur(12px)',
        })}
      >
        <div
          mix={[
            container,
            css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '5rem',
            }),
          ]}
        >
          <Brand href="#top" />

          <nav
            mix={css({
              display: 'none',
              alignItems: 'center',
              gap: '2rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--text-muted)',
              [md]: { display: 'flex' },
            })}
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                mix={css({
                  transition: 'color 150ms',
                  '&:hover': { color: 'var(--text-strong)' },
                })}
              >
                {link.label}
              </a>
            ))}
            <a
              href={contact.href}
              mix={css({
                borderRadius: '9999px',
                border: '1px solid var(--border-strong)',
                background: 'var(--button-bg)',
                color: 'var(--button-text)',
                padding: '0.5rem 1.25rem',
                fontWeight: 600,
                transition: 'background-color 150ms',
                '&:hover': { background: 'var(--button-bg-hover)' },
              })}
            >
              {contact.label}
            </a>
            <ThemeSwitcher />
            <LanguageLink href={handle.props.languageHref} />
          </nav>

          <div
            mix={css({
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              [md]: { display: 'none' },
            })}
          >
            <ThemeSwitcher />
            <MobileMenu
              links={[...links, { ...contact, emphasis: true }]}
              language={{
                href: handle.props.languageHref,
                label: locale === 'ja' ? 'English' : '日本語',
              }}
              labels={{
                open: t('メニューを開く'),
                close: t('メニューを閉じる'),
              }}
            />
          </div>
        </div>
      </header>
    )
  }
}
