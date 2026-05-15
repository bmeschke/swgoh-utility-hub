export interface PatchNote {
  date: string // ISO date, e.g. "2026-05-02"
  title: string
  changes: string[]
}

// Newest entry first.
export const patchNotes: PatchNote[] = [
  {
    date: '2026-05-12',
    title: 'Omega Battle Refresh Cost Increase',
    changes: [
      'Made changes to the crystal value of Zeta ability materials based on the updated Tier 3 refresh cost in the new Omega Battles.',
      'Zeta crystal value updated to 133 (based on the first refresh).',
    ],
  },
  {
    date: '2026-05-11',
    title: 'Income Calculator',
    changes: [
      'New tool: Income Calculator — model your monthly crystal, currency, and material income from every SWGOH reward source.',
      'Configure Assault Battles, Grand Arena, Fleet Arena, Territory Wars, Raids, Territory Battles, Conquest, Special Events, and more.',
      'Toggle premium passes (Episode Pass, Conquest Pass) to see how they affect your monthly income.',
      'Totals panel shows monthly and daily averages for every resource type, with per-source breakdowns on hover.',
      'Sign in to save your selections across sessions.',
    ],
  },
  {
    date: '2026-05-08',
    title: 'Item Values Modal Improvements',
    changes: [
      'Added explanations for what the % value means, with a color-coded breakdown of value categories (Excellent, Good, Fair, Scam) and their thresholds.',
      'Added explanations for Standard Value and Holiday Value, including the crystal-per-dollar rates used (165✦ standard, 212✦ holiday).',
      'Value category filter labels now show their percent ranges (e.g. "Good (+45% - 144%)").',
    ],
  },
  {
    date: '2026-05-03',
    title: 'Pack Library Filter by Type',
    changes: [
      'Added a "Filter by Type" option to the filter menu — toggle Standard Pack, Ascension Pack, and Slice-A-Bundle visibility independently.',
    ],
  },
  {
    date: '2026-05-02',
    title: 'Pack Library Filtering Improvements',
    changes: [
      'Added a "Filter by Value" option inside the search bar — toggle individual value categories (Excellent, Good, Fair, Scam) independently instead of selecting a single tier.',
      'Added a "Filter by Contents" option — search for a specific item and see only packs that contain it, including SABs and Ascension packs where it appears in any tier.',
      'Filters are now saved in the URL, so navigating to a pack and hitting the back button returns you to your filtered results.',
    ],
  },
  {
    date: '2026-05-02',
    title: 'Omega Battle Economy Changes',
    changes: [
      'Made changes to the crystal values of Omega and Zeta ability materials based on the new Tier 2 and Tier 3 refresh costs in the new Omega Battles.',
      'Zeta crystal value updated to 100.',
      'Omega crystal value updated to 30.',
    ],
  },
]
