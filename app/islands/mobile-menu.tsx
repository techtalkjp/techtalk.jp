import { clientEntry, css, on, type Handle } from 'remix/component'
import { animateEntrance, spring } from '@remix-run/ui/animation'
import * as popover from '@remix-run/ui/popover'

import { CloseIcon, MenuIcon } from '../ui/icons.tsx'
import { iconButton } from '../ui/styles.ts'

export interface MobileMenuProps {
  links: { href: string; label: string; emphasis?: boolean }[]
  language: { href: string; label: string }
  labels: { open: string; close: string }
}

/** スマホ幅で表示するナビゲーションメニュー */
export const MobileMenu = clientEntry(
  '/js/islands.js#MobileMenu',
  function MobileMenu(handle: Handle<MobileMenuProps>) {
    let open = false

    function setOpen(next: boolean) {
      open = next
      void handle.update()
    }

    async function closeAndScrollTo(hash: string) {
      open = false
      await handle.update()
      document.querySelector(hash)?.scrollIntoView()
      history.pushState(null, '', hash)
    }

    return () => {
      let { links, language, labels } = handle.props
      return (
        <popover.Context>
          <button
            type="button"
            aria-label={open ? labels.close : labels.open}
            aria-expanded={open}
            mix={[
              iconButton,
              css({ border: 'none' }),
              popover.anchor({ placement: 'bottom-end' }),
              popover.focusOnHide(),
              on('click', () => setOpen(!open)),
            ]}
          >
            {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
          <nav
            aria-label={labels.open}
            mix={[
              panelStyle,
              popover.surface({ open, onHide: () => setOpen(false) }),
            ]}
          >
            {open ? (
              <div
                mix={[
                  listStyle,
                  animateEntrance({
                    opacity: 0,
                    transform: 'translateY(-12px)',
                    ...spring('snappy'),
                  }),
                ]}
              >
                {links.map((link, index) => (
                  <a
                    key={link.href}
                    href={link.href}
                    mix={[
                      linkStyle,
                      link.emphasis ? emphasisStyle : null,
                      index === 0 ? popover.focusOnShow() : null,
                      on('click', (event) => {
                        // 閉じるとスクロールロックが元の位置に戻すので、閉じてからスクロールする
                        event.preventDefault()
                        void closeAndScrollTo(link.href)
                      }),
                    ]}
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href={language.href}
                  data-rmx-document=""
                  mix={[linkStyle, css({ fontSize: '0.875rem' })]}
                >
                  {language.label}
                </a>
              </div>
            ) : null}
          </nav>
        </popover.Context>
      )
    }
  },
)

const panelStyle = css({
  margin: 0,
  marginTop: '1.25rem',
  width: 'min(20rem, calc(100vw - 2rem))',
  padding: '1.5rem',
  border: '1px solid var(--border)',
  borderRadius: '0.75rem',
  background: 'var(--bg)',
  color: 'var(--text)',
  boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
})

const listStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  textAlign: 'center',
})

const linkStyle = css({
  fontSize: '1.125rem',
  color: 'var(--text-muted)',
  '&:hover': { color: 'var(--text-strong)' },
})

const emphasisStyle = css({ fontWeight: 700, color: 'var(--text-strong)' })
