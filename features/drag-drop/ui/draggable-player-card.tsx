"use client"

import type React from "react"

import { useState } from "react"
import type { Player, Position } from "@/shared/types"
import { PlayerCard } from "@/entities/player/ui/player-card"
import { cn } from "@/lib/utils"

interface DraggablePlayerCardProps {
  player: Player
  teamColor?: "red" | "blue"
  isSelected?: boolean
  onClick?: () => void
  onDragStart?: (player: Player) => void
  onDragEnd?: () => void
  showPositionSelector?: boolean
  onPositionChange?: (playerId: string, position: Position | undefined) => void
  className?: string
}

export function DraggablePlayerCard({
  player,
  teamColor,
  isSelected,
  onClick,
  onDragStart,
  onDragEnd,
  showPositionSelector,
  onPositionChange,
  className,
}: DraggablePlayerCardProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", player.id)
    onDragStart?.(player)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    onDragEnd?.()
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn("cursor-grab active:cursor-grabbing", className)}
    >
      <PlayerCard
        player={player}
        teamColor={teamColor}
        isSelected={isSelected}
        isDragging={isDragging}
        onClick={onClick}
        showDetailedTier={true}
        showPositionSelector={showPositionSelector}
        onPositionChange={onPositionChange}
      />
    </div>
  )
}
