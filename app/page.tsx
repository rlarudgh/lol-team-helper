import Footer from "@/components/ui/footer";
import { MatchBoard } from "@/widgets/match-board";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 min-h-screen grid grid-rows-[auto_1fr_auto]">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            5v5 내전 배정표
          </h1>
        </header>
        <MatchBoard />
        <Footer />
      </div>
    </main>
  );
}
