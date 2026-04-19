import { Waves, Wind, Activity } from "lucide-react";
import type { HourlyPoint } from "@/lib/surf";
import { degToCompass } from "@/lib/surf";

type Props = {
  points: HourlyPoint[];
  title: string;
};

export function HourlyTable({ points, title }: Props) {
  const visible = points.filter((p) => {
    const h = new Date(p.time).getHours();
    return h >= 6 && h <= 21;
  });

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-display text-2xl text-[#0c3a52]">{title}</h3>
      <div className="overflow-x-auto rounded-2xl bg-white border border-stone-100 shadow-sm">
        <table className="w-full text-sm min-w-[560px]">
          <thead className="text-[11px] uppercase tracking-wider text-[#0c3a52]/50 bg-stone-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Heure</th>
              <th className="text-left px-4 py-3 font-semibold">
                <Waves className="inline w-3.5 h-3.5 mr-1 text-sky-500" />
                Vagues
              </th>
              <th className="text-left px-4 py-3 font-semibold">
                <Activity className="inline w-3.5 h-3.5 mr-1 text-indigo-500" />
                Houle
              </th>
              <th className="text-left px-4 py-3 font-semibold">
                <Wind className="inline w-3.5 h-3.5 mr-1 text-green-600" />
                Vent
              </th>
              <th className="text-right px-4 py-3 font-semibold">Note</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p, i) => {
              const d = new Date(p.time);
              const hour = d.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Paris",
              });
              return (
                <tr
                  key={p.time}
                  className={`${i % 2 ? "bg-sky-50/40" : ""} hover:bg-sky-100/60 transition`}
                >
                  <td className="px-4 py-2.5 text-[#0c3a52]/80 font-medium">
                    {hour}
                  </td>
                  <td className="px-4 py-2.5 text-[#0c3a52]/80">
                    {p.conditions.waveHeight.toFixed(1)} m ·{" "}
                    <span className="text-[#0c3a52]/50">
                      {p.conditions.wavePeriod.toFixed(0)}s
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[#0c3a52]/70">
                    {p.conditions.swellHeight.toFixed(1)} m ·{" "}
                    {p.conditions.swellPeriod.toFixed(0)}s
                  </td>
                  <td className="px-4 py-2.5 text-[#0c3a52]/70">
                    {p.conditions.windSpeed.toFixed(0)} km/h{" "}
                    <span className="text-[#0c3a52]/50">
                      {degToCompass(p.conditions.windDirection)}
                    </span>
                  </td>
                  <td
                    className="px-4 py-2.5 text-right font-display text-lg"
                    style={{ color: p.score.color }}
                  >
                    {p.score.total.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
