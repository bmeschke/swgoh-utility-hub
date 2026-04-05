export type PriceCurrency = 'usd' | 'crystals'

export interface ProbabilityTier {
  probability: number // 0–100
  quantity: number
}

export const REGULAR_CPD = 165 // crystals per dollar (regular pricing)
export const HOLIDAY_CPD = 212 // crystals per dollar (holiday pricing)

export interface LineItem {
  crystalValue: number
  quantity: number
}

export function calcCrystalEquivalent(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.crystalValue * item.quantity, 0)
}

export function calcDollarValue(crystals: number, pricingModel: 'regular' | 'holiday'): number {
  const cpd = pricingModel === 'regular' ? REGULAR_CPD : HOLIDAY_CPD
  return crystals / cpd
}

export function calcGainLossPercent(dollarValue: number, packPrice: number): number {
  if (packPrice <= 0) return 0
  return ((dollarValue - packPrice) / packPrice) * 100
}

export function getRecommendationLabel(gainLossPercent: number): string {
  if (gainLossPercent >= 145) return 'Excellent'
  if (gainLossPercent >= 45) return 'Good'
  if (gainLossPercent > 0) return 'Fair'
  return 'Scam'
}

/** Tailwind classes for the value badge background/text based on gain % */
export function getValueBadgeClass(gainLossPercent: number): string {
  if (gainLossPercent >= 145) return 'bg-green-500/20 text-green-300 border-green-500/30'
  if (gainLossPercent >= 45) return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  if (gainLossPercent > 0) return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  return 'bg-red-500/20 text-red-300 border-red-500/30'
}

/** Card border color based on gain % */
export function getValueBorderClass(gainLossPercent: number): string {
  if (gainLossPercent >= 145) return 'border-green-500/50'
  if (gainLossPercent >= 45) return 'border-blue-500/50'
  if (gainLossPercent > 0) return 'border-purple-500/50'
  return 'border-red-500/50'
}

/** Card header background based on gain % */
export function getValueHeaderBgClass(gainLossPercent: number): string {
  if (gainLossPercent >= 145) return 'bg-green-500/15'
  if (gainLossPercent >= 45) return 'bg-blue-500/15'
  if (gainLossPercent > 0) return 'bg-purple-500/15'
  return 'bg-red-500/15'
}

/** Value row background based on gain % */
export function getValueRowBgClass(gainLossPercent: number): string {
  if (gainLossPercent >= 145) return 'bg-green-500/10'
  if (gainLossPercent >= 45) return 'bg-blue-500/10'
  if (gainLossPercent > 0) return 'bg-purple-500/10'
  return 'bg-red-500/10'
}

// ─── SAB (Slice-A-Bundle) helpers ─────────────────────────────────────────────

export interface SabTierDraft {
  price: string // string for controlled input
  items: { itemId: string; name: string; crystalValue: number; quantity: number }[]
}

export interface SabDiscount {
  quantity: number // 1, 2, or 3
  discountAmount: string // string for controlled input
}

export const DEFAULT_SAB_TIERS: SabTierDraft[] = [
  { price: '', items: [] },
  { price: '', items: [] },
  { price: '', items: [] },
]

export const DEFAULT_SAB_DISCOUNTS: SabDiscount[] = [
  { quantity: 1, discountAmount: '' },
  { quantity: 2, discountAmount: '' },
  { quantity: 3, discountAmount: '' },
]

/** Average crystal equivalent across choices in one SAB tier (client-side, pre-save) */
export function calcSabTierCE(tier: SabTierDraft): number {
  if (tier.items.length === 0) return 0
  const total = tier.items.reduce((s, i) => s + i.crystalValue * i.quantity, 0)
  return total / tier.items.length
}

/** Total CE across all tiers (used as crystalEquivalent on the pack card) */
export function calcSabAvgCE(tiers: SabTierDraft[]): number {
  return tiers.reduce((s, t) => s + calcSabTierCE(t), 0)
}

/** Total price of all tiers from draft state */
export function calcSabTotalPrice(tiers: SabTierDraft[]): number {
  return tiers.reduce((s, t) => s + (parseFloat(t.price) || 0), 0)
}

/** Total price of server-enriched SAB tiers */
export function calcSabTotalPriceFromTiers(tiers: Array<{ price: number }>): number {
  return tiers.reduce((s, t) => s + t.price, 0)
}

/** Total price of server-enriched Ascension tiers */
export function calcAscensionTotalPriceFromTiers(tiers: Array<{ price: number }>): number {
  return tiers.reduce((s, t) => s + t.price, 0)
}

// ─── Ascension helpers ────────────────────────────────────────────────────────

export interface AscensionTierDraft {
  price: string
  items: { itemId: string; name: string; crystalValue: number; quantity: number }[]
}

export const DEFAULT_ASCENSION_TIERS: AscensionTierDraft[] = [
  { price: '', items: [] },
  { price: '', items: [] },
  { price: '', items: [] },
]

export function calcAscensionTierCE(tier: AscensionTierDraft): number {
  return tier.items.reduce((s, i) => s + i.crystalValue * i.quantity, 0)
}

export function calcAscensionTotalCE(tiers: AscensionTierDraft[]): number {
  return tiers.reduce((s, t) => s + calcAscensionTierCE(t), 0)
}

export function calcAscensionTotalPrice(tiers: AscensionTierDraft[]): number {
  return tiers.reduce((s, t) => s + (parseFloat(t.price) || 0), 0)
}

/**
 * Compute total CE + total price for an interactive SAB selection.
 * tiersSelected = number of tiers purchased (0, 1, 2, or 3).
 * Tiers are cumulative — buying tier N means buying all tiers 1..N.
 */
export function calcSabSelectionValue(
  tiers: Array<{ price: number; crystalEquivalent: number }>,
  tiersSelected: number
): { totalCE: number; totalPrice: number } {
  let totalCE = 0
  let totalPrice = 0
  for (let i = 0; i < tiersSelected && i < tiers.length; i++) {
    totalCE += tiers[i].crystalEquivalent
    totalPrice += tiers[i].price
  }
  return { totalCE, totalPrice }
}
