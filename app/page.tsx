import { BEACHES } from "@/lib/beaches";
import { fetchConditions, scoreConditions } from "@/lib/surf";
import { BeachCard } from "./components/BeachCard";
import { BeachMapLoader } from "./components/BeachMapLoader";

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
    <main className="min-h-screen bg-gradient-to-b from-[#061725] via-[#0a2a3f] to-[#061725] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
        <header className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
            Côtes-d&apos;Armor
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Conditions de surf en direct
          </h1>
          <p className="text-white/60 max-w-2xl">
            Une vue d&apos;ensemble des principaux spots de surf des Côtes-d&apos;Armor,
            basée sur les prévisions marines et météo d&apos;Open-Meteo. Mise à jour
            toutes les 30 minutes.
          </p>
          <p className="text-xs text-white/40">Dernière actualisation : {updatedAt}</p>
        </header>

        <section className="rounded-3xl bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border border-white/10 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-sm uppercase tracking-widest text-cyan-300/80">
              Note générale
            </h2>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-bold">{generalScore.toFixed(1)}</span>
              <span className="text-white/50">/ 10</span>
            </div>
            <p className="text-white/70 max-w-md">
              {generalScore >= 7
                ? "Conditions globalement excellentes sur le département, beaucoup de spots valent le détour."
                : generalScore >= 5
                  ? "Conditions correctes, certains spots sortent du lot selon leur orientation."
                  : generalScore >= 3
                    ? "Journée faible dans l'ensemble, viser les spots les mieux exposés."
                    : "Mer plate ou désordonnée sur la plupart des spots, journée peu propice au surf."}
            </p>
          </div>

          {best?.score && (
            <div className="rounded-2xl bg-black/30 border border-white/10 p-5 min-w-[220px]">
              <div className="text-xs uppercase tracking-widest text-white/50">
                Spot du moment
              </div>
              <div className="text-xl font-semibold mt-1">{best.beach.name}</div>
              <div className="text-sm text-white/60">{best.beach.town}</div>
              <div
                className="mt-3 text-3xl font-bold"
                style={{ color: best.score.color }}
              >
                {best.score.total.toFixed(1)}{" "}
                <span className="text-sm font-normal">{best.score.label}</span>
              </div>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm uppercase tracking-widest text-cyan-300/80">
            Carte des spots
          </h2>
          <BeachMapLoader
            points={results.map(({ beach, score }) => ({ beach, score }))}
          />
          <div className="flex flex-wrap gap-3 text-xs text-white/60">
            <Legend color="#10b981" label="Excellent (≥ 8)" />
            <Legend color="#22c55e" label="Bon (≥ 6.5)" />
            <Legend color="#eab308" label="Correct (≥ 5)" />
            <Legend color="#f97316" label="Faible (≥ 3)" />
            <Legend color="#ef4444" label="Plat (< 3)" />
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map(({ beach, conditions, score }) => (
            <BeachCard
              key={beach.id}
              beach={beach}
              conditions={conditions}
              score={score}
            />
          ))}
        </section>

        <footer className="text-xs text-white/40 border-t border-white/10 pt-6">
          Données :{" "}
          <a className="underline" href="https://open-meteo.com/">
            Open-Meteo
          </a>{" "}
          (Marine &amp; Forecast API). Les notes sont une estimation basée sur la
          hauteur des vagues, la période de houle et l&apos;orientation du vent. Rien
          ne remplace un œil sur le spot.
        </footer>
      </div>
    </main>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span
        className="inline-block w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
