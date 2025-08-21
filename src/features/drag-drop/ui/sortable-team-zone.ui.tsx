"use client";

import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Player } from "@/shared/types/team-player.types";

interface SortableTeamZoneProps {
  players: Player[];
  onDrop: (playerId: string, targetIndex?: number) => void;
  onDragOver?: (position?: number) => void;
  onDragLeave?: () => void;
  canDrop?: boolean;
  isOver?: boolean;
  children: React.ReactNode;
  className?: string;
  teamType: "red" | "blue" | "unassigned";
}

export function SortableTeamZone({
  players,
  onDrop,
  onDragOver,
  onDragLeave,
  canDrop = true,
  isOver = false,
  children,
  className,
  teamType,
}: SortableTeamZoneProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    if (!canDrop) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const itemHeight = rect.height / Math.max(players.length, 1);
    const targetIndex = Math.floor(y / itemHeight);

    setDragOverIndex(targetIndex);
    onDragOver?.(targetIndex);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverIndex(null);
      onDragLeave?.();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (!canDrop) return;

    const playerId = e.dataTransfer.getData("text/plain");
    if (playerId) {
      onDrop(playerId, dragOverIndex ?? undefined);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "transition-all duration-200 min-h-[200px] relative",
        isOver && canDrop && "ring-2 ring-accent ring-opacity-50 bg-accent/5",
        isOver &&
          !canDrop &&
          "ring-2 ring-destructive ring-opacity-50 bg-destructive/5",
        className
      )}
    >
      {children}
      {dragOverIndex !== null && canDrop && (
        <div
          className="absolute left-0 right-0 h-0.5 bg-accent z-10"
          style={{
            top: `${(dragOverIndex / Math.max(players.length, 1)) * 100}%`,
          }}
        />
      )}
    </div>
  );
}
