import type { IncomeResult } from '@/lib/income'

interface Props {
  totals: IncomeResult
}

function fmt(n: number) {
  return n.toLocaleString()
}

function daily(monthly: number) {
  return Math.round(monthly / 30)
}

const CURRENCY_ROWS: { key: keyof IncomeResult; label: string }[] = [
  { key: 'crystals', label: 'Crystals' },
  { key: 'raidMk1', label: 'Raid Mk 1' },
  { key: 'raidMk2', label: 'Raid Mk 2' },
  { key: 'raidMk3', label: 'Raid Mk 3' },
  { key: 'getMk1', label: 'GET Mk 1' },
  { key: 'getMk2', label: 'GET Mk 2' },
  { key: 'getMk3', label: 'GET Mk 3' },
]

const GEAR_ROWS: { key: keyof IncomeResult; label: string }[] = [
  { key: 'kyrotechShockProd', label: 'Kyrotech Shock Prod Salvage' },
  { key: 'kyrotechBattleComputer', label: 'Kyrotech Battle Computer Salvage' },
  { key: 'signalData', label: 'Signal Data' },
  { key: 'bronziumWiring', label: 'Bronzium Wiring' },
  { key: 'carboniteCircuitBoard', label: 'Carbonite Circuit Board' },
  { key: 'chromiumTransistor', label: 'Chromium Transistor' },
  { key: 'aurodiumHeatsink', label: 'Aurodium Heatsink' },
  { key: 'electriumConductor', label: 'Electrium Conductor' },
]

function TotalsSection({
  heading,
  rows,
  totals,
}: {
  heading: string
  rows: { key: keyof IncomeResult; label: string }[]
  totals: IncomeResult
}) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground col-span-3 mb-1">
          {heading}
        </span>
        {rows.map(({ key, label }) => (
          <>
            <span key={`${key}-label`} className="text-foreground">
              {label}
            </span>
            <span key={`${key}-mo`} className="text-right tabular-nums">
              {fmt(totals[key])}
            </span>
            <span key={`${key}-day`} className="text-right tabular-nums text-muted-foreground">
              ~{fmt(daily(totals[key]))}/day
            </span>
          </>
        ))}
      </div>
    </div>
  )
}

export default function IncomeTotals({ totals }: Props) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
      <div className="grid grid-cols-3 gap-x-4 text-xs text-muted-foreground font-medium">
        <span className="text-sm font-semibold text-foreground">Monthly &amp; Daily Totals</span>
        <span className="text-right">Monthly</span>
        <span className="text-right">Daily (avg)</span>
      </div>
      <TotalsSection heading="Currency" rows={CURRENCY_ROWS} totals={totals} />
      <div className="border-t" />
      <TotalsSection heading="Gear" rows={GEAR_ROWS} totals={totals} />
    </div>
  )
}
