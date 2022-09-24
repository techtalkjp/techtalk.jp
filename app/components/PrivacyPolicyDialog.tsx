import React from 'react'
import { useLocale } from '../features/i18n/hooks/useLocale'
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
import Content from '~/assets/privacy.md'

interface Props {}

const PrivacyPolicyDialog: React.FC<Props> = (props) => {
  const { t } = useLocale()
  const { isOpen, onOpen, onClose } = useDisclosure()

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
            <Box className="markdown">
              <Content />
            </Box>
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