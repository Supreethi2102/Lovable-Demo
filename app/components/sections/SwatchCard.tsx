import React from 'react';
import { Info } from '@phosphor-icons/react';

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
  const cardClassName = `gp-swatch${isFlipped ? ' gp-swatch--flipped' : ''}${className ? ` ${className}` : ''}`;

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
                      <button
                        type="button"
                        className="gp-swatch__info-btn"
                        aria-label={`${isFlipped ? 'Hide' : 'Show'} colour mood for ${name}`}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (interactive) onToggle();
                        }}
                        disabled={!interactive}
                      >
                        <Info size={16} weight="regular" color="#7150E5" className="gp-swatch__info-icon" aria-hidden="true" />
                      </button>
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
                      <button
                        type="button"
                        className="gp-swatch__info-btn"
                        aria-label={`${isFlipped ? 'Hide' : 'Show'} colour mood for ${name}`}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (interactive) onToggle();
                        }}
                        disabled={!interactive}
                      >
                        <Info size={16} weight="regular" color="#7150E5" className="gp-swatch__info-icon" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
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
    </div>
  );
};
