import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { useFetcher } from 'react-router'
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui'
import { cn } from '~/libs/utils'
import type { Route } from './+types/route'

const master = [
  {
    zip: '100-0001',
    address: '東京都千代田区千代田',
  },
  {
    zip: '001-0000',
    address: '北海道札幌市北区',
  },
  {
    zip: '999-8531',
    address: '山形県飽海郡遊佐町菅里',
  },
]

export const loader = ({ request }: Route.LoaderArgs) => {
  return { zipAddresses: master }
}

interface ZipInputProps {
  defaultValue?: string
  onChange?: (value: string) => void
}
export const ZipInput = ({ defaultValue = '', onChange }: ZipInputProps) => {
  const fetcher = useFetcher<typeof loader>({
    key: '/demo/resources/zip-input',
  })
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)

  const handleOnSelect = (currentValue: string) => {
    const newValue = currentValue === value ? '' : currentValue
    setValue(newValue)
    onChange?.(newValue)
    setOpen(false)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    if (fetcher.data) return
    fetcher.load('/demo/resources/zip-input')
  }, [])

  const zipAddresses = fetcher.data?.zipAddresses

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="justify-between whitespace-nowrap"
        >
          {value ? value : 'Zip...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search zip..." />
          <CommandEmpty>No zip address found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {zipAddresses?.map((zipAddress) => (
                <CommandItem
                  key={zipAddress.zip}
                  value={zipAddress.zip}
                  onSelect={handleOnSelect}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === zipAddress.address
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  <div>
                    <div>{zipAddress.zip}</div>
                    <div className="text-muted-foreground text-xs">
                      {zipAddress.address}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
