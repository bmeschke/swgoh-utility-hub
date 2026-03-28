import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Doc } from '../../../convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { PlusIcon, ChevronsUpDownIcon } from 'lucide-react'

export interface ItemComboboxHandle {
  openAndFocus: () => void
}

interface ItemComboboxProps {
  onAdd: (item: Doc<'items'>) => void
  placeholder?: string
  /** Compact mode: smaller trigger button height, used inside SAB option rows */
  compact?: boolean
}

const ItemCombobox = forwardRef<ItemComboboxHandle, ItemComboboxProps>(
  function ItemCombobox({ onAdd, placeholder = 'Add item...', compact = false }, ref) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [highlighted, setHighlighted] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const items = useQuery(api.items.list) ?? []

    // Focus the search input without causing page scroll whenever the popover opens
    useEffect(() => {
      if (open) {
        // rAF lets Base UI finish positioning before we focus
        const id = requestAnimationFrame(() => {
          inputRef.current?.focus({ preventScroll: true })
        })
        return () => cancelAnimationFrame(id)
      }
    }, [open])

    useImperativeHandle(ref, () => ({
      openAndFocus: () => {
        setSearch('')
        setOpen(true)
      },
    }))

    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    )

    function handleSelect(item: Doc<'items'>) {
      onAdd(item)
      setOpen(false)
      setSearch('')
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className={compact
                ? 'w-full justify-between h-7 text-xs'
                : 'w-full justify-between'}
            >
              <span className="flex items-center gap-2">
                <PlusIcon className={compact ? 'size-3' : 'size-4'} />
                {placeholder}
              </span>
              <ChevronsUpDownIcon className={compact ? 'size-3 opacity-50' : 'size-4 opacity-50'} />
            </Button>
          }
        />
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command value={highlighted} onValueChange={setHighlighted}>
            <CommandInput
              ref={inputRef}
              placeholder="Search items..."
              value={search}
              onValueChange={setSearch}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault()
                  const match =
                    filtered.find((i) => i.name === highlighted) ?? filtered[0]
                  if (match) handleSelect(match)
                }
              }}
            />
            <CommandList>
              <CommandEmpty>No items found.</CommandEmpty>
              <CommandGroup>
                {filtered.slice(0, 50).map((item) => (
                  <CommandItem
                    key={item._id}
                    value={item.name}
                    onSelect={() => handleSelect(item)}
                  >
                    <span className="flex-1">{item.name}</span>
                    {item.category && (
                      <span className="text-xs text-muted-foreground">
                        {item.category}
                      </span>
                    )}
                    <span className="ml-2 text-xs font-medium text-muted-foreground">
                      {item.crystalValue}✦
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

export default ItemCombobox
