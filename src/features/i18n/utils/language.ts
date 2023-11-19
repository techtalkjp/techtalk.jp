export const languages = [
  { id: 'ja', label: 'Japanese' },
  { id: 'en', label: 'English' },
]

export const getCurrentLanguage = (path: string) =>
  languages.find((lang) => path.startsWith(`/${lang.id}`)) || languages[0]
