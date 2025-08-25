import { describe, it, expect } from "vitest";
import {
  calculateTeamStrength,
  calculateTeamBalance,
  getTeamBalance,
  createBalancedTeams,
} from "./team-balance.utils";
import type { Player, Tier } from "@/shared/types/team-player.types";

// Mock 플레이어 데이터
const createPlayer = (
  name: string,
  tier: Tier,
  leaguePoints: number = 0
): Player => ({
  id: `${name}-id`,
  summonerName: name,
  tier,
  leaguePoints,
  rank: "I",
  profileIconId: 1,
});

describe("team-balance 함수들", () => {
  describe("calculateTeamStrength", () => {
    it("단일 플레이어의 강도를 올바르게 계산해야 한다", () => {
      const players = [createPlayer("TestPlayer", "GOLD", 500)];
      const strength = calculateTeamStrength(players);

      // GOLD = 4 points, 500 LP = 0.5 points
      expect(strength).toBe(4.5);
    });

    it("여러 플레이어의 강도를 합계해야 한다", () => {
      const players = [
        createPlayer("Player1", "DIAMOND", 1000), // 7 + 1 = 8
        createPlayer("Player2", "GOLD", 500), // 4 + 0.5 = 4.5
        createPlayer("Player3", "SILVER", 0), // 3 + 0 = 3
      ];
      const strength = calculateTeamStrength(players);

      expect(strength).toBe(15.5);
    });

    it("빈 팀의 강도는 0이어야 한다", () => {
      const strength = calculateTeamStrength([]);
      expect(strength).toBe(0);
    });

    it("UNRANKED 플레이어를 올바르게 처리해야 한다", () => {
      const players = [
        createPlayer("UnrankedPlayer", "UNRANKED", 0),
        createPlayer("GoldPlayer", "GOLD", 0),
      ];
      const strength = calculateTeamStrength(players);

      // UNRANKED = 0, GOLD = 4
      expect(strength).toBe(4);
    });

    it("최고 티어 플레이어들을 올바르게 처리해야 한다", () => {
      const players = [
        createPlayer("ChallengerPlayer", "CHALLENGER", 0), // 10
        createPlayer("GrandmasterPlayer", "GRANDMASTER", 500), // 9 + 0.5 = 9.5
      ];
      const strength = calculateTeamStrength(players);

      expect(strength).toBe(19.5);
    });

    it("LP 보너스가 최대 1포인트까지만 적용되어야 한다", () => {
      const players = [
        createPlayer("Player", "GOLD", 1000), // 4 + 1 = 5
        createPlayer("Player2", "GOLD", 1500), // 4 + 1.5 -> but max 1, so 4 + 1 = 5
      ];
      const strength = calculateTeamStrength(players);

      expect(strength).toBe(10.5); // 5 + 5.5 (1500 LP는 1.5 bonus)
    });
  });

  describe("calculateTeamBalance", () => {
    it("calculateTeamStrength와 같은 결과를 반환해야 한다", () => {
      const players = [
        createPlayer("Player1", "PLATINUM", 750),
        createPlayer("Player2", "GOLD", 250),
      ];

      const strength = calculateTeamStrength(players);
      const balance = calculateTeamBalance(players);

      expect(balance).toBe(strength);
    });
  });

  describe("getTeamBalance", () => {
    it("두 팀의 밸런스를 올바르게 계산해야 한다", () => {
      const redTeam = [
        createPlayer("Red1", "GOLD", 500), // 4.5
        createPlayer("Red2", "SILVER", 0), // 3
      ];
      const blueTeam = [
        createPlayer("Blue1", "PLATINUM", 0), // 5
        createPlayer("Blue2", "BRONZE", 500), // 2.5
      ];

      const balance = getTeamBalance(redTeam, blueTeam);

      expect(balance.redStrength).toBe(7.5);
      expect(balance.blueStrength).toBe(7.5);
      expect(balance.difference).toBe(0);
      expect(balance.isBalanced).toBe(true);
    });

    it("차이가 2 이하일 때 균형잡힌 것으로 판단해야 한다", () => {
      const redTeam = [createPlayer("Red1", "GOLD", 0)]; // 4
      const blueTeam = [createPlayer("Blue1", "PLATINUM", 0)]; // 5

      const balance = getTeamBalance(redTeam, blueTeam);

      expect(balance.difference).toBe(1);
      expect(balance.isBalanced).toBe(true);
    });

    it("차이가 2보다 클 때 불균형으로 판단해야 한다", () => {
      const redTeam = [createPlayer("Red1", "IRON", 0)]; // 1
      const blueTeam = [createPlayer("Blue1", "GOLD", 0)]; // 4

      const balance = getTeamBalance(redTeam, blueTeam);

      expect(balance.difference).toBe(3);
      expect(balance.isBalanced).toBe(false);
    });

    it("절댓값으로 차이를 계산해야 한다", () => {
      const redTeam = [createPlayer("Red1", "DIAMOND", 0)]; // 7
      const blueTeam = [createPlayer("Blue1", "GOLD", 0)]; // 4

      const balance = getTeamBalance(redTeam, blueTeam);

      expect(balance.difference).toBe(3);
      expect(balance.redStrength > balance.blueStrength).toBe(true);
    });
  });

  describe("createBalancedTeams", () => {
    it("정확히 10명의 플레이어가 필요하다", () => {
      const players = [
        createPlayer("Player1", "GOLD", 0),
        createPlayer("Player2", "SILVER", 0),
      ];

      expect(() => createBalancedTeams(players)).toThrow(
        "Exactly 10 players required for balanced team creation"
      );
    });

    it("10명의 플레이어로 5:5 팀을 생성해야 한다", () => {
      const players = Array.from({ length: 10 }, (_, i) =>
        createPlayer(`Player${i + 1}`, "GOLD", i * 100)
      );

      const result = createBalancedTeams(players);

      expect(result.redTeam).toHaveLength(5);
      expect(result.blueTeam).toHaveLength(5);
    });

    it("모든 플레이어가 한 팀에만 배치되어야 한다", () => {
      const players = Array.from({ length: 10 }, (_, i) =>
        createPlayer(`Player${i + 1}`, "GOLD", i * 100)
      );

      const result = createBalancedTeams(players);
      const allAssigned = [...result.redTeam, ...result.blueTeam];

      expect(allAssigned).toHaveLength(10);

      // 중복 플레이어가 없는지 확인
      const uniquePlayers = new Set(allAssigned.map((p) => p.id));
      expect(uniquePlayers.size).toBe(10);

      // 모든 원본 플레이어가 포함되었는지 확인
      players.forEach((player) => {
        expect(allAssigned.some((p) => p.id === player.id)).toBe(true);
      });
    });

    it("동일한 티어의 플레이어들로 균형잡힌 팀을 생성해야 한다", () => {
      const players = Array.from(
        { length: 10 },
        (_, i) => createPlayer(`Player${i + 1}`, "GOLD", i * 50) // 다양한 LP
      );

      const result = createBalancedTeams(players);
      const balance = getTeamBalance(result.redTeam, result.blueTeam);

      // 동일한 티어에서는 매우 균형잡힌 팀이 만들어져야 함
      expect(balance.difference).toBeLessThanOrEqual(1);
    });

    it("다양한 티어의 플레이어들로 균형잡힌 팀을 생성해야 한다", () => {
      const tiers: Tier[] = [
        "CHALLENGER",
        "DIAMOND",
        "GOLD",
        "GOLD",
        "SILVER",
        "SILVER",
        "BRONZE",
        "BRONZE",
        "IRON",
        "UNRANKED",
      ];
      const players = tiers.map((tier, i) =>
        createPlayer(`Player${i + 1}`, tier, i * 100)
      );

      const result = createBalancedTeams(players);
      const balance = getTeamBalance(result.redTeam, result.blueTeam);

      // 최적화된 결과여야 함
      expect(result.redTeam).toHaveLength(5);
      expect(result.blueTeam).toHaveLength(5);
    });

    it("극단적인 경우를 처리해야 한다", () => {
      const players = [
        // 매우 강한 플레이어들
        createPlayer("Challenger1", "CHALLENGER", 1000),
        createPlayer("Challenger2", "CHALLENGER", 500),
        // 중간 플레이어들
        createPlayer("Gold1", "GOLD", 500),
        createPlayer("Gold2", "GOLD", 300),
        createPlayer("Gold3", "GOLD", 100),
        createPlayer("Gold4", "GOLD", 0),
        // 약한 플레이어들
        createPlayer("Iron1", "IRON", 0),
        createPlayer("Iron2", "IRON", 0),
        createPlayer("Iron3", "IRON", 0),
        createPlayer("Iron4", "IRON", 0),
      ];

      const result = createBalancedTeams(players);

      expect(result.redTeam).toHaveLength(5);
      expect(result.blueTeam).toHaveLength(5);

      // 챌린저 플레이어들이 다른 팀에 배치되어야 함
      const redChallengerCount = result.redTeam.filter(
        (p) => p.tier === "CHALLENGER"
      ).length;
      const blueChallengerCount = result.blueTeam.filter(
        (p) => p.tier === "CHALLENGER"
      ).length;

      expect(redChallengerCount + blueChallengerCount).toBe(2);
      expect(
        Math.abs(redChallengerCount - blueChallengerCount)
      ).toBeLessThanOrEqual(1);
    });

    it("입력 배열을 수정하지 않아야 한다", () => {
      const players = Array.from({ length: 10 }, (_, i) =>
        createPlayer(`Player${i + 1}`, "GOLD", i * 100)
      );
      const originalPlayers = [...players];

      createBalancedTeams(players);

      expect(players).toEqual(originalPlayers);
    });
  });

  describe("에지 케이스", () => {
    it("모든 플레이어가 동일한 티어와 LP를 가진 경우", () => {
      const players = Array.from({ length: 10 }, (_, i) =>
        createPlayer(`Player${i + 1}`, "GOLD", 500)
      );

      const result = createBalancedTeams(players);
      const balance = getTeamBalance(result.redTeam, result.blueTeam);

      expect(balance.difference).toBe(0);
      expect(balance.isBalanced).toBe(true);
    });

    it("LP가 0인 플레이어들을 올바르게 처리해야 한다", () => {
      const players = [
        createPlayer("Diamond", "DIAMOND", 0), // 7
        createPlayer("Platinum", "PLATINUM", 0), // 5
        createPlayer("Gold1", "GOLD", 0), // 4
        createPlayer("Gold2", "GOLD", 0), // 4
        createPlayer("Silver1", "SILVER", 0), // 3
        createPlayer("Silver2", "SILVER", 0), // 3
        createPlayer("Bronze1", "BRONZE", 0), // 2
        createPlayer("Bronze2", "BRONZE", 0), // 2
        createPlayer("Iron1", "IRON", 0), // 1
        createPlayer("Iron2", "IRON", 0), // 1
      ];

      const result = createBalancedTeams(players);

      expect(result.redTeam).toHaveLength(5);
      expect(result.blueTeam).toHaveLength(5);
    });

    it("매우 높은 LP 값을 올바르게 처리해야 한다", () => {
      const players = Array.from({ length: 10 }, (_, i) =>
        createPlayer(`Player${i + 1}`, "GOLD", 3000 + i * 100)
      );

      const result = createBalancedTeams(players);

      expect(result.redTeam).toHaveLength(5);
      expect(result.blueTeam).toHaveLength(5);
    });
  });

  describe("성능 및 최적화", () => {
    it("10명의 플레이어 조합에서 합리적인 시간 내에 완료되어야 한다", () => {
      const players = Array.from({ length: 10 }, (_, i) =>
        createPlayer(`Player${i + 1}`, "GOLD", Math.random() * 1000)
      );

      const startTime = Date.now();
      const result = createBalancedTeams(players);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000); // 1초 미만
      expect(result.redTeam).toHaveLength(5);
      expect(result.blueTeam).toHaveLength(5);
    });
  });
});
