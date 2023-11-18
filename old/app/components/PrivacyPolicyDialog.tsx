import { useState } from 'react'
import Content from '~/assets/privacy.md'
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader } from '~/components/ui'
import { useLocale } from '../features/i18n/hooks/useLocale'

const PrivacyPolicyDialog = () => {
  const { t } = useLocale()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <span className="text-sm">
        {t('privacy.agree-to-before', '')}
        <span
          className="inline cursor-pointer text-primary"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setIsOpen(true)
          }}
        >
          {t('privacy.privacy-policy', 'プライバシーポリシー')}
        </span>
        {t('privacy.agree-to-after', 'に 同意する。')}
      </span>

      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogContent className="flex max-h-[32rem] flex-col gap-4">
          <DialogHeader className="text-xl font-bold">
            {t('privacy.dialog.title', 'TechTalk プライバシーポリシー')}
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
