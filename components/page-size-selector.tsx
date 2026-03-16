'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const PAGE_SIZES = [10, 20, 30, 50, 100]

interface PageSizeSelectorProps {
  value: number
  onChange: (value: number) => void
  className?: string
}

export function PageSizeSelector({ value, onChange, className }: PageSizeSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <span className="text-sm text-muted-foreground whitespace-nowrap">Show:</span>
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(parseInt(val, 10))}
      >
        <SelectTrigger className="w-[80px] h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZES.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
