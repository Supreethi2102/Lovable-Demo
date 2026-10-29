import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, MagnifyingGlass } from '@phosphor-icons/react';
import { ResponsivePicture } from './ResponsivePicture';
import { isRasterImageSources, type PublicationImage } from '../utils/imageFormats';
import './CaseStudyEnlarge.css';

type EnlargeItem = {
  image: PublicationImage;
  alt: string;
};

type EnlargeContextValue = {
  open: (item: EnlargeItem, trigger: HTMLElement) => void;
};

const EnlargeContext = createContext<EnlargeContextValue | null>(null);

export function CaseStudyEnlargeProvider({ children }: { children: React.ReactNode }) {
  const [item, setItem] = useState<EnlargeItem | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const open = useCallback((next: EnlargeItem, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setItem(next);
  }, []);

  const close = useCallback(() => setItem(null), []);

  useEffect(() => {
    if (!item) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [item, close]);

  return (
    <EnlargeContext.Provider value={{ open }}>
      {children}
      {item
        ? createPortal(
            <div
              className="case-study-enlarge-dialog"
              role="dialog"
              aria-modal="true"
              aria-label={item.alt}
            >
              <div className="case-study-enlarge-dialog__bar">
                <button
                  ref={closeRef}
                  type="button"
                  className="case-study-enlarge-dialog__back"
                  onClick={close}
                >
                  <ArrowLeft size={24} weight="regular" color="currentColor" aria-hidden="true" />
                  <span>Back</span>
                </button>
              </div>
              <div
                className="case-study-enlarge-dialog__stage"
                onClick={close}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') close();
                }}
                role="presentation"
              >
                <div
                  className="case-study-enlarge-dialog__frame"
                  onClick={(event) => event.stopPropagation()}
                >
                  {isRasterImageSources(item.image) ? (
                    <ResponsivePicture
                      image={item.image}
                      className="case-study-enlarge-dialog__image"
                      loading="eager"
                      fallbackAlt={item.alt}
                    />
                  ) : (
                    <img
                      src={encodeURI(item.image)}
                      alt={item.alt}
                      className="case-study-enlarge-dialog__image"
                    />
                  )}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </EnlargeContext.Provider>
  );
}

type EnlargeTriggerProps = {
  image: PublicationImage;
  alt?: string;
};

export function EnlargeTrigger({ image, alt }: EnlargeTriggerProps) {
  const ctx = useContext(EnlargeContext);
  if (!ctx) return null;

  const label = alt || (isRasterImageSources(image) ? image.alt : 'Image');

  return (
    <button
      type="button"
      className="case-study-enlarge__hit"
      aria-label={`View larger. ${label}`}
      onClick={(event) => {
        event.stopPropagation();
        ctx.open({ image, alt: label }, event.currentTarget);
      }}
    >
      <span className="case-study-enlarge__cue" aria-hidden="true">
        <MagnifyingGlass size={16} weight="regular" color="currentColor" />
        <span className="case-study-enlarge__cue-label">View larger</span>
      </span>
    </button>
  );
}
