import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, CaretLeft, CaretRight, ArrowLeft } from '@phosphor-icons/react';
import { getGalleryImages, getPublicationById, getPublicationCopy } from '../../data/publications';
import { ResponsivePicture } from '../ResponsivePicture';
import { isRasterImageSources, publicationImageAlt } from '../../utils/imageFormats';
import './PublicationDetail.css';

function clampIndex(n: number, len: number) {
  if (len <= 0) return 0;
  const mod = n % len;
  return mod < 0 ? mod + len : mod;
}

function renderParagraphs(text: string, keyPrefix: string) {
  return text
    .split(/\n\s*\n/g) // blank-line separated paragraphs
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim()) // normalize single newlines within a paragraph
    .filter(Boolean)
    .map((p, idx) => (
      <p key={`${keyPrefix}-${idx}`} className="publication-detail__paragraph">
        {p}
      </p>
    ));
}

export const PublicationDetail: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const id = Number(params.id);
  const thumbsScrollerRef = useRef<HTMLDivElement | null>(null);
  const viewLargerRef = useRef<HTMLButtonElement | null>(null);
  const enlargedDialogRef = useRef<HTMLDivElement | null>(null);

  const publication = useMemo(() => (Number.isFinite(id) ? getPublicationById(id) : undefined), [id]);
  const copy = useMemo(() => (publication ? getPublicationCopy(publication) : null), [publication]);

  const galleryImages = useMemo(() => (publication ? getGalleryImages(publication) : []), [publication]);
  const totalImages = galleryImages.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const isEnlargedFromUrl = searchParams.get('enlarged') === '1';

  const openEnlarged = () => {
    const next = new URLSearchParams(searchParams);
    next.set('enlarged', '1');
    setSearchParams(next, { replace: false });
  };

  const closeEnlarged = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('enlarged');
    setSearchParams(next, { replace: true });
  };

  // Sync modal state with URL, so browser Back closes enlarged view
  // instead of navigating away from the publication detail page.
  useEffect(() => {
    setIsEnlarged(isEnlargedFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnlargedFromUrl]);

  useEffect(() => {
    setActiveIndex(0);
  }, [id]);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [id]);

  // Fullscreen enlarged gallery: lock scroll + escape to close + restore focus.
  useEffect(() => {
    if (!isEnlarged) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the dialog for screen readers / keyboard.
    requestAnimationFrame(() => enlargedDialogRef.current?.focus());

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeEnlarged();
      if (e.key === 'ArrowLeft') setActiveIndex((v) => clampIndex(v - 1, Math.max(totalImages, 1)));
      if (e.key === 'ArrowRight') setActiveIndex((v) => clampIndex(v + 1, Math.max(totalImages, 1)));
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      viewLargerRef.current?.focus();
    };
  }, [isEnlarged, totalImages]);

  // Keep the active thumbnail fully visible in the bottom carousel (including wrap-around).
  useEffect(() => {
    const scroller = thumbsScrollerRef.current;
    if (!scroller) return;

    const active = scroller.querySelector<HTMLButtonElement>('.publication-detail__thumb.is-active');
    if (!active) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const edgePad = 8;
    const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const activeLeft = active.offsetLeft;
    const activeRight = activeLeft + active.offsetWidth;
    const viewLeft = scroller.scrollLeft;
    const viewRight = viewLeft + scroller.clientWidth;
    const lastIndex = Math.max(totalImages - 1, 0);

    let nextScroll = viewLeft;
    // Wrap-around: jump fully to the start/end so the highlight is never off-screen.
    if (activeIndex === 0) {
      nextScroll = 0;
    } else if (activeIndex === lastIndex) {
      nextScroll = maxScroll;
    } else if (activeLeft < viewLeft + edgePad) {
      nextScroll = Math.max(0, activeLeft - edgePad);
    } else if (activeRight > viewRight - edgePad) {
      nextScroll = Math.min(maxScroll, activeRight - scroller.clientWidth + edgePad);
    }

    if (Math.abs(nextScroll - viewLeft) < 1) return;

    // Large jumps (wrap) use instant scroll so scroll-snap can't stop mid-strip.
    const distance = Math.abs(nextScroll - viewLeft);
    const behavior: ScrollBehavior =
      prefersReducedMotion || distance > scroller.clientWidth ? 'auto' : 'smooth';

    scroller.scrollTo({ left: nextScroll, behavior });
  }, [activeIndex, galleryImages, totalImages]);

  useEffect(() => {
    if (!params.id) return;
    if (!Number.isFinite(id) || !publication) {
      navigate('/', { replace: true });
    }
  }, [id, navigate, params.id, publication]);

  const activeImage = useMemo(() => {
    const idx = clampIndex(activeIndex, galleryImages.length);
    return galleryImages[idx];
  }, [activeIndex, galleryImages]);

  const activeImageAlt = useMemo(() => {
    if (!publication || !activeImage) return '';
    if (isRasterImageSources(activeImage)) return activeImage.alt;
    return `${publication.title} image ${activeIndex + 1}`;
  }, [activeImage, activeIndex, publication]);

  const caption = useMemo(() => {
    const lowerSubtitle = (copy?.modalSubtitle ?? '').toLowerCase();
    const titleLower = (publication?.title ?? '').toLowerCase();
    if (!publication || !copy) return '';
    if (lowerSubtitle.includes('magazine') && !titleLower.includes('magazine')) return `${publication.title} magazine`;
    return publication.title;
  }, [copy, publication]);

  if (!publication || !copy) return null;

  const enlargedView = isEnlarged ? (
    <div
      className="publication-detail-enlarged__overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged photo gallery"
    >
      <div ref={enlargedDialogRef} className="publication-detail-enlarged__panel-inner" tabIndex={-1}>
        <div className="publication-detail-enlarged__stage-block">
          <div className="publication-detail-enlarged__toolbar">
            <div className="publication-detail__gallery-rail" aria-hidden="true" />
            <div className="publication-detail-enlarged__toolbar-inner">
              <button
                type="button"
                className="publication-detail-enlarged__back"
                onClick={closeEnlarged}
                aria-label="Back to publication"
              >
                <ArrowLeft size={24} weight="regular" color="#7150E5" aria-hidden="true" />
                <span>Back</span>
              </button>
              <div className="publication-detail-enlarged__counter" aria-live="polite" aria-atomic="true">
                <span>{activeIndex + 1}/</span>
                <strong>{Math.max(totalImages, 1)}</strong>
                <span className="publication-detail__counter-label">images</span>
              </div>
            </div>
            <div className="publication-detail__gallery-rail" aria-hidden="true" />
          </div>

          <div className="publication-detail-enlarged__carousel">
            <button
              type="button"
              className="publication-detail__nav publication-detail__nav--prev"
              aria-label="Previous image"
              onClick={() => setActiveIndex((v) => clampIndex(v - 1, Math.max(totalImages, 1)))}
            >
              <CaretLeft size={24} weight="regular" color="#7150E5" aria-hidden="true" />
            </button>

            <div className="publication-detail-enlarged__stage">
              {activeImage ? (
                <ResponsivePicture
                  image={activeImage}
                  className="publication-detail-enlarged__image"
                  loading="eager"
                  fallbackAlt={activeImageAlt}
                />
              ) : (
                <div className="publication-detail__image-placeholder" aria-hidden="true" />
              )}
            </div>

            <button
              type="button"
              className="publication-detail__nav publication-detail__nav--next"
              aria-label="Next image"
              onClick={() => setActiveIndex((v) => clampIndex(v + 1, Math.max(totalImages, 1)))}
            >
              <CaretRight size={24} weight="regular" color="#7150E5" aria-hidden="true" />
            </button>
          </div>

          <div className="publication-detail-enlarged__caption-row">
            <div className="publication-detail__gallery-rail" aria-hidden="true" />
            <div className="publication-detail-enlarged__caption">{caption}</div>
            <div className="publication-detail__gallery-rail" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <section className="publication-detail" aria-labelledby="publication-detail-title">
      {enlargedView ? createPortal(enlargedView, document.body) : null}

      <div className="publication-detail__inner">
        <div className="publication-detail__grid">
          <div className="publication-detail__content">
            <aside className="publication-detail__meta">
              <button
                type="button"
                className="publication-detail__back"
                onClick={() => navigate(-1)}
                aria-label="Go back"
              >
                <ArrowLeft size={24} weight="regular" color="#7150E5" aria-hidden="true" />
                <span>Back</span>
              </button>
              <header className="publication-detail__heading">
                <h1 id="publication-detail-title" className="publication-detail__title">
                  {publication.title}
                </h1>
                <p className="publication-detail__subtitle">{copy.modalSubtitle}</p>
              </header>

              <div className="publication-detail__copy">
                {renderParagraphs(copy.intro, 'intro')}
                {copy.bullets.length > 0 && (
                  <ul className="publication-detail__bullets">
                    {copy.bullets.map((b) => (
                      <li key={b} className="publication-detail__bullet">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {renderParagraphs(copy.conclusion, 'conclusion')}
              </div>

              {/* Listen button (commented out for future use) */}
              {/* <button
                type="button"
                className="publication-detail__listen"
                aria-label="Listen"
                onClick={() => {
                  // Placeholder interaction (no audio file yet).
                }}
              >
                <span className="publication-detail__listen-icon" aria-hidden="true">
                  <SpeakerHigh size={24} weight="regular" color="#7150E5" />
                </span>
                <span className="publication-detail__listen-bottom" aria-hidden="true">
                  <span className="publication-detail__listen-label">Listen</span>
                </span>
              </button> */}
            </aside>
          </div>

          <div className="publication-detail__gallery" aria-label="Publication image gallery">
            <div className="publication-detail__carousel">
              <button
                type="button"
                className="publication-detail__nav publication-detail__nav--prev"
                aria-label="Previous image"
                onClick={() => setActiveIndex((v) => clampIndex(v - 1, Math.max(totalImages, 1)))}
              >
                <CaretLeft size={24} weight="regular" color="#7150E5" aria-hidden="true" />
              </button>

              <button
                type="button"
                className="publication-detail__stage"
                onClick={openEnlarged}
                aria-label={activeImageAlt ? `View larger, ${activeImageAlt}` : 'View larger'}
              >
                {activeImage ? (
                  <ResponsivePicture
                    image={activeImage}
                    className="publication-detail__image"
                    loading={activeIndex === 0 ? 'eager' : 'lazy'}
                    fallbackAlt={activeImageAlt}
                  />
                ) : (
                  <div className="publication-detail__image-placeholder" aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                className="publication-detail__nav publication-detail__nav--next"
                aria-label="Next image"
                onClick={() => setActiveIndex((v) => clampIndex(v + 1, Math.max(totalImages, 1)))}
              >
                <CaretRight size={24} weight="regular" color="#7150E5" aria-hidden="true" />
              </button>
            </div>

            <div className="publication-detail__gallery-meta">
              <div className="publication-detail__gallery-rail" aria-hidden="true" />
              <div className="publication-detail__gallery-meta-inner">
                <div className="publication-detail__counter" aria-live="polite" aria-atomic="true">
                  <div className="publication-detail__counter-text">
                    <span>{activeIndex + 1}/</span>
                    <strong>{Math.max(totalImages, 1)}</strong>
                    <span className="publication-detail__counter-label">images</span>
                  </div>
                </div>
                <button
                  type="button"
                  ref={viewLargerRef}
                  className="publication-detail__view-larger"
                  onClick={openEnlarged}
                >
                  View larger
                  <ArrowUpRight size={16} weight="regular" color="currentColor" aria-hidden="true" />
                </button>
              </div>
              <div className="publication-detail__gallery-rail" aria-hidden="true" />
            </div>

            <div className="publication-detail__thumbs-row">
              <div className="publication-detail__gallery-rail" aria-hidden="true" />
              <div className="publication-detail__thumbs-wrap" aria-label="Image thumbnails">
                <div className="publication-detail__thumbs-clip">
                  <div
                    ref={thumbsScrollerRef}
                    className="publication-detail__thumbs"
                    role="list"
                  >
                    {Array.from({ length: Math.max(totalImages, 1) }).map((_, idx) => {
                      const isActive = idx === clampIndex(activeIndex, Math.max(totalImages, 1));
                      const thumbImage = galleryImages[idx];
                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`publication-detail__thumb ${isActive ? 'is-active' : ''}`}
                          onClick={() => setActiveIndex(idx)}
                          aria-label={`View image ${idx + 1}`}
                          aria-current={isActive ? 'true' : undefined}
                          role="listitem"
                        >
                          {thumbImage ? (
                            <ResponsivePicture
                              image={thumbImage}
                              className="publication-detail__thumb-img"
                              decorative
                              loading="lazy"
                              fallbackAlt={`${publication.title} thumbnail ${idx + 1}`}
                            />
                          ) : (
                            <span className="publication-detail__thumb-placeholder" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="publication-detail__gallery-rail" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

