import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Waves, Wind, Thermometer, Activity } from "lucide-react";
import { BEACHES, beachImage } from "@/lib/beaches";
import { fetchForecast, degToCompass } from "@/lib/surf";
import { DayCalendar } from "@/app/components/DayCalendar";
import { HourlyTable } from "@/app/components/HourlyTable";
import { WaveIllustration } from "@/app/components/WaveIllustration";

export const revalidate = 1800;

export function generateStaticParams() {
  return BEACHES.map((b) => ({ id: b.id }));
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BeachPage({ params }: PageProps) {
  const { id } = await params;
  const beach = BEACHES.find((b) => b.id === id);
  if (!beach) notFound();

  const forecast = await fetchForecast(beach, 7);
  const current = forecast?.current ?? null;
  const days = forecast?.days ?? [];
  const today = days[0];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#061725] via-[#0a2a3f] to-[#061725] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux spots
        </Link>

        <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden border border-white/10">
          <Image
            src={beachImage(beach)}
            alt={`${beach.name} — ${beach.town}`}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061725] via-[#061725]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
                Côtes-d&apos;Armor
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mt-1">
                {beach.name}
              </h1>
              <p className="text-white/70 flex items-center gap-1 mt-2">
                <MapPin className="w-4 h-4" />
                {beach.town}
              </p>
            </div>

            {current && (
              <div
                className="rounded-2xl px-5 py-4 border min-w-[160px] backdrop-blur-sm"
                style={{
                  backgroundColor: `${current.score.color}33`,
                  borderColor: current.score.color,
                }}
              >
                <div className="text-xs uppercase tracking-widest text-white/80">
                  Maintenant
                </div>
                <div
                  className="text-4xl font-bold mt-1"
                  style={{ color: current.score.color }}
                >
                  {current.score.total.toFixed(1)}
                </div>
                <div
                  className="text-sm font-medium"
                  style={{ color: current.score.color }}
                >
                  {current.score.label}
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-white/70 max-w-2xl -mt-4">{beach.description}</p>

        {!forecast && (
          <p className="text-red-400">Impossible de récupérer la prévision.</p>
        )}

        {current && (
          <section className="grid gap-5 lg:grid-cols-[1fr_minmax(0,380px)]">
            <WaveIllustration
              waveHeight={current.conditions.waveHeight}
              swellHeight={current.conditions.swellHeight}
              swellPeriod={
                current.conditions.swellPeriod || current.conditions.wavePeriod
              }
            />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <BigStat
                icon={<Waves className="w-4 h-4" style={{ color: "#22d3ee" }} />}
                label="Vagues"
                value={`${current.conditions.waveHeight.toFixed(1)} m`}
                hint={`${degToCompass(current.conditions.waveDirection)} · ${current.conditions.wavePeriod.toFixed(0)}s`}
              />
              <BigStat
                icon={<Activity className="w-4 h-4" style={{ color: "#818cf8" }} />}
                label="Houle"
                value={`${current.conditions.swellHeight.toFixed(1)} m`}
                hint={`${current.conditions.swellPeriod.toFixed(0)}s`}
              />
              <BigStat
                icon={<Wind className="w-4 h-4" style={{ color: "#a3e635" }} />}
                label="Vent"
                value={`${current.conditions.windSpeed.toFixed(0)} km/h`}
                hint={degToCompass(current.conditions.windDirection)}
              />
              <BigStat
                icon={
                  <Thermometer className="w-4 h-4" style={{ color: "#fb923c" }} />
                }
                label="Températures"
                value={`${current.conditions.airTemperature.toFixed(0)}°C air`}
                hint={
                  current.conditions.waterTemperature != null
                    ? `${current.conditions.waterTemperature.toFixed(0)}°C eau`
                    : undefined
                }
              />
            </div>
          </section>
        )}

        {days.length > 0 && (
          <section className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm uppercase tracking-widest text-cyan-300/80">
                Prévision {days.length} jours
              </h2>
              <span className="text-xs text-white/40">Europe/Paris</span>
            </div>
            <DayCalendar days={days} />
          </section>
        )}

        {today && (
          <HourlyTable
            points={today.hourly}
            title={`Aujourd'hui · ${today.dayLabel}`}
          />
        )}

        {days[1] && (
          <HourlyTable
            points={days[1].hourly}
            title={`Demain · ${days[1].dayLabel}`}
          />
        )}

        <footer className="text-xs text-white/40 border-t border-white/10 pt-6">
          Prévisions Open-Meteo, mises à jour toutes les 30 minutes.
        </footer>
      </div>
    </main>
  );
}

function BigStat({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 flex gap-3 items-start">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="flex flex-col min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-white/50">
          {label}
        </div>
        <div className="text-white font-medium text-base">{value}</div>
        {hint && <div className="text-xs text-white/50">{hint}</div>}
      </div>
    </div>
  );
}
