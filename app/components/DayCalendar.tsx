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
          className="rounded-2xl p-4 flex flex-col gap-2 bg-white border-2 shadow-sm"
          style={{
            borderColor: day.summary.color,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#0c3a52]/60 font-medium">
              {idx === 0 ? "Aujourd'hui" : day.shortLabel}
            </span>
            <span
              className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full"
              style={{
                color: day.summary.color,
                backgroundColor: `${day.summary.color}18`,
              }}
            >
              {day.summary.label}
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span
              className="font-display text-4xl leading-none"
              style={{ color: day.summary.color }}
            >
              {day.avgScore.toFixed(1)}
            </span>
            <span className="text-xs text-[#0c3a52]/40">/10</span>
          </div>

          <div className="text-xs text-[#0c3a52]/70 flex flex-col gap-0.5">
            <span>
              🌊 {day.waveHeightMin.toFixed(1)}–
              {day.waveHeightMax.toFixed(1)} m
            </span>
            <span>💨 {day.windAvg.toFixed(0)} km/h</span>
          </div>

          <div className="text-[11px] text-[#0c3a52]/60 border-t border-stone-100 pt-1.5 mt-0.5">
            Pic {formatHour(day.bestHour.time)} ·{" "}
            <span
              className="font-semibold"
              style={{ color: day.bestHour.score.color }}
            >
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
