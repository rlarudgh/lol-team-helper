import { cn } from "@/lib/utils"
import type { Tier } from "@/shared/types"

interface TierBadgeProps {
  tier: Tier
  rank?: string
  leaguePoints?: number
  wins?: number
  losses?: number
  showWinRate?: boolean
  showIcon?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

const tierColors: Record<Tier, string> = {
  IRON: "bg-gradient-to-r from-gray-700 to-gray-600 text-white border-gray-500",
  BRONZE: "bg-gradient-to-r from-amber-800 to-amber-700 text-white border-amber-600",
  SILVER: "bg-gradient-to-r from-gray-500 to-gray-400 text-gray-900 border-gray-300",
  GOLD: "bg-gradient-to-r from-yellow-500 to-yellow-400 text-yellow-900 border-yellow-300",
  PLATINUM: "bg-gradient-to-r from-teal-600 to-teal-500 text-white border-teal-400",
  EMERALD: "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-emerald-400",
  DIAMOND: "bg-gradient-to-r from-blue-600 to-blue-500 text-white border-blue-400",
  MASTER: "bg-gradient-to-r from-purple-700 to-purple-600 text-white border-purple-500",
  GRANDMASTER: "bg-gradient-to-r from-red-700 to-red-600 text-white border-red-500",
  CHALLENGER: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white border-yellow-300 shadow-lg",
  UNRANKED: "bg-muted text-muted-foreground border-border",
}

const tierIconUrls: Record<Tier, string> = {
  IRON: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/iron.png",
  BRONZE:
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/bronze.png",
  SILVER:
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/silver.png",
  GOLD: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/gold.png",
  PLATINUM:
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/platinum.png",
  EMERALD:
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/emerald.png",
  DIAMOND:
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/diamond.png",
  MASTER:
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/master.png",
  GRANDMASTER:
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/grandmaster.png",
  CHALLENGER:
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/challenger.png",
  UNRANKED: "",
}

const sizeClasses = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
}

const iconSizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
}

export function TierBadge({
  tier,
  rank,
  leaguePoints = 0,
  wins = 0,
  losses = 0,
  showWinRate = false,
  showIcon = true,
  size = "md",
  className,
}: TierBadgeProps) {
  const winRate = wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0
  const hasIcon = showIcon && tierIconUrls[tier]

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-md font-semibold border transition-all duration-200",
        tierColors[tier],
        sizeClasses[size],
        tier === "CHALLENGER" && "animate-pulse",
        className,
      )}
    >
      {hasIcon && (
        <img
          src={tierIconUrls[tier] || "/placeholder.svg"}
          alt={tier}
          className={cn("object-contain", iconSizeClasses[size])}
          onError={(e) => {
            // Hide icon if it fails to load
            e.currentTarget.style.display = "none"
          }}
        />
      )}

      <div className="flex flex-col items-start">
        <div className="flex items-center gap-1">
          <span>{tier}</span>
          {rank && <span>{rank}</span>}
        </div>

        {(leaguePoints > 0 || showWinRate) && (
          <div className="flex items-center gap-2 text-xs opacity-90">
            {leaguePoints > 0 && <span>{leaguePoints} LP</span>}
            {showWinRate && wins + losses > 0 && (
              <span>
                {winRate}% ({wins}W {losses}L)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
