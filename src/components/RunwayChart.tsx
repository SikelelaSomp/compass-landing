type Pt = { x: number; y: number };

const W = 720;
const H = 270;
const PAD = { l: 64, r: 24, t: 20, b: 52 };
const plotW = W - PAD.l - PAD.r;
const plotH = H - PAD.t - PAD.b;
const Y_MAX = 600;
const Y_MIN = -200;

const x = (day: number) => PAD.l + (day / 90) * plotW;
const y = (k: number) => PAD.t + ((Y_MAX - k) / (Y_MAX - Y_MIN)) * plotH;

// Sample data in thousands of rand. Illustration only.
const days = [0, 15, 30, 45, 60, 75, 90];
const mid = [380, 310, 245, 170, 40, -30, -25];
const spread = [20, 35, 50, 65, 80, 95, 105];

const midPts: Pt[] = days.map((d, i) => ({ x: x(d), y: y(mid[i]) }));
const upPts: Pt[] = days.map((d, i) => ({ x: x(d), y: y(mid[i] + spread[i]) }));
const loPts: Pt[] = days.map((d, i) => ({ x: x(d), y: y(mid[i] - spread[i]) })).reverse();

function seg(p: Pt[]): string {
  let d = "";
  for (let i = 1; i < p.length - 1; i++) {
    const mx = (p[i].x + p[i + 1].x) / 2;
    const my = (p[i].y + p[i + 1].y) / 2;
    d += `Q${p[i].x},${p[i].y} ${mx},${my} `;
  }
  const last = p[p.length - 1];
  return d + `L${last.x},${last.y}`;
}

const linePath = `M${midPts[0].x},${midPts[0].y} ${seg(midPts)}`;
const bandPath = `M${upPts[0].x},${upPts[0].y} ${seg(upPts)} L${loPts[0].x},${loPts[0].y} ${seg(loPts)} Z`;

const yTicks = [600, 400, 200, 0, -200];
const xLabels = ["Today", "15 days", "30 days", "45 days", "60 days", "75 days", "90 days"];
const fmt = (k: number) => (k < 0 ? `-R${Math.abs(k)}k` : `R${k}k`);

const SHORTFALL_DAY = 68;

export default function RunwayChart() {
  const sx = x(SHORTFALL_DAY);
  const sy = y(0);

  return (
    <figure className="rounded-2xl border border-line bg-card p-4 sm:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <figcaption className="text-sm font-semibold">
          Projected cash balance <span className="font-normal text-muted">(sample data)</span>
        </figcaption>
        <span className="rounded-lg border border-line px-3 py-1 text-sm font-semibold text-brand">
          Runway: 11 weeks
        </span>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="min-w-[600px] w-full"
          role="img"
          aria-label="Concept sketch of a projected cash balance falling below zero after about 68 days, with a range of likely outcomes"
        >
          {yTicks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.l}
                x2={W - PAD.r}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--line)"
                strokeDasharray={t === 0 ? "4 4" : undefined}
                strokeWidth={t === 0 ? 1.5 : 1}
              />
              <text x={PAD.l - 10} y={y(t) + 4} textAnchor="end" fontSize="12" fill="var(--muted)">
                {fmt(t)}
              </text>
            </g>
          ))}

          {days.map((d, i) => (
            <text
              key={d}
              x={x(d)}
              y={H - PAD.b + 24}
              textAnchor={i === 0 ? "start" : "middle"}
              fontSize="12"
              fill="var(--muted)"
            >
              {xLabels[i]}
            </text>
          ))}

          <path d={bandPath} fill="var(--brand)" fillOpacity="0.14" />
          <path d={linePath} fill="none" stroke="var(--brand)" strokeWidth="2.5" strokeLinecap="round" />

          <line x1={sx} x2={sx} y1={sy - 14} y2={sy} stroke="var(--warn)" strokeWidth="1.5" />
          <circle cx={sx} cy={sy} r="5" fill="var(--warn)" />
          <rect x={sx - 58} y={sy - 38} width="116" height="24" rx="12" fill="var(--warn)" />
          <text x={sx} y={sy - 22} textAnchor="middle" fontSize="12" fontWeight="600" fill="#1a1a1a">
            Possible shortfall
          </text>
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
        <div className="flex flex-wrap items-center gap-5">
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-6 rounded bg-brand" /> Projected cash
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-6 rounded bg-brand/15" /> Range of likely outcomes
          </span>
        </div>
        <span>Concept sketch, not a live product</span>
      </div>
    </figure>
  );
}