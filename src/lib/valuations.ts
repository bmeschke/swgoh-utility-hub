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

export function calcDollarValue(
  crystals: number,
  pricingModel: 'regular' | 'holiday'
): number {
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
  if (gainLossPercent >= 45)  return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  if (gainLossPercent > 0)    return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  return 'bg-red-500/20 text-red-300 border-red-500/30'
}

/** Card border color based on gain % */
export function getValueBorderClass(gainLossPercent: number): string {
  if (gainLossPercent >= 145) return 'border-green-500/50'
  if (gainLossPercent >= 45)  return 'border-blue-500/50'
  if (gainLossPercent > 0)    return 'border-purple-500/50'
  return 'border-red-500/50'
}

/** Card header background based on gain % */
export function getValueHeaderBgClass(gainLossPercent: number): string {
  if (gainLossPercent >= 145) return 'bg-green-500/15'
  if (gainLossPercent >= 45)  return 'bg-blue-500/15'
  if (gainLossPercent > 0)    return 'bg-purple-500/15'
  return 'bg-red-500/15'
}

/** Value row background based on gain % */
export function getValueRowBgClass(gainLossPercent: number): string {
  if (gainLossPercent >= 145) return 'bg-green-500/10'
  if (gainLossPercent >= 45)  return 'bg-blue-500/10'
  if (gainLossPercent > 0)    return 'bg-purple-500/10'
  return 'bg-red-500/10'
}
