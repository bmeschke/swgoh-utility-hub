export interface PatchNote {
  date: string // ISO date, e.g. "2026-05-02"
  title: string
  changes: string[]
}

// Newest entry first.
export const patchNotes: PatchNote[] = [
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
      'Zeta crystal value updated to 133.',
      'Omega crystal value updated to 30.',
    ],
  },
]
