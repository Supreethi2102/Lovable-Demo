import { encodeAssetUrl } from './imageFormats';

/**
 * Resolves once the image is decoded and safe to paint, so callers can swap views
 * without the browser showing a half-loaded frame. Always resolves: a failed or slow
 * image must never block the UI, so errors and the timeout fall through quietly.
 */
export function preloadImage(src: string, timeoutMs = 3000): Promise<void> {
  if (typeof window === 'undefined' || !src || src.startsWith('data:')) {
    return Promise.resolve();
  }

  const img = new Image();
  img.src = encodeAssetUrl(src);

  const decoded = img.decode
    ? img.decode().catch(() => undefined)
    : new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });

  const timeout = new Promise<void>((resolve) => {
    window.setTimeout(resolve, timeoutMs);
  });

  return Promise.race([decoded, timeout]).then(() => undefined);
}

/** Warm the HTTP cache without blocking render. */
export function preloadImages(
  urls: Array<string | undefined | null>,
  priority: 'high' | 'low' = 'low',
): void {
  if (typeof window === 'undefined') return;

  const seen = new Set<string>();
  for (const raw of urls) {
    if (!raw || raw.startsWith('data:')) continue;
    const src = encodeAssetUrl(raw);
    if (seen.has(src)) continue;
    seen.add(src);

    const img = new Image();
    img.decoding = 'async';
    if ('fetchPriority' in img) {
      (img as HTMLImageElement & { fetchPriority: string }).fetchPriority = priority;
    }
    img.src = src;
  }
}

/** Start fetching as soon as `target` is within `rootMargin` of the viewport. */
export function preloadImagesWhenNear(
  target: Element | null,
  urls: Array<string | undefined | null>,
  rootMargin = '1200px',
): () => void {
  const run = () => preloadImages(urls);
  if (typeof window === 'undefined') return () => undefined;

  if (!target || typeof IntersectionObserver === 'undefined') {
    run();
    return () => undefined;
  }

  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      run();
      io.disconnect();
    },
    { rootMargin },
  );
  io.observe(target);
  return () => io.disconnect();
}
