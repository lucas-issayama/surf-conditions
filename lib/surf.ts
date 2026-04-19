import type { Beach } from "./beaches";

export type Conditions = {
  waveHeight: number; // m
  wavePeriod: number; // s
  waveDirection: number; // deg
  swellHeight: number; // m
  swellPeriod: number; // s
  windSpeed: number; // km/h
  windDirection: number; // deg (d'où vient le vent)
  airTemperature: number; // °C
  waterTemperature: number | null; // °C
  time: string; // ISO
};

export type Score = {
  total: number; // 0-10
  waves: number;
  period: number;
  wind: number;
  label: string;
  color: string;
  highlights: string[];
};

function scoreWaveHeight(h: number): number {
  if (h < 0.3) return 1;
  if (h < 0.5) return 3;
  if (h < 0.8) return 6;
  if (h < 1.2) return 9;
  if (h <= 1.8) return 10;
  if (h <= 2.5) return 7;
  if (h <= 3.5) return 4;
  return 2;
}

function scorePeriod(p: number): number {
  if (p < 5) return 2;
  if (p < 7) return 5;
  if (p < 9) return 7;
  if (p < 11) return 9;
  return 10;
}

function angularDiff(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function scoreWind(speed: number, from: number, facing: number): {
  score: number;
  type: "offshore" | "onshore" | "cross";
} {
  // Vent offshore = vient de la terre vers le large = direction opposée à "facing"
  const offshoreDir = (facing + 180) % 360;
  const diffOff = angularDiff(from, offshoreDir);
  const diffOn = angularDiff(from, facing);

  let type: "offshore" | "onshore" | "cross" = "cross";
  if (diffOff < 45) type = "offshore";
  else if (diffOn < 45) type = "onshore";

  let base = 10 - Math.min(10, speed / 4); // vent calme = 10
  if (type === "offshore") base += 1.5;
  if (type === "onshore") base -= 2;

  return { score: Math.max(0, Math.min(10, base)), type };
}

export function scoreConditions(c: Conditions, beach: Beach): Score {
  const h = scoreWaveHeight(c.waveHeight);
  const p = scorePeriod(c.swellPeriod || c.wavePeriod);
  const w = scoreWind(c.windSpeed, c.windDirection, beach.facing);

  const total = Math.round((h * 0.45 + p * 0.2 + w.score * 0.35) * 10) / 10;

  let label = "Médiocre";
  let color = "#6b7280";
  if (total >= 8) {
    label = "Excellent";
    color = "#10b981";
  } else if (total >= 6.5) {
    label = "Bon";
    color = "#22c55e";
  } else if (total >= 5) {
    label = "Correct";
    color = "#eab308";
  } else if (total >= 3) {
    label = "Faible";
    color = "#f97316";
  } else {
    label = "Plat";
    color = "#ef4444";
  }

  const highlights: string[] = [];
  if (c.waveHeight < 0.4) highlights.push("Quasiment plat");
  else if (c.waveHeight > 2.5) highlights.push("Grosses vagues, niveau confirmé");
  if ((c.swellPeriod || c.wavePeriod) >= 10) highlights.push("Houle longue et propre");
  if (c.windSpeed < 10) highlights.push("Vent très léger");
  else if (c.windSpeed > 30) highlights.push("Vent fort, surface agitée");
  if (w.type === "offshore") highlights.push("Vent offshore favorable");
  if (w.type === "onshore" && c.windSpeed > 15) highlights.push("Vent onshore, vagues désordonnées");

  return {
    total,
    waves: Math.round(h * 10) / 10,
    period: Math.round(p * 10) / 10,
    wind: Math.round(w.score * 10) / 10,
    label,
    color,
    highlights,
  };
}

export function degToCompass(deg: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO"];
  return dirs[Math.round(deg / 22.5) % 16];
}

type MarineResponse = {
  hourly: {
    time: string[];
    wave_height: number[];
    wave_period: number[];
    wave_direction: number[];
    swell_wave_height: number[];
    swell_wave_period: number[];
    sea_surface_temperature?: number[];
  };
};

type WeatherResponse = {
  hourly: {
    time: string[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    temperature_2m: number[];
  };
};

export type HourlyPoint = {
  time: string;
  conditions: Conditions;
  score: Score;
};

export type DailyForecast = {
  date: string; // "2026-04-19"
  dayLabel: string; // "sam. 19 avr."
  shortLabel: string; // "Sam 19"
  hourly: HourlyPoint[];
  bestHour: HourlyPoint;
  avgScore: number;
  waveHeightMin: number;
  waveHeightMax: number;
  windAvg: number;
  summary: { label: string; color: string };
};

export type Forecast = {
  current: HourlyPoint | null;
  days: DailyForecast[];
};

function summaryLabel(score: number): { label: string; color: string } {
  if (score >= 8) return { label: "Excellent", color: "#10b981" };
  if (score >= 6.5) return { label: "Bon", color: "#22c55e" };
  if (score >= 5) return { label: "Correct", color: "#eab308" };
  if (score >= 3) return { label: "Faible", color: "#f97316" };
  return { label: "Plat", color: "#ef4444" };
}

export async function fetchForecast(
  beach: Beach,
  days = 7,
): Promise<Forecast | null> {
  const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${beach.lat}&longitude=${beach.lon}&hourly=wave_height,wave_period,wave_direction,swell_wave_height,swell_wave_period,sea_surface_temperature&timezone=Europe%2FParis&forecast_days=${days}`;
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${beach.lat}&longitude=${beach.lon}&hourly=wind_speed_10m,wind_direction_10m,temperature_2m&timezone=Europe%2FParis&forecast_days=${days}`;

  try {
    const [marineRes, weatherRes] = await Promise.all([
      fetch(marineUrl, { next: { revalidate: 1800 } }),
      fetch(weatherUrl, { next: { revalidate: 1800 } }),
    ]);
    if (!marineRes.ok || !weatherRes.ok) return null;
    const marine: MarineResponse = await marineRes.json();
    const weather: WeatherResponse = await weatherRes.json();

    const weatherByTime = new Map<string, number>();
    weather.hourly.time.forEach((t, i) => weatherByTime.set(t, i));

    const hourly: HourlyPoint[] = [];
    for (let i = 0; i < marine.hourly.time.length; i++) {
      const t = marine.hourly.time[i];
      const wi = weatherByTime.get(t);
      if (wi === undefined) continue;
      const conditions: Conditions = {
        waveHeight: marine.hourly.wave_height[i] ?? 0,
        wavePeriod: marine.hourly.wave_period[i] ?? 0,
        waveDirection: marine.hourly.wave_direction[i] ?? 0,
        swellHeight: marine.hourly.swell_wave_height[i] ?? 0,
        swellPeriod: marine.hourly.swell_wave_period[i] ?? 0,
        waterTemperature: marine.hourly.sea_surface_temperature?.[i] ?? null,
        windSpeed: weather.hourly.wind_speed_10m[wi] ?? 0,
        windDirection: weather.hourly.wind_direction_10m[wi] ?? 0,
        airTemperature: weather.hourly.temperature_2m[wi] ?? 0,
        time: t,
      };
      const score = scoreConditions(conditions, beach);
      hourly.push({ time: t, conditions, score });
    }

    if (hourly.length === 0) return null;

    const now = Date.now();
    let current: HourlyPoint | null = hourly[0];
    let bestDiff = Math.abs(new Date(hourly[0].time).getTime() - now);
    for (const h of hourly) {
      const diff = Math.abs(new Date(h.time).getTime() - now);
      if (diff < bestDiff) {
        bestDiff = diff;
        current = h;
      }
    }

    // Grouper par jour
    const byDay = new Map<string, HourlyPoint[]>();
    for (const h of hourly) {
      const date = h.time.slice(0, 10);
      const arr = byDay.get(date) ?? [];
      arr.push(h);
      byDay.set(date, arr);
    }

    const dayLabelFmt = new Intl.DateTimeFormat("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: "Europe/Paris",
    });
    const shortLabelFmt = new Intl.DateTimeFormat("fr-FR", {
      weekday: "short",
      day: "numeric",
      timeZone: "Europe/Paris",
    });

    const daysOut: DailyForecast[] = Array.from(byDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, hours]) => {
        const surfHours = hours.filter((h) => {
          const hour = new Date(h.time).getHours();
          return hour >= 7 && hour <= 20;
        });
        const relevant = surfHours.length ? surfHours : hours;
        const best = relevant.reduce((a, b) =>
          a.score.total >= b.score.total ? a : b,
        );
        const avg =
          relevant.reduce((s, h) => s + h.score.total, 0) / relevant.length;
        const heights = relevant.map((h) => h.conditions.waveHeight);
        const winds = relevant.map((h) => h.conditions.windSpeed);
        const d = new Date(`${date}T12:00:00`);
        return {
          date,
          dayLabel: dayLabelFmt.format(d).replace(".", ""),
          shortLabel: shortLabelFmt.format(d).replace(".", ""),
          hourly: hours,
          bestHour: best,
          avgScore: Math.round(avg * 10) / 10,
          waveHeightMin: Math.min(...heights),
          waveHeightMax: Math.max(...heights),
          windAvg: winds.reduce((a, b) => a + b, 0) / winds.length,
          summary: summaryLabel(avg),
        };
      });

    return { current, days: daysOut };
  } catch {
    return null;
  }
}

export async function fetchConditions(beach: Beach): Promise<Conditions | null> {
  const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${beach.lat}&longitude=${beach.lon}&hourly=wave_height,wave_period,wave_direction,swell_wave_height,swell_wave_period,sea_surface_temperature&timezone=Europe%2FParis&forecast_days=1`;
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${beach.lat}&longitude=${beach.lon}&hourly=wind_speed_10m,wind_direction_10m,temperature_2m&timezone=Europe%2FParis&forecast_days=1`;

  try {
    const [marineRes, weatherRes] = await Promise.all([
      fetch(marineUrl, { next: { revalidate: 1800 } }),
      fetch(weatherUrl, { next: { revalidate: 1800 } }),
    ]);
    if (!marineRes.ok || !weatherRes.ok) return null;
    const marine: MarineResponse = await marineRes.json();
    const weather: WeatherResponse = await weatherRes.json();

    // Trouver l'index de l'heure la plus proche de maintenant
    const now = Date.now();
    const idx = marine.hourly.time.reduce((best, t, i) => {
      const diff = Math.abs(new Date(t).getTime() - now);
      return diff < Math.abs(new Date(marine.hourly.time[best]).getTime() - now) ? i : best;
    }, 0);

    const wIdx = weather.hourly.time.reduce((best, t, i) => {
      const diff = Math.abs(new Date(t).getTime() - now);
      return diff < Math.abs(new Date(weather.hourly.time[best]).getTime() - now) ? i : best;
    }, 0);

    return {
      waveHeight: marine.hourly.wave_height[idx] ?? 0,
      wavePeriod: marine.hourly.wave_period[idx] ?? 0,
      waveDirection: marine.hourly.wave_direction[idx] ?? 0,
      swellHeight: marine.hourly.swell_wave_height[idx] ?? 0,
      swellPeriod: marine.hourly.swell_wave_period[idx] ?? 0,
      waterTemperature: marine.hourly.sea_surface_temperature?.[idx] ?? null,
      windSpeed: weather.hourly.wind_speed_10m[wIdx] ?? 0,
      windDirection: weather.hourly.wind_direction_10m[wIdx] ?? 0,
      airTemperature: weather.hourly.temperature_2m[wIdx] ?? 0,
      time: marine.hourly.time[idx],
    };
  } catch {
    return null;
  }
}
