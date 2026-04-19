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
      <h3 className="text-sm uppercase tracking-widest text-cyan-300/80">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-1 min-w-[560px]">
          <thead className="text-[11px] uppercase tracking-wider text-white/40">
            <tr>
              <th className="text-left px-2 py-1 font-normal">Heure</th>
              <th className="text-left px-2 py-1 font-normal">
                <Waves className="inline w-3 h-3 mr-1" />
                Vagues
              </th>
              <th className="text-left px-2 py-1 font-normal">
                <Activity className="inline w-3 h-3 mr-1" />
                Houle
              </th>
              <th className="text-left px-2 py-1 font-normal">
                <Wind className="inline w-3 h-3 mr-1" />
                Vent
              </th>
              <th className="text-right px-2 py-1 font-normal">Note</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => {
              const d = new Date(p.time);
              const hour = d.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Paris",
              });
              return (
                <tr key={p.time} className="bg-white/[0.03] hover:bg-white/[0.07]">
                  <td className="px-2 py-2 rounded-l-lg text-white/80">{hour}</td>
                  <td className="px-2 py-2 text-white/80">
                    {p.conditions.waveHeight.toFixed(1)} m ·{" "}
                    <span className="text-white/50">
                      {p.conditions.wavePeriod.toFixed(0)}s
                    </span>
                  </td>
                  <td className="px-2 py-2 text-white/70">
                    {p.conditions.swellHeight.toFixed(1)} m ·{" "}
                    {p.conditions.swellPeriod.toFixed(0)}s
                  </td>
                  <td className="px-2 py-2 text-white/70">
                    {p.conditions.windSpeed.toFixed(0)} km/h{" "}
                    <span className="text-white/50">
                      {degToCompass(p.conditions.windDirection)}
                    </span>
                  </td>
                  <td
                    className="px-2 py-2 rounded-r-lg text-right font-semibold"
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
