import { ArrowRightIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { Heading } from '~/components/typography'
import {
  Avatar,
  AvatarImage,
  Button,
  HStack,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
} from '~/components/ui'
import { useLocale } from '~/i18n/hooks/useLocale'

export const BiographyPopover = () => {
  const { t, locale } = useLocale()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger asChild>
        <Button size="xs" variant="default">
          {t('about.biography', '代表略歴')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto max-w-sm md:max-w-md">
        <Stack className="relative gap-4">
          <Button
            className="absolute top-0 right-0 h-6 w-6"
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <XIcon />
          </Button>

          <HStack className="gap-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/images/coji.webp" loading="lazy" />
            </Avatar>
            <Stack className="gap-1">
              <Heading size="md">
                {locale === 'en' ? 'Koji Mizoguchi (coji)' : '溝口浩二 coji'}
              </Heading>
              <p className="text-muted-foreground text-sm">
                {locale === 'en'
                  ? 'CEO, TechTalk Inc.'
                  : '株式会社TechTalk 代表取締役'}
              </p>
            </Stack>
          </HStack>

          <div className="space-y-2 text-sm leading-relaxed">
            <p>
              {locale === 'en'
                ? 'Founded TechTalk Inc. in 2019. Previously experienced in engineering, business development, and corporate planning at FreakOut, Niwango, and Dwango.'
                : '2019年に株式会社TechTalkを設立。それ以前は、フリークアウト、ニワンゴ、ドワンゴにて、エンジニアリング、事業開発、経営企画などを経験。'}
            </p>
          </div>

          <Button asChild variant="default" className="w-full">
            <Link
              to={locale === 'ja' ? '/biography' : `/${locale}/biography`}
              onClick={() => setIsOpen(false)}
            >
              {t('about.viewFullBiography', '詳細を見る')}
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Stack>
      </PopoverContent>
    </Popover>
  )
}
