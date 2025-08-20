"use client"

import type { Player } from "@/shared/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { calculateTeamBalance } from "@/shared/utils/team-balance"
import { TrendingUp, Minus } from "lucide-react"

interface TeamStrengthIndicatorProps {
  redTeam: Player[]
  blueTeam: Player[]
}

export function TeamStrengthIndicator({ redTeam, blueTeam }: TeamStrengthIndicatorProps) {
  if (redTeam.length === 0 && blueTeam.length === 0) return null

  const redBalance = calculateTeamBalance(redTeam)
  const blueBalance = calculateTeamBalance(blueTeam)
  const difference = Math.abs(redBalance - blueBalance)
  const strongerTeam = redBalance > blueBalance ? "red" : blueBalance > redBalance ? "blue" : "balanced"

  const getStrengthLevel = (diff: number) => {
    if (diff < 100) return { level: "균형", color: "bg-green-500", icon: Minus }
    if (diff < 300) return { level: "약간 우세", color: "bg-yellow-500", icon: TrendingUp }
    if (diff < 600) return { level: "우세", color: "bg-orange-500", icon: TrendingUp }
    return { level: "압도적 우세", color: "bg-red-500", icon: TrendingUp }
  }

  const strength = getStrengthLevel(difference)
  const Icon = strength.icon

  return (
    <Card className="border-accent">
      <CardContent className="p-4">
        <div className="flex items-center justify-center gap-4">
          {/* Red Team Indicator */}
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`border-primary ${strongerTeam === "red" ? "bg-primary text-primary-foreground" : ""}`}
            >
              레드팀
            </Badge>
            <span className="text-sm font-mono">{redBalance.toFixed(0)}</span>
          </div>

          {/* Strength Indicator */}
          <div className="flex flex-col items-center gap-1">
            <div className={`p-2 rounded-full ${strength.color} text-white`}>
              <Icon className="w-4 h-4" />
            </div>
            <Badge variant="secondary" className="text-xs">
              {strongerTeam === "balanced"
                ? "균형"
                : strongerTeam === "red"
                  ? `레드팀 ${strength.level}`
                  : `블루팀 ${strength.level}`}
            </Badge>
            <span className="text-xs text-muted-foreground">차이: {difference.toFixed(0)}</span>
          </div>

          {/* Blue Team Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono">{blueBalance.toFixed(0)}</span>
            <Badge
              variant="outline"
              className={`border-secondary ${strongerTeam === "blue" ? "bg-secondary text-secondary-foreground" : ""}`}
            >
              블루팀
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
