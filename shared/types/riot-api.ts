export interface RiotSummoner {
  id: string
  accountId: string
  puuid: string
  name: string
  profileIconId: number
  revisionDate: number
  summonerLevel: number
}

export interface RiotLeagueEntry {
  leagueId: string
  summonerId: string
  summonerName: string
  queueType: string
  tier: string
  rank: string
  leaguePoints: number
  wins: number
  losses: number
  hotStreak: boolean
  veteran: boolean
  freshBlood: boolean
  inactive: boolean
  miniSeries?: {
    target: number
    wins: number
    losses: number
    progress: string
  }
}

export interface RiotApiError {
  status: {
    message: string
    status_code: number
  }
}
