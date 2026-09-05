import { Metric, RupeeMetric, Delta } from '../motion/Metric';
import { ValuePlaceholder } from '../motion/Placeholder';
import { Lift } from '../motion/primitives';
import { CapacityBars, DotMatrix, RadialGauge, Sparkline, PulseDot } from '../viz/micro';

/**
 * KPI CARD
 *
 * A number is never alone: every card pairs its figure with a micro-visual
 * encoding the same fact. `viz` picks which one rides along.
 *
 * While `loading`, the chrome (label, icon, caption) renders exactly as it
 * will when loaded — only the figure and the micro-viz are withheld. Nothing
 * moves when the data arrives.
 */
export function KpiCard({
  label,
  value,
  paisa,
  delta,
  deltaInvert = false,
  caption = 'vs last month',
  suffix,
  viz = 'spark',
  vizProps = {},
  accent = false,
  live = false,
  loading = false,
  onAction,
}) {
  const isMoney = paisa !== undefined;

  return (
    <Lift className="h-full">
      <article
        className={`card card-pad group h-full ${accent ? 'card-ember' : ''}`}
        aria-label={label}
      >
        <header className="mb-3 flex items-start justify-between gap-2 sm:mb-4">
          <h3 className={`text-label uppercase ${accent ? 'text-white/70' : 'text-ink-3'}`}>
            <span className="inline-flex items-center gap-1.5">
              {live && !loading && <PulseDot color={accent ? 'bg-white' : 'bg-good'} />}
              {label}
            </span>
          </h3>
          <button
            type="button"
            onClick={onAction}
            aria-label={`Open ${label} detail`}
            className={`ghost-action shrink-0 ${
              accent ? 'bg-white/15 text-white hover:bg-white hover:text-ember' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
          </button>
        </header>

        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            {loading ? (
              <div className="font-display text-metric">
                <ValuePlaceholder sample={isMoney ? "₹00,000" : "0,000"} />
              </div>
            ) : isMoney ? (
              <RupeeMetric paisa={paisa} className={accent ? '!text-white' : ''} />
            ) : (
              <Metric value={value} suffix={suffix} className={accent ? '!text-white' : ''} />
            )}

            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className={`text-label-xs ${accent ? 'text-white/60' : 'text-ink-3'}`}>
                {caption}
              </span>
              {!loading && delta !== null && delta !== undefined && (
                <Delta value={delta} invert={deltaInvert} />
              )}
            </div>
          </div>

          {/* Micro-viz is decorative; hidden on the narrowest screens where the
              figure needs the full card width. */}
          {!loading && (
            <div className="hidden shrink-0 opacity-95 xs:block">
              {viz === 'bars' && <CapacityBars {...vizProps} />}
              {viz === 'dots' && <DotMatrix {...vizProps} />}
              {viz === 'gauge' && <RadialGauge {...vizProps} />}
              {viz === 'spark' && <Sparkline {...vizProps} />}
            </div>
          )}
        </div>
      </article>
    </Lift>
  );
}
