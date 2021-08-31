import React, { useState, useEffect } from 'react'
import { useLocale } from '../utils/useLocale'
import marked from 'marked'
import axios from 'axios'
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
import styles from '../assets/privacy.module.css'

interface Props {}

const PrivacyPolicyDialog: React.FC<Props> = (props) => {
  const { t } = useLocale()
  const [policy, setPolicy] = useState<string>('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    async function fetch() {
      const ret = await axios.get('/privacy.md').catch(() => null)
      if (ret) setPolicy(marked(ret.data as string))
    }
    fetch()
  }, [])

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

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {t('privacy.dialog.title', 'TechTalk プライバシーポリシー')}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div
              className={styles.markdown}
              dangerouslySetInnerHTML={{ __html: policy }}
            ></div>
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
