import { cn } from '@/lib/utils'

export type IncomeTab = 'soloEvents' | 'pvp' | 'guildEvents'

const TABS: { id: IncomeTab; label: string }[] = [
  { id: 'soloEvents', label: 'Solo Events' },
  { id: 'pvp', label: 'PvP' },
  { id: 'guildEvents', label: 'Guild Events' },
]

interface Props {
  active: IncomeTab
  onChange: (tab: IncomeTab) => void
}

export default function IncomeTabBar({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1 border-b pb-0">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'rounded-t px-4 py-2 text-sm font-medium transition-colors',
            active === tab.id
              ? 'border border-b-background bg-background text-foreground -mb-px'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
