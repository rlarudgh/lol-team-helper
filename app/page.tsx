import { MatchBoard } from "@/widgets/match-board"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">League of Legends</h1>
          <h2 className="text-2xl font-semibold text-muted-foreground">5v5 내전 배정표</h2>
        </header>
        <MatchBoard />
      </div>
    </main>
  )
}
