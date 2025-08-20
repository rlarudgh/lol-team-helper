"use client"

import type { Player, Position } from "@/shared/types"
import { Badge } from "@/components/ui/badge"

interface TeamPositionsDisplayProps {
  players: Player[]
  teamName: string
  teamColor: "red" | "blue"
}

const POSITION_ORDER: Position[] = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"]
const POSITION_LABELS: Record<Position, string> = {
  TOP: "탑",
  JUNGLE: "정글",
  MID: "미드",
  ADC: "원딜",
  SUPPORT: "서포터",
}

const POSITION_ICONS: Record<Position, string> = {
  TOP: "⚔️",
  JUNGLE: "🌲",
  MID: "⭐",
  ADC: "🏹",
  SUPPORT: "🛡️",
}

export function TeamPositionsDisplay({ players, teamName, teamColor }: TeamPositionsDisplayProps) {
  const getPlayerByPosition = (position: Position) => {
    return players.find((p) => p.position === position)
  }

  const unassignedPlayers = players.filter((p) => !p.position)

  return (
    <div className="space-y-2">
      {/* Position-assigned players */}
      {POSITION_ORDER.map((position) => {
        const player = getPlayerByPosition(position)
        return (
          <div key={position} className="flex items-center gap-2 p-2 rounded border">
            <Badge variant="outline" className="min-w-[60px] text-xs">
              <span className="mr-1">{POSITION_ICONS[position]}</span>
              {POSITION_LABELS[position]}
            </Badge>
            {player ? (
              <span className="text-sm font-medium">{player.summonerName}</span>
            ) : (
              <span className="text-sm text-muted-foreground italic">미배정</span>
            )}
          </div>
        )
      })}

      {/* Unassigned players */}
      {unassignedPlayers.length > 0 && (
        <div className="mt-3 pt-2 border-t">
          <Badge variant="secondary" className="mb-2 text-xs">
            포지션 미지정
          </Badge>
          {unassignedPlayers.map((player) => (
            <div key={player.id} className="text-sm text-muted-foreground ml-2">
              • {player.summonerName}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
