import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Player } from "@/shared/types"
import { getTeamBalance } from "@/shared/utils/team-balance"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface TeamComparisonProps {
  redTeam: Player[]
  blueTeam: Player[]
}

export function TeamComparison({ redTeam, blueTeam }: TeamComparisonProps) {
  if (redTeam.length === 0 && blueTeam.length === 0) return null

  const balance = getTeamBalance(redTeam, blueTeam)

  const getAdvantageIcon = () => {
    if (balance.isBalanced) return <Minus className="w-4 h-4 text-green-500" />
    if (balance.redStrength > balance.blueStrength) return <TrendingUp className="w-4 h-4 text-red-500" />
    return <TrendingDown className="w-4 h-4 text-blue-500" />
  }

  const getAdvantageText = () => {
    if (balance.isBalanced) return "균형잡힌 매치업"
    const stronger = balance.redStrength > balance.blueStrength ? "레드팀" : "블루팀"
    const advantage = balance.difference.toFixed(1)
    return `${stronger} +${advantage} 우세`
  }

  const getAdvantageColor = () => {
    if (balance.isBalanced) return "bg-green-100 text-green-800 border-green-200"
    if (balance.difference <= 1) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const redAvgLP = redTeam.length > 0 ? redTeam.reduce((sum, p) => sum + p.leaguePoints, 0) / redTeam.length : 0
  const blueAvgLP = blueTeam.length > 0 ? blueTeam.reduce((sum, p) => sum + p.leaguePoints, 0) / blueTeam.length : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">{getAdvantageIcon()}팀 비교 분석</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Balance */}
        <div className="text-center">
          <Badge className={getAdvantageColor()}>{getAdvantageText()}</Badge>
        </div>

        {/* Detailed Comparison */}
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="text-center">
            <p className="text-primary font-semibold">레드팀</p>
            <p className="text-muted-foreground">실력: {balance.redStrength.toFixed(1)}</p>
            <p className="text-muted-foreground">평균 LP: {Math.round(redAvgLP)}</p>
          </div>

          <div className="text-center border-x px-2">
            <p className="font-semibold">차이</p>
            <p className="text-muted-foreground">{balance.difference.toFixed(1)}</p>
            <p className="text-muted-foreground">{Math.abs(redAvgLP - blueAvgLP).toFixed(0)} LP</p>
          </div>

          <div className="text-center">
            <p className="text-secondary font-semibold">블루팀</p>
            <p className="text-muted-foreground">실력: {balance.blueStrength.toFixed(1)}</p>
            <p className="text-muted-foreground">평균 LP: {Math.round(blueAvgLP)}</p>
          </div>
        </div>

        {/* Match Prediction */}
        <div className="text-center pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            {balance.isBalanced
              ? "매우 치열한 경기가 예상됩니다!"
              : `${balance.redStrength > balance.blueStrength ? "레드팀" : "블루팀"}이 약간 유리할 것으로 예상됩니다.`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
