"use client"

import { useState, useCallback } from "react"
import type { Player } from "@/shared/types"

export interface DragDropState {
  draggedPlayer: Player | null
  dragOverTeam: "red" | "blue" | "unassigned" | null
  dragOverPosition?: number
}

export function useDragDrop() {
  const [dragState, setDragState] = useState<DragDropState>({
    draggedPlayer: null,
    dragOverTeam: null,
    dragOverPosition: undefined,
  })

  const handleDragStart = useCallback((player: Player) => {
    setDragState((prev) => ({ ...prev, draggedPlayer: player }))
  }, [])

  const handleDragEnd = useCallback(() => {
    setDragState({ draggedPlayer: null, dragOverTeam: null, dragOverPosition: undefined })
  }, [])

  const handleDragOver = useCallback((team: "red" | "blue" | "unassigned" | null, position?: number) => {
    setDragState((prev) => ({ ...prev, dragOverTeam: team, dragOverPosition: position }))
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragState((prev) => ({ ...prev, dragOverTeam: null, dragOverPosition: undefined }))
  }, [])

  return {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
  }
}
