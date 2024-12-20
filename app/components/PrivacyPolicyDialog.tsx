import { DialogDescription } from '@radix-ui/react-dialog'
import { useState } from 'react'
import Content from '~/assets/privacy.mdx'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui'
import { useLocale } from '../i18n/hooks/useLocale'

const PrivacyPolicyDialog = () => {
  const { t } = useLocale()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <span className="text-sm">
        {t('privacy.agree-to-before', '')}
        <Button
          type="button"
          variant="link"
          className="p-0.5"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setIsOpen(true)
          }}
        >
          {t('privacy.privacy-policy', 'プライバシーポリシー')}
        </Button>
        {t('privacy.agree-to-after', 'に 同意する')}
      </span>

      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogContent className="flex max-h-[32rem] flex-col gap-4">
          <DialogHeader className="text-xl font-bold">
            <DialogTitle>
              {t('privacy.dialog.title', 'TechTalk プライバシーポリシー')}
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <div className="markdown flex-1 overflow-auto">
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
