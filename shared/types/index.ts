export interface Player {
  id: string
  summonerName: string
  tier: Tier
  rank: string
  leaguePoints: number
  profileIconId: number
  position?: Position
}

export interface Team {
  id: "red" | "blue"
  name: string
  players: Player[]
  color: string
}

export interface Match {
  id: string
  redTeam: Team
  blueTeam: Team
  createdAt: Date
}

export type Tier =
  | "IRON"
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "PLATINUM"
  | "EMERALD"
  | "DIAMOND"
  | "MASTER"
  | "GRANDMASTER"
  | "CHALLENGER"
  | "UNRANKED"

export type Position = "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT"
