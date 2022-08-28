import React from 'react'
import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react'
import { useLocale } from '~/hooks/useLocale'
import { useNavigate } from '@remix-run/react'

const LanguageSwitcher: React.FC = () => {
  const { t, locales, locale } = useLocale()
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
