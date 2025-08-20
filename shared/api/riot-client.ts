const RIOT_API_BASE_URL = "https://kr.api.riotgames.com";
const DATA_DRAGON_BASE_URL = "https://ddragon.leagueoflegends.com";

export class RiotApiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    console.log("Requesting", endpoint);
    console.log(RIOT_API_BASE_URL + endpoint);
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

  async getSummonerByName(summonerName: string) {
    return this.makeRequest<import("../types/riot-api").RiotSummoner>(
      `/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`
    );
  }

  async getLeagueEntries(summonerId: string) {
    return this.makeRequest<import("../types/riot-api").RiotLeagueEntry[]>(
      `/lol/league/v4/entries/by-summoner/${summonerId}`
    );
  }

  static getProfileIconUrl(iconId: number, version = "14.1.1") {
    return `${DATA_DRAGON_BASE_URL}/cdn/${version}/img/profileicon/${iconId}.png`;
  }
}
