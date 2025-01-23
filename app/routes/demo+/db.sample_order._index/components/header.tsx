import { Badge, HStack } from '~/components/ui'

export const Header = ({
  region,
  selectDuration,
  insertDuration,
}: {
  region: string
  selectDuration: number
  insertDuration?: number
}) => {
  return (
    <HStack className="text-foreground/50 text-sm">
      <div>
        Region{' '}
        <Badge variant="secondary" className="text-foreground/50">
          {region}
        </Badge>
      </div>
      <div>
        SELECT <Badge>{selectDuration}ms</Badge>
      </div>
      {insertDuration && (
        <div>
          INSERT <Badge variant="destructive">{insertDuration}ms</Badge>
        </div>
      )}
    </HStack>
  )
}
