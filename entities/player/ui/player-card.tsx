"use client"

import type { Player, Position } from "@/shared/types"
import { TierBadge } from "@/shared/ui/tier-badge"
import { PositionSelector } from "@/features/position-assignment/ui/position-selector"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface PlayerCardProps {
  player: Player
  teamColor?: "red" | "blue"
  isDragging?: boolean
  isSelected?: boolean
  onClick?: () => void
  showDetailedTier?: boolean
  showPositionSelector?: boolean
  onPositionChange?: (playerId: string, position: Position | undefined) => void
  className?: string
}

export function PlayerCard({
  player,
  teamColor,
  isDragging = false,
  isSelected = false,
  onClick,
  showDetailedTier = false,
  showPositionSelector = false,
  onPositionChange,
  className,
}: PlayerCardProps) {
  const [showPositionSettings, setShowPositionSettings] = useState(false)

  const teamColorClass =
    teamColor === "red"
      ? "border-primary bg-primary/5"
      : teamColor === "blue"
        ? "border-secondary bg-secondary/5"
        : "border-border"

  const handlePositionChange = (position: Position | undefined) => {
    onPositionChange?.(player.id, position)
    setShowPositionSettings(false)
  }

  return (
    <div className="space-y-2">
      <Card
        className={cn(
          "p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
          teamColorClass,
          isDragging && "opacity-50 scale-95",
          isSelected && "ring-2 ring-accent shadow-lg",
          className,
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/${player.profileIconId}.png`}
              alt={player.summonerName}
            />
            <AvatarFallback>{player.summonerName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm truncate">{player.summonerName}</p>
              {player.position && (
                <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                  {player.position}
                </span>
              )}
            </div>
            <div className="mt-1">
              <TierBadge
                tier={player.tier}
                rank={player.rank}
                leaguePoints={showDetailedTier ? player.leaguePoints : undefined}
                size="sm"
                showIcon={showDetailedTier}
              />
            </div>
          </div>

          {showPositionSelector && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setShowPositionSettings(!showPositionSettings)
              }}
              className="h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>

      {showPositionSettings && showPositionSelector && (
        <PositionSelector selectedPosition={player.position} onPositionChange={handlePositionChange} />
      )}
    </div>
  )
}
