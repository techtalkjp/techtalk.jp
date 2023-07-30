import { useState } from 'react'
import Content from '~/assets/privacy.md'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '~/components/ui'
import { useLocale } from '../features/i18n/hooks/useLocale'

const PrivacyPolicyDialog = () => {
  const { t } = useLocale()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div>
        {t('privacy.agree-to-before', '')}
        <p
          className="text-primary cursor-pointer inline"
          onClick={() => setIsOpen(true)}
        >
          {t('privacy.privacy-policy', 'プライバシーポリシー')}
        </p>
        {t(
          'privacy.agree-to-after',
          'をお読みいただき、同意の上送信してください。',
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogContent className="max-h-[32rem] flex flex-col gap-4">
          <DialogHeader className="font-bold text-xl">
            {t('privacy.dialog.title', 'TechTalk プライバシーポリシー')}
          </DialogHeader>

          <div className="markdown overflow-auto flex-1">
            <Content />
          </div>
          <DialogFooter>
            <Button className="w-full" onClick={() => setIsOpen(false)}>
              {t('privacy.dialog.close', '閉じる')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
export default PrivacyPolicyDialog
