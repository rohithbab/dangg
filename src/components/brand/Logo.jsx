import planeWhite from '../../assets/brand/dangg-plane-white.png';
import wordmarkWhite from '../../assets/brand/dangg-wordmark-white.png';
import lockupWhite from '../../assets/brand/dangg-lockup-white.png';

/**
 * DANGG BRAND MARKS
 *
 * These use the ACTUAL brand artwork (extracted from the supplied kit with the
 * pink keyed out, cropped to the true glyph bounds). An earlier attempt to
 * hand-author SVG paths from pixel measurements produced letterforms that were
 * visibly wrong — the double-g ligature and the plane's wing geometry are too
 * distinctive to approximate. Real artwork, always.
 *
 *   <PlaneMark />  the paper-plane glyph — also the "a" inside the wordmark.
 *                  Square canvas, so it centres correctly inside a circle.
 *   <DanggLogo />  the full "Dangg · Talk with love" lockup.
 *
 * Both source images are WHITE on transparent, so they sit on the pink brand
 * ball or any dark panel. `tone="ink"` inverts them to near-black for use on
 * the cream canvas — done with a CSS filter so there is only one asset to ship.
 */

/* invert() turns the white artwork into near-black ink (#14140F ≈ 8% white). */
const INK_FILTER = 'invert(1) brightness(0.08)';

export function PlaneMark({ size = 24, tone = 'white', className = '', title }) {
  return (
    <img
      src={planeWhite}
      width={size}
      height={size}
      alt={title || ''}
      aria-hidden={title ? undefined : true}
      draggable="false"
      className={`select-none ${className}`}
      style={{
        filter: tone === 'ink' ? INK_FILTER : undefined,
        /* The source is a raster; keep it sharp when scaled down. */
        imageRendering: 'auto',
      }}
    />
  );
}

/**
 * Full wordmark lockup.
 * @param {number} height  rendered height in px (width follows the artwork)
 * @param {'white'|'ink'} tone
 */
export function DanggLogo({ height = 30, tone = 'white', tagline = false, className = '' }) {
  /* The tagline is baked into the artwork, so below ~40px it turns to mud —
     use the tagline-free wordmark at small sizes. */
  return (
    <img
      src={tagline ? lockupWhite : wordmarkWhite}
      style={{
        height,
        width: 'auto',
        filter: tone === 'ink' ? INK_FILTER : undefined,
      }}
      alt="Dangg"
      draggable="false"
      className={`select-none ${className}`}
    />
  );
}
