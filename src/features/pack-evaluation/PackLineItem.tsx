import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { XIcon } from 'lucide-react'

interface PackLineItemProps {
  name: string
  crystalValue: number
  quantity: number
  onQuantityChange: (qty: number) => void
  onRemove: () => void
  inputRef?: (el: HTMLInputElement | null) => void
  onEnter?: () => void
}

export default function PackLineItem({
  name,
  crystalValue,
  quantity,
  onQuantityChange,
  onRemove,
  inputRef,
  onEnter,
}: PackLineItemProps) {
  // Initialize blank if quantity is 0 (new item), pre-filled if quantity > 0 (edit mode)
  const [localValue, setLocalValue] = useState(quantity > 0 ? String(quantity) : '')
  const prevQuantityRef = useRef(quantity)

  // Sync external quantity changes (e.g. duplicate item added via combobox)
  // Uses prevQuantityRef instead of hasMounted to avoid React StrictMode double-invoke bug
  useEffect(() => {
    if (quantity !== prevQuantityRef.current) {
      setLocalValue(String(quantity))
      prevQuantityRef.current = quantity
    }
  }, [quantity])

  const subtotal = crystalValue * quantity

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    setLocalValue(raw)
    const val = parseFloat(raw)
    if (!isNaN(val) && val > 0) {
      onQuantityChange(val)
    }
  }

  function handleBlur() {
    const val = parseFloat(localValue)
    if (isNaN(val) || val <= 0) {
      if (quantity > 0) {
        setLocalValue(String(quantity))
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      const val = parseFloat(localValue)
      if (isNaN(val) || val <= 0) {
        setLocalValue('1')
        onQuantityChange(1)
      }
      onEnter?.()
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/20 px-3 py-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <p className="text-xs text-muted-foreground">
          {crystalValue}✦ × {quantity} = {subtotal.toLocaleString()}✦
        </p>
      </div>
      <Input
        ref={inputRef}
        type="number"
        min={0}
        step="any"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-24 h-6 text-center text-sm px-1 shrink-0"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive"
      >
        <XIcon className="size-3.5" />
      </Button>
    </div>
  )
}
