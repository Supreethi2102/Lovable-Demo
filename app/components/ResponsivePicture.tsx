import React, { useEffect, useRef, useState } from 'react';
import { encodeAssetUrl, isRasterImageSources, type PublicationImage } from '../utils/imageFormats';
import './ResponsivePicture.css';

type ResponsivePictureProps = {
  image: PublicationImage;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
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
  fetchPriority,
  decorative = false,
  fallbackAlt = '',
  width,
  height,
}) => {
  const alt = decorative ? '' : isRasterImageSources(image) ? image.alt : fallbackAlt;
  const imgRef = useRef<HTMLImageElement>(null);
  const eager = loading === 'eager';
  const [ready, setReady] = useState(eager);
  const markReady = () => setReady(true);

  useEffect(() => {
    const node = imgRef.current;
    if (node?.complete && node.naturalWidth > 0) setReady(true);
  }, [image]);

  const imgClass = [
    className,
    'responsive-picture__img',
    ready ? 'responsive-picture__img--ready' : 'responsive-picture__img--pending',
  ]
    .filter(Boolean)
    .join(' ');

  const imgProps = {
    ref: imgRef,
    alt,
    className: imgClass,
    loading,
    decoding: 'async' as const,
    fetchPriority: fetchPriority ?? (eager ? 'high' : 'auto'),
    width,
    height,
    onLoad: markReady,
    'aria-hidden': decorative ? true : undefined,
  };

  if (!isRasterImageSources(image)) {
    return <img {...imgProps} src={encodeAssetUrl(image)} />;
  }

  return (
    <picture>
      <source type="image/avif" srcSet={encodeAssetUrl(image.avif)} />
      <img {...imgProps} src={encodeAssetUrl(image.webp)} />
    </picture>
  );
};
