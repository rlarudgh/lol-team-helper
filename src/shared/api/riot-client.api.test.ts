import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { RiotApiClient } from "./riot-client.api";
import { RiotApiBaseUrls } from "./riot-api.config";
import type {
  RiotGetPUUIDResponse,
  RiotGetSummonersTier,
  RiotProfileInfo,
} from "../types/riot-api.types";

// fetch mock
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock data
const mockPUUIDResponse: RiotGetPUUIDResponse = {
  puuid: "test-puuid-123",
  gameName: "TestPlayer",
  tagLine: "KR1",
};

const mockSummonersTier: RiotGetSummonersTier = [
  {
    leagueId: "league-123",
    queueType: "RANKED_SOLO_5x5",
    tier: "GOLD",
    rank: "II",
    puuid: "test-puuid-123",
    leaguePoints: 75,
    wins: 50,
    losses: 25,
    veteran: false,
    inactive: false,
    freshBlood: true,
    hotStreak: false,
  },
];

const mockProfileInfo: RiotProfileInfo = {
  puuid: "test-puuid-123",
  profileIconId: 1234,
  revisionDate: 1640995200000,
  summonerLevel: 150,
};

describe("RiotApiClient", () => {
  let client: RiotApiClient;
  const testApiKey = "test-api-key-123";

  beforeEach(() => {
    client = new RiotApiClient(testApiKey);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("constructor", () => {
    it("API 키로 인스턴스를 생성할 수 있어야 한다", () => {
      const apiKey = "my-api-key";
      const riotClient = new RiotApiClient(apiKey);

      expect(riotClient).toBeInstanceOf(RiotApiClient);
    });
  });

  describe("getSummonersPUUID", () => {
    it("gameName과 tagLine으로 PUUID를 가져올 수 있어야 한다", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPUUIDResponse,
      });

      const result = await client.getSummonersPUUID("TestPlayer#KR1");

      expect(mockFetch).toHaveBeenCalledWith(
        `${RiotApiBaseUrls.RIOT_API_BASE_URL}/riot/account/v1/accounts/by-riot-id/TestPlayer/KR1`,
        {
          headers: {
            "X-Riot-Token": testApiKey,
          },
        }
      );
      expect(result).toEqual(mockPUUIDResponse);
    });

    it('tagLine이 없으면 기본값 "KR1"을 사용해야 한다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPUUIDResponse,
      });

      await client.getSummonersPUUID("TestPlayer");

      expect(mockFetch).toHaveBeenCalledWith(
        `${RiotApiBaseUrls.RIOT_API_BASE_URL}/riot/account/v1/accounts/by-riot-id/TestPlayer/KR1`,
        {
          headers: {
            "X-Riot-Token": testApiKey,
          },
        }
      );
    });

    it("API 에러 시 예외를 던져야 한다", async () => {
      const errorResponse = {
        status: {
          message: "Data not found",
          status_code: 404,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => errorResponse,
      });

      await expect(
        client.getSummonersPUUID("NonExistentPlayer#KR1")
      ).rejects.toThrow("Riot API Error: Data not found");
    });

    it('에러 메시지가 없으면 "Unknown error"를 사용해야 한다', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      await expect(client.getSummonersPUUID("TestPlayer#KR1")).rejects.toThrow(
        "Riot API Error: Unknown error"
      );
    });
  });

  describe("getSummonersTier", () => {
    const testPUUID = "test-puuid-123";

    it("PUUID로 소환사 티어 정보를 가져올 수 있어야 한다", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSummonersTier,
      });

      const result = await client.getSummonersTier(testPUUID);

      expect(mockFetch).toHaveBeenCalledWith(
        `${RiotApiBaseUrls.RIOT_KR_API_BASE_URL}/lol/league/v4/entries/by-puuid/${testPUUID}`,
        {
          headers: {
            "X-Riot-Token": testApiKey,
          },
        }
      );
      expect(result).toEqual(mockSummonersTier);
    });

    it("API 에러 시 예외를 던져야 한다", async () => {
      const errorResponse = {
        status: {
          message: "Forbidden",
          status_code: 403,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => errorResponse,
      });

      await expect(client.getSummonersTier(testPUUID)).rejects.toThrow(
        "Riot API Error: Forbidden"
      );
    });
  });

  describe("getSummonersInfo", () => {
    const testPUUID = "test-puuid-123";

    it("PUUID로 소환사 정보를 가져올 수 있어야 한다", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfileInfo,
      });

      const result = await client.getSummonersInfo(testPUUID);

      expect(mockFetch).toHaveBeenCalledWith(
        `${RiotApiBaseUrls.RIOT_KR_API_BASE_URL}/lol/summoner/v4/summoners/by-puuid/${testPUUID}`,
        {
          headers: {
            "X-Riot-Token": testApiKey,
          },
        }
      );
      expect(result).toEqual(mockProfileInfo);
    });

    it("API 에러 시 예외를 던져야 한다", async () => {
      const errorResponse = {
        status: {
          message: "Rate limit exceeded",
          status_code: 429,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => errorResponse,
      });

      await expect(client.getSummonersInfo(testPUUID)).rejects.toThrow(
        "Riot API Error: Rate limit exceeded"
      );
    });
  });

  describe("getProfileIconUrl (static method)", () => {
    it("기본 버전으로 프로필 아이콘 URL을 생성해야 한다", () => {
      const iconId = 1234;
      const expectedUrl = `${RiotApiBaseUrls.DATA_DRAGON_BASE_URL}/cdn/14.1.1/img/profileicon/${iconId}.png`;

      const result = RiotApiClient.getProfileIconUrl(iconId);

      expect(result).toBe(expectedUrl);
    });

    it("커스텀 버전으로 프로필 아이콘 URL을 생성해야 한다", () => {
      const iconId = 5678;
      const version = "14.2.1";
      const expectedUrl = `${RiotApiBaseUrls.DATA_DRAGON_BASE_URL}/cdn/${version}/img/profileicon/${iconId}.png`;

      const result = RiotApiClient.getProfileIconUrl(iconId, version);

      expect(result).toBe(expectedUrl);
    });

    it("0을 포함한 다양한 아이콘 ID로 URL을 생성할 수 있어야 한다", () => {
      const testCases = [0, 1, 999, 9999];

      testCases.forEach((iconId) => {
        const result = RiotApiClient.getProfileIconUrl(iconId);
        expect(result).toContain(`profileicon/${iconId}.png`);
      });
    });
  });

  describe("Network error handling", () => {
    it("fetch 실패 시 예외를 처리해야 한다", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(client.getSummonersPUUID("TestPlayer#KR1")).rejects.toThrow(
        "Network error"
      );
    });

    it("JSON 파싱 실패 시 예외를 처리해야 한다", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      await expect(client.getSummonersPUUID("TestPlayer#KR1")).rejects.toThrow(
        "Invalid JSON"
      );
    });
  });

  describe("API 호출 헤더 검증", () => {
    it("모든 API 호출에 올바른 헤더가 포함되어야 한다", async () => {
      const expectedHeaders = {
        "X-Riot-Token": testApiKey,
      };

      // 각 메서드 테스트
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await client.getSummonersPUUID("Test#KR1");
      expect(mockFetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expectedHeaders,
        })
      );

      await client.getSummonersTier("test-puuid");
      expect(mockFetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expectedHeaders,
        })
      );

      await client.getSummonersInfo("test-puuid");
      expect(mockFetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expectedHeaders,
        })
      );
    });
  });

  describe("URL 구성 검증", () => {
    it("makeRequest는 RIOT_API_BASE_URL을 사용해야 한다", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPUUIDResponse,
      });

      await client.getSummonersPUUID("Test#KR1");

      const calledUrl = mockFetch.mock.calls[0][0] as string;
      expect(calledUrl.startsWith(RiotApiBaseUrls.RIOT_API_BASE_URL)).toBe(
        true
      );
    });

    it("makeRequestKR은 RIOT_KR_API_BASE_URL을 사용해야 한다", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSummonersTier,
      });

      await client.getSummonersTier("test-puuid");

      const calledUrl = mockFetch.mock.calls[0][0] as string;
      expect(calledUrl.startsWith(RiotApiBaseUrls.RIOT_KR_API_BASE_URL)).toBe(
        true
      );
    });
  });

  describe("타입 안전성", () => {
    it("getSummonersPUUID는 올바른 타입을 반환해야 한다", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPUUIDResponse,
      });

      const result = await client.getSummonersPUUID("Test#KR1");

      expect(result).toHaveProperty("puuid");
      expect(result).toHaveProperty("gameName");
      expect(result).toHaveProperty("tagLine");
      expect(typeof result.puuid).toBe("string");
    });

    it("getSummonersTier는 배열을 반환해야 한다", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSummonersTier,
      });

      const result = await client.getSummonersTier("test-puuid");

      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("tier");
        expect(result[0]).toHaveProperty("rank");
        expect(result[0]).toHaveProperty("leaguePoints");
      }
    });
  });
});
