import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Player, Tier } from "@/shared/types"
import { calculateTeamStrength } from "@/shared/utils/team-balance"

interface TierStatisticsProps {
  players: Player[]
  title: string
}

const tierOrder: Tier[] = [
  "CHALLENGER",
  "GRANDMASTER",
  "MASTER",
  "DIAMOND",
  "EMERALD",
  "PLATINUM",
  "GOLD",
  "SILVER",
  "BRONZE",
  "IRON",
  "UNRANKED",
]

export function TierStatistics({ players, title }: TierStatisticsProps) {
  if (players.length === 0) return null

  const tierCounts = players.reduce(
    (acc, player) => {
      acc[player.tier] = (acc[player.tier] || 0) + 1
      return acc
    },
    {} as Record<Tier, number>,
  )

  const totalStrength = calculateTeamStrength(players)
  const averageStrength = totalStrength / players.length
  const totalLP = players.reduce((sum, player) => sum + player.leaguePoints, 0)
  const averageLP = totalLP / players.length

  const highestTierPlayer = players.reduce((highest, player) => {
    const currentTierIndex = tierOrder.indexOf(player.tier)
    const highestTierIndex = tierOrder.indexOf(highest.tier)
    return currentTierIndex < highestTierIndex ? player : highest
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title} 통계</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tier Distribution */}
        <div>
          <h4 className="text-xs font-medium mb-2">티어 분포</h4>
          <div className="space-y-1">
            {tierOrder.map((tier) => {
              const count = tierCounts[tier] || 0
              if (count === 0) return null

              const percentage = (count / players.length) * 100

              return (
                <div key={tier} className="flex items-center justify-between text-xs">
                  <span className="min-w-0 flex-1">{tier}</span>
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Progress value={percentage} className="h-2" />
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Team Statistics */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-muted-foreground">평균 실력</p>
            <p className="font-semibold">{averageStrength.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">평균 LP</p>
            <p className="font-semibold">{Math.round(averageLP)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground">최고 티어</p>
            <p className="font-semibold">
              {highestTierPlayer.summonerName} ({highestTierPlayer.tier} {highestTierPlayer.rank})
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
