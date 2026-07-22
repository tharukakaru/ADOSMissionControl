/**
 * @module RedesignIcons
 * @description Hand-picked icons from the ARC OS icon export
 * (ARC_OS_icon (1).zip) that could be confidently matched to a specific
 * button by their SVG path shape (they're geometrically identical to the
 * lucide icon they replace, just redrawn/exported from Figma with the
 * exact redesign stroke color baked in).
 *
 * NOT all icons from the export are here — most of the 22 files have
 * generic names (Icon-7.svg, Vector.svg, etc.) with no way to tell which
 * UI element they belong to just from the path data. Swapping those in
 * blind risks putting the wrong icon on the wrong button. See GUIDE.md for
 * how to get the rest mapped in one pass.
 *
 * Each icon accepts a `size` and `className` like a lucide icon so it's a
 * drop-in replacement at the call site.
 * @license GPL-3.0-only
 */

interface IconProps {
  size?: number;
  className?: string;
}

/** Export/download icon — from Icon-10.svg (Simulate "Export" quick action). */
export function RedesignDownloadIcon({ size = 12, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className}>
      <path d="M10.5 7.5V9.5C10.5 9.76522 10.3946 10.0196 10.2071 10.2071C10.0196 10.3946 9.76522 10.5 9.5 10.5H2.5C2.23478 10.5 1.98043 10.3946 1.79289 10.2071C1.60536 10.0196 1.5 9.76522 1.5 9.5V7.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 5L6 7.5L8.5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 7.5V1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Plus icon — from Icon-11.svg (Simulate "Add to Planner" quick action). */
export function RedesignPlusIcon({ size = 12, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className}>
      <path d="M2.5 6H9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 2.5V9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Skip-forward icon — from Icon-16.svg (Simulate bottom-bar transport). */
export function RedesignSkipForwardIcon({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" className={className}>
      <path d="M3.125 2.5L9.375 7.5L3.125 12.5V2.5Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.875 3.125V11.875" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Skip-back icon — from Icon-18.svg (Simulate bottom-bar transport). */
export function RedesignSkipBackIcon({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" className={className}>
      <path d="M11.875 12.5L5.625 7.5L11.875 2.5V12.5Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.125 11.875V3.125" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
