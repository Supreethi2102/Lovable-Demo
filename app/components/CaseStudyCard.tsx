import React, { useEffect, useMemo, useRef, useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowsClockwise,
  Ruler,
  NotePencil,
  Megaphone,
  Package,
  PuzzlePiece,
  Target,
  ChartBar,
  MapPin,
  Sparkle,
  Binoculars,
} from '@phosphor-icons/react';
import { gsap } from 'gsap';
import './sections/CaseStudies.css';

export type CaseStudyCardStudy = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  category: string;
  image: string;
  frontTabs?: {
    challenge: { title: string; description: string; image: string };
    focus: { title: string; description: string; image: string };
    impact: { title: string; description: string; image: string };
  };
  backTabs?: {
    place: { title: string; description: string; image?: string; background?: string };
    influence: { title: string; description: string; image?: string; background?: string };
    discoveries: { title: string; description: string; image?: string; background?: string };
  };
};

interface CaseStudyCardProps {
  study: CaseStudyCardStudy;
}

const splitIntoSixLines = (text: string): string[] => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lineCount = 6;
  if (words.length === 0) return Array(lineCount).fill('');

  if (words.length <= lineCount) {
    return [...words, ...Array(lineCount - words.length).fill('')];
  }

  const n = words.length;
  const prefixWordLengths = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i += 1) {
    prefixWordLengths[i + 1] = prefixWordLengths[i] + words[i].length;
  }

  const lineLength = (start: number, end: number) => {
    const chars = prefixWordLengths[end] - prefixWordLengths[start];
    const spaces = end - start - 1;
    return chars + Math.max(0, spaces);
  };

  const totalLength = lineLength(0, n);
  const targetLength = totalLength / lineCount;
  const minReasonableLength = targetLength * 0.72;

  const dp: number[][] = Array.from({ length: lineCount + 1 }, () => Array(n + 1).fill(Number.POSITIVE_INFINITY));
  const prev: number[][] = Array.from({ length: lineCount + 1 }, () => Array(n + 1).fill(-1));
  dp[0][0] = 0;

  for (let line = 1; line <= lineCount; line += 1) {
    for (let end = line; end <= n; end += 1) {
      for (let start = line - 1; start < end; start += 1) {
        if (!Number.isFinite(dp[line - 1][start])) continue;

        const len = lineLength(start, end);
        let cost = Math.pow(len - targetLength, 2);

        // Penalize visibly short lines so line breaks look less jagged.
        if (line < lineCount && len < minReasonableLength) {
          cost += Math.pow(minReasonableLength - len, 2) * 1.6;
        }

        const candidate = dp[line - 1][start] + cost;
        if (candidate < dp[line][end]) {
          dp[line][end] = candidate;
          prev[line][end] = start;
        }
      }
    }
  }

  const lines = new Array<string>(lineCount).fill('');
  let end = n;
  for (let line = lineCount; line >= 1; line -= 1) {
    const start = prev[line][end];
    if (start < 0) {
      // Fallback: greedy split if DP unexpectedly fails.
      return [
        words.slice(0, Math.ceil(n / 6)).join(' '),
        words.slice(Math.ceil(n / 6), Math.ceil((2 * n) / 6)).join(' '),
        words.slice(Math.ceil((2 * n) / 6), Math.ceil((3 * n) / 6)).join(' '),
        words.slice(Math.ceil((3 * n) / 6), Math.ceil((4 * n) / 6)).join(' '),
        words.slice(Math.ceil((4 * n) / 6), Math.ceil((5 * n) / 6)).join(' '),
        words.slice(Math.ceil((5 * n) / 6)).join(' '),
      ];
    }
    lines[line - 1] = words.slice(start, end).join(' ');
    end = start;
  }

  return lines;
};

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ study }) => {
  const navigate = useNavigate();
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [activeTab, setActiveTab] = useState<'challenge' | 'focus' | 'impact'>('challenge');
  const [contentTab, setContentTab] = useState<'challenge' | 'focus' | 'impact'>('challenge');
  const [imageFrontSlot, setImageFrontSlot] = useState<0 | 1>(0);
  const isTabAnimatingRef = useRef(false);
  const copyRef = useRef<HTMLDivElement>(null);
  const imgARef = useRef<HTMLDivElement>(null);
  const imgBRef = useRef<HTMLDivElement>(null);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeBackTab, setActiveBackTab] = useState<'place' | 'influence' | 'discoveries'>('place');
  const tabPanelId = useId();
  const cardTitleId = useId();

  const frontTabs = useMemo(
    () =>
      study.frontTabs ?? {
        challenge: { title: study.title, description: study.description, image: study.image },
        focus: { title: study.title, description: study.description, image: study.image },
        impact: { title: study.title, description: study.description, image: study.image },
      },
    [study],
  );

  const backTabs = useMemo(
    () =>
      study.backTabs ?? {
        place: {
          title: 'Anchored in the Pacific islands',
          description:
            "This design was shaped by the rhythm of the Moana, the ocean that connects us all. From Aotearoa to Hawai'i, Samoa, Tonga, Fiji, Niue, the Cook Islands, Tokelau and beyond, I've always been drawn to the connection between the islands, shores, and communities linked by the Pacific tides - and wanted that sense of belonging to ripple through Palmy.",
          image: '/misc/Image%20frame.png',
        },
        influence: {
          title: 'Anchored in the Pacific islands',
          description:
            "This design was shaped by the rhythm of the Moana, the ocean that connects us all. From Aotearoa to Hawai'i, Samoa, Tonga, Fiji, Niue, the Cook Islands, Tokelau and beyond, I've always been drawn to the connection between the islands, shores, and communities linked by the Pacific tides - and wanted that sense of belonging to ripple through Palmy.",
          image: '/misc/Image%20frame.png',
        },
        discoveries: {
          title: 'Anchored in the Pacific islands',
          description:
            "This design was shaped by the rhythm of the Moana, the ocean that connects us all. From Aotearoa to Hawai'i, Samoa, Tonga, Fiji, Niue, the Cook Islands, Tokelau and beyond, I've always been drawn to the connection between the islands, shores, and communities linked by the Pacific tides - and wanted that sense of belonging to ripple through Palmy.",
          image: '/misc/Image%20frame.png',
        },
      },
    [study],
  );
  const currentFrontTab = frontTabs[contentTab];
  const currentBackTab = backTabs[activeBackTab];
  const frontDescriptionLines = useMemo(
    () => splitIntoSixLines(currentFrontTab.description),
    [currentFrontTab.description],
  );
  const backDescriptionLines = useMemo(
    () => splitIntoSixLines(currentBackTab.description),
    [currentBackTab.description],
  );

  const getTabImage = (tab: 'challenge' | 'focus' | 'impact') => {
    return frontTabs[tab].image;
  };

  const renderViewDesignIcon = (isHovered: boolean) => {
    const weight = isHovered ? 'fill' : 'regular';

    switch (study.id) {
      case 2:
        return <Package size={24} weight={weight} color="currentColor" />;
      case 3:
      case 4:
        return <Megaphone size={24} weight={weight} color="currentColor" />;
      case 5:
        return <NotePencil size={24} weight={weight} color="currentColor" />;
      case 1:
      default:
        return <Ruler size={24} weight={weight} color="currentColor" />;
    }
  };

  const setLayerBg = (el: HTMLDivElement | null, url: string) => {
    if (!el) return;
    el.style.backgroundImage = `url(${url})`;
  };

  useEffect(() => {
    setActiveTab('challenge');
    setContentTab('challenge');
    setImageFrontSlot(0);
    setIsFlipped(false);
    setActiveBackTab('place');
    isTabAnimatingRef.current = false;

    setLayerBg(imgARef.current, getTabImage('challenge'));
    setLayerBg(imgBRef.current, getTabImage('challenge'));

    gsap.set(imgARef.current, { x: '0%', opacity: 1 });
    gsap.set(imgBRef.current, { x: '-120%', opacity: 1 });
    gsap.set(copyRef.current, { x: 0, opacity: 1 });
  }, [study.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const animateToTab = (nextTab: 'challenge' | 'focus' | 'impact') => {
    if (isTabAnimatingRef.current) return;
    if (nextTab === activeTab) return;

    setActiveTab(nextTab);

    if (prefersReducedMotion) {
      setContentTab(nextTab);
      setLayerBg(imgARef.current, getTabImage(nextTab));
      setLayerBg(imgBRef.current, getTabImage(nextTab));
      gsap.set(imgARef.current, { x: '0%', opacity: 1 });
      gsap.set(imgBRef.current, { x: '-120%', opacity: 1 });
      return;
    }

    const copyEl = copyRef.current;
    const frontEl = (imageFrontSlot === 0 ? imgARef.current : imgBRef.current) as HTMLDivElement | null;
    const backEl = (imageFrontSlot === 0 ? imgBRef.current : imgARef.current) as HTMLDivElement | null;
    if (!copyEl || !frontEl || !backEl) return;

    isTabAnimatingRef.current = true;

    setLayerBg(backEl, getTabImage(nextTab));
    gsap.set(backEl, { x: '-120%', opacity: 1 });
    gsap.set(frontEl, { x: '0%', opacity: 1 });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        setImageFrontSlot((s) => (s === 0 ? 1 : 0));
        isTabAnimatingRef.current = false;
      },
    });

    tl.to(copyEl, { duration: 0.12, x: 8, opacity: 0 }, 0);
    tl.to(frontEl, { duration: 0.45, x: '120%', opacity: 0, force3D: true }, 0);
    tl.to(backEl, { duration: 0.5, x: '0%', opacity: 1, ease: 'power3.out', force3D: true }, 0.08);

    tl.add(() => {
      setContentTab(nextTab);
      requestAnimationFrame(() => {
        const el = copyRef.current;
        if (!el) return;
        gsap.set(el, { x: -16, opacity: 0 });
        gsap.to(el, { duration: 0.25, x: 0, opacity: 1, ease: 'power2.out' });
      });
    }, 0.12);
  };

  return (
    <div className="case-study-card-flip">
      <article
        className={`case-study-card ${isFlipped ? 'case-study-card--flipped' : ''}`}
        aria-labelledby={cardTitleId}
      >
        <div className="case-study-card__face case-study-card__front">
          <div className="case-study-card__content">
            <aside className="case-study-card__sidebar" aria-label="Case study options">
              <button
                type="button"
                className="flip-button flip-button--sidebar"
                onMouseEnter={() => setHoveredBtn('flip')}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={() => setIsFlipped(true)}
                aria-label="Flip card for design inspiration"
              >
                <div className="flip-button__icon">
                  <ArrowsClockwise
                    size={24}
                    weight={hoveredBtn === 'flip' ? 'fill' : 'regular'}
                    color={hoveredBtn === 'flip' ? '#fbfbfb' : '#7150E5'}
                    aria-hidden="true"
                  />
                </div>
                <span className="flip-button__text">Flip for inspiration</span>
              </button>

              <div className="case-study-card__tabs" role="tablist" aria-label="Case study details">
                <button
                  type="button"
                  role="tab"
                  id={`tab-challenge-${study.id}`}
                  aria-selected={activeTab === 'challenge'}
                  aria-controls={tabPanelId}
                  className={`tab ${activeTab === 'challenge' ? 'tab--active' : ''}`}
                  onClick={() => animateToTab('challenge')}
                  onMouseEnter={() => setHoveredBtn('challenge')}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  <PuzzlePiece
                    size={24}
                    weight={activeTab === 'challenge' || hoveredBtn === 'challenge' ? 'fill' : 'regular'}
                    color="currentColor"
                    aria-hidden="true"
                  />
                  <span>Challenge</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  id={`tab-focus-${study.id}`}
                  aria-selected={activeTab === 'focus'}
                  aria-controls={tabPanelId}
                  className={`tab ${activeTab === 'focus' ? 'tab--active' : ''}`}
                  onClick={() => animateToTab('focus')}
                  onMouseEnter={() => setHoveredBtn('focus')}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  <Target
                    size={24}
                    weight={activeTab === 'focus' || hoveredBtn === 'focus' ? 'fill' : 'regular'}
                    color="currentColor"
                    aria-hidden="true"
                  />
                  <span>Focus</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  id={`tab-impact-${study.id}`}
                  aria-selected={activeTab === 'impact'}
                  aria-controls={tabPanelId}
                  className={`tab ${activeTab === 'impact' ? 'tab--active' : ''}`}
                  onClick={() => animateToTab('impact')}
                  onMouseEnter={() => setHoveredBtn('impact')}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  <ChartBar
                    size={24}
                    weight={activeTab === 'impact' || hoveredBtn === 'impact' ? 'fill' : 'regular'}
                    color="currentColor"
                    aria-hidden="true"
                  />
                  <span>Impact</span>
                </button>
              </div>
            </aside>

            <div
              className="case-study-card__main"
              id={tabPanelId}
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}-${study.id}`}
            >
              <div ref={copyRef} className="case-study-card__copy">
                <p className="case-study-card__subtitle">{study.subtitle}</p>
                <h3 id={cardTitleId} className="case-study-card__title">
                  {currentFrontTab.title}
                </h3>
                <p className="case-study-card__description" aria-label={currentFrontTab.description}>
                  {frontDescriptionLines.map((line, idx) => (
                    <span key={idx} className="case-study-card__description-line">
                      {line || '\u00A0'}
                    </span>
                  ))}
                </p>
              </div>
              <button
                type="button"
                className="btn btn--primary btn--icon-left view-design-btn"
                onMouseEnter={() => setHoveredBtn('viewDesign')}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={() => navigate(`/case-studies/${study.id}`)}
                aria-label={`View the design for ${study.subtitle}`}
              >
                <span className="btn__icon" aria-hidden="true">
                  {renderViewDesignIcon(hoveredBtn === 'viewDesign')}
                </span>
                <span>View the design</span>
              </button>
              <button
                type="button"
                className="flip-button flip-button--footer"
                onMouseEnter={() => setHoveredBtn('flip')}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={() => setIsFlipped(true)}
                aria-label="Flip card for design inspiration"
              >
                <div className="flip-button__icon">
                  <ArrowsClockwise
                    size={24}
                    weight={hoveredBtn === 'flip' ? 'fill' : 'regular'}
                    color="currentColor"
                    aria-hidden="true"
                  />
                </div>
                <span className="flip-button__text">Flip for inspiration</span>
              </button>
            </div>
          </div>

          <figure className="case-study-card__image">
            <div className="case-study-card__duration" aria-label={`Project duration: ${study.duration}`}>
              Duration: {study.duration}
            </div>
            <div className="case-study-card__image-viewport" role="img" aria-label={`${study.subtitle} project preview`}>
              <div ref={imgARef} className="case-study-card__image-layer" aria-hidden="true" />
              <div ref={imgBRef} className="case-study-card__image-layer" aria-hidden="true" />
            </div>
          </figure>
        </div>

        <div className="case-study-card__face case-study-card__back">
          <div className="case-study-card__content">
            <aside className="case-study-card__sidebar" aria-label="Case study insights">
              <button
                type="button"
                className="flip-button flip-button--sidebar"
                onMouseEnter={() => setHoveredBtn('flipBack')}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={() => setIsFlipped(false)}
                aria-label="Back to insights"
              >
                <div className="flip-button__icon">
                  <ArrowsClockwise
                    size={24}
                    weight={hoveredBtn === 'flipBack' ? 'fill' : 'regular'}
                    color={hoveredBtn === 'flipBack' ? '#fbfbfb' : '#7150E5'}
                    aria-hidden="true"
                  />
                </div>
                <span className="flip-button__text">Back to insights</span>
              </button>
              <div className="case-study-card__tabs case-study-card__back-tabs" role="tablist" aria-label="Case study insights">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeBackTab === 'place'}
                  className={`case-study-card__back-item tab ${activeBackTab === 'place' ? 'tab--active' : ''}`}
                  onClick={() => setActiveBackTab('place')}
                  onMouseEnter={() => setHoveredBtn('place')}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  <MapPin
                    size={24}
                    weight={activeBackTab === 'place' || hoveredBtn === 'place' ? 'fill' : 'regular'}
                    color="currentColor"
                    aria-hidden="true"
                  />
                  <span>Place</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeBackTab === 'influence'}
                  className={`case-study-card__back-item tab ${activeBackTab === 'influence' ? 'tab--active' : ''}`}
                  onClick={() => setActiveBackTab('influence')}
                  onMouseEnter={() => setHoveredBtn('influence')}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  <Sparkle
                    size={24}
                    weight={activeBackTab === 'influence' || hoveredBtn === 'influence' ? 'fill' : 'regular'}
                    color="currentColor"
                    aria-hidden="true"
                  />
                  <span>Influence</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeBackTab === 'discoveries'}
                  className={`case-study-card__back-item tab ${activeBackTab === 'discoveries' ? 'tab--active' : ''}`}
                  onClick={() => setActiveBackTab('discoveries')}
                  onMouseEnter={() => setHoveredBtn('discoveries')}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  <Binoculars
                    size={24}
                    weight={activeBackTab === 'discoveries' || hoveredBtn === 'discoveries' ? 'fill' : 'regular'}
                    color="currentColor"
                    aria-hidden="true"
                  />
                  <span>Discoveries</span>
                </button>
              </div>
            </aside>
            <div className="case-study-card__main">
              <div className="case-study-card__copy">
                <p className="case-study-card__subtitle">{study.subtitle}</p>
                <h3 className="case-study-card__title">{currentBackTab.title}</h3>
                <p className="case-study-card__description" aria-label={currentBackTab.description}>
                  {backDescriptionLines.map((line, idx) => (
                    <span key={idx} className="case-study-card__description-line">
                      {line || '\u00A0'}
                    </span>
                  ))}
                </p>
              </div>
              <button
                type="button"
                className="btn btn--primary btn--icon-left view-design-btn"
                onMouseEnter={() => setHoveredBtn('viewDesignBack')}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={() => navigate(`/case-studies/${study.id}`)}
                aria-label={`View the design for ${study.subtitle}`}
              >
                <span className="btn__icon" aria-hidden="true">
                  {renderViewDesignIcon(hoveredBtn === 'viewDesignBack')}
                </span>
                <span>View the design</span>
              </button>
              <button
                type="button"
                className="flip-button flip-button--footer"
                onMouseEnter={() => setHoveredBtn('flipBack')}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={() => setIsFlipped(false)}
                aria-label="Back to insights"
              >
                <div className="flip-button__icon">
                  <ArrowsClockwise
                    size={24}
                    weight={hoveredBtn === 'flipBack' ? 'fill' : 'regular'}
                    color="currentColor"
                    aria-hidden="true"
                  />
                </div>
                <span className="flip-button__text">Back to insights</span>
              </button>
            </div>
          </div>
          <figure className="case-study-card__image">
            <div className="case-study-card__duration" aria-label={`Project duration: ${study.duration}`}>
              Duration: {study.duration}
            </div>
            <div className="case-study-card__image-viewport" role="img" aria-label={`${study.subtitle} project preview`}>
              <div
                className="case-study-card__image-layer"
                style={{
                  backgroundImage: currentBackTab.image
                    ? `url(${currentBackTab.image})`
                    : 'none',
                  backgroundColor: currentBackTab.background ?? '#ddd',
                }}
                aria-hidden="true"
              />
            </div>
          </figure>
        </div>
      </article>
    </div>
  );
};
