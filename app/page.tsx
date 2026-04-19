import { BEACHES } from "@/lib/beaches";
import { fetchConditions, scoreConditions } from "@/lib/surf";
import { BeachCard } from "./components/BeachCard";
import { BeachMapLoader } from "./components/BeachMapLoader";
import { WavesBackground } from "./components/WavesBackground";

export const revalidate = 1800;

export default async function Home() {
  const results = await Promise.all(
    BEACHES.map(async (beach) => {
      const conditions = await fetchConditions(beach);
      const score = conditions ? scoreConditions(conditions, beach) : null;
      return { beach, conditions, score };
    }),
  );

  const sorted = [...results].sort(
    (a, b) => (b.score?.total ?? -1) - (a.score?.total ?? -1),
  );

  const best = sorted[0];
  const scored = results.filter((r) => r.score);
  const generalScore = scored.length
    ? scored.reduce((s, r) => s + (r.score?.total ?? 0), 0) / scored.length
    : 0;

  const updatedAt = new Date().toLocaleString("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  });

  return (
    <main className="min-h-screen text-[#0c3a52]">
      {/* Hero avec vagues animées */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#e0f7ff] via-[#bae6fd] to-[#7dd3fc] pb-36 sm:pb-44">
        <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-8 flex flex-col gap-3 z-10">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-700 font-medium">
            Côtes-d&apos;Armor · Bretagne
          </p>
          <h1 className="font-display text-5xl sm:text-7xl text-[#0c3a52] leading-tight drop-shadow-sm">
            Ça surfe aujourd&apos;hui ?
          </h1>
          <p className="text-lg text-[#0c3a52]/80 max-w-2xl">
            Le check des spots du coin : vagues, vent, tout ce qu&apos;il faut
            pour savoir où poser la planche.
          </p>
          <p className="text-xs text-[#0c3a52]/60">
            Mise à jour : {updatedAt}
          </p>
        </div>
        <WavesBackground />
      </div>

      {/* Contenu principal sur fond clair */}
      <div className="relative bg-gradient-to-b from-[#f0f9ff] to-[#e0f2fe] -mt-1">
        <div className="max-w-6xl mx-auto px-6 pt-4 pb-10 flex flex-col gap-10">
          <section className="rounded-[2rem] bg-white border border-sky-100 shadow-xl shadow-sky-200/50 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="text-xs uppercase tracking-widest text-sky-600 font-semibold">
                La note du jour
              </h2>
              <div className="flex items-baseline gap-3">
                <span
                  className="font-display text-7xl leading-none"
                  style={{ color: colorForScore(generalScore) }}
                >
                  {generalScore.toFixed(1)}
                </span>
                <span className="text-[#0c3a52]/50">/ 10</span>
              </div>
              <p className="text-[#0c3a52]/70 max-w-md text-base">
                {generalScore >= 7
                  ? "Énorme journée, fonce, ça rentre partout ! 🤙"
                  : generalScore >= 5
                    ? "Correct dans l'ensemble, quelques spots sortent bien du lot."
                    : generalScore >= 3
                      ? "Faiblard, vise les plages les mieux exposées."
                      : "Plat comme un lac... Journée bronzette ou longboard mousse."}
              </p>
            </div>

            {best?.score && (
              <div
                className="rounded-2xl p-5 min-w-[220px] border-2 shadow-md"
                style={{
                  backgroundColor: `${best.score.color}14`,
                  borderColor: best.score.color,
                }}
              >
                <div className="text-xs uppercase tracking-widest text-[#0c3a52]/60">
                  Le spot du jour
                </div>
                <div className="font-display text-2xl mt-1 text-[#0c3a52]">
                  {best.beach.name}
                </div>
                <div className="text-sm text-[#0c3a52]/60">
                  {best.beach.town}
                </div>
                <div
                  className="mt-3 font-display text-4xl"
                  style={{ color: best.score.color }}
                >
                  {best.score.total.toFixed(1)}{" "}
                  <span className="text-base font-sans font-medium">
                    {best.score.label}
                  </span>
                </div>
              </div>
            )}
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="font-display text-3xl text-[#0c3a52]">
              La carte des spots
            </h2>
            <BeachMapLoader
              points={results.map(({ beach, score }) => ({ beach, score }))}
            />
            <div className="flex flex-wrap gap-3 text-xs text-[#0c3a52]/70">
              <Legend color="#10b981" label="Énorme (≥ 8)" />
              <Legend color="#22c55e" label="Bon (≥ 6.5)" />
              <Legend color="#eab308" label="Correct (≥ 5)" />
              <Legend color="#f97316" label="Mou (≥ 3)" />
              <Legend color="#ef4444" label="Plat (< 3)" />
            </div>
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="font-display text-3xl text-[#0c3a52]">
              Tous les spots
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map(({ beach, conditions, score }, i) => (
                <BeachCard
                  key={beach.id}
                  beach={beach}
                  conditions={conditions}
                  score={score}
                  priority={i < 3}
                />
              ))}
            </div>
          </section>

          <footer className="text-sm text-[#0c3a52]/60 border-t border-sky-200/50 pt-6 pb-4">
            Données{" "}
            <a
              className="underline decoration-sky-400 decoration-2 underline-offset-4"
              href="https://open-meteo.com/"
            >
              Open-Meteo
            </a>
            . Les notes sont une estimation. Rien ne remplace un œil sur
            le spot. Bon surf 🏄
          </footer>
        </div>
      </div>
    </main>
  );
}

function colorForScore(score: number): string {
  if (score >= 8) return "#10b981";
  if (score >= 6.5) return "#22c55e";
  if (score >= 5) return "#eab308";
  if (score >= 3) return "#f97316";
  return "#ef4444";
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-sky-100 shadow-sm">
      <span
        className="inline-block w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
