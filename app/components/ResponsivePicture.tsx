import React from 'react';
import { isRasterImageSources, type PublicationImage } from '../utils/imageFormats';

type ResponsivePictureProps = {
  image: PublicationImage;
  className?: string;
  loading?: 'lazy' | 'eager';
  /** Thumbnails and decorative repeats — empty alt + aria-hidden */
  decorative?: boolean;
  fallbackAlt?: string;
  width?: number;
  height?: number;
};

export const ResponsivePicture: React.FC<ResponsivePictureProps> = ({
  image,
  className,
  loading = 'lazy',
  decorative = false,
  fallbackAlt = '',
  width,
  height,
}) => {
  const alt = decorative ? '' : isRasterImageSources(image) ? image.alt : fallbackAlt;

  if (!isRasterImageSources(image)) {
    return (
      <img
        src={image}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        width={width}
        height={height}
        aria-hidden={decorative ? true : undefined}
      />
    );
  }

  return (
    <picture>
      <source type="image/avif" srcSet={image.avif} />
      <img
        src={image.webp}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        width={width}
        height={height}
        aria-hidden={decorative ? true : undefined}
      />
    </picture>
  );
};
