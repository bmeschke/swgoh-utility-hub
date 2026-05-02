import { useState } from 'react'
import { NewspaperIcon } from 'lucide-react'
import { patchNotes } from '@/data/patchNotes'
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

const LS_KEY = 'patchNotesLastSeen'

function hasUnseenNotes(): boolean {
  if (patchNotes.length === 0) return false
  const lastSeen = localStorage.getItem(LS_KEY)
  if (!lastSeen) return true
  return patchNotes[0].date > lastSeen
}

export default function PatchNotesModal() {
  const [hasNew, setHasNew] = useState(() => hasUnseenNotes())

  function handleOpen() {
    localStorage.setItem(LS_KEY, patchNotes[0]?.date ?? new Date().toISOString())
    setHasNew(false)
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="relative gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={handleOpen}
          />
        }
      >
        <NewspaperIcon className="size-4" />
        Changes
        {hasNew && <span className="absolute right-1 top-1 size-2 rounded-full bg-red-500" />}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Changes</DialogTitle>
          <DialogDescription>
            Recent changes to item values, income data, and GoH Tools features.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-1 space-y-6">
          {patchNotes.map((note, i) => (
            <div key={i}>
              {i > 0 && <Separator className="mb-6" />}
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                {note.date}
              </p>
              <p className="font-medium text-sm mb-2">{note.title}</p>
              <ul className="space-y-1">
                {note.changes.map((change, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex gap-2">
                    <span className="shrink-0">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
