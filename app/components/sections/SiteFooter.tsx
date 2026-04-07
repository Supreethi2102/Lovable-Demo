import React, { useEffect, useRef, useState } from 'react';
import { Cookie, Leaf, LinkedinLogo, PersonSimpleCircle, X } from '@phosphor-icons/react';
import './ColorSwatches.css';

export const SiteFooter: React.FC = () => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [sustainabilityOpen, setSustainabilityOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [privacyCookiesOpen, setPrivacyCookiesOpen] = useState(false);
  const [motionOn, setMotionOn] = useState(true);
  const sustainabilityBtnRef = useRef<HTMLButtonElement>(null);
  const sustainabilityCloseRef = useRef<HTMLButtonElement>(null);
  const accessibilityBtnRef = useRef<HTMLButtonElement>(null);
  const accessibilityCloseRef = useRef<HTMLButtonElement>(null);
  const privacyCookiesBtnRef = useRef<HTMLButtonElement>(null);
  const privacyCookiesCloseRef = useRef<HTMLButtonElement>(null);

  const closeSustainability = () => {
    setSustainabilityOpen(false);
    requestAnimationFrame(() => sustainabilityBtnRef.current?.focus());
  };

  const closeAccessibility = () => {
    setAccessibilityOpen(false);
    requestAnimationFrame(() => accessibilityBtnRef.current?.focus());
  };

  const closePrivacyCookies = () => {
    setPrivacyCookiesOpen(false);
    requestAnimationFrame(() => privacyCookiesBtnRef.current?.focus());
  };

  useEffect(() => {
    if (!sustainabilityOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSustainability();
    };
    document.addEventListener('keydown', onKeyDown);
    sustainabilityCloseRef.current?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [sustainabilityOpen]);

  useEffect(() => {
    if (!accessibilityOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAccessibility();
    };
    document.addEventListener('keydown', onKeyDown);
    accessibilityCloseRef.current?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [accessibilityOpen]);

  useEffect(() => {
    if (!privacyCookiesOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePrivacyCookies();
    };
    document.addEventListener('keydown', onKeyDown);
    privacyCookiesCloseRef.current?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [privacyCookiesOpen]);

  return (
    <>
      <footer className="site-footer" role="contentinfo">
        <div className="site-footer__inner">
          <div className="site-footer__left">
            <img src="/icons/Brand logo.svg" alt="Samantha Jane Smith logo" className="site-footer__logo" />
            <small className="site-footer__copyright">© 2026 Samantha Jane Smith, All rights reserved.</small>
          </div>
          <nav className="site-footer__right" aria-label="Footer navigation">
            <button
              ref={sustainabilityBtnRef}
              type="button"
              className={`site-footer__link ${hoveredLink === 'sustainability' ? 'site-footer__link--hovered' : ''}`}
              onMouseEnter={() => setHoveredLink('sustainability')}
              onMouseLeave={() => setHoveredLink(null)}
              onClick={() => setSustainabilityOpen(true)}
              aria-expanded={sustainabilityOpen}
              aria-haspopup="dialog"
              aria-label="Open Sustainability information"
            >
              <Leaf
                size={24}
                weight={hoveredLink === 'sustainability' ? 'fill' : 'regular'}
                color={hoveredLink === 'sustainability' ? '#7150E5' : '#3C3F43'}
                aria-hidden="true"
              />
              <span>Sustainability</span>
            </button>
            <button
              ref={privacyCookiesBtnRef}
              type="button"
              className={`site-footer__link ${hoveredLink === 'privacy' ? 'site-footer__link--hovered' : ''}`}
              onMouseEnter={() => setHoveredLink('privacy')}
              onMouseLeave={() => setHoveredLink(null)}
              onClick={() => setPrivacyCookiesOpen(true)}
              aria-expanded={privacyCookiesOpen}
              aria-haspopup="dialog"
              aria-label="Open Privacy and cookies information"
            >
              <Cookie
                size={24}
                weight={hoveredLink === 'privacy' ? 'fill' : 'regular'}
                color={hoveredLink === 'privacy' ? '#7150E5' : '#3C3F43'}
                aria-hidden="true"
              />
              <span>Privacy and cookies</span>
            </button>
            <button
              ref={accessibilityBtnRef}
              type="button"
              className={`site-footer__link ${hoveredLink === 'accessibility' ? 'site-footer__link--hovered' : ''}`}
              onMouseEnter={() => setHoveredLink('accessibility')}
              onMouseLeave={() => setHoveredLink(null)}
              onClick={() => setAccessibilityOpen(true)}
              aria-expanded={accessibilityOpen}
              aria-haspopup="dialog"
              aria-label="Open Accessibility information"
            >
              <PersonSimpleCircle
                size={24}
                weight={hoveredLink === 'accessibility' ? 'fill' : 'regular'}
                color={hoveredLink === 'accessibility' ? '#7150E5' : '#3C3F43'}
                aria-hidden="true"
              />
              <span>Accessibility</span>
            </button>
            <a
              href="https://www.linkedin.com/in/samanthajsmith-nz/"
              target="_blank"
              rel="noopener noreferrer"
              className={`site-footer__link ${hoveredLink === 'linkedin' ? 'site-footer__link--hovered' : ''}`}
              onMouseEnter={() => setHoveredLink('linkedin')}
              onMouseLeave={() => setHoveredLink(null)}
              aria-label="LinkedIn profile (opens in new tab)"
            >
              <LinkedinLogo
                size={24}
                weight={hoveredLink === 'linkedin' ? 'fill' : 'regular'}
                color={hoveredLink === 'linkedin' ? '#7150E5' : '#3C3F43'}
                aria-hidden="true"
              />
              <span>Linkedin</span>
            </a>
          </nav>
        </div>
      </footer>

      {sustainabilityOpen && (
        <div className="sustainability-modal__overlay" role="presentation" onClick={closeSustainability}>
          <div
            className="sustainability-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sustainability-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={sustainabilityCloseRef}
              type="button"
              className="sustainability-modal__close"
              onClick={closeSustainability}
              aria-label="Close Sustainability"
            >
              Close <X size={16} weight="regular" className="sustainability-modal__close-icon" aria-hidden="true" />
            </button>
            <div className="sustainability-modal__content">
              <div className="sustainability-modal__text">
                <h2 id="sustainability-modal-title" className="sustainability-modal__title">
                  Lighter digital footprint
                </h2>
                <p className="sustainability-modal__p sustainability-modal__p--lines">
                  {`Sustainability shaped this site from the
beginning. Performance has been optimised to reduce energy use through efficient image handling, minimal code, and fast loading times.

As digital standards shift, I'll keep refining.
If you have tips for reducing impact even
further, I'd love to hear them.
`}
                  <span className="modal__contact-wrap">
                    <a href="#contact" onClick={closeSustainability} className="modal__inline-link">
                      Contact me
                    </a>
                  </span>
                </p>
              </div>
              <div className="sustainability-modal__image-wrap">
                <img src="/Footer images/Laptop and flowers 2.png" alt="" className="sustainability-modal__image" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      )}

      {privacyCookiesOpen && (
        <div className="privacy-cookies-modal__overlay" role="presentation" onClick={closePrivacyCookies}>
          <div
            className="privacy-cookies-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-cookies-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={privacyCookiesCloseRef}
              type="button"
              className="privacy-cookies-modal__close"
              onClick={closePrivacyCookies}
              aria-label="Close Privacy and cookies"
            >
              Close <X size={16} weight="regular" className="privacy-cookies-modal__close-icon" aria-hidden="true" />
            </button>
            <div className="privacy-cookies-modal__content">
              <div className="privacy-cookies-modal__text">
                <h2 id="privacy-cookies-modal-title" className="privacy-cookies-modal__title">
                  Privacy and cookies
                </h2>
                <p className="privacy-cookies-modal__p">
                  Your privacy matters. This site only collects the information you share through the contact form, such as your name and email address, and uses it solely to respond to your message.
                </p>
                <p className="privacy-cookies-modal__p">
                  There are no tracking cookies, no third-party analytics, and no unnecessary data collection. Just a simple, respectful browsing experience. If you have any questions about how your data is handled, I&apos;m happy to clarify.
                  <span className="modal__contact-wrap">
                    <a href="#contact" onClick={closePrivacyCookies} className="modal__inline-link">
                      Contact me
                    </a>
                  </span>
                </p>
              </div>
              <div className="privacy-cookies-modal__image-wrap">
                <img src="/Footer images/Cookie jar copy 3.png" alt="" className="privacy-cookies-modal__image" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      )}

      {accessibilityOpen && (
        <div className="accessibility-modal__overlay" role="presentation" onClick={closeAccessibility}>
          <div
            className="accessibility-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="accessibility-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={accessibilityCloseRef}
              type="button"
              className="accessibility-modal__close"
              onClick={closeAccessibility}
              aria-label="Close Accessibility"
            >
              Close <X size={16} weight="regular" className="accessibility-modal__close-icon" aria-hidden="true" />
            </button>
            <div className="accessibility-modal__content">
              <div className="accessibility-modal__text">
                <h2 id="accessibility-modal-title" className="accessibility-modal__title">
                  Accessibility commitment
                </h2>
                <p className="accessibility-modal__p">
                  Everyone should be able to navigate this site with ease. It was designed with accessibility in mind, including colour contrast, readable typography, keyboard navigation, and a clear content structure.
                </p>
                <p className="accessibility-modal__p">
                  I continue to learn and improve as accessibility standards evolve. If there&apos;s anything that could be more inclusive, I&apos;d genuinely appreciate
                  <br />
                  your feedback.
                  <span className="modal__contact-wrap">
                    <a href="#contact" onClick={closeAccessibility} className="modal__inline-link">
                      Contact me
                    </a>
                  </span>
                </p>
                <div className="accessibility-modal__motion">
                  <span className="accessibility-modal__motion-label">Motion</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={motionOn}
                    aria-label="Toggle motion"
                    className={`accessibility-modal__toggle ${motionOn ? 'accessibility-modal__toggle--on' : ''}`}
                    onClick={() => setMotionOn((prev) => !prev)}
                  >
                    <span className="accessibility-modal__toggle-track">
                      <span className="accessibility-modal__toggle-on-text">On</span>
                      <span className="accessibility-modal__toggle-off-text">Off</span>
                      <span className="accessibility-modal__toggle-thumb" />
                    </span>
                  </button>
                </div>
              </div>
              <div className="accessibility-modal__image-wrap">
                <img src="/Footer images/Balloons accessibility 2.png" alt="" className="accessibility-modal__image" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
