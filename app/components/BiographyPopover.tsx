import { useState } from 'react'
import { BsFacebook, BsGithub, BsTwitter } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import ArticlesContent from '~/assets/articles.md'
import BiographyContent from '~/assets/biography.md'
import {
  Avatar,
  AvatarImage,
  Button,
  HStack,
  Heading,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
} from '~/components/ui'
import { useLocale } from '~/features/i18n/hooks/useLocale'

export const BiographyPopover = () => {
  const { t } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState] = useState<'biography' | 'articles'>('biography')

  return (
    <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger asChild>
        <Button size="xs">{t('about.biography', '代表略歴')}</Button>
      </PopoverTrigger>
      <PopoverContent color="gray.800">
        <Stack className="relative">
          <Button
            className="absolute top-0 right-0 h-6 w-6"
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <IoClose />
          </Button>

          <HStack>
            <Avatar>
              <AvatarImage src="/images/coji.webp" loading="lazy" />
            </Avatar>
            <Stack>
              <Heading className="font-bold">溝口浩二 coji</Heading>
              <HStack>
                <a
                  href="https://twitter.com/techtalkjp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-twitter"
                >
                  <BsTwitter /> <p className="ml-1 text-xs">Twitter</p>
                </a>

                <a
                  href="https://www.facebook.com/mizoguchi.coji"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-facebook"
                >
                  <BsFacebook /> <p className="ml-1 text-xs">Facebook</p>
                </a>

                <a
                  href="https://github.com/coji"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-github"
                >
                  <BsGithub /> <p className="ml-1 text-xs">GitHub</p>
                </a>
              </HStack>
            </Stack>
          </HStack>

          <HStack>
            <Button
              className="flex-1"
              size="xs"
              variant={state === 'biography' ? 'default' : 'outline'}
              onClick={() => setState('biography')}
            >
              略歴
            </Button>
            <Button
              className="flex-1"
              size="xs"
              variant={state === 'articles' ? 'default' : 'outline'}
              onClick={() => setState('articles')}
            >
              掲載記事
            </Button>
          </HStack>

          <div className="biography pr-2 h-48 overflow-auto text-sm">
            {state === 'biography' && <BiographyContent />}
            {state === 'articles' && <ArticlesContent />}
          </div>
        </Stack>
      </PopoverContent>
    </Popover>
  )
}
