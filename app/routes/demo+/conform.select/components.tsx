import type { action } from './route'

export const ActionResult = ({
  actionData,
}: {
  actionData: Awaited<ReturnType<typeof action>>
}) => {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-4 rounded-md border p-4">
      <div className="col-span-2">Result</div>
      <div className="capitalize text-foreground/50">type</div>
      <div>{actionData.formType}</div>
      <div className="capitalize text-foreground/50">now</div>
      <div>{actionData.now}</div>
      <div className="capitalize text-foreground/50">option</div>
      <div>{actionData.option ?? 'undefined'}</div>
    </div>
  )
}
