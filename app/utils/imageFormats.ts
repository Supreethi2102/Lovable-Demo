export type RasterImageSources = {
  avif: string;
  webp: string;
  alt: string;
};

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
