import { useState } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  AreaChart, Area, Tooltip, RadialBarChart, RadialBar, PolarAngleAxis,
} from 'recharts';
import { motion, useReducedMotion } from 'framer-motion';
import { ValuePlaceholder, TrackPlaceholder } from '../motion/Placeholder';

/**
 * CHARTS
 *
 * Built per the dataviz procedure: form first, colour by job, validated ramp,
 * thin marks with rounded data-ends, recessive grid, hover layer by default.
 *
 * The categorical hues come from the validated palette (light + dark both pass
 * all six checks). Do NOT swap them for better-looking ones by eye — the
 * gold↔green pair in particular sits near the tritan floor and is only legal
 * because these charts also carry direct labels.
 */

import { CAT } from './palette';

/* Shared tooltip — dark pill, tabular figures, never a colour-only reference. */
function ChartTooltip({ active, payload, label, formatter, unit = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      {label != null && (
        <div className="mb-1 text-label-xs uppercase opacity-60">{label}</div>
      )}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 whitespace-nowrap">
          <i className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="opacity-75">{p.name}</span>
          <span className="ml-auto font-semibold tabular">
            {formatter ? formatter(p.value) : p.value}{unit}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Bar chart with hatched headroom ──────────────────────────────────────
   Mirrors the reference's Attendance Rate: pale bars, ONE ember bar for the
   focus period, hatched capacity above each. Hovering promotes a bar. */
export function CapacityBarChart({ data, dataKey = 'value', xKey = 'label', highlightKey, height = 230, unit = '' }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(null);
  const max = Math.max(...data.map(d => d[dataKey]), 1);
  const ceiling = Math.ceil(max * 1.25);

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 14, right: 4, bottom: 0, left: -18 }}
          onMouseMove={(s) => setHover(s?.activeTooltipIndex ?? null)}
          onMouseLeave={() => setHover(null)}
          barCategoryGap="26%"
        >
          <CartesianGrid vertical={false} strokeDasharray="2 5" />
          <XAxis dataKey={xKey} axisLine={false} tickLine={false} dy={6} />
          <YAxis
            axisLine={false} tickLine={false} width={44}
            domain={[0, ceiling]}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
          />
          <Tooltip
            cursor={{ fill: 'rgba(232,81,31,0.05)', radius: 8 }}
            content={<ChartTooltip unit={unit} />}
          />
          {/* hatched headroom sits behind, drawn to the ceiling */}
          <Bar dataKey={() => ceiling} fill="url(#hatchFill)" radius={[7, 7, 7, 7]} isAnimationActive={false} />
          <Bar
            dataKey={dataKey}
            radius={[7, 7, 7, 7]}
            isAnimationActive={!reduce}
            animationDuration={950}
            animationEasing="ease-out"
          >
            {data.map((d, i) => {
              const isFocus = highlightKey ? d[xKey] === highlightKey : false;
              const active = hover === i;
              return (
                <Cell
                  key={i}
                  fill={isFocus || active ? '#E8511F' : '#CFE8D2'}
                  style={{ transition: 'fill 220ms cubic-bezier(0.16,1,0.3,1)' }}
                />
              );
            })}
          </Bar>
          <defs>
            <pattern id="hatchFill" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
              <rect width="7" height="7" fill="transparent" />
              <line x1="0" y1="0" x2="0" y2="7" stroke="#C3CEF2" strokeWidth="1.5" />
            </pattern>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Area trend ───────────────────────────────────────────────────────────
   Single-series area, so no legend (the title names it). Crosshair + tooltip. */
export function TrendArea({ data, dataKey = 'value', xKey = 'label', height = 210, color = '#E8511F', formatter, unit = '' }) {
  const reduce = useReducedMotion();
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 14, right: 10, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="areaFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.26" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="2 5" />
          <XAxis dataKey={xKey} axisLine={false} tickLine={false} dy={6} />
          <YAxis
            axisLine={false} tickLine={false} width={44}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
          />
          <Tooltip
            cursor={{ stroke: color, strokeWidth: 1.5, strokeDasharray: '3 3' }}
            content={<ChartTooltip formatter={formatter} unit={unit} />}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill="url(#areaFade)"
            isAnimationActive={!reduce}
            animationDuration={1200}
            animationEasing="ease-out"
            activeDot={{ r: 5, strokeWidth: 2, stroke: '#FCFBF7' }}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Funnel / ladder bars ─────────────────────────────────────────────────
   Horizontal magnitude comparison with a direct value label on every row —
   the secondary encoding that keeps near-floor hue pairs legal.

   `scale="log"` is for series spanning orders of magnitude, where a linear
   bar would render the small rows as invisible slivers. Bar LENGTH is then
   only a rough cue — the printed figure is the real comparison — so the
   caller must surface a note saying so. Never use log for a part-to-whole. */
export function FunnelBars({ steps = [], scale = 'linear', loading = false }) {
  const reduce = useReducedMotion();
  const max = Math.max(...steps.map(s => s.value), 1);
  const logMax = Math.log10(max + 1) || 1;

  return (
    <div className="space-y-3.5">
      {steps.map((s, i) => {
        const pct = loading
          ? 0
          : scale === 'log'
            ? Math.max(6, (Math.log10(s.value + 1) / logMax) * 100)
            : (s.value / max) * 100;
        return (
          <div key={s.label} className="group">
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-body-sm font-medium text-ink-2">{s.label}</span>
              <span className="shrink-0 text-body-sm font-semibold text-ink tabular">
                {loading ? (
                  <ValuePlaceholder sample="00,000" />
                ) : (
                  <>
                    {s.value.toLocaleString('en-IN')}
                    {s.pct != null && <span className="ml-1.5 text-label-xs text-ink-3">{s.pct}%</span>}
                  </>
                )}
              </span>
            </div>
            {loading ? (
              <TrackPlaceholder width={[74, 52, 88][i % 3]} delay={i * 0.16} />
            ) : (
              <div className="track">
                <motion.div
                  className="h-full rounded-pill"
                  style={{ background: s.color || CAT[i % CAT.length] }}
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.09 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Radial progress ──────────────────────────────────────────────────────
   Single-value completion dial with the figure in the middle. */
export function RadialProgress({ value = 0, size = 140, color = '#E8511F', label, sublabel, loading = false }) {
  const reduce = useReducedMotion();
  const data = [{ name: label || 'value', value: loading ? 0 : Math.max(0, Math.min(100, value)) }];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={data}
          innerRadius="70%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
          barSize={11}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: '#F1EEE4' }}
            dataKey="value"
            cornerRadius={999}
            fill={color}
            isAnimationActive={!reduce}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-metric-sm text-ink tabular">
          {loading ? <ValuePlaceholder sample="00" /> : `${Math.round(value)}%`}
        </span>
        {sublabel && <span className="mt-0.5 text-label-xs uppercase text-ink-3">{sublabel}</span>}
      </div>
    </div>
  );
}
