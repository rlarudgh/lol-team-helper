"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Users } from "lucide-react"
import type { Player } from "@/shared/types"

interface PlayerTransferControlsProps {
  selectedPlayer: Player | null
  onMoveToRed: () => void
  onMoveToBlue: () => void
  onMoveToUnassigned: () => void
  canMoveToRed: boolean
  canMoveToBlue: boolean
}

export function PlayerTransferControls({
  selectedPlayer,
  onMoveToRed,
  onMoveToBlue,
  onMoveToUnassigned,
  canMoveToRed,
  canMoveToBlue,
}: PlayerTransferControlsProps) {
  if (!selectedPlayer) {
    return <div className="text-center text-muted-foreground py-4">플레이어를 선택하여 팀 간 이동하세요</div>
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-center text-sm font-medium mb-2">선택된 플레이어: {selectedPlayer.summonerName}</div>

      <div className="flex gap-2 justify-center">
        <Button
          onClick={onMoveToRed}
          disabled={!canMoveToRed}
          variant="outline"
          size="sm"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          레드팀으로
        </Button>

        <Button onClick={onMoveToUnassigned} variant="outline" size="sm">
          <Users className="w-4 h-4 mr-1" />
          미배정으로
        </Button>

        <Button
          onClick={onMoveToBlue}
          disabled={!canMoveToBlue}
          variant="outline"
          size="sm"
          className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
        >
          블루팀으로
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
