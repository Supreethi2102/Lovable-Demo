import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Info } from '@phosphor-icons/react';
import { getSwatchColorValues } from '../../data/swatchColorValues';
import { canUseHover } from '../../utils/canUseHover';
import './GravityPlayground.css';

export interface SwatchCardMood {
  description: string;
  contrastColor: string;
  idealMatchHex: string;
  idealMatchName: string;
  contrastRatio: string;
  contrastRating: string;
}

interface SwatchCardProps {
  id: string;
  color: string;
  hex: string;
  name: string;
  mood: SwatchCardMood;
  isFlipped: boolean;
  onToggle: () => void;
  interactive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

type TooltipAnchor = 'front' | 'back';

export const SwatchCard: React.FC<SwatchCardProps> = ({
  id,
  color,
  hex,
  name,
  mood,
  isFlipped,
  onToggle,
  interactive = true,
  style,
  className = '',
}) => {
  const colorValues = getSwatchColorValues(name);
  const tooltipId = useId();
  const frontInfoRef = useRef<HTMLButtonElement>(null);
  const backInfoRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
  const [activeAnchor, setActiveAnchor] = useState<TooltipAnchor>('front');

  const cardClassName = `gp-swatch${isFlipped ? ' gp-swatch--flipped' : ''}${className ? ` ${className}` : ''}`;

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current != null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const updateTooltipPosition = useCallback((anchor: TooltipAnchor = activeAnchor) => {
    const btn = anchor === 'back' ? backInfoRef.current : frontInfoRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setTooltipPos({
      top: rect.top,
      left: rect.left + rect.width / 2,
    });
  }, [activeAnchor]);

  const openTooltip = useCallback((anchor: TooltipAnchor) => {
    if (!colorValues) return;
    clearCloseTimer();
    setActiveAnchor(anchor);
    setTooltipOpen(true);
    requestAnimationFrame(() => {
      const btn = anchor === 'back' ? backInfoRef.current : frontInfoRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      setTooltipPos({
        top: rect.top,
        left: rect.left + rect.width / 2,
      });
    });
  }, [colorValues, clearCloseTimer]);

  const closeTooltip = useCallback(() => {
    clearCloseTimer();
    setTooltipOpen(false);
  }, [clearCloseTimer]);

  const scheduleCloseTooltip = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setTooltipOpen(false);
      closeTimerRef.current = null;
    }, 120);
  }, [clearCloseTimer]);

  useEffect(() => {
    if (!tooltipOpen) return;

    const onScrollOrResize = () => updateTooltipPosition();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (frontInfoRef.current?.contains(target)) return;
      if (backInfoRef.current?.contains(target)) return;
      if (tooltipRef.current?.contains(target)) return;
      closeTooltip();
    };

    document.addEventListener('pointerdown', onPointerDown);

    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [tooltipOpen, updateTooltipPosition, closeTooltip]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  useEffect(() => {
    if (tooltipOpen) updateTooltipPosition(isFlipped ? 'back' : 'front');
  }, [isFlipped, tooltipOpen, updateTooltipPosition]);

  const handleInfoClick = (e: React.MouseEvent, anchor: TooltipAnchor) => {
    e.stopPropagation();
    if (!interactive || !colorValues) return;
    // Desktop: hover shows tooltip; click should not flip the card
    if (canUseHover()) return;
    if (tooltipOpen && activeAnchor === anchor) {
      closeTooltip();
    } else {
      openTooltip(anchor);
    }
  };

  const infoButton = (anchor: TooltipAnchor) => (
    <button
      ref={anchor === 'front' ? frontInfoRef : backInfoRef}
      type="button"
      className="gp-swatch__info-btn"
      aria-label={`Colour values for ${name}`}
      aria-describedby={tooltipOpen && activeAnchor === anchor ? tooltipId : undefined}
      aria-expanded={tooltipOpen && activeAnchor === anchor}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onMouseEnter={() => {
        if (canUseHover()) openTooltip(anchor);
      }}
      onMouseLeave={() => {
        if (canUseHover()) scheduleCloseTooltip();
      }}
      onFocus={() => openTooltip(anchor)}
      onBlur={() => {
        if (canUseHover()) scheduleCloseTooltip();
      }}
      onClick={(e) => handleInfoClick(e, anchor)}
      disabled={!interactive || !colorValues}
    >
      <Info size={16} weight="regular" color="#7150E5" className="gp-swatch__info-icon" aria-hidden="true" />
    </button>
  );

  const tooltip =
    tooltipOpen &&
    colorValues &&
    tooltipPos &&
    typeof document !== 'undefined' &&
    createPortal(
      <div
        ref={tooltipRef}
        id={tooltipId}
        role="tooltip"
        className="gp-swatch-tooltip"
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
        }}
        onMouseEnter={() => {
          if (canUseHover()) {
            clearCloseTimer();
            setTooltipOpen(true);
          }
        }}
        onMouseLeave={() => {
          if (canUseHover()) scheduleCloseTooltip();
        }}
      >
        <div className="gp-swatch-tooltip__content">
          <p className="gp-swatch-tooltip__line">
            <span className="gp-swatch-tooltip__label">RGB</span>{' '}
            <span className="gp-swatch-tooltip__value">{colorValues.rgb}</span>
          </p>
          <p className="gp-swatch-tooltip__line">
            <span className="gp-swatch-tooltip__label">CMYK</span>{' '}
            <span className="gp-swatch-tooltip__value">{colorValues.cmyk}</span>
          </p>
          <p className="gp-swatch-tooltip__line">
            <span className="gp-swatch-tooltip__label">HSL</span>{' '}
            <span className="gp-swatch-tooltip__value">{colorValues.hsl}</span>
          </p>
        </div>
        <img
          className="gp-swatch-tooltip__caret"
          src="/icons/swatch-tooltip-caret.svg"
          alt=""
          width={16}
          height={8}
          aria-hidden="true"
        />
      </div>,
      document.body,
    );

  return (
    <div className={cardClassName} style={style} data-swatch-id={id}>
      <div className="gp-swatch__face">
        <div className="gp-swatch__body">
          <div className="gp-swatch__viewport">
            <div className="gp-swatch__track">
              <div className="gp-swatch__panel gp-swatch__panel--front">
                <div className="gp-swatch__color" style={{ backgroundColor: color }} />
                <div className="gp-swatch__content">
                  <div className="gp-swatch__text">
                    <p className="gp-swatch__name">{name}</p>
                    <div className="gp-swatch__hex-row">
                      <span className="gp-swatch__hex">{hex}</span>
                      {infoButton('front')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="gp-swatch__panel gp-swatch__panel--back">
                <div className="gp-swatch__back-inner">
                  <div className="gp-swatch__text gp-swatch__text--back-header">
                    <p className="gp-swatch__name">{name}</p>
                    <div className="gp-swatch__hex-row">
                      <span className="gp-swatch__hex">{hex}</span>
                      {infoButton('back')}
                    </div>
                  </div>
                  <div
                    className="gp-swatch__back-scroll"
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <p className="gp-swatch__description">{mood.description}</p>
                    <div className="gp-swatch__contrast-bar" aria-hidden="true">
                      <span className="gp-swatch__contrast-left" style={{ backgroundColor: color }} />
                      <span className="gp-swatch__contrast-divider" />
                      <span className="gp-swatch__contrast-right" style={{ backgroundColor: mood.contrastColor }} />
                    </div>
                    <div className="gp-swatch__ideal">
                      <p className="gp-swatch__ideal-line">
                        <span className="gp-swatch__ideal-label">My ideal match: </span>
                        <span className="gp-swatch__ideal-hex">{mood.idealMatchHex}</span>
                      </p>
                      <p className="gp-swatch__ideal-name">{mood.idealMatchName}</p>
                    </div>
                    <p className="gp-swatch__contrast-ratio">
                      Contrast: {mood.contrastRatio} - ({mood.contrastRating})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="gp-swatch__footer">
            <button
              type="button"
              className="gp-swatch__link gp-swatch__cta"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                if (interactive) onToggle();
              }}
              aria-label={`${isFlipped ? 'Hide' : 'View'} colour mood for ${name}`}
              disabled={!interactive}
            >
              {isFlipped ? 'Hide colour mood' : 'View colour mood'}
            </button>
          </div>
        </div>
      </div>
      {tooltip}
    </div>
  );
};
