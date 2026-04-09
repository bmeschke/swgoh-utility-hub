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
              <span className="font-medium text-foreground">Daily Activities</span> — completed
              every day (+70 crystals/day, +1 Omega/day); includes +25 crystals/day from Galactic
              War
            </li>
            <li>
              <span className="font-medium text-foreground">Daily login</span> — login reward
              claimed every day
            </li>
            <li>
              <span className="font-medium text-foreground">Grand Arena</span> — 5 wins + 4 losses
              per season, always finishing 2nd–4th place
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
