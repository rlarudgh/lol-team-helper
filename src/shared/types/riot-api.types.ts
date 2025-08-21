export interface RiotGetPUUIDResponse {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export type RankType = "RANKED_FLEX_SR" | "RANKED_SOLO_5x5";

export type Tier =
  | "IRON"
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "PLATINUM"
  | "DIAMOND"
  | "MASTER"
  | "GRANDMASTER"
  | "CHALLENGER";

export type Rank = "I" | "II" | "III" | "IV";

export type League = {
  leagueId: string;
  queueType: RankType;
  tier: Tier;
  rank: Rank;
  puuid: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
};

export type RiotGetSummonersTier = League[];

export interface RiotProfileInfo {
  puuid: string;
  profileIconId: number;
  revisionDate: number | Date;
  summonerLevel: number;
}
