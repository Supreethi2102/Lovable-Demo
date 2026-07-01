import React, { useEffect, useState } from 'react';
import './Footer.css';

const TABLET_MAX_WIDTH_PX = 1024;

export const Footer: React.FC = () => {
  const [useTapVerb, setUseTapVerb] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia(`(max-width: ${TABLET_MAX_WIDTH_PX}px)`).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${TABLET_MAX_WIDTH_PX}px)`);
    const sync = () => setUseTapVerb(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const dragVerb = useTapVerb ? 'Tap and drag' : 'Click and drag';

  return (
    <aside className="footer" aria-label="Globe interaction instructions">
      <div className="footer__wrapper">
        <div className="footer__gestures" aria-hidden="true">
          <img src="/icons/HandSwipeLeft.svg" alt="" className="footer__gesture-icon" />
          <img src="/icons/HandGrabbing.svg" alt="" className="footer__gesture-icon" />
          <img src="/icons/HandSwipeRight.svg" alt="" className="footer__gesture-icon" />
        </div>

        <div className="footer__instruction">
          <p className="footer__text">
            <span className="footer__text-copy footer__text-copy--wide">
              <span className="footer__text-line">
                {dragVerb} the globe to explore the places that inspired each
              </span>
              <span className="footer__text-line"> project, or scroll for more</span>
            </span>
            <span className="footer__text-copy footer__text-copy--mobile">
              <span className="footer__text-line">
                {dragVerb} the globe to explore the places
              </span>
              <span className="footer__text-line"> that inspired each project, or scroll for more</span>
            </span>
            <span className="footer__text-copy footer__text-copy--narrow">
              <span className="footer__text-line">
                {dragVerb} the globe to explore the places that
              </span>
              <span className="footer__text-line"> inspired each project, or scroll for more</span>
            </span>
          </p>
          <button type="button" className="footer__link" aria-label="Reduce motion for accessibility">
            Reduce motion
          </button>
        </div>
      </div>
    </aside>
  );
};
