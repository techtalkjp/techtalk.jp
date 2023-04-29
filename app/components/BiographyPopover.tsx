import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { BsFacebook, BsGithub, BsTwitter } from 'react-icons/bs'
import ArticlesContent from '~/assets/articles.md'
import BiographyContent from '~/assets/biography.md'
import { useLocale } from '~/features/i18n/hooks/useLocale'

export const BiographyPopover = () => {
  const { t } = useLocale()
  const [state, setState] = useState<'biography' | 'articles'>('biography')

  return (
    <Popover isLazy>
      <PopoverTrigger>
        <Button colorScheme="accent" size="xs">
          {t('about.biography', '代表略歴')}
        </Button>
      </PopoverTrigger>
      <PopoverContent color="gray.800">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          <HStack>
            <Avatar src="/images/coji.webp" loading="lazy" />
            <Stack>
              <Text>溝口浩二 coji</Text>
              <HStack>
                <Link
                  href="https://twitter.com/techtalkjp"
                  target="_blank"
                  color="twitter.500"
                  display="flex"
                >
                  <Icon as={BsTwitter} /> <Text ml="1">Twitter</Text>
                </Link>

                <Link
                  href="https://www.facebook.com/mizoguchi.coji"
                  target="_blank"
                  color="facebook.500"
                  display="flex"
                >
                  <Icon as={BsFacebook} /> <Text ml="1">Facebook</Text>
                </Link>

                <Link
                  href="https://www.facebook.com/mizoguchi.coji"
                  target="_blank"
                  color="github.500"
                  display="flex"
                >
                  <Icon as={BsGithub} /> <Text ml="1">GitHub</Text>
                </Link>
              </HStack>
            </Stack>
          </HStack>
        </PopoverHeader>
        <PopoverBody>
          <Stack>
            <HStack>
              <Button
                colorScheme="accent"
                size="xs"
                flex="1"
                variant={state === 'biography' ? 'solid' : 'outline'}
                onClick={() => setState('biography')}
              >
                略歴
              </Button>
              <Button
                colorScheme="accent"
                size="xs"
                flex="1"
                variant={state === 'articles' ? 'solid' : 'outline'}
                onClick={() => setState('articles')}
              >
                掲載記事
              </Button>
            </HStack>

            <Box className="biography" pr="2" height="12rem" overflow="auto">
              {state === 'biography' && <BiographyContent />}
              {state === 'articles' && <ArticlesContent />}
            </Box>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
