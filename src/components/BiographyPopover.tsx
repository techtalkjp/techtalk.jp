import { FacebookIcon, GithubIcon, TwitterIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import * as ArticlesContent from '~/assets/articles.md'
import * as BiographyContent from '~/assets/biography.md'
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

export const BiographyPopover = () => {
  const t = (key: string, fallback: string) => fallback // TODO: use i18n (i18next
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState] = useState<'biography' | 'articles'>('biography')

  return (
    <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger asChild>
        <Button size="xs" variant="outline">
          {t('about.biography', '代表略歴')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto max-w-sm text-slate-700 md:max-w-md lg:max-w-lg">
        <Stack className="relative">
          <Button
            className="absolute right-0 top-0 h-6 w-6"
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
            <Stack gap="1">
              <Heading size="md">溝口浩二 coji</Heading>
              <HStack>
                <Button size="xs" variant="outline" className="text-twitter" asChild>
                  <a
                    href="https://twitter.com/techtalkjp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <TwitterIcon /> <p className="ml-1 text-xs">Twitter</p>
                  </a>
                </Button>

                <Button size="xs" variant="outline" className="text-facebook" asChild>
                  <a
                    href="https://www.facebook.com/mizoguchi.coji"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <FacebookIcon /> <p className="ml-1 text-xs">Facebook</p>
                  </a>
                </Button>

                <Button size="xs" variant="outline" className="text-github" asChild>
                  <a
                    href="https://github.com/coji"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <GithubIcon /> <p className="ml-1 text-xs">GitHub</p>
                  </a>
                </Button>
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

          <div className="biography h-48 overflow-auto p-2 text-sm leading-5">
            {state === 'biography' && <div>{BiographyContent.compiledContent()}</div>}
            {state === 'articles' && <div>{ArticlesContent.compiledContent()}</div>}
          </div>
        </Stack>
      </PopoverContent>
    </Popover>
  )
}
