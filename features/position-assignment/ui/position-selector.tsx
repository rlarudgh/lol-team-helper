"use client"

import type { Position } from "@/shared/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PositionSelectorProps {
  selectedPosition: Position | undefined
  onPositionChange: (position: Position | undefined) => void
}

const POSITIONS: { value: Position; label: string; icon: string }[] = [
  { value: "TOP", label: "탑", icon: "⚔️" },
  { value: "JUNGLE", label: "정글", icon: "🌲" },
  { value: "MID", label: "미드", icon: "⭐" },
  { value: "ADC", label: "원딜", icon: "🏹" },
  { value: "SUPPORT", label: "서포터", icon: "🛡️" },
]

export function PositionSelector({ selectedPosition, onPositionChange }: PositionSelectorProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">포지션 선택</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {POSITIONS.map((position) => (
            <Button
              key={position.value}
              variant={selectedPosition === position.value ? "default" : "outline"}
              size="sm"
              onClick={() => onPositionChange(selectedPosition === position.value ? undefined : position.value)}
              className="text-xs"
            >
              <span className="mr-1">{position.icon}</span>
              {position.label}
            </Button>
          ))}
          {selectedPosition && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPositionChange(undefined)}
              className="text-xs text-muted-foreground"
            >
              초기화
            </Button>
          )}
        </div>
        {selectedPosition && (
          <Badge variant="secondary" className="mt-2 text-xs">
            선택된 포지션: {POSITIONS.find((p) => p.value === selectedPosition)?.label}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
