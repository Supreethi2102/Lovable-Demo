import React, { useState } from 'react';
import { 
  SelectionAll, 
  PaintBrush, 
  Megaphone, 
  Package, 
  Ruler,
  NotePencil,
  SpeakerHigh,
  Folders,
  IconWeight,
  Icon,
} from '@phosphor-icons/react';
import './CaseStudies.css';
import { CaseStudyCard, type CaseStudyCardStudy } from '../CaseStudyCard';

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
const caseStudies: CaseStudyCardStudy[] = [
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

      {/* Category Filter – outer wrap allows horizontal scroll + padding so active shadow is not clipped */}
      <div className="case-studies__filter-wrap">
        <nav
          className="case-studies__filter"
          role="tablist"
          aria-label="Filter case studies by category"
        >
          {categories.map((cat) => (
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
      </div>

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
