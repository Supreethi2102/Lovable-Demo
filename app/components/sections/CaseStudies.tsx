import React, { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SelectionAll, 
  PaintBrush, 
  Megaphone, 
  Package, 
  Ruler,
  PencilSimple,
  ArrowsClockwise,
  PuzzlePiece,
  Target,
  ChartLineUp,
  SpeakerHigh,
  Folders,
  IconWeight,
  Icon
} from '@phosphor-icons/react';
import './CaseStudies.css';

// UX logo: Phosphor pencil + ruler
function UxIcon({ size = 24, weight = 'regular', color, className }: { size?: number; weight?: IconWeight; color?: string; className?: string }) {
  return (
    <span
      className={['ux-icon', className].filter(Boolean).join(' ')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: -4,
      }}
    >
      <PencilSimple size={size} weight={weight} color={color} style={{ display: 'block', flexShrink: 0 }} />
      <Ruler size={size} weight={weight} color={color} style={{ display: 'block', flexShrink: 0 }} />
    </span>
  );
}

// Category data - Phosphor icons; UX = pencil + ruler
type CategoryType = {
  id: string;
  label: string;
  Icon?: Icon | typeof UxIcon;
  svgPath?: string;
};

const categories: CategoryType[] = [
  { id: 'all', label: 'All', Icon: SelectionAll },
  // { id: 'branding', label: 'Branding', Icon: PaintBrush },
  { id: 'campaigns', label: 'Campaigns', Icon: Megaphone },
  { id: 'packaging', label: 'Packaging', Icon: Package },
  { id: 'ui', label: 'UI', Icon: Ruler },
  { id: 'ux', label: 'UX', Icon: UxIcon },
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
  const [activeTab, setActiveTab] = useState('challenge');
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const tabPanelId = useId();
  const cardTitleId = useId();

  return (
    <article className="case-study-card" aria-labelledby={cardTitleId}>
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
              onClick={() => setActiveTab('challenge')}
              onMouseEnter={() => setHoveredBtn('challenge')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <PuzzlePiece 
                size={24} 
                weight={activeTab === 'challenge' || hoveredBtn === 'challenge' ? 'fill' : 'regular'} 
                color={activeTab === 'challenge' ? '#111213' : '#3c3f43'}
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
              onClick={() => setActiveTab('focus')}
              onMouseEnter={() => setHoveredBtn('focus')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <Target 
                size={24} 
                weight={activeTab === 'focus' || hoveredBtn === 'focus' ? 'fill' : 'regular'} 
                color={activeTab === 'focus' ? '#111213' : '#3c3f43'}
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
              onClick={() => setActiveTab('impact')}
              onMouseEnter={() => setHoveredBtn('impact')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <ChartLineUp 
                size={24} 
                weight={activeTab === 'impact' || hoveredBtn === 'impact' ? 'fill' : 'regular'} 
                color={activeTab === 'impact' ? '#111213' : '#3c3f43'}
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
          <p className="case-study-card__subtitle">{study.subtitle}</p>
          <h3 id={cardTitleId} className="case-study-card__title">{study.title}</h3>
          <p className="case-study-card__description">{study.description}</p>
          <button 
            type="button"
            className="view-design-btn"
            onMouseEnter={() => setHoveredBtn('viewDesign')}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => {
              // Publication detail page removed: scroll to Publications section instead
              const el = document.getElementById('publications');
              el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            aria-label={`View the design for ${study.subtitle}`}
          >
            <Ruler size={24} weight={hoveredBtn === 'viewDesign' ? 'fill' : 'regular'} color="#fbfbfb" aria-hidden="true" />
            <span>View the design</span>
          </button>
        </div>
      </div>

      {/* Right Image */}
      <figure className="case-study-card__image">
        <div className="case-study-card__duration" aria-label={`Project duration: ${study.duration}`}>
          Duration: {study.duration}
        </div>
        <div 
          className="case-study-card__image-bg"
          style={{ backgroundImage: `url(${study.image})` }}
          role="img"
          aria-label={`${study.subtitle} project preview`}
        />
        {/* Listen button – commented out for now, will use in future */}
        {/* <button 
          type="button"
          className="listen-button"
          onMouseEnter={() => setHoveredBtn('listen')}
          onMouseLeave={() => setHoveredBtn(null)}
          aria-label={`Listen to audio description of ${study.subtitle}`}
        >
          <div className="listen-button__icon">
            <SpeakerHigh size={24} weight={hoveredBtn === 'listen' ? 'fill' : 'regular'} color="#7150E5" aria-hidden="true" />
          </div>
          <div className="listen-button__divider" aria-hidden="true"></div>
          <span className="listen-button__text">Listen</span>
        </button> */}
      </figure>
    </article>
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
                <cat.Icon size={24} weight={getIconWeight(cat.id)} color="#7150E5" />
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
          className={`view-all-btn ${hoveredViewAll ? 'view-all-btn--hovered' : ''}`}
          onMouseEnter={() => setHoveredViewAll(true)}
          onMouseLeave={() => setHoveredViewAll(false)}
          aria-label="View all case studies"
        >
          <Folders size={24} weight={hoveredViewAll ? 'fill' : 'regular'} color={hoveredViewAll ? '#ffffff' : '#7150E5'} aria-hidden="true" />
          <span>View all cases</span>
        </button>
      </footer>
    </section>
  );
};
