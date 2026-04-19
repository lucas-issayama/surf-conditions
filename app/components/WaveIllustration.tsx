type Props = {
  waveHeight: number; // m
  swellHeight: number; // m
  swellPeriod: number; // s
};

const VIEW_W = 320;
const VIEW_H = 140;
const BASELINE = 118;
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

export function WaveIllustration({
  waveHeight,
  swellHeight,
  swellPeriod,
}: Props) {
  const rawWavelen = Math.max(4, swellPeriod) * 18;
  const wavelen = Math.min(rawWavelen, VIEW_W * 0.9);

  const vWave = Math.min(waveHeight, MAX_SCALE_M);
  const vSwell = Math.min(swellHeight, MAX_SCALE_M);

  const waveTopY = BASELINE - vWave * PX_PER_M;
  const swellTopY = BASELINE - vSwell * PX_PER_M;
  const waveRulerX = VIEW_W - 20;
  const swellRulerX = 20;

  const ticks = [1, 2, 3];

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#e0f7ff] via-[#bae6fd] to-[#7dd3fc] border border-sky-200 p-3 overflow-hidden relative">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto relative"
        role="img"
        aria-label={`Vague ${waveHeight.toFixed(1)}m, houle ${swellHeight.toFixed(1)}m période ${swellPeriod.toFixed(0)}s`}
      >
        <defs>
          <linearGradient id="swellFillLight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="waveFillLight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Graduations */}
        <g opacity="0.45">
          {ticks.map((t) => {
            const y = BASELINE - t * PX_PER_M;
            return (
              <g key={t}>
                <line
                  x1="0"
                  y1={y}
                  x2={VIEW_W}
                  y2={y}
                  stroke="#0c3a52"
                  strokeDasharray="2 4"
                  strokeWidth="0.5"
                />
                <text x="4" y={y - 2} fill="#0c3a52" fontSize="8">
                  {t}m
                </text>
              </g>
            );
          })}
        </g>

        {/* Houle */}
        <path
          d={wavePath(vSwell, wavelen, 0)}
          fill="url(#swellFillLight)"
          stroke="#0369a1"
          strokeOpacity="0.7"
          strokeWidth="1"
        />

        {/* Vagues */}
        <path
          d={wavePath(vWave, wavelen * 0.45, wavelen * 0.25)}
          fill="url(#waveFillLight)"
          stroke="#075985"
          strokeOpacity="0.95"
          strokeWidth="1.2"
        />

        {/* Ligne d'eau */}
        <line
          x1="0"
          y1={BASELINE}
          x2={VIEW_W}
          y2={BASELINE}
          stroke="#0c3a52"
          strokeOpacity="0.3"
          strokeDasharray="3 3"
        />

        {/* Règle houle */}
        <g stroke="#0369a1" strokeWidth="1.2" opacity="0.95">
          <line
            x1={swellRulerX}
            y1={BASELINE}
            x2={swellRulerX}
            y2={swellTopY}
          />
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
          fill="#0369a1"
          fontSize="10"
          fontWeight="700"
        >
          {swellHeight.toFixed(1)} m
        </text>

        {/* Règle vague */}
        <g stroke="#075985" strokeWidth="1.2" opacity="0.95">
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
          fill="#075985"
          fontSize="10"
          textAnchor="end"
          fontWeight="700"
        >
          {waveHeight.toFixed(1)} m
        </text>

        {/* Période */}
        <g opacity="0.85">
          <line
            x1={VIEW_W / 2 - wavelen / 2}
            y1={14}
            x2={VIEW_W / 2 + wavelen / 2}
            y2={14}
            stroke="#0c3a52"
            strokeWidth="1"
          />
          <line
            x1={VIEW_W / 2 - wavelen / 2}
            y1={10}
            x2={VIEW_W / 2 - wavelen / 2}
            y2={18}
            stroke="#0c3a52"
            strokeWidth="1"
          />
          <line
            x1={VIEW_W / 2 + wavelen / 2}
            y1={10}
            x2={VIEW_W / 2 + wavelen / 2}
            y2={18}
            stroke="#0c3a52"
            strokeWidth="1"
          />
          <text
            x={VIEW_W / 2}
            y={8}
            fill="#0c3a52"
            fontSize="9"
            textAnchor="middle"
            fontWeight="600"
          >
            période {swellPeriod.toFixed(0)}s
          </text>
        </g>
      </svg>
    </div>
  );
}
