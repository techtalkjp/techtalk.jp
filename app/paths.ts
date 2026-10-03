import { langParam, type Locale } from './i18n/index.ts'
import { routes } from './routes.ts'

/** ロケール付きのパスを routes から組み立てる */
export const paths = {
  home: (locale: Locale) => routes.home.index.href({ ...langParam(locale) }),
  biography: (locale: Locale) =>
    routes.biography.href({ ...langParam(locale) }),
  contactForm: (locale: Locale) =>
    routes.contactForm.href({ ...langParam(locale) }),
  privacy: () => routes.privacy.href(),
}
