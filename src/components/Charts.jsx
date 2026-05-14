// Hand-rolled SVG charts — no external dependency. Themed with CSS variables.

export const Sparkline = ({ values = [], width = 240, height = 56, stroke = "var(--brand)", fill = "rgba(25,211,197,0.20)" }) => {
  if (!values.length) {
    return (
      <svg width={width} height={height}>
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="var(--muted)" fontSize="12">
          No data yet
        </text>
      </svg>
    );
  }
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 100);
  const pad = 4;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const step = values.length > 1 ? w / (values.length - 1) : w;

  const pts = values.map((v, i) => {
    const x = pad + i * step;
    const y = pad + h - ((v - min) / Math.max(1, max - min)) * h;
    return [x, y];
  });
  const path = pts.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(" ");
  const area = `${path} L${pts[pts.length - 1][0]},${pad + h} L${pts[0][0]},${pad + h} Z`;

  return (
    <svg width={width} height={height} role="img" aria-label="Score trend">
      <path d={area} fill={fill} />
      <path d={path} fill="none" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" fill={stroke} />
      ))}
    </svg>
  );
};

export const LineChart = ({ data = [], width = 640, height = 220, yLabel = "Score (%)" }) => {
  // data: [{ x: string, y: number }]
  const padL = 36, padR = 16, padT = 16, padB = 30;
  const w = width - padL - padR;
  const h = height - padT - padB;
  const yMin = 0, yMax = 100;

  if (!data.length) {
    return (
      <svg width={width} height={height}>
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="var(--muted)" fontSize="13">
          No attempts yet — take a quiz to populate this chart.
        </text>
      </svg>
    );
  }

  const xStep = data.length > 1 ? w / (data.length - 1) : w;
  const xy = data.map((d, i) => [
    padL + i * xStep,
    padT + h - ((d.y - yMin) / (yMax - yMin)) * h
  ]);
  const path = xy.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(" ");
  const area = `${path} L${xy[xy.length - 1][0]},${padT + h} L${xy[0][0]},${padT + h} Z`;

  const gridYs = [0, 25, 50, 75, 100];

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={yLabel}>
      <defs>
        <linearGradient id="lc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="var(--brand)"   stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--brand)"   stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="lc-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="var(--brand)" />
          <stop offset="100%" stopColor="var(--violet)" />
        </linearGradient>
      </defs>

      {gridYs.map(v => {
        const y = padT + h - ((v - yMin) / (yMax - yMin)) * h;
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={padL + w} y2={y} stroke="var(--border)" strokeDasharray="2 4" />
            <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="11" fill="var(--muted)">{v}</text>
          </g>
        );
      })}

      <path d={area} fill="url(#lc-fill)" />
      <path d={path} fill="none" stroke="url(#lc-stroke)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {xy.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill="var(--bg)" stroke="var(--brand)" strokeWidth="2" />
          {(data.length <= 12 || i === xy.length - 1) && (
            <text x={x} y={padT + h + 16} textAnchor="middle" fontSize="10" fill="var(--muted)">
              {data[i].x}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};

export const Donut = ({ value = 0, max = 100, size = 110, stroke = 12, color = "var(--brand)", label = "" }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <svg width={size} height={size} role="img" aria-label={label || `${value}/${max}`}>
      <circle cx={size/2} cy={size/2} r={r} stroke="var(--bg-2)" strokeWidth={stroke} fill="none" />
      <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
              strokeLinecap="round" strokeDasharray={`${c * pct} ${c}`}
              transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
            fontSize={size * 0.26} fill="var(--text)" fontWeight="800" fontFamily="var(--font-display)">
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
};

export const MultiDonut = ({ segments = [], size = 130, stroke = 14 }) => {
  // segments: [{ label, value, color }]
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} stroke="var(--bg-2)" strokeWidth={stroke} fill="none" />
      {segments.map((s, i) => {
        const len = (s.value / total) * c;
        const el = (
          <circle key={i}
            cx={size/2} cy={size/2} r={r} fill="none"
            stroke={s.color} strokeWidth={stroke} strokeLinecap="butt"
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size/2} ${size/2})`}
          />
        );
        offset += len;
        return el;
      })}
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
            fontSize={size * 0.22} fill="var(--text)" fontWeight="800" fontFamily="var(--font-display)">
        {total}
      </text>
    </svg>
  );
};

export const Heatmap = ({ days = 84, values = {}, max = 5 }) => {
  // values: { 'YYYY-MM-DD': count }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cells = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const v = values[key] || 0;
    cells.push({ key, v, d });
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.ceil(days/7)}, 1fr)`, gap: 4 }}>
      {Array.from({ length: 7 }).map((_, row) => (
        <div key={row} style={{ display: "contents" }}>
          {cells.filter((_, idx) => idx % 7 === row).map(c => {
            const level = Math.min(4, Math.floor((c.v / max) * 4));
            const colors = ["var(--bg-2)", "rgba(25,211,197,0.25)", "rgba(25,211,197,0.45)", "rgba(25,211,197,0.70)", "var(--brand)"];
            return (
              <div key={c.key}
                title={`${c.key}: ${c.v} attempt${c.v === 1 ? "" : "s"}`}
                style={{
                  width: 12, height: 12, borderRadius: 3,
                  background: colors[level], border: "1px solid var(--border)"
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
