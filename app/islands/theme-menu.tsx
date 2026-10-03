import { clientEntry, css, type Handle } from 'remix/component'
import * as menu from '@remix-run/ui/menu'

import { MonitorIcon, MoonIcon, SunIcon } from '../ui/icons.tsx'
import { iconButton } from '../ui/styles.ts'

type Theme = 'light' | 'dark' | 'system'

export interface ThemeMenuProps {
  labels: { theme: string; light: string; dark: string; system: string }
}

const ONE_YEAR = 60 * 60 * 24 * 365
const THEME_CHANGE = 'techtalk:themechange'

function readTheme(): Theme {
  let value = document.documentElement.dataset.theme
  return value === 'light' || value === 'dark' ? value : 'system'
}

function applyTheme(theme: Theme) {
  let root = document.documentElement
  if (theme === 'system') {
    delete root.dataset.theme
    document.cookie = 'theme=; Path=/; Max-Age=0; SameSite=Lax'
  } else {
    root.dataset.theme = theme
    document.cookie = `theme=${theme}; Path=/; Max-Age=${ONE_YEAR}; SameSite=Lax`
  } // 同じページにある他のテーマメニュー（PC 用とスマホ用）にも知らせる
  document.dispatchEvent(new CustomEvent(THEME_CHANGE, { detail: theme }))
}

/** ライト / ダーク / システム設定を切り替えるメニュー */
export const ThemeMenu = clientEntry(
  '/js/entry.js#ThemeMenu',
  function ThemeMenu(handle: Handle<ThemeMenuProps>) {
    // サーバー描画時はテーマが分からないので、ハイドレーション後に読み直す
    let theme: Theme = 'system'
    handle.queueTask(() => {
      theme = readTheme()
      void handle.update()
    })
    if (typeof document !== 'undefined') {
      let onThemeChange = () => {
        theme = readTheme()
        void handle.update()
      }
      document.addEventListener(THEME_CHANGE, onThemeChange, {
        signal: handle.signal,
      })
    }

    return () => {
      let { labels } = handle.props
      let options: { value: Theme; label: string }[] = [
        { value: 'light', label: labels.light },
        { value: 'dark', label: labels.dark },
        { value: 'system', label: labels.system },
      ]

      return (
        <div
          mix={menu.onMenuSelect((event) => {
            let value = event.item.value as Theme | undefined
            if (!value) return
            applyTheme(value)
          })}
        >
          <menu.Context label={labels.theme}>
            <button
              type="button"
              aria-label={labels.theme}
              mix={[iconButton, menu.trigger()]}
            >
              {theme === 'dark' ? (
                <MoonIcon size={18} />
              ) : theme === 'light' ? (
                <SunIcon size={18} />
              ) : (
                <MonitorIcon size={18} />
              )}
            </button>
            <div mix={[popoverStyle, menu.popover()]}>
              <div mix={[listStyle, menu.list()]}>
                {options.map((option) => (
                  <div
                    key={option.value}
                    mix={[
                      itemStyle,
                      menu.item({
                        type: 'radio',
                        name: 'theme',
                        value: option.value,
                        label: option.label,
                        checked: theme === option.value,
                      }),
                    ]}
                  >
                    {option.value === 'light' ? (
                      <SunIcon size={16} />
                    ) : option.value === 'dark' ? (
                      <MoonIcon size={16} />
                    ) : (
                      <MonitorIcon size={16} />
                    )}
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          </menu.Context>
        </div>
      )
    }
  },
)

const popoverStyle = css({
  margin: 0,
  padding: '0.25rem',
  minWidth: '9rem',
  borderRadius: '0.5rem',
  border: '1px solid var(--border)',
  background: 'var(--bg)',
  color: 'var(--text)',
  boxShadow: '0 10px 30px rgb(0 0 0 / 0.15)',
})

const listStyle = css({
  display: 'flex',
  flexDirection: 'column',
  outline: 'none',
})

const itemStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 0.75rem',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  cursor: 'pointer',
  userSelect: 'none',
  '&[data-highlighted], &:hover': { background: 'var(--surface-muted)' },
  '&[aria-checked="true"]': { fontWeight: 700, color: 'var(--accent)' },
})
