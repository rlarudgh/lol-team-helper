"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button.ui";
import { Input } from "@/components/ui/input.ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.ui";
import { Search, Loader2, Plus } from "lucide-react";
import type { Player } from "@/shared/types/team-player.types";
import { useForm } from "@/hooks/use-form";

interface SummonerSearchFormProps {
  onPlayerAdd: (player: Player) => void;
}

export function SummonerSearchForm({ onPlayerAdd }: SummonerSearchFormProps) {
  const {
    state,
    handleChange,
    setState: setSummonerName,
  } = useForm({ summonerName: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<Player | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.summonerName.trim()) return;

    setIsLoading(true);
    setError(null);
    setSearchResult(null);

    try {
      const apiUrl = `/api/summoner?name=${encodeURIComponent(
        state.summonerName.trim()
      )}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch summoner data");
      }

      setSearchResult(data.player);
    } catch (err) {
      console.error("[v0] API 호출 에러:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPlayer = () => {
    if (searchResult) {
      onPlayerAdd(searchResult);
      setSearchResult(null);
      setSummonerName({ summonerName: "" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">소환사 검색</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="소환사명을 입력하세요"
            value={state.summonerName}
            name="summonerName"
            onChange={handleChange}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !state.summonerName.trim()}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </form>

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}

        {searchResult && (
          <div className="p-4 border rounded-md bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/${searchResult.profileIconId}.png`}
                  alt={searchResult.summonerName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">{searchResult.summonerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {searchResult.tier} {searchResult.rank} -{" "}
                    {searchResult.leaguePoints} LP
                  </p>
                </div>
              </div>
              <Button onClick={handleAddPlayer} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                추가
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          <p>Riot API를 사용하여 실시간 소환사 정보를 가져옵니다.</p>
        </div>
      </CardContent>
    </Card>
  );
}
