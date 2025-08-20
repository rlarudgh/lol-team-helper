import { type NextRequest, NextResponse } from "next/server";
import { RiotApiClient } from "@/shared/api/riot-client";
import type { Player, Tier } from "@/shared/types";

const RIOT_API_KEY = process.env.RIOT_API_KEY;

if (!RIOT_API_KEY) {
  console.warn("RIOT_API_KEY is not set. LoL API features will not work.");
}

function mapTierToEnum(tier: string = ""): Tier {
  if (!tier) {
    return "UNRANKED";
  }

  const upperTier = tier.toUpperCase();
  switch (upperTier) {
    case "IRON":
    case "BRONZE":
    case "SILVER":
    case "GOLD":
    case "PLATINUM":
    case "EMERALD":
    case "DIAMOND":
    case "MASTER":
    case "GRANDMASTER":
    case "CHALLENGER":
      return upperTier as Tier;
    default:
      return "UNRANKED";
  }
}

export async function GET(request: NextRequest) {
  if (!RIOT_API_KEY) {
    return NextResponse.json(
      { error: "Riot API key is not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const summonerName = searchParams.get("name");

  console.log("[v0] 소환사 검색 요청:", { summonerName, url: request.url });

  if (!summonerName) {
    return NextResponse.json(
      { error: "Summoner name is required" },
      { status: 400 }
    );
  }

  try {
    const riotClient = new RiotApiClient(RIOT_API_KEY);

    console.log("[v0] Riot API 호출 시작:", summonerName);

    const { puuid, gameName, tagLine } = await riotClient.getSummonersPUUID(
      summonerName
    );

    console.log("[v0] 소환사 정보 조회 성공:", { puuid, gameName, tagLine });

    const tiers = await riotClient.getSummonersTier(puuid);

    const [soloTier, flexTier] = tiers;

    console.log("[v0] 소환사 티어 조회 성공:", soloTier, flexTier);

    const tier = soloTier ? soloTier.tier : flexTier?.tier;
    const leaguePoints = soloTier
      ? soloTier.leaguePoints
      : flexTier?.leaguePoints;
    const rank = soloTier ? soloTier.rank : flexTier?.rank;

    const info = await riotClient.getSummonersInfo(puuid);

    const player: Player = {
      id: puuid,
      summonerName: `${gameName}#${tagLine}`,
      tier: mapTierToEnum(tier),
      rank: rank,
      leaguePoints,
      profileIconId: info.profileIconId,
    };

    console.log(`[v0] 소환사 정보 조회 성공: ${JSON.stringify(player)}`);

    return NextResponse.json({ player });
  } catch (error) {
    console.error("[v0] Riot API 에러:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch summoner data. Please check the summoner name.",
      },
      { status: 404 }
    );
  }
}
