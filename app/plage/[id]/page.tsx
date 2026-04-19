import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Waves,
  Wind,
  Thermometer,
  Activity,
} from "lucide-react";
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
    <main className="min-h-screen bg-gradient-to-b from-[#e0f7ff] via-[#f0f9ff] to-[#e0f2fe] text-[#0c3a52]">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#0c3a52]/70 hover:text-sky-600 w-fit font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux spots
        </Link>

        <div className="relative h-72 sm:h-96 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl shadow-sky-300/50">
          <Image
            src={beachImage(beach)}
            alt={`${beach.name} — ${beach.town}`}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-sky-200 font-medium">
                Côtes-d&apos;Armor
              </p>
              <h1 className="font-display text-5xl sm:text-6xl mt-2 drop-shadow-lg">
                {beach.name}
              </h1>
              <p className="flex items-center gap-1 mt-2 text-white/90">
                <MapPin className="w-4 h-4" />
                {beach.town}
              </p>
            </div>

            {current && (
              <div
                className="rounded-3xl px-6 py-4 border-2 min-w-[170px] bg-white shadow-lg"
                style={{ borderColor: current.score.color }}
              >
                <div className="text-[11px] uppercase tracking-widest text-[#0c3a52]/60 font-medium">
                  Maintenant
                </div>
                <div
                  className="font-display text-5xl leading-none mt-1"
                  style={{ color: current.score.color }}
                >
                  {current.score.total.toFixed(1)}
                </div>
                <div
                  className="text-sm font-semibold mt-1"
                  style={{ color: current.score.color }}
                >
                  {current.score.label}
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-lg text-[#0c3a52]/75 max-w-3xl leading-relaxed">
          {beach.description}
        </p>

        {!forecast && (
          <p className="text-red-500">Impossible de récupérer la prévision.</p>
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
                icon={<Waves className="w-5 h-5 text-sky-600" />}
                bg="#e0f2fe"
                label="Vagues"
                value={`${current.conditions.waveHeight.toFixed(1)} m`}
                hint={`${degToCompass(current.conditions.waveDirection)} · ${current.conditions.wavePeriod.toFixed(0)}s`}
              />
              <BigStat
                icon={<Activity className="w-5 h-5 text-indigo-600" />}
                bg="#e0e7ff"
                label="Houle"
                value={`${current.conditions.swellHeight.toFixed(1)} m`}
                hint={`${current.conditions.swellPeriod.toFixed(0)}s`}
              />
              <BigStat
                icon={<Wind className="w-5 h-5 text-green-600" />}
                bg="#dcfce7"
                label="Vent"
                value={`${current.conditions.windSpeed.toFixed(0)} km/h`}
                hint={degToCompass(current.conditions.windDirection)}
              />
              <BigStat
                icon={<Thermometer className="w-5 h-5 text-orange-600" />}
                bg="#ffedd5"
                label="Temp."
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
              <h2 className="font-display text-3xl text-[#0c3a52]">
                Les {days.length} prochains jours
              </h2>
              <span className="text-xs text-[#0c3a52]/50">Europe/Paris</span>
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

        <footer className="text-sm text-[#0c3a52]/60 border-t border-[#0c3a52]/10 pt-6 pb-4">
          Prévisions Open-Meteo, mises à jour toutes les 30 minutes. 🤙
        </footer>
      </div>
    </main>
  );
}

function BigStat({
  icon,
  bg,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  bg: string;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-stone-100 px-4 py-3 flex gap-3 items-start shadow-sm">
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: bg }}
      >
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-[#0c3a52]/50 font-medium">
          {label}
        </div>
        <div className="text-[#0c3a52] font-semibold text-base leading-tight">
          {value}
        </div>
        {hint && (
          <div className="text-xs text-[#0c3a52]/50">{hint}</div>
        )}
      </div>
    </div>
  );
}
