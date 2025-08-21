"use client";

import { useState } from "react";
import type { Player, Position } from "@/shared/types/team-player.types";
import { DraggablePlayerCard } from "@/features/drag-drop/ui/draggable-player-card.ui";
import { SortableTeamZone } from "@/features/drag-drop/ui/sortable-team-zone.ui";
import { useDragDrop } from "@/features/drag-drop/hooks/use-drag-drop";
import { TeamBalanceIndicator } from "@/features/team-assignment/ui/team-balance-indicator.ui";
import { TeamStrengthIndicator } from "@/features/team-assignment/ui/team-strength-indicator.ui";
import { PlayerTransferControls } from "@/features/team-assignment/ui/player-transfer-controls.ui";
import { SummonerSearchForm } from "@/features/summoner-search/ui/summoner-search-form.ui";
import { TeamPositionsDisplay } from "@/features/position-assignment/ui/team-positions-display.ui";
import { Button } from "@/components/ui/button.ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.ui";
import {
  Shuffle,
  RotateCcw,
  Zap,
  Trash2,
  BarChart3,
  Users,
} from "lucide-react";
import { createBalancedTeams } from "@/shared/utils/team-balance.utils";

export function MatchBoard() {
  const [redTeam, setRedTeam] = useState<Player[]>([]);
  const [blueTeam, setBlueTeam] = useState<Player[]>([]);
  const [unassignedPlayers, setUnassignedPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showPositions, setShowPositions] = useState(false);

  const {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
  } = useDragDrop();

  const handlePositionChange = (
    playerId: string,
    position: Position | undefined
  ) => {
    const updatePlayerPosition = (players: Player[]) =>
      players.map((p) => (p.id === playerId ? { ...p, position } : p));

    setRedTeam((prev) => updatePlayerPosition(prev));
    setBlueTeam((prev) => updatePlayerPosition(prev));
    setUnassignedPlayers((prev) => updatePlayerPosition(prev));
  };

  const shuffleTeams = () => {
    const allPlayers = [...redTeam, ...blueTeam, ...unassignedPlayers];
    const shuffled = [...allPlayers].sort(() => Math.random() - 0.5);

    setRedTeam(shuffled.slice(0, 5));
    setBlueTeam(shuffled.slice(5, 10));
    setUnassignedPlayers([]);
    setSelectedPlayer(null);
  };

  const createBalancedAssignment = () => {
    const allPlayers = [...redTeam, ...blueTeam, ...unassignedPlayers];
    if (allPlayers.length !== 10) {
      alert("정확히 10명의 플레이어가 필요합니다.");
      return;
    }

    try {
      const { redTeam: newRedTeam, blueTeam: newBlueTeam } =
        createBalancedTeams(allPlayers);
      setRedTeam(newRedTeam);
      setBlueTeam(newBlueTeam);
      setUnassignedPlayers([]);
      setSelectedPlayer(null);
    } catch (error) {
      alert("밸런스 팀 생성에 실패했습니다.");
    }
  };

  const resetTeams = () => {
    const allPlayers = [...redTeam, ...blueTeam, ...unassignedPlayers];
    setRedTeam([]);
    setBlueTeam([]);
    setUnassignedPlayers(allPlayers);
    setSelectedPlayer(null);
  };

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(selectedPlayer?.id === player.id ? null : player);
  };

  const handlePlayerAdd = (player: Player) => {
    // Check if player already exists
    const allPlayers = [...redTeam, ...blueTeam, ...unassignedPlayers];
    if (allPlayers.some((p) => p.id === player.id)) {
      alert("이미 추가된 플레이어입니다.");
      return;
    }

    setUnassignedPlayers((prev) => [...prev, player]);
  };

  const handlePlayerRemove = (player: Player) => {
    setRedTeam((prev) => prev.filter((p) => p.id !== player.id));
    setBlueTeam((prev) => prev.filter((p) => p.id !== player.id));
    setUnassignedPlayers((prev) => prev.filter((p) => p.id !== player.id));
    if (selectedPlayer?.id === player.id) {
      setSelectedPlayer(null);
    }
  };

  const movePlayerToRed = () => {
    if (!selectedPlayer || redTeam.length >= 5) return;

    if (blueTeam.find((p) => p.id === selectedPlayer.id)) {
      setBlueTeam(blueTeam.filter((p) => p.id !== selectedPlayer.id));
    } else {
      setUnassignedPlayers(
        unassignedPlayers.filter((p) => p.id !== selectedPlayer.id)
      );
    }
    setRedTeam([...redTeam, selectedPlayer]);
    setSelectedPlayer(null);
  };

  const movePlayerToBlue = () => {
    if (!selectedPlayer || blueTeam.length >= 5) return;

    if (redTeam.find((p) => p.id === selectedPlayer.id)) {
      setRedTeam(redTeam.filter((p) => p.id !== selectedPlayer.id));
    } else {
      setUnassignedPlayers(
        unassignedPlayers.filter((p) => p.id !== selectedPlayer.id)
      );
    }
    setBlueTeam([...blueTeam, selectedPlayer]);
    setSelectedPlayer(null);
  };

  const movePlayerToUnassigned = () => {
    if (!selectedPlayer) return;

    if (redTeam.find((p) => p.id === selectedPlayer.id)) {
      setRedTeam(redTeam.filter((p) => p.id !== selectedPlayer.id));
    } else if (blueTeam.find((p) => p.id === selectedPlayer.id)) {
      setBlueTeam(blueTeam.filter((p) => p.id !== selectedPlayer.id));
    }
    setUnassignedPlayers([...unassignedPlayers, selectedPlayer]);
    setSelectedPlayer(null);
  };

  const handleDropToRed = (playerId: string, targetIndex?: number) => {
    if (redTeam.length >= 5) return;

    const player = findPlayerById(playerId);
    if (!player) return;

    movePlayerToTeam(player, "red", targetIndex);
  };

  const handleDropToBlue = (playerId: string, targetIndex?: number) => {
    if (blueTeam.length >= 5) return;

    const player = findPlayerById(playerId);
    if (!player) return;

    movePlayerToTeam(player, "blue", targetIndex);
  };

  const handleDropToUnassigned = (playerId: string, targetIndex?: number) => {
    const player = findPlayerById(playerId);
    if (!player) return;

    movePlayerToTeam(player, "unassigned", targetIndex);
  };

  const findPlayerById = (playerId: string): Player | null => {
    return (
      [...redTeam, ...blueTeam, ...unassignedPlayers].find(
        (p) => p.id === playerId
      ) || null
    );
  };

  const movePlayerToTeam = (
    player: Player,
    targetTeam: "red" | "blue" | "unassigned",
    targetIndex?: number
  ) => {
    // Remove player from current team
    setRedTeam((prev) => prev.filter((p) => p.id !== player.id));
    setBlueTeam((prev) => prev.filter((p) => p.id !== player.id));
    setUnassignedPlayers((prev) => prev.filter((p) => p.id !== player.id));

    // Add player to target team at specific position
    switch (targetTeam) {
      case "red":
        setRedTeam((prev) => {
          if (
            targetIndex !== undefined &&
            targetIndex >= 0 &&
            targetIndex <= prev.length
          ) {
            const newTeam = [...prev];
            newTeam.splice(targetIndex, 0, player);
            return newTeam;
          }
          return [...prev, player];
        });
        break;
      case "blue":
        setBlueTeam((prev) => {
          if (
            targetIndex !== undefined &&
            targetIndex >= 0 &&
            targetIndex <= prev.length
          ) {
            const newTeam = [...prev];
            newTeam.splice(targetIndex, 0, player);
            return newTeam;
          }
          return [...prev, player];
        });
        break;
      case "unassigned":
        setUnassignedPlayers((prev) => {
          if (
            targetIndex !== undefined &&
            targetIndex >= 0 &&
            targetIndex <= prev.length
          ) {
            const newTeam = [...prev];
            newTeam.splice(targetIndex, 0, player);
            return newTeam;
          }
          return [...prev, player];
        });
        break;
    }

    setSelectedPlayer(null);
  };

  return (
    <div className="space-y-6">
      {/* Summoner Search */}
      <SummonerSearchForm onPlayerAdd={handlePlayerAdd} />

      {/* Control Buttons */}
      <div className="flex justify-center gap-4 flex-wrap">
        <Button
          onClick={shuffleTeams}
          className="bg-primary hover:bg-primary/90"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          랜덤 배정
        </Button>
        <Button
          onClick={createBalancedAssignment}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Zap className="w-4 h-4 mr-2" />
          밸런스 배정
        </Button>
        <Button onClick={resetTeams} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          초기화
        </Button>
        <Button
          onClick={() => setShowAnalytics(!showAnalytics)}
          variant="outline"
          className={showAnalytics ? "bg-accent text-accent-foreground" : ""}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          분석 {showAnalytics ? "숨기기" : "보기"}
        </Button>
        <Button
          onClick={() => setShowPositions(!showPositions)}
          variant="outline"
          className={showPositions ? "bg-accent text-accent-foreground" : ""}
        >
          <Users className="w-4 h-4 mr-2" />
          포지션 {showPositions ? "숨기기" : "보기"}
        </Button>
        {selectedPlayer && (
          <Button
            onClick={() => handlePlayerRemove(selectedPlayer)}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            플레이어 삭제
          </Button>
        )}
      </div>

      <TeamStrengthIndicator redTeam={redTeam} blueTeam={blueTeam} />

      {/* Player Transfer Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-sm">수동 팀 배정</CardTitle>
        </CardHeader>
        <CardContent>
          <PlayerTransferControls
            selectedPlayer={selectedPlayer}
            onMoveToRed={movePlayerToRed}
            onMoveToBlue={movePlayerToBlue}
            onMoveToUnassigned={movePlayerToUnassigned}
            canMoveToRed={redTeam.length < 5}
            canMoveToBlue={blueTeam.length < 5}
          />
        </CardContent>
      </Card>

      {/* Drag and Drop Instructions */}
      {dragState.draggedPlayer && (
        <Card className="border-accent bg-accent/5">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-accent-foreground">
              <strong>{dragState.draggedPlayer.summonerName}</strong>을(를)
              원하는 팀으로 드래그하세요
            </p>
          </CardContent>
        </Card>
      )}

      {/* Unassigned Players */}
      {unassignedPlayers.length > 0 && (
        <SortableTeamZone
          players={unassignedPlayers}
          onDrop={handleDropToUnassigned}
          onDragOver={(position) => handleDragOver("unassigned", position)}
          onDragLeave={() => handleDragLeave()}
          canDrop={true}
          isOver={dragState.dragOverTeam === "unassigned"}
          teamType="unassigned"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                미배정 플레이어 ({unassignedPlayers.length})
                {dragState.dragOverTeam === "unassigned" && (
                  <span className="ml-2 text-xs opacity-75">
                    드롭하여 미배정으로 이동
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 min-h-[200px]">
                {unassignedPlayers.map((player) => (
                  <DraggablePlayerCard
                    key={player.id}
                    player={player}
                    isSelected={selectedPlayer?.id === player.id}
                    onClick={() => handlePlayerSelect(player)}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onPositionChange={handlePositionChange}
                    showPositionSelector={true}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </SortableTeamZone>
      )}

      {/* Teams */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Blue Team */}
        <SortableTeamZone
          players={blueTeam}
          onDrop={handleDropToBlue}
          onDragOver={(position) => handleDragOver("blue", position)}
          onDragLeave={() => handleDragLeave()}
          canDrop={blueTeam.length < 5}
          isOver={dragState.dragOverTeam === "blue"}
          teamType="blue"
        >
          <Card className="border-secondary">
            <CardHeader className="bg-secondary text-secondary-foreground">
              <CardTitle className="text-center">
                블루팀 ({blueTeam.length}/5)
                {dragState.dragOverTeam === "blue" && blueTeam.length < 5 && (
                  <span className="ml-2 text-xs opacity-75">드롭하여 추가</span>
                )}
                {dragState.dragOverTeam === "blue" && blueTeam.length >= 5 && (
                  <span className="ml-2 text-xs opacity-75">팀이 가득참</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {showPositions ? (
                <TeamPositionsDisplay
                  players={blueTeam}
                  teamName="블루팀"
                  teamColor="blue"
                />
              ) : (
                <div className="space-y-3 min-h-[200px]">
                  {blueTeam.map((player) => (
                    <DraggablePlayerCard
                      key={player.id}
                      player={player}
                      teamColor="blue"
                      isSelected={selectedPlayer?.id === player.id}
                      onClick={() => handlePlayerSelect(player)}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onPositionChange={handlePositionChange}
                      showPositionSelector={true}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </SortableTeamZone>

        {/* Red Team */}
        <SortableTeamZone
          players={redTeam}
          onDrop={handleDropToRed}
          onDragOver={(position) => handleDragOver("red", position)}
          onDragLeave={() => handleDragLeave()}
          canDrop={redTeam.length < 5}
          isOver={dragState.dragOverTeam === "red"}
          teamType="red"
        >
          <Card className="border-primary">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-center">
                레드팀 ({redTeam.length}/5)
                {dragState.dragOverTeam === "red" && redTeam.length < 5 && (
                  <span className="ml-2 text-xs opacity-75">드롭하여 추가</span>
                )}
                {dragState.dragOverTeam === "red" && redTeam.length >= 5 && (
                  <span className="ml-2 text-xs opacity-75">팀이 가득참</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {showPositions ? (
                <TeamPositionsDisplay
                  players={redTeam}
                  teamName="레드팀"
                  teamColor="red"
                />
              ) : (
                <div className="space-y-3 min-h-[200px]">
                  {redTeam.map((player) => (
                    <DraggablePlayerCard
                      key={player.id}
                      player={player}
                      teamColor="red"
                      isSelected={selectedPlayer?.id === player.id}
                      onClick={() => handlePlayerSelect(player)}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onPositionChange={handlePositionChange}
                      showPositionSelector={true}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </SortableTeamZone>
      </div>

      {/* Team Balance Indicator */}
      {(redTeam.length > 0 || blueTeam.length > 0) && (
        <TeamBalanceIndicator redTeam={redTeam} blueTeam={blueTeam} />
      )}
    </div>
  );
}
