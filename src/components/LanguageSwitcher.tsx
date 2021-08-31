import React from 'react'
import Router from 'next/router'
import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react'
import { useLocale } from '../utils/useLocale'

const LanguageSwitcher: React.FC = () => {
  const { t, locales, locale } = useLocale()
  const setLocale = (locale: string) => {
    Router.push(Router.asPath, undefined, { locale })
  }

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
            onClick={() => setLocale(e)}
          >
            {t(e, e)}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
export default LanguageSwitcher
