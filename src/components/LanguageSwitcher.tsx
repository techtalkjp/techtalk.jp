import React from 'react'
import { useRouter } from 'next/router'
import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react'
import { useLocale } from '../utils/useLocale'

const LanguageSwitcher: React.FC = () => {
  const { t, locales, locale } = useLocale()
  const router = useRouter()

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
            onClick={() =>
              router.push(router.asPath, router.asPath, { locale: e })
            }
          >
            {t(e, e)}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
export default LanguageSwitcher
