type Props = {
  waveHeight: number; // m
  swellHeight: number; // m
  swellPeriod: number; // s
};

const VIEW_W = 320;
const VIEW_H = 140;
const BASELINE = 118;
// Échelle : on réserve la moitié haute du cadre pour 3 m de hauteur
const MAX_SCALE_M = 3;
const PX_PER_M = (BASELINE - 20) / MAX_SCALE_M;

function wavePath(amplitudeM: number, wavelengthPx: number, phase = 0) {
  const amp = amplitudeM * PX_PER_M * 0.5;
  const points: string[] = [];
  const step = 4;
  for (let x = 0; x <= VIEW_W; x += step) {
    const y =
      BASELINE - amp * Math.sin(((x + phase) / wavelengthPx) * Math.PI * 2);
    points.push(`${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)}`);
  }
  points.push(`L${VIEW_W} ${VIEW_H}`);
  points.push(`L0 ${VIEW_H}`);
  points.push("Z");
  return points.join(" ");
}

export function WaveIllustration({ waveHeight, swellHeight, swellPeriod }: Props) {
  const rawWavelen = Math.max(4, swellPeriod) * 18;
  const wavelen = Math.min(rawWavelen, VIEW_W * 0.9);

  const vWave = Math.min(waveHeight, MAX_SCALE_M);
  const vSwell = Math.min(swellHeight, MAX_SCALE_M);

  const waveTopY = BASELINE - vWave * PX_PER_M;
  const swellTopY = BASELINE - vSwell * PX_PER_M;
  const waveRulerX = VIEW_W - 20;
  const swellRulerX = 20;

  // Graduations de l'échelle verticale
  const ticks = [1, 2, 3];

  return (
    <div className="rounded-lg bg-gradient-to-b from-[#0a2a3f] to-[#061725] border border-white/5 p-3">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Vague ${waveHeight.toFixed(1)}m, houle ${swellHeight.toFixed(1)}m période ${swellPeriod.toFixed(0)}s`}
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0e3a56" />
            <stop offset="100%" stopColor="#0a2a3f" />
          </linearGradient>
          <linearGradient id="swellFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#sky)" />

        {/* Graduations de référence (1m / 2m / 3m) */}
        <g opacity="0.25">
          {ticks.map((t) => {
            const y = BASELINE - t * PX_PER_M;
            return (
              <g key={t}>
                <line
                  x1="0"
                  y1={y}
                  x2={VIEW_W}
                  y2={y}
                  stroke="#ffffff"
                  strokeDasharray="2 4"
                  strokeWidth="0.5"
                />
                <text x="4" y={y - 2} fill="#ffffff" fontSize="8">
                  {t}m
                </text>
              </g>
            );
          })}
        </g>

        {/* Houle : longue période, amplitude = swellHeight */}
        <path
          d={wavePath(vSwell, wavelen, 0)}
          fill="url(#swellFill)"
          stroke="#818cf8"
          strokeOpacity="0.6"
          strokeWidth="1"
        />

        {/* Vagues : période plus courte, amplitude = waveHeight */}
        <path
          d={wavePath(vWave, wavelen * 0.45, wavelen * 0.25)}
          fill="url(#waveFill)"
          stroke="#22d3ee"
          strokeOpacity="0.9"
          strokeWidth="1.2"
        />

        {/* Ligne d'eau au repos */}
        <line
          x1="0"
          y1={BASELINE}
          x2={VIEW_W}
          y2={BASELINE}
          stroke="#ffffff"
          strokeOpacity="0.2"
          strokeDasharray="3 3"
        />

        {/* Règle hauteur de houle (gauche, indigo) */}
        <g stroke="#818cf8" strokeWidth="1" opacity="0.9">
          <line x1={swellRulerX} y1={BASELINE} x2={swellRulerX} y2={swellTopY} />
          <line
            x1={swellRulerX - 4}
            y1={BASELINE}
            x2={swellRulerX + 4}
            y2={BASELINE}
          />
          <line
            x1={swellRulerX - 4}
            y1={swellTopY}
            x2={swellRulerX + 4}
            y2={swellTopY}
          />
        </g>
        <text
          x={swellRulerX + 6}
          y={(BASELINE + swellTopY) / 2 + 3}
          fill="#a5b4fc"
          fontSize="10"
          fontWeight="600"
        >
          {swellHeight.toFixed(1)} m
        </text>

        {/* Règle hauteur de vague (droite, cyan) */}
        <g stroke="#22d3ee" strokeWidth="1" opacity="0.95">
          <line x1={waveRulerX} y1={BASELINE} x2={waveRulerX} y2={waveTopY} />
          <line
            x1={waveRulerX - 4}
            y1={BASELINE}
            x2={waveRulerX + 4}
            y2={BASELINE}
          />
          <line
            x1={waveRulerX - 4}
            y1={waveTopY}
            x2={waveRulerX + 4}
            y2={waveTopY}
          />
        </g>
        <text
          x={waveRulerX - 6}
          y={(BASELINE + waveTopY) / 2 + 3}
          fill="#22d3ee"
          fontSize="10"
          textAnchor="end"
          fontWeight="600"
        >
          {waveHeight.toFixed(1)} m
        </text>

        {/* Indicateur de période */}
        <g opacity="0.75">
          <line
            x1={VIEW_W / 2 - wavelen / 2}
            y1={14}
            x2={VIEW_W / 2 + wavelen / 2}
            y2={14}
            stroke="#818cf8"
            strokeWidth="1"
          />
          <line
            x1={VIEW_W / 2 - wavelen / 2}
            y1={10}
            x2={VIEW_W / 2 - wavelen / 2}
            y2={18}
            stroke="#818cf8"
            strokeWidth="1"
          />
          <line
            x1={VIEW_W / 2 + wavelen / 2}
            y1={10}
            x2={VIEW_W / 2 + wavelen / 2}
            y2={18}
            stroke="#818cf8"
            strokeWidth="1"
          />
          <text
            x={VIEW_W / 2}
            y={8}
            fill="#a5b4fc"
            fontSize="9"
            textAnchor="middle"
          >
            période {swellPeriod.toFixed(0)}s
          </text>
        </g>
      </svg>
    </div>
  );
}
