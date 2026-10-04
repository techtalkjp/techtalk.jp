import en from './en.json' with { type: 'json' }

export const locales = ['ja', 'en'] as const
export type Locale = (typeof locales)[number]

const catalogs: Record<Exclude<Locale, 'ja'>, typeof en> = { en }

/**
 * URL の `(:lang)` パラメータからロケールを決める。
 * 省略時は ja、未対応の値は null（404 にする）。
 */
export function parseLocale(lang: string | undefined): Locale | null {
  if (lang === undefined) return 'ja'
  return lang === 'en' ? 'en' : null
}

/**
 * 翻訳できる文言。en.json のキーなので、訳のない文言を t() に渡すと型エラーになる
 */
export type MessageKey = keyof typeof en

/**
 * 日本語の文言そのものをキーに翻訳する。
 * `{name}` 形式のプレースホルダーは vars で置き換える。
 */
export type Translate = (
  ja: MessageKey,
  vars?: Record<string, string | number>,
) => string

export function createTranslate(locale: Locale): Translate {
  return (ja, vars) => {
    let text: string = locale === 'ja' ? ja : catalogs[locale][ja]
    if (vars) {
      for (let [key, value] of Object.entries(vars)) {
        text = text.replaceAll(`{${key}}`, () => String(value))
      }
    }
    return text
  }
}

/** ルートの `(:lang)` に渡すパラメータ。ja は接頭辞なし */
export function langParam(locale: Locale): { lang?: string } {
  return locale === 'ja' ? {} : { lang: locale }
}

/** 言語切替リンクに出す、その言語自身での名前 */
export function languageName(locale: Locale): string {
  return locale === 'ja' ? '日本語' : 'English'
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'ja' ? 'en' : 'ja'
}

export interface I18n {
  locale: Locale
  t: Translate
}

export function createI18n(locale: Locale): I18n {
  return { locale, t: createTranslate(locale) }
}
