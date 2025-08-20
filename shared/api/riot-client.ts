const RIOT_API_BASE_URL = "https://asia.api.riotgames.com";
const RIOT_KR_API_BASE_URL = "https://kr.api.riotgames.com";
const DATA_DRAGON_BASE_URL = "https://ddragon.leagueoflegends.com";

export class RiotApiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${RIOT_API_BASE_URL}${endpoint}`, {
      headers: {
        "X-Riot-Token": this.apiKey,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Riot API Error: ${error.status?.message || "Unknown error"}`
      );
    }

    return response.json();
  }

  private async makeRequestKR<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${RIOT_KR_API_BASE_URL}${endpoint}`, {
      headers: {
        "X-Riot-Token": this.apiKey,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Riot API Error: ${error.status?.message || "Unknown error"}`
      );
    }

    return response.json();
  }

  async getSummonersPUUID(summonerName: string) {
    const [gameName, tagLine] = summonerName.split("#");

    return this.makeRequest<import("../types/riot-api").RiotGetPUUIDResponse>(
      `/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine ?? "KR1"}`
    );
  }

  async getSummonersTier(encryptedPUUID: Readonly<string>) {
    return this.makeRequestKR<import("../types/riot-api").RiotGetSummonersTier>(
      `/lol/league/v4/entries/by-puuid/${encryptedPUUID}`
    );
  }

  async getSummonersInfo(encryptedPUUID: Readonly<string>) {
    return this.makeRequestKR<import("../types/riot-api").RiotProfileInfo>(
      `/lol/summoner/v4/summoners/by-puuid/${encryptedPUUID}`
    );
  }

  static getProfileIconUrl(iconId: number, version = "14.1.1") {
    return `${DATA_DRAGON_BASE_URL}/cdn/${version}/img/profileicon/${iconId}.png`;
  }
}
