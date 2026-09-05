/**
 * VALIDATED CATEGORICAL PALETTE
 *
 * Produced by the dataviz skill's validate_palette.js. Both modes pass all six
 * checks (lightness band, chroma floor, CVD separation, normal-vision floor,
 * contrast vs surface) against their respective surfaces.
 *
 *   light  surface #FCFBF7 → ALL CHECKS PASS
 *   dark   surface #17160F → ALL CHECKS PASS
 *
 * Assign in fixed order, never cycled. Do NOT substitute values by eye: the
 * gold↔green pair sits near the tritan floor and is only legal because every
 * chart using it also carries direct value labels.
 */
export const CAT = ['#E8511F', '#2F6FA8', '#3E9B72', '#B8891B', '#8C5BC4'];

export const CAT_DARK = ['#E4552B', '#4785BE', '#38996F', '#B07F1E', '#8F66C4'];
