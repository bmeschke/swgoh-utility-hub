import { InfoIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

export default function IncomeAssumptionsModal() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          />
        }
      >
        <InfoIcon className="size-4" />
        Assumptions
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Income Assumptions</DialogTitle>
          <DialogDescription>
            Some inputs are fixed to keep the calculator simple. Here's what's assumed for all
            players regardless of your selections.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <Separator />
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">28-day cycle</span> — all "monthly"
              totals are calculated over 28 days, not 30 or 31. Most in-game events (GAC, Conquest,
              Territory War, Territory Battle, etc.) run on a 4-week cycle, making 28 days the most
              accurate baseline.
            </li>
            <li>
              <span className="font-medium text-foreground">Daily Activities</span> — completed
              every day (+70 crystals/day, +1 Omega/day, +3 Kyrotech salvage/day); includes +25
              crystals/day from Galactic War
            </li>
            <li>
              <span className="font-medium text-foreground">Monthly login calendar</span> — login
              reward claimed every day; monthly calendar assumed to award ~500 crystals, +1 Zeta,
              and +1 Omega (based on April 2025; may vary month-to-month)
            </li>
            <li>
              <span className="font-medium text-foreground">Omega Battles</span> — 8 events per
              month (twice per week); each awards +10 Omegas and +3 Zetas (+80 Omegas and +24
              Zetas/month total)
            </li>
            <li>
              <span className="font-medium text-foreground">Grand Arena</span> — 4.5 wins + 4.5
              losses per season; weekly-end placement averaged as 1.5× 2nd–4th and 1.5× 5th–7th
            </li>
            <li>
              <span className="font-medium text-foreground">Territory Wars</span> — 2 wins + 2
              losses per month (4 events total); Prize Box rewards are not included as drop odds are
              unknown
            </li>
            <li>
              <span className="font-medium text-foreground">Raids</span> — 4 raids per month
            </li>
            <li>
              <span className="font-medium text-foreground">Territory Battles</span> — Prize Box
              rewards are not included; the drop odds for Prize Box contents are unknown
            </li>
            <li>
              <span className="font-medium text-foreground">Episode Track</span> — track is fully
              completed (level 50) regardless of whether the Episode Pass is purchased
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
