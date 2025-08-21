import { NextRequest, NextResponse } from "next/server";

const BOT_PATTERNS = [
  "googlebot",
  "bingbot",
  "slurp", // Yahoo
  "duckduckbot",
  "baiduspider",
  "yandexbot",
  "semrushbot",
  "petalbot", // Bing
  "applebot",
  "crawler",
  "bot",
  "spider",
] as const;

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";

  const isBot: boolean = BOT_PATTERNS.some((pattern) =>
    userAgent.includes(pattern)
  );

  // 봇이라면 'isBot' 헤더를 추가하여 다음 요청으로 전달
  if (isBot) {
    const response = NextResponse.next();
    response.headers.set("x-is-bot", "true");
    console.log("Bot detected!");
    return response;
  }

  // 봇이 아니라면 그대로 통과
  return NextResponse.next();
}

// 미들웨어를 실행할 경로를 설정 (예: 모든 경로)
export const config = {
  matcher: "/:path*",
};
