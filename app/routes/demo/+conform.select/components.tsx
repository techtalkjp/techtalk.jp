import type { FormType } from './types'

interface ActionResultProps {
  formType: FormType
  now: string
  option?: string
}
export const ActionResult = ({
  actionData,
}: {
  actionData: ActionResultProps
}) => {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-4 rounded-md border p-4">
      <div className="col-span-2">Result</div>
      <div className="text-foreground/50 capitalize">type</div>
      <div>{actionData.formType}</div>
      <div className="text-foreground/50 capitalize">now</div>
      <div>{actionData.now}</div>
      <div className="text-foreground/50 capitalize">option</div>
      <div>{actionData.option ?? 'undefined'}</div>
    </div>
  )
}
