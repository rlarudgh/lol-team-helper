import { type NextRequest, NextResponse } from "next/server";
import { RiotApiClient } from "@/shared/api/riot-client";
import type { Player, Tier } from "@/shared/types";

const RIOT_API_KEY = process.env.RIOT_API_KEY;

if (!RIOT_API_KEY) {
  console.warn("RIOT_API_KEY is not set. LoL API features will not work.");
}

function mapTierToEnum(tier: string): Tier {
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

    // Get summoner basic info
    const summoner = await riotClient.getSummonerByName(summonerName);

    // Get league entries (ranked info)
    const leagueEntries = await riotClient.getLeagueEntries(summoner.id);

    // Find Solo/Duo queue entry
    const soloQueueEntry = leagueEntries.find(
      (entry) => entry.queueType === "RANKED_SOLO_5x5"
    );

    const player: Player = {
      id: summoner.puuid,
      summonerName: summoner.name,
      tier: soloQueueEntry ? mapTierToEnum(soloQueueEntry.tier) : "UNRANKED",
      rank: soloQueueEntry?.rank || "",
      leaguePoints: soloQueueEntry?.leaguePoints || 0,
      profileIconId: summoner.profileIconId,
    };

    console.log(
      "[v0] 소환사 정보 조회 성공:",
      player.summonerName,
      player.tier
    );

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
