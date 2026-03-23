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

const ABILITY_ROWS: { key: keyof IncomeResult; label: string }[] = [
  { key: 'omega', label: 'Omega' },
  { key: 'zeta', label: 'Zeta' },
  { key: 'omicron', label: 'Omicron' },
]

const GEAR_ROWS: { key: keyof IncomeResult; label: string }[] = [
  { key: 'kyrotechShockProd', label: 'Kyrotech Shock Prod Salvage' },
  { key: 'kyrotechBattleComputer', label: 'Kyrotech Battle Computer Salvage' },
  { key: 'injectorHead', label: 'Injector Head Salvage' },
  { key: 'injectorHandle', label: 'Injector Handle Salvage' },
  { key: 'injectorCell', label: 'Injector Cell Salvage' },
  { key: 'greySignalData', label: 'Grey Signal Data' },
  { key: 'greenSignalData', label: 'Green Signal Data' },
  { key: 'blueSignalData', label: 'Blue Signal Data' },
  { key: 'bronziumWiring', label: 'Bronzium Wiring' },
  { key: 'carboniteCircuitBoard', label: 'Carbonite Circuit Board' },
  { key: 'chromiumTransistors', label: 'Chromium Transistors' },
  { key: 'aurodiumHeatsink', label: 'Aurodium Heatsink' },
  { key: 'electriumConductor', label: 'Electrium Conductor' },
  { key: 'zinbiddleCard', label: 'Zinbiddle Card' },
  { key: 'impulseDetector', label: 'Impulse Detector' },
  { key: 'aeromagnifier', label: 'Aeromagnifier' },
  { key: 'droidBrain', label: 'Droid Brain' },
  { key: 'gyrdaKeypad', label: 'Gyrda Keypad' },
]

const MOD_ROWS: { key: keyof IncomeResult; label: string }[] = [
  { key: 'mk1FusionDisk', label: 'Mk 1 Fusion Disk' },
  { key: 'mk1FusionCoil', label: 'Mk 1 Fusion Coil' },
  { key: 'mk1PowerFlowControlChip', label: 'Mk 1 Power Flow Control Chip' },
  { key: 'mk1Capacitor', label: 'Mk 1 Capacitor' },
  { key: 'mk1Amplifier', label: 'Mk 1 Amplifier' },
  { key: 'mk2PulseModulator', label: 'Mk 2 Pulse Modulator' },
  { key: 'mk2CircuitBreaker', label: 'Mk 2 Circuit Breaker Module' },
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
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
        {heading}
      </div>
      {/* Label gets all remaining space; number columns shrink to fit content */}
      <div className="grid gap-y-0.5 text-sm" style={{ gridTemplateColumns: '1fr auto auto' }}>
        {rows.map(({ key, label }) => (
          <>
            <span key={`${key}-label`} className="text-foreground pr-4">
              {label}
            </span>
            <span key={`${key}-mo`} className="text-right tabular-nums whitespace-nowrap pr-3">
              {fmt(totals[key])}
            </span>
            <span key={`${key}-day`} className="text-right tabular-nums whitespace-nowrap text-muted-foreground">
              ~{fmt(daily(totals[key]))}/day
            </span>
          </>
        ))}
      </div>
    </div>
  )
}

// Column header row matching the same grid template
function SectionHeader() {
  return (
    <div className="grid gap-y-0.5 text-xs text-muted-foreground font-medium mb-1" style={{ gridTemplateColumns: '1fr auto auto' }}>
      <span />
      <span className="text-right pr-3">Monthly</span>
      <span className="text-right whitespace-nowrap">Daily (avg)</span>
    </div>
  )
}

export default function IncomeTotals({ totals }: Props) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
      <span className="text-sm font-semibold text-foreground">Monthly &amp; Daily Totals</span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left column: Currency + Ability Mats + Mod Mats */}
        <div className="space-y-4">
          <SectionHeader />
          <TotalsSection heading="Currency" rows={CURRENCY_ROWS} totals={totals} />
          <div className="border-t" />
          <TotalsSection heading="Ability Materials" rows={ABILITY_ROWS} totals={totals} />
          <div className="border-t" />
          <TotalsSection heading="Mod Materials" rows={MOD_ROWS} totals={totals} />
        </div>

        {/* Right column: Gear */}
        <div className="space-y-4">
          <SectionHeader />
          <TotalsSection heading="Gear" rows={GEAR_ROWS} totals={totals} />
        </div>

      </div>
    </div>
  )
}
