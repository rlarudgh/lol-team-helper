import { Card, CardContent } from "@/components/ui/card.ui";
import { Badge } from "@/components/ui/badge.ui";
import type { Player } from "@/shared/types/team-player.types";
import { getTeamBalance } from "@/shared/utils/team-balance.utils";
import { Scale, TrendingUp, TrendingDown } from "lucide-react";

interface TeamBalanceIndicatorProps {
  redTeam: Player[];
  blueTeam: Player[];
}

export function TeamBalanceIndicator({
  redTeam,
  blueTeam,
}: TeamBalanceIndicatorProps) {
  const balance = getTeamBalance(redTeam, blueTeam);

  const getBalanceIcon = () => {
    if (balance.isBalanced) return <Scale className="w-4 h-4 text-green-500" />;
    if (balance.redStrength > balance.blueStrength)
      return <TrendingUp className="w-4 h-4 text-red-500" />;
    return <TrendingDown className="w-4 h-4 text-blue-500" />;
  };

  const getBalanceText = () => {
    if (balance.isBalanced) return "균형잡힌 팀";
    if (balance.redStrength > balance.blueStrength) return "레드팀 우세";
    return "블루팀 우세";
  };

  const getBalanceColor = () => {
    if (balance.isBalanced)
      return "bg-green-100 text-green-800 border-green-200";
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getBalanceIcon()}
            <span className="font-semibold">팀 밸런스</span>
          </div>
          <Badge className={getBalanceColor()}>{getBalanceText()}</Badge>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-primary">레드팀</div>
            <div className="text-muted-foreground">
              {balance.redStrength.toFixed(1)}
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold">차이</div>
            <div className="text-muted-foreground">
              {balance.difference.toFixed(1)}
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-secondary">블루팀</div>
            <div className="text-muted-foreground">
              {balance.blueStrength.toFixed(1)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
