import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Waves,
  Wind,
  Thermometer,
  Activity,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { beachImage, type Beach } from "@/lib/beaches";
import { type Conditions, type Score, degToCompass } from "@/lib/surf";
import { WaveIllustration } from "./WaveIllustration";

type Props = {
  beach: Beach;
  conditions: Conditions | null;
  score: Score | null;
  priority?: boolean;
};

export function BeachCard({
  beach,
  conditions,
  score,
  priority = false,
}: Props) {
  return (
    <Link
      href={`/plage/${beach.id}`}
      className="rounded-3xl bg-white border border-sky-100 shadow-lg shadow-sky-200/40 hover:shadow-xl hover:shadow-sky-300/60 hover:-translate-y-0.5 transition overflow-hidden flex flex-col group"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={beachImage(beach)}
          alt={`${beach.name} — ${beach.town}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition duration-500"
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {score && (
          <div
            className="absolute top-3 right-3 rounded-2xl px-3 py-1.5 text-base font-display shadow-md"
            style={{
              backgroundColor: score.color,
              color: "white",
            }}
          >
            {score.total.toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-4">
        <header className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-[#0c3a52] flex items-center gap-1 group-hover:text-sky-600 transition">
              {beach.name}
              <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition" />
            </h2>
            <p className="text-sm text-[#0c3a52]/60 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {beach.town}
            </p>
          </div>
          {score && (
            <div
              className="text-xs uppercase tracking-wider px-2 py-1 rounded-full"
              style={{
                backgroundColor: `${score.color}20`,
                color: score.color,
              }}
            >
              {score.label}
            </div>
          )}
        </header>

        <p className="text-sm text-[#0c3a52]/70 leading-relaxed">
          {beach.description}
        </p>

        {!conditions && (
          <p className="text-sm text-red-500">Données indisponibles.</p>
        )}

        {conditions && (
          <>
            <WaveIllustration
              waveHeight={conditions.waveHeight}
              swellHeight={conditions.swellHeight}
              swellPeriod={
                conditions.swellPeriod || conditions.wavePeriod
              }
            />

            <div className="grid grid-cols-2 gap-2.5 text-sm">
              <Stat
                icon={Waves}
                iconColor="#0ea5e9"
                bg="#e0f2fe"
                label="Vagues"
                value={`${conditions.waveHeight.toFixed(1)} m`}
                hint={`${degToCompass(conditions.waveDirection)} · ${conditions.wavePeriod.toFixed(0)}s`}
              />
              <Stat
                icon={Activity}
                iconColor="#6366f1"
                bg="#e0e7ff"
                label="Houle"
                value={`${conditions.swellHeight.toFixed(1)} m`}
                hint={`${conditions.swellPeriod.toFixed(0)}s`}
              />
              <Stat
                icon={Wind}
                iconColor="#16a34a"
                bg="#dcfce7"
                label="Vent"
                value={`${conditions.windSpeed.toFixed(0)} km/h`}
                hint={degToCompass(conditions.windDirection)}
              />
              <Stat
                icon={Thermometer}
                iconColor="#ea580c"
                bg="#ffedd5"
                label="Temp."
                value={`${conditions.airTemperature.toFixed(0)}°C air`}
                hint={
                  conditions.waterTemperature != null
                    ? `${conditions.waterTemperature.toFixed(0)}°C eau`
                    : undefined
                }
              />
            </div>

            {score && score.highlights.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {score.highlights.map((h) => (
                  <li
                    key={h}
                    className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </Link>
  );
}

function Stat({
  icon: Icon,
  iconColor,
  bg,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  iconColor: string;
  bg: string;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-stone-50 border border-stone-100 px-3 py-2.5 flex gap-2.5 items-start">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: bg }}
      >
        <Icon className="w-4 h-4" style={{ color: iconColor }} />
      </div>
      <div className="flex flex-col min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-[#0c3a52]/50 font-medium">
          {label}
        </div>
        <div className="text-[#0c3a52] font-semibold leading-tight">
          {value}
        </div>
        {hint && (
          <div className="text-xs text-[#0c3a52]/50">{hint}</div>
        )}
      </div>
    </div>
  );
}
