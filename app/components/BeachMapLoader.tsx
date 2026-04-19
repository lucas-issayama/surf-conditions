"use client";

import dynamic from "next/dynamic";
import type { Beach } from "@/lib/beaches";
import type { Score } from "@/lib/surf";

const BeachMap = dynamic(() => import("./BeachMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/50 text-sm">
      Chargement de la carte…
    </div>
  ),
});

type MapPoint = {
  beach: Beach;
  score: Score | null;
};

export function BeachMapLoader({ points }: { points: MapPoint[] }) {
  return <BeachMap points={points} />;
}
