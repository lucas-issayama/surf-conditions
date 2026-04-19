"use client";

import { useEffect, useRef } from "react";

const VIEW_W = 900;
const VIEW_H = 120;
const BASELINE = 75;
const SAMPLES = 220;

type Marola = {
  amp: number;
  sigma: number;
  duration: number;
};

const MAROLAS: Marola[] = [
  { amp: 18, sigma: 70, duration: 5 },
  { amp: 38, sigma: 140, duration: 7 },
];

const CYCLE = MAROLAS.reduce((s, m) => s + m.duration, 0);

function activeAt(tSec: number): { m: Marola; phase: number } | null {
  const t = ((tSec % CYCLE) + CYCLE) % CYCLE;
  let elapsed = 0;
  for (const m of MAROLAS) {
    if (t < elapsed + m.duration) {
      return { m, phase: (t - elapsed) / m.duration };
    }
    elapsed += m.duration;
  }
  return null;
}

function buildPath(tSec: number): string {
  const a = activeAt(tSec);
  const pts: string[] = [];
  if (a) {
    const edge = a.m.sigma * 2.5;
    const centerX = -edge + a.phase * (VIEW_W + 2 * edge);
    for (let i = 0; i <= SAMPLES; i++) {
      const x = (i / SAMPLES) * VIEW_W;
      const dx = (x - centerX) / a.m.sigma;
      const y = BASELINE - a.m.amp * Math.exp(-dx * dx);
      pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
    }
  } else {
    pts.push(`M0 ${BASELINE} L${VIEW_W} ${BASELINE}`);
  }
  return pts.join(" ");
}

export function WavesBackground() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const tSec = (now - start) / 1000;
      if (pathRef.current) {
        pathRef.current.setAttribute("d", buildPath(tSec));
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-28 sm:h-32 overflow-hidden pointer-events-none"
    >
      <svg
        className="block w-full h-full"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d={buildPath(0)}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
