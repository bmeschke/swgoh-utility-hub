import React from 'react'
import type { IncomeResult } from '@/lib/income'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

export interface IncomeSource {
  label: string
  result: IncomeResult
}

interface Props {
  totals: IncomeResult
  breakdown?: IncomeSource[]
}

function fmt(n: number) {
  return n.toLocaleString()
}

function daily(monthly: number) {
  return Math.round(monthly / 30)
}

const CURRENCY_ROWS: { key: keyof IncomeResult; label: string }[] = [
  { key: 'crystals', label: 'Crystals' },
  { key: 'raidMk1', label: 'Raid Mk 1 Tokens' },
  { key: 'raidMk2', label: 'Raid Mk 2 Tokens' },
  { key: 'raidMk3', label: 'Raid Mk 3 Tokens' },
  { key: 'getMk1', label: 'GET Mk 1 Tokens' },
  { key: 'getMk2', label: 'GET Mk 2 Tokens' },
  { key: 'getMk3', label: 'GET Mk 3 Tokens' },
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

// ─── Breakdown tooltip content ─────────────────────────────────────────────

function BreakdownTooltip({
  rowKey,
  sources,
  total,
}: {
  rowKey: keyof IncomeResult
  sources: IncomeSource[]
  total: number
}) {
  const contributing = sources.filter((s) => s.result[rowKey] > 0)
  if (contributing.length < 1) return null

  return (
    <div
      className="min-w-[230px] text-xs grid gap-x-4"
      style={{ gridTemplateColumns: '1fr auto auto' }}
    >
      {/* Header */}
      <span className="pb-1.5 border-b border-border font-medium text-muted-foreground">
        Source
      </span>
      <span className="pb-1.5 border-b border-border font-medium text-muted-foreground text-right">
        Monthly
      </span>
      <span className="pb-1.5 border-b border-border font-medium text-muted-foreground text-right whitespace-nowrap">
        Daily avg
      </span>

      {/* Per-source rows */}
      {contributing.map((s) => {
        const mo = s.result[rowKey]
        return (
          <React.Fragment key={s.label}>
            <span className="pt-1">{s.label}</span>
            <span className="pt-1 text-right tabular-nums">{fmt(mo)}</span>
            <span className="pt-1 text-right tabular-nums text-muted-foreground whitespace-nowrap">
              ~{fmt(daily(mo))}/day
            </span>
          </React.Fragment>
        )
      })}

      {/* Total row */}
      <span className="pt-1.5 mt-0.5 border-t border-border font-medium">Total</span>
      <span className="pt-1.5 mt-0.5 border-t border-border font-medium text-right tabular-nums">
        {fmt(total)}
      </span>
      <span className="pt-1.5 mt-0.5 border-t border-border font-medium text-right tabular-nums text-muted-foreground whitespace-nowrap">
        ~{fmt(daily(total))}/day
      </span>
    </div>
  )
}

// ─── TotalsSection ─────────────────────────────────────────────────────────

function TotalsSection({
  heading,
  rows,
  totals,
  breakdown,
}: {
  heading: string
  rows: { key: keyof IncomeResult; label: string }[]
  totals: IncomeResult
  breakdown?: IncomeSource[]
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
        {heading}
      </div>
      {/* Flat grid: 3 direct children per row via React.Fragment */}
      <div className="grid gap-y-0.5 text-sm" style={{ gridTemplateColumns: '1fr auto auto' }}>
        {rows.map(({ key, label }) => {
          const monthly = totals[key]
          const contributing = breakdown?.filter((s) => s.result[key] > 0) ?? []
          const hasTooltip = contributing.length >= 1

          if (!hasTooltip) {
            return (
              <React.Fragment key={key}>
                <span className="text-foreground pr-4">{label}</span>
                <span className="text-right tabular-nums whitespace-nowrap pr-3">
                  {fmt(monthly)}
                </span>
                <span className="text-right tabular-nums whitespace-nowrap text-muted-foreground">
                  ~{fmt(daily(monthly))}/day
                </span>
              </React.Fragment>
            )
          }

          // Rows with multiple sources get a tooltip on the label
          return (
            <React.Fragment key={key}>
              <Tooltip>
                <TooltipTrigger render={<span className="pr-4 cursor-help w-fit" />}>
                  {label}
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={8}
                  className="!bg-card !text-card-foreground border border-border shadow-lg px-3 py-2.5 max-w-none"
                >
                  <BreakdownTooltip rowKey={key} sources={breakdown!} total={monthly} />
                </TooltipContent>
              </Tooltip>
              <span className="text-right tabular-nums whitespace-nowrap pr-3">{fmt(monthly)}</span>
              <span className="text-right tabular-nums whitespace-nowrap text-muted-foreground">
                ~{fmt(daily(monthly))}/day
              </span>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

// ─── Column header row ─────────────────────────────────────────────────────

function SectionHeader() {
  return (
    <div
      className="grid gap-y-0.5 text-xs text-muted-foreground font-medium mb-1"
      style={{ gridTemplateColumns: '1fr auto auto' }}
    >
      <span />
      <span className="text-right pr-3">Monthly</span>
      <span className="text-right whitespace-nowrap">Daily (avg)</span>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────

export default function IncomeTotals({ totals, breakdown }: Props) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-semibold text-foreground">Monthly &amp; Daily Totals</span>
        <span className="text-xs text-muted-foreground">Hover over any item to see sources</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: Currency + Ability Mats + Mod Mats */}
        <div className="space-y-4">
          <SectionHeader />
          <TotalsSection
            heading="Currency"
            rows={CURRENCY_ROWS}
            totals={totals}
            breakdown={breakdown}
          />
          <div className="border-t" />
          <TotalsSection
            heading="Ability Materials"
            rows={ABILITY_ROWS}
            totals={totals}
            breakdown={breakdown}
          />
          <div className="border-t" />
          <TotalsSection
            heading="Mod Materials"
            rows={MOD_ROWS}
            totals={totals}
            breakdown={breakdown}
          />
        </div>

        {/* Right column: Gear */}
        <div className="space-y-4">
          <SectionHeader />
          <TotalsSection heading="Gear" rows={GEAR_ROWS} totals={totals} breakdown={breakdown} />
        </div>
      </div>
    </div>
  )
}
