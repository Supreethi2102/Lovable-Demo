import React from 'react';
import { GravityPlayground } from './GravityPlayground';
import { SiteFooter } from './SiteFooter';
import './ColorSwatches.css';

export const ColorSwatches: React.FC = () => {
  return (
    <section className="color-swatches" aria-label="Interactive color swatches">
      {/* Header - Instructions */}
      <header className="color-swatches__header">
        <div className="color-swatches__icons" aria-hidden="true">
          <img src="/icons/HandSwipeLeft.svg" alt="" className="color-swatches__icon" />
          <img src="/icons/HandGrabbing.svg" alt="" className="color-swatches__icon" />
          <img src="/icons/HandSwipeRight.svg" alt="" className="color-swatches__icon" />
        </div>
        <p className="color-swatches__text">
          Tap, click, or drag the colour swatches to discover my travel colour moods
        </p>
      </header>

      {/* Physics Animation Canvas */}
      <div 
        className="color-swatches__canvas-wrapper"
        role="region"
        aria-label="Interactive color playground - drag swatches to explore"
      >
        <GravityPlayground />
      </div>

      <SiteFooter />
    </section>
  );
};
