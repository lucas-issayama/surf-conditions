import type { DailyForecast } from "@/lib/surf";

type Props = {
  days: DailyForecast[];
};

export function DayCalendar({ days }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
      {days.map((day, idx) => (
        <div
          key={day.date}
          className="rounded-xl p-3 flex flex-col gap-2 border"
          style={{
            backgroundColor: `${day.summary.color}14`,
            borderColor: `${day.summary.color}55`,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/70">
              {idx === 0 ? "Aujourd'hui" : day.shortLabel}
            </span>
            <span
              className="text-[10px] uppercase tracking-wider"
              style={{ color: day.summary.color }}
            >
              {day.summary.label}
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span
              className="text-2xl font-bold"
              style={{ color: day.summary.color }}
            >
              {day.avgScore.toFixed(1)}
            </span>
            <span className="text-xs text-white/40">/10</span>
          </div>

          <div className="text-xs text-white/70 flex flex-col gap-0.5">
            <span>
              Vagues {day.waveHeightMin.toFixed(1)}–
              {day.waveHeightMax.toFixed(1)} m
            </span>
            <span>Vent {day.windAvg.toFixed(0)} km/h</span>
          </div>

          <div className="text-[11px] text-white/60 border-t border-white/10 pt-1.5 mt-0.5">
            Pic {formatHour(day.bestHour.time)} ·{" "}
            <span style={{ color: day.bestHour.score.color }}>
              {day.bestHour.score.total.toFixed(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatHour(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  });
}
