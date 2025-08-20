import type { Player, Tier } from "@/shared/types"

// Tier point system for balance calculation
const tierPoints: Record<Tier, number> = {
  CHALLENGER: 10,
  GRANDMASTER: 9,
  MASTER: 8,
  DIAMOND: 7,
  EMERALD: 6,
  PLATINUM: 5,
  GOLD: 4,
  SILVER: 3,
  BRONZE: 2,
  IRON: 1,
  UNRANKED: 0,
}

export function calculateTeamStrength(players: Player[]): number {
  return players.reduce((total, player) => {
    const basePoints = tierPoints[player.tier]
    const lpBonus = player.leaguePoints / 1000 // LP bonus (max 1 point)
    return total + basePoints + lpBonus
  }, 0)
}

export function calculateTeamBalance(players: Player[]): number {
  return calculateTeamStrength(players)
}

export function getTeamBalance(
  redTeam: Player[],
  blueTeam: Player[],
): {
  redStrength: number
  blueStrength: number
  difference: number
  isBalanced: boolean
} {
  const redStrength = calculateTeamStrength(redTeam)
  const blueStrength = calculateTeamStrength(blueTeam)
  const difference = Math.abs(redStrength - blueStrength)
  const isBalanced = difference <= 2 // Consider balanced if difference is <= 2 points

  return {
    redStrength,
    blueStrength,
    difference,
    isBalanced,
  }
}

export function createBalancedTeams(players: Player[]): {
  redTeam: Player[]
  blueTeam: Player[]
} {
  if (players.length !== 10) {
    throw new Error("Exactly 10 players required for balanced team creation")
  }

  // Sort players by strength (tier + LP)
  const sortedPlayers = [...players].sort((a, b) => {
    const aStrength = tierPoints[a.tier] + a.leaguePoints / 1000
    const bStrength = tierPoints[b.tier] + b.leaguePoints / 1000
    return bStrength - aStrength
  })

  let bestRedTeam: Player[] = []
  let bestBlueTeam: Player[] = []
  let bestDifference = Number.POSITIVE_INFINITY

  // Try different combinations to find the most balanced teams
  const combinations = generateCombinations(sortedPlayers, 5)

  for (const redTeam of combinations) {
    const blueTeam = sortedPlayers.filter((player) => !redTeam.includes(player))
    const balance = getTeamBalance(redTeam, blueTeam)

    if (balance.difference < bestDifference) {
      bestDifference = balance.difference
      bestRedTeam = redTeam
      bestBlueTeam = blueTeam
    }
  }

  return {
    redTeam: bestRedTeam,
    blueTeam: bestBlueTeam,
  }
}

function generateCombinations<T>(arr: T[], size: number): T[][] {
  if (size === 0) return [[]]
  if (arr.length === 0) return []

  const [first, ...rest] = arr
  const withFirst = generateCombinations(rest, size - 1).map((combo) => [first, ...combo])
  const withoutFirst = generateCombinations(rest, size)

  return [...withFirst, ...withoutFirst]
}
