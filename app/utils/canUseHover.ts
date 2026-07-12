/** True only on desktop with a real hover pointer — never on mobile/tablet. */
export function canUseHover(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(min-width: 1025px)').matches &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
}
