import type { ReactNode } from 'react'
import { HStack, Spacer } from '~/components/ui'
import LanguageSwitcher from '~/i18n/components/LanguageSwitcher'

interface HeaderProps {
  left?: ReactNode
  children?: ReactNode
  showLanguageSwitcher?: boolean
}

export const Header = ({
  left,
  children,
  showLanguageSwitcher = true,
}: HeaderProps) => {
  return (
    <HStack className="fixed z-10 w-full py-2 pr-4 pl-4 font-bold sm:pr-8">
      {left}
      <Spacer />
      <HStack>
        {children}
        {showLanguageSwitcher && <LanguageSwitcher />}
      </HStack>
    </HStack>
  )
}
