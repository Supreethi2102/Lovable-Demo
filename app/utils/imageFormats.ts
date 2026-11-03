export type RasterImageSources = {
  avif: string;
  webp: string;
  alt: string;
  /**
   * Stage crop zoom for publication detail (1 = no extra zoom).
   * Tight 3D mockups ≈ 1.0; airy stills with studio margin ≈ 1.08–1.15.
   */
  frameZoom?: number;
};

/** Encode a public asset path once, even if it is already percent-encoded. */
export function encodeAssetUrl(path: string): string {
  try {
    return encodeURI(decodeURI(path));
  } catch {
    return encodeURI(path);
  }
}

export type PublicationImage = string | RasterImageSources;

export function isRasterImageSources(value: PublicationImage): value is RasterImageSources {
  return typeof value === 'object' && value !== null && 'avif' in value && 'webp' in value;
}

/** Resolve a display path for legacy string-only callers (prefers webp when modern pair exists). */
export function publicationImageSrc(image: PublicationImage): string {
  return isRasterImageSources(image) ? image.webp : image;
}

export function publicationImageAlt(image: PublicationImage, fallback: string): string {
  return isRasterImageSources(image) ? image.alt : fallback;
}

/** Per-image frame zoom; falls back to the CSS default when unset. */
export function publicationImageFrameZoom(image: PublicationImage | undefined, fallback = 1): number {
  if (image && isRasterImageSources(image) && typeof image.frameZoom === 'number') {
    return image.frameZoom;
  }
  return fallback;
}
