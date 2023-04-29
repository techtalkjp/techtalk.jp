import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { useNavigate } from '@remix-run/react'
import { locales, useLocale } from '~/features/i18n/hooks/useLocale'

const LanguageSwitcher = () => {
  const { t, locale } = useLocale()
  const navigate = useNavigate()

  return (
    <Menu>
      <MenuButton
        as={Button}
        size="xs"
        aria-label="Language"
        variant="outline"
        colorScheme="white"
      >
        {t(locale, locale)}
      </MenuButton>
      <MenuList color="black">
        {locales.map((e) => (
          <MenuItem
            isDisabled={e === locale}
            fontWeight={e === locale ? 'bold' : 'normal'}
            key={e}
            onClick={() => navigate(e === 'ja' ? '/' : `/${e}`)}
          >
            {t(e, e)}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
export default LanguageSwitcher
