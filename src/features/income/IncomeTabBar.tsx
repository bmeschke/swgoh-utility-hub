import { cn } from '@/lib/utils'

export type IncomeTab =
  | 'crystalIncome'
  | 'assaultBattles'
  | 'territoryBattles'
  | 'raidRewards'
  | 'territoryWar'
  | 'conquest'
  | 'specialEvents'

const TABS: { id: IncomeTab; label: string }[] = [
  { id: 'crystalIncome', label: 'Crystal Income' },
  { id: 'assaultBattles', label: 'Assault Battles' },
  { id: 'territoryBattles', label: 'Territory Battles' },
  { id: 'raidRewards', label: 'Raid Rewards' },
  { id: 'territoryWar', label: 'Territory War' },
  { id: 'conquest', label: 'Conquest' },
  { id: 'specialEvents', label: 'Special Events' },
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
