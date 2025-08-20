"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface DropZoneProps {
  onDrop: (playerId: string) => void
  onDragOver?: () => void
  onDragLeave?: () => void
  canDrop?: boolean
  isOver?: boolean
  children: React.ReactNode
  className?: string
}

export function DropZone({
  onDrop,
  onDragOver,
  onDragLeave,
  canDrop = true,
  isOver = false,
  children,
  className,
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    if (!canDrop) return
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setIsDragOver(true)
    onDragOver?.()
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Only trigger drag leave if we're actually leaving the drop zone
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
      onDragLeave?.()
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    if (!canDrop) return

    const playerId = e.dataTransfer.getData("text/plain")
    if (playerId) {
      onDrop(playerId)
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "transition-all duration-200",
        isDragOver && canDrop && "ring-2 ring-accent ring-opacity-50 bg-accent/5",
        isDragOver && !canDrop && "ring-2 ring-destructive ring-opacity-50 bg-destructive/5",
        className,
      )}
    >
      {children}
    </div>
  )
}
