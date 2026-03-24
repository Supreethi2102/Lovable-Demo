import React, { useEffect, useMemo, useRef, useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SelectionAll, 
  PaintBrush, 
  Megaphone, 
  Package, 
  Ruler,
  NotePencil,
  ArrowsClockwise,
  PuzzlePiece,
  Target,
  ChartBar,
  SpeakerHigh,
  Folders,
  MapPin,
  Sparkle,
  Binoculars,
  IconWeight,
  Icon
} from '@phosphor-icons/react';
import { gsap } from 'gsap';
import './CaseStudies.css';

// Category data - Phosphor icons
type CategoryType = {
  id: string;
  label: string;
  Icon?: Icon;
  svgPath?: string;
};

const categories: CategoryType[] = [
  { id: 'all', label: 'All', Icon: SelectionAll },
  // { id: 'branding', label: 'Branding', Icon: PaintBrush },
  { id: 'campaigns', label: 'Campaigns', Icon: Megaphone },
  { id: 'packaging', label: 'Packaging', Icon: Package },
  { id: 'ui', label: 'UI', Icon: Ruler },
  { id: 'ux', label: 'UX', Icon: NotePencil },
];

// Case study data with actual images from public folder
const caseStudies = [
  {
    id: 1,
    title: 'What if your banking app knew how to smile?',
    subtitle: 'Palmy bank | UI',
    description: `Palmy is a fictional challenger bank I created to reimagine what trust, clarity and playfulness could feel like in everyday banking. It's designed for those too often excluded, including Pacific peoples, Māori and women. A warm, human-centred experience. Welcoming. Maybe even smile-worthy.`,
    duration: '7 months',
    category: 'ui',
    image: '/misc/47acc09551b581ea0204690ee9c9bf854e3a5309.png',
  },
  {
    id: 2,
    title: 'What if your banking app knew how to smile?',
    subtitle: 'Palmy bank | UI',
    description: `Palmy is a fictional challenger bank I created to reimagine what trust, clarity and playfulness could feel like in everyday banking. It's designed for those too often excluded, including Pacific peoples, Māori and women. A warm, human-centred experience. Welcoming. Maybe even smile-worthy.`,
    duration: '7 months',
    category: 'ui',
    image: '/misc/eb063b7647d2bb7897c12e3ac9acb89080d8a3d6.png',
  },
  {
    id: 3,
    title: 'What if your banking app knew how to smile?',
    subtitle: 'Palmy bank | UI',
    description: `Palmy is a fictional challenger bank I created to reimagine what trust, clarity and playfulness could feel like in everyday banking. It's designed for those too often excluded, including Pacific peoples, Māori and women. A warm, human-centred experience. Welcoming. Maybe even smile-worthy.`,
    duration: '7 months',
    category: 'ui',
    image: '/misc/junior-VRjbcJSINVc-unsplash-1.png',
  },
];

interface CaseStudyCardProps {
  study: typeof caseStudies[0];
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ study }) => {
  const navigate = useNavigate();
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

  const tabDescription = useMemo(() => study.description, [study.description]);

  const getTabImage = (tab: 'challenge' | 'focus' | 'impact') => {
    // Placeholder: use the same image until per-tab images are provided.
    void tab;
    return study.image;
  };

  const setLayerBg = (el: HTMLDivElement | null, url: string) => {
    if (!el) return;
    el.style.backgroundImage = `url(${url})`;
  };

  useEffect(() => {
    // Reset per-card when the card study changes (stacked cards)
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
        // Keep new image as the "front"
        setImageFrontSlot((s) => (s === 0 ? 1 : 0));
        isTabAnimatingRef.current = false;
      },
    });

    // Copy slides in from the divider; CTA stays pinned below.
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
        {/* Front */}
        <div className="case-study-card__face case-study-card__front">
          {/* Left Content */}
          <div className="case-study-card__content">
            {/* Sidebar */}
            <aside className="case-study-card__sidebar" aria-label="Case study options">
              {/* Flip Button */}
              <button 
                type="button"
                className="flip-button"
                onMouseEnter={() => setHoveredBtn('flip')}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={() => setIsFlipped(true)}
                aria-label="Flip card for design inspiration"
              >
                <div className="flip-button__icon">
                  <ArrowsClockwise size={24} weight={hoveredBtn === 'flip' ? 'fill' : 'regular'} color={hoveredBtn === 'flip' ? '#fbfbfb' : '#7150E5'} aria-hidden="true" />
                </div>
                <span className="flip-button__text">Flip for inspiration</span>
              </button>

          {/* Tabs */}
          <div 
            className="case-study-card__tabs" 
            role="tablist" 
            aria-label="Case study details"
          >
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

        {/* Main Content */}
        <div 
          className="case-study-card__main"
          id={tabPanelId}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}-${study.id}`}
        >
          <div ref={copyRef} className="case-study-card__copy">
            <p className="case-study-card__subtitle">{study.subtitle}</p>
            <h3 id={cardTitleId} className="case-study-card__title">{study.title}</h3>
            <p className="case-study-card__description">{tabDescription}</p>
          </div>
          <button 
            type="button"
            className="btn btn--primary btn--icon-left view-design-btn"
            onMouseEnter={() => setHoveredBtn('viewDesign')}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => {
              const el = document.getElementById('publications');
              el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            aria-label={`View the design for ${study.subtitle}`}
          >
            <span className="btn__icon" aria-hidden="true">
              <Ruler size={24} weight={hoveredBtn === 'viewDesign' ? 'fill' : 'regular'} color="currentColor" />
            </span>
            <span>View the design</span>
          </button>
        </div>
      </div>

      {/* Right Image */}
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

        {/* Back – same layout as front, with Place, Influence, Discoveries instead of Challenge, Focus, Impact */}
        <div className="case-study-card__face case-study-card__back">
          <div className="case-study-card__content">
            <aside className="case-study-card__sidebar" aria-label="Case study insights">
              <button 
                type="button"
                className="flip-button"
                onMouseEnter={() => setHoveredBtn('flipBack')}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={() => setIsFlipped(false)}
                aria-label="Back to insights"
              >
                <div className="flip-button__icon">
                  <ArrowsClockwise size={24} weight={hoveredBtn === 'flipBack' ? 'fill' : 'regular'} color={hoveredBtn === 'flipBack' ? '#fbfbfb' : '#7150E5'} aria-hidden="true" />
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
                  <MapPin size={24} 
                  weight={activeBackTab === 'place' || hoveredBtn === 'place' ? 'fill' : 'regular'} 
                  color="currentColor"
                  aria-hidden="true" />
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
                  <Sparkle size={24} 
                  weight={activeBackTab === 'influence' || hoveredBtn === 'influence' ? 'fill' : 'regular'} 
                  color="currentColor" aria-hidden="true" />
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
                  <Binoculars size={24} weight={activeBackTab === 'discoveries' || hoveredBtn === 'discoveries' ? 'fill' : 'regular'} 
                  color="currentColor" aria-hidden="true" />
                  <span>Discoveries</span>
                </button>
              </div>
            </aside>
            <div className="case-study-card__main">
              <div className="case-study-card__copy">
                <p className="case-study-card__subtitle">{study.subtitle}</p>
                <h3 className="case-study-card__title">Anchored in the Pacific islands</h3>
                <p className="case-study-card__description">
                  This design was shaped by the rhythm of the Moana, the ocean that connects us all. From Aotearoa to Hawai&apos;i, Samoa, Tonga, Fiji, Niue, the Cook Islands, Tokelau and beyond, I&apos;ve always been drawn to the connection between the islands, shores, and communities linked by the Pacific tides — and wanted that sense of belonging to ripple through Palmy.
                </p>
              </div>
              <button 
                type="button"
                className="btn btn--primary btn--icon-left view-design-btn"
                onMouseEnter={() => setHoveredBtn('viewDesignBack')}
                onMouseLeave={() => setHoveredBtn(null)}
                onClick={() => {
                  const el = document.getElementById('publications');
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                aria-label={`View the design for ${study.subtitle}`}
              >
                <span className="btn__icon" aria-hidden="true">
                  <Ruler size={24} weight={hoveredBtn === 'viewDesignBack' ? 'fill' : 'regular'} color="currentColor" />
                </span>
                <span>View the design</span>
              </button>
            </div>
          </div>
          <figure className="case-study-card__image">
            <div className="case-study-card__duration" aria-label={`Project duration: ${study.duration}`}>
              Duration: {study.duration}
            </div>
            <div className="case-study-card__image-viewport" role="img" aria-label={`${study.subtitle} project preview`}>
              <div className="case-study-card__image-layer" style={{ backgroundImage: `url(/misc/Image%20frame.png)` }} aria-hidden="true" />
            </div>
          </figure>
        </div>
      </article>
    </div>
  );
};

export const CaseStudies: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredViewAll, setHoveredViewAll] = useState(false);

  const filteredStudies = activeCategory === 'all' 
    ? caseStudies 
    : caseStudies.filter(s => s.category === activeCategory);

  const getIconWeight = (catId: string): IconWeight => {
    if (activeCategory === catId || hoveredCategory === catId) return 'fill';
    return 'regular';
  };

  return (
    <section 
      className="case-studies" 
      id="work"
      aria-labelledby="case-studies-title"
      tabIndex={-1}
    >
      {/* Header */}
      <header className="case-studies__header">
        <h2 id="case-studies-title" className="case-studies__title">
          Case studies <span className="case-studies__subtitle">Browse by design category</span>
        </h2>
      </header>

      {/* Category Filter */}
      <nav 
        className="case-studies__filter" 
        role="tablist" 
        aria-label="Filter case studies by category"
      >
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat.id}
            aria-controls="case-studies-grid"
            className={`category-pill ${activeCategory === cat.id ? 'category-pill--active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
            onMouseEnter={() => setHoveredCategory(cat.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="category-pill__icon" aria-hidden="true">
              {cat.Icon ? (
                <cat.Icon size={24} weight={getIconWeight(cat.id)} color={hoveredCategory === cat.id ? '#ffffff' : '#7150E5'} />
              ) : cat.svgPath ? (
                <img src={cat.svgPath} alt="" />
              ) : null}
            </div>
            <span className="category-pill__label">{cat.label}</span>
          </button>
        ))}
      </nav>

      {/* Case Study Cards - Stacking */}
      <div 
        id="case-studies-grid"
        className="case-studies__grid"
        role="tabpanel"
        aria-label={`Showing ${activeCategory === 'all' ? 'all' : activeCategory} case studies`}
        aria-live="polite"
      >
        <div className="case-studies__stack">
          {filteredStudies.map((study, index) => (
            <div 
              key={study.id} 
              className="case-studies__stack-item"
              style={{ zIndex: index + 1 }}
            >
              <CaseStudyCard study={study} />
            </div>
          ))}
        </div>
      </div>

      {/* View All Button */}
      <footer className="case-studies__footer">
        <button 
          type="button"
          className={`btn btn--secondary btn--icon-left view-all-btn ${hoveredViewAll ? 'view-all-btn--hovered' : ''}`}
          onMouseEnter={() => setHoveredViewAll(true)}
          onMouseLeave={() => setHoveredViewAll(false)}
          aria-label="View all case studies"
        >
          <span className="btn__icon" aria-hidden="true">
            <Folders size={24} weight={hoveredViewAll ? 'fill' : 'regular'} color="currentColor" />
          </span>
          <span>View all cases</span>
        </button>
      </footer>
    </section>
  );
};
