import { FacebookIcon, GithubIcon, TwitterIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import ArticlesContent from '~/assets/articles.mdx'
import BiographyContent from '~/assets/biography.mdx'
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
import { useLocale } from '~/i18n/hooks/useLocale'

export const BiographyPopover = () => {
  const { t } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState] = useState<'biography' | 'articles'>('biography')

  return (
    <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          {t('about.biography', '代表略歴')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto max-w-sm md:max-w-md lg:max-w-lg">
        <Stack className="relative">
          <Button
            className="absolute top-0 right-0 h-6 w-6"
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <XIcon />
          </Button>

          <HStack>
            <Avatar>
              <AvatarImage src="/images/coji.webp" loading="lazy" />
            </Avatar>
            <Stack className="gap-0.5">
              <Heading size="md">溝口浩二 coji</Heading>
              <HStack>
                <Button
                  size="sm"
                  variant="default"
                  className="bg-twitter hover:bg-twitter/80 active:bg-twitter text-white"
                  asChild
                >
                  <a
                    href="https://twitter.com/techtalkjp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <TwitterIcon className="h-4 w-4" />{' '}
                    <p className="ml-1 text-xs">Twitter</p>
                  </a>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="bg-facebook hover:bg-facebook/80 active:bg-facebook text-white hover:text-white"
                  asChild
                >
                  <a
                    href="https://www.facebook.com/mizoguchi.coji"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <FacebookIcon className="h-4 w-4" />{' '}
                    <p className="ml-1 text-xs">Facebook</p>
                  </a>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="bg-github hover:bg-github/80 active:bg-github text-white hover:text-white"
                  asChild
                >
                  <a
                    href="https://github.com/coji"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <GithubIcon className="h-4 w-4" />{' '}
                    <p className="ml-1 text-xs">GitHub</p>
                  </a>
                </Button>
              </HStack>
            </Stack>
          </HStack>

          <HStack>
            <Button
              className="flex-1"
              size="sm"
              variant={state === 'biography' ? 'default' : 'outline'}
              onClick={() => setState('biography')}
            >
              略歴
            </Button>
            <Button
              className="flex-1"
              size="sm"
              variant={state === 'articles' ? 'default' : 'outline'}
              onClick={() => setState('articles')}
            >
              掲載記事
            </Button>
          </HStack>

          <div className="biography h-48 overflow-auto p-2 text-sm leading-5">
            {state === 'biography' && <BiographyContent />}
            {state === 'articles' && <ArticlesContent />}
          </div>
        </Stack>
      </PopoverContent>
    </Popover>
  )
}
