import React from 'react'
import { useLocale } from '../features/i18n/hooks/useLocale'
//import MarkdownIt from 'markdown-it'
//import { useQuery } from 'react-query'
import {
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
//import ky from 'ky'
//const md = new MarkdownIt()

interface Props {}

const PrivacyPolicyDialog: React.FC<Props> = (props) => {
  const { t } = useLocale()
  const { isOpen, onOpen, onClose } = useDisclosure()
  //  const { data: policy } = useQuery<string>('/privacy.md', async () =>
  //    md.render(await ky.get('/privacy.md').text())
  //  )

  return (
    <>
      <Box>
        {t('privacy.agree-to-before', '')}
        <Text
          color="accent.500"
          cursor="pointer"
          display="inline"
          onClick={onOpen}
        >
          {t('privacy.privacy-policy', 'プライバシーポリシー')}
        </Text>
        {t(
          'privacy.agree-to-after',
          'をお読みいただき、同意の上送信してください。'
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxW="container.md">
          <ModalHeader>
            {t('privacy.dialog.title', 'TechTalk プライバシーポリシー')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/*
            <div
              className={styles.markdown}
              dangerouslySetInnerHTML={{ __html: policy || 'no data' }}
            ></div>
              */}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="accent" onClick={onClose}>
              {t('privacy.dialog.close', '閉じる')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
export default PrivacyPolicyDialog
