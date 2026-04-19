import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Waves, Wind, Thermometer, Activity, MapPin, ChevronRight } from "lucide-react";
import { beachImage, type Beach } from "@/lib/beaches";
import { type Conditions, type Score, degToCompass } from "@/lib/surf";
import { WaveIllustration } from "./WaveIllustration";

type Props = {
  beach: Beach;
  conditions: Conditions | null;
  score: Score | null;
};

export function BeachCard({ beach, conditions, score }: Props) {
  return (
    <Link
      href={`/plage/${beach.id}`}
      className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 overflow-hidden flex flex-col hover:bg-white/10 hover:border-cyan-400/30 transition group"
    >
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={beachImage(beach)}
          alt={`${beach.name} — ${beach.town}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {score && (
          <div
            className="absolute top-3 right-3 rounded-lg px-2 py-1 text-sm font-bold border backdrop-blur-sm"
            style={{
              backgroundColor: `${score.color}cc`,
              borderColor: score.color,
              color: "#0a0a0a",
            }}
          >
            {score.total.toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-1 group-hover:text-cyan-300 transition">
            {beach.name}
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
          </h2>
          <p className="text-sm text-white/60 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {beach.town}
          </p>
        </div>
        {score && (
          <div
            className="flex flex-col items-center justify-center rounded-xl px-3 py-2 min-w-[72px]"
            style={{
              backgroundColor: `${score.color}22`,
              borderColor: score.color,
              borderWidth: 1,
            }}
          >
            <span className="text-2xl font-bold" style={{ color: score.color }}>
              {score.total.toFixed(1)}
            </span>
            <span
              className="text-xs uppercase tracking-wider"
              style={{ color: score.color }}
            >
              {score.label}
            </span>
          </div>
        )}
      </header>

      <p className="text-sm text-white/70 leading-relaxed">{beach.description}</p>

      {!conditions && (
        <p className="text-sm text-red-400">Données indisponibles pour le moment.</p>
      )}

      {conditions && (
        <>
          <WaveIllustration
            waveHeight={conditions.waveHeight}
            swellHeight={conditions.swellHeight}
            swellPeriod={conditions.swellPeriod || conditions.wavePeriod}
          />

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Stat
              icon={Waves}
              iconColor="#22d3ee"
              label="Vagues"
              value={`${conditions.waveHeight.toFixed(1)} m`}
              hint={`${degToCompass(conditions.waveDirection)} · ${conditions.wavePeriod.toFixed(0)}s`}
            />
            <Stat
              icon={Activity}
              iconColor="#818cf8"
              label="Houle"
              value={`${conditions.swellHeight.toFixed(1)} m`}
              hint={`${conditions.swellPeriod.toFixed(0)}s`}
            />
            <Stat
              icon={Wind}
              iconColor="#a3e635"
              label="Vent"
              value={`${conditions.windSpeed.toFixed(0)} km/h`}
              hint={degToCompass(conditions.windDirection)}
            />
            <Stat
              icon={Thermometer}
              iconColor="#fb923c"
              label="Températures"
              value={`${conditions.airTemperature.toFixed(0)}°C air`}
              hint={
                conditions.waterTemperature != null
                  ? `${conditions.waterTemperature.toFixed(0)}°C eau`
                  : undefined
              }
            />
          </div>

          {score && score.highlights.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {score.highlights.map((h) => (
                <li
                  key={h}
                  className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80 border border-white/10"
                >
                  {h}
                </li>
              ))}
            </ul>
          )}

          {score && (
            <div className="flex gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1">
                <Waves className="w-3 h-3" />
                {score.waves}/10
              </span>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {score.period}/10
              </span>
              <span className="flex items-center gap-1">
                <Wind className="w-3 h-3" />
                {score.wind}/10
              </span>
            </div>
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
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg bg-black/20 border border-white/5 px-3 py-2 flex gap-2.5 items-start">
      <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: iconColor }} />
      <div className="flex flex-col min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-white/50">
          {label}
        </div>
        <div className="text-white font-medium">{value}</div>
        {hint && <div className="text-xs text-white/50">{hint}</div>}
      </div>
    </div>
  );
}
