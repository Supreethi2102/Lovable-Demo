import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  SpeakerHigh,
  ListBullets,
  Note,
  MagnifyingGlass,
  FlowArrow,
  FlagCheckered,
  LightbulbFilament,
  ChartBar,
  Books,
  Folders,
} from '@phosphor-icons/react';
import { SiteFooter } from './SiteFooter';
import { CaseStudyCard, type CaseStudyCardStudy } from '../CaseStudyCard';
import './CaseStudyDetail.css';

type NavSectionId =
  | 'overview'
  | 'brief'
  | 'research'
  | 'process'
  | 'solution'
  | 'reflection'
  | 'impact'
  | 'sources';

const NAV_ITEMS: Array<{ id: NavSectionId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'brief', label: 'Brief' },
  { id: 'research', label: 'Research' },
  { id: 'process', label: 'Process' },
  { id: 'solution', label: 'Solution' },
  { id: 'reflection', label: 'Reflection' },
  { id: 'impact', label: 'Impact' },
  { id: 'sources', label: 'Sources' },
];

const SECTION_ICON_COMPONENTS: Record<NavSectionId, React.ElementType> = {
  overview: ListBullets,
  brief: Note,
  research: MagnifyingGlass,
  process: FlowArrow,
  solution: FlagCheckered,
  reflection: LightbulbFilament,
  impact: ChartBar,
  sources: Books,
};

const IMG = {
  hero: '/case-study-gch/9912d40ae739a7575ec4a7abed1a19cf05d03244.png',
  brief: '/case-study-gch/d65aed70beb865887889dd3c5f06cd6bf5c9d477.png',
  research: '/case-study-gch/f4b71e3100c327a76d4ed5c72d9b0279829c97a0.png',
  process: '/case-study-gch/6921425df3fbd47838860bb0b5ca35d29859de9e.png',
  typographySpecimen: '/case-study-gch/d65aed70beb865887889dd3c5f06cd6bf5c9d477.png',
  typographyBanner: '/case-study-gch/f4b71e3100c327a76d4ed5c72d9b0279829c97a0.png',
  duo1: '/case-study-gch/06d7fcc67fd2e50425416638866d9a8ffffe1f48.png',
  duo2: '/case-study-gch/ae57819f1182ad7e22b284384065d1925c6aabd7.png',
  duo3: '/case-study-gch/1ed717e27b4208d7579d7f929d28b0624fde988e.png',
  duo4: '/case-study-gch/6921425df3fbd47838860bb0b5ca35d29859de9e.png',
  posterWall: '/case-study-gch/1ed717e27b4208d7579d7f929d28b0624fde988e.png',
  retailDisplay: '/case-study-gch/ae57819f1182ad7e22b284384065d1925c6aabd7.png',
  outOfHome1: '/case-study-gch/06d7fcc67fd2e50425416638866d9a8ffffe1f48.png',
  outOfHome2: '/case-study-gch/1ed717e27b4208d7579d7f929d28b0624fde988e.png',
  outOfHome3: '/case-study-gch/ae57819f1182ad7e22b284384065d1925c6aabd7.png',
  outOfHome4: '/case-study-gch/6921425df3fbd47838860bb0b5ca35d29859de9e.png',
  commercialBay: '/case-study-gch/9912d40ae739a7575ec4a7abed1a19cf05d03244.png',
  commercialBayPoster: '/case-study-gch/1ed717e27b4208d7579d7f929d28b0624fde988e.png',
  digitalPoster: '/case-study-gch/1ed717e27b4208d7579d7f929d28b0624fde988e.png',
  solution: '/case-study-gch/ae57819f1182ad7e22b284384065d1925c6aabd7.png',
  digital: '/case-study-gch/9912d40ae739a7575ec4a7abed1a19cf05d03244.png',
  impact: '/case-study-gch/06d7fcc67fd2e50425416638866d9a8ffffe1f48.png',
  reflection: '/case-study-gch/ae57819f1182ad7e22b284384065d1925c6aabd7.png',
  sources: '/case-study-gch/6921425df3fbd47838860bb0b5ca35d29859de9e.png',
  explore1: '/case-study-gch/c8cdbdceb1fbf0c9bca7307bcba47c77cfbb2e81.png',
};

const TESTIMONIALS = [
  {
    quote: 'Customers comment on them more than the old ones. Especially the wording on the side.',
    author: 'Pharmacy assistant, Auckland',
    className: 'case-study-detail__testimonial-card--top-left',
    bubble: '/case-study/464ed7b7414f42b86b14ae25bcac75852bc99010.svg',
  },
  {
    quote: 'It’s good to see something a bit more responsible, especially from a big chain.',
    author: 'Customer, Auckland',
    className: 'case-study-detail__testimonial-card--top-right',
    bubble: '/case-study/18f9645bf37c99104bb50a07a5a4af98f0aec53a.svg',
  },
  {
    quote:
      'I liked the “Kia ora” on the bag. I didn’t know the exact meaning until I saw it, and it feels really Kiwi. It’s nice seeing te reo Māori used more.',
    author: 'Customer, Auckland',
    className: 'case-study-detail__testimonial-card--bottom-left',
    bubble: '/case-study/67f34898ea6b9e22ca7d4c59fe0a19577d334a39.svg',
  },
  {
    quote: 'The new bags feel clearer and more premium at checkout.',
    author: 'Store team member, Auckland',
    className: 'case-study-detail__testimonial-card--bottom-right',
    bubble: '/case-study/55848b141f11b80be83c56000477a15b580f06a6.svg',
  },
];

const MORE_PROJECTS: CaseStudyCardStudy[] = [
  {
    id: 1,
    subtitle: 'The Warehouse | Mega Toy Month Campaign',
    title: 'How do you turn a toy sale into a month-long adventure?',
    description:
      'Families entered the July school holidays with tight budgets after lockdowns. The Warehouse needed a campaign that felt playful for kids, clear and value-driven for parents, and strong enough to drive online and in-store sales across busy retail channels.',
    image: '/case-study-gch/c8cdbdceb1fbf0c9bca7307bcba47c77cfbb2e81.png',
    duration: '4 weeks',
    category: 'campaigns',
  },
  {
    id: 2,
    subtitle: 'The Warehouse | Summer Campaign',
    title: 'How do you make small spends feel like summer wins?',
    description:
      'After lockdowns and rising living costs, Kiwi families were cautious with spending. The Warehouse needed a bright summer campaign that balanced aspiration with approachability.',
    image: '/case-study-gch/ae57819f1182ad7e22b284384065d1925c6aabd7.png',
    duration: '4 weeks',
    category: 'campaigns',
  },
];

export const CaseStudyDetailGch: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState<NavSectionId>('overview');
  const [hoveredNavId, setHoveredNavId] = useState<NavSectionId | null>(null);
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});
  const suppressSectionSpyRef = useRef(false);
  const suppressSectionSpyTimerRef = useRef(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [id]);

  useEffect(() => {
    return () => {
      window.clearTimeout(suppressSectionSpyTimerRef.current);
    };
  }, []);

  const scrollToNavSection = useCallback((sectionId: NavSectionId) => {
    const el = sectionsRef.current[sectionId];
    if (!el) return;

    setActiveSection(sectionId);
    window.clearTimeout(suppressSectionSpyTimerRef.current);
    suppressSectionSpyRef.current = true;

    const reduce =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });

    const releaseSpy = () => {
      suppressSectionSpyRef.current = false;
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scrollend', releaseSpy, { once: true });
    }
    suppressSectionSpyTimerRef.current = window.setTimeout(releaseSpy, 1100);
  }, []);

  useEffect(() => {
    const nodes = NAV_ITEMS.map((s) => sectionsRef.current[s.id])
      .filter((el): el is HTMLElement => Boolean(el));
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressSectionSpyRef.current) return;
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveSection(visible[0].target.id as NavSectionId);
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.25, 0.5, 0.75],
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="case-study-detail" aria-labelledby="case-study-detail-title">
      <div className="case-study-detail__inner">
        <div className="case-study-detail__layout">
          <aside className="case-study-detail__sidebar" aria-label="Case study sections">
            <div className="case-study-detail__sidebar-top">
              <div className="case-study-detail__back-wrap">
                <button
                  type="button"
                  className="case-study-detail__back"
                  onClick={() => navigate(-1)}
                  aria-label="Back to case studies"
                >
                  <ArrowLeft size={24} weight="regular" color="#3C3F43" aria-hidden="true" />
                  <span>Back</span>
                </button>
              </div>

              <nav className="case-study-detail__tabs" aria-label="Jump to section">
                {NAV_ITEMS.map((section) => {
                  const isActive = activeSection === section.id;
                  const SectionIcon = SECTION_ICON_COMPONENTS[section.id];
                  return (
                    <div key={section.id} className="case-study-detail__tab-row">
                      <button
                        type="button"
                        className={`case-study-detail__tab ${isActive ? 'is-active' : ''}`}
                        onClick={() => scrollToNavSection(section.id)}
                        onMouseEnter={() => setHoveredNavId(section.id)}
                        onMouseLeave={() => setHoveredNavId(null)}
                        onFocus={() => setHoveredNavId(section.id)}
                        onBlur={() => setHoveredNavId(null)}
                        aria-current={isActive ? 'location' : undefined}
                      >
                        <SectionIcon
                          size={24}
                          weight={isActive || hoveredNavId === section.id ? 'fill' : 'regular'}
                          color="currentColor"
                          aria-hidden="true"
                        />
                        <span>{section.label}</span>
                      </button>
                    </div>
                  );
                })}
              </nav>
            </div>

            <button type="button" className="case-study-detail__listen" aria-label="Listen to case study">
              <span className="case-study-detail__listen-icon" aria-hidden="true">
                <SpeakerHigh size={24} weight="regular" color="#7150E5" />
              </span>
              <span className="case-study-detail__listen-label">Listen</span>
            </button>
          </aside>

          <div className="case-study-detail__content">
            <section
              id="overview"
              ref={(el) => {
                sectionsRef.current.overview = el;
              }}
              className="case-study-detail__top"
            >
              <article className="case-study-detail__hero-card">
                <figure className="case-study-detail__hero-image-wrap">
                  <img
                    className="case-study-detail__hero-image case-study-detail__hero-image--cinema case-study-detail__hero-image--figma"
                    src={IMG.hero}
                    alt="Brown paper retail bags in warm sunlight"
                  />
                </figure>
                <div className="case-study-detail__hero-copy">
                  <p className="case-study-detail__hero-subtitle">Packaging | Green Cross</p>
                  <h1 id="case-study-detail-title" className="case-study-detail__hero-title">
                    Retail paper bags
                  </h1>
                  <p className="case-study-detail__hero-body">
                    Green Cross needed a practical paper bag system across Life Pharmacy and Unichem. I led design
                    direction to balance sustainability, brand clarity, and production reality.
                  </p>
                  <p className="case-study-detail__hero-meta">Estimated read time: 3 minutes | Duration: 4 weeks</p>
                </div>
              </article>

              <aside className="case-study-detail__summary" aria-label="Project summary">
                <h2>Project summary</h2>
                {[
                  {
                    label: 'Role',
                    value: 'Art direction, visual design, and packaging rollout assets',
                    size: 'summary-item--72',
                  },
                  {
                    label: 'Context',
                    value: 'Green Cross Health plastic-bag phase-out across NZ stores',
                    size: 'summary-item--48',
                  },
                  { label: 'Tools', value: 'InDesign, Illustrator, Photoshop', size: 'summary-item--48' },
                  {
                    label: 'Platforms',
                    value: 'In-store point of sale (POS), checkout touchpoints, and carry-out packaging',
                    size: 'summary-item--auto',
                  },
                  {
                    label: 'Audience',
                    value: 'Everyday pharmacy shoppers',
                    size: 'summary-item--24',
                  },
                  {
                    label: 'Focus',
                    value: 'Packaging system, hierarchy, and production-ready templates',
                    size: 'summary-item--48',
                  },
                  {
                    label: 'Designs',
                    value: 'Bag faces, side panels, lockups, and printable variants',
                    size: 'summary-item--48',
                  },
                  { label: 'Accessibility', value: 'High contrast, legible typography', size: 'summary-item--24' },
                  {
                    label: 'Team',
                    value: 'Brand, packaging, production, and illustrator collaboration',
                    size: 'summary-item--48',
                  },
                ].map(({ label, value, size }, idx, arr) => (
                  <React.Fragment key={label}>
                    <div className={`case-study-detail__summary-item ${size}`}>
                      <p>
                        <strong>{label}:</strong> {value}
                      </p>
                    </div>
                    {idx < arr.length - 1 && <div className="case-study-detail__summary-divider" aria-hidden="true" />}
                  </React.Fragment>
                ))}
              </aside>
            </section>

            <article
              id="brief"
              ref={(el) => {
                sectionsRef.current.brief = el;
              }}
              className="case-study-detail__split-card case-study-detail__split-card--brief"
            >
              <figure className="media-side case-study-detail__brief-media">
                <img src={IMG.duo1} alt="Life Pharmacy paper bag front and back" />
              </figure>
              <div className="text-side case-study-detail__brief-text">
                <div className="case-study-detail__brief-content">
                  <div className="case-study-detail__brief-top-group">
                    <div className="case-study-detail__brief-intro">
                      <h3>The brief</h3>
                      <div className="case-study-detail__brief-business">
                        <h4>Business context</h4>
                        <p>
                          With New Zealand’s single-use plastics ban kicking in, Green Cross Health needed packaging that
                          felt like a step forward.
                        </p>
                      </div>
                    </div>

                    <div className="case-study-detail__brief-priorities">
                      <h4>Priorities:</h4>
                      <ul>
                        <li>Make sustainability visible</li>
                        <li>Strengthen each brand’s individual presence</li>
                        <li>Turn a regulatory shift into a customer moment</li>
                      </ul>
                    </div>
                  </div>

                  <div className="case-study-detail__brief-question">
                    <h4 className="case-study-detail__brief-question-title">
                      How might we create paper bags that double as small billboards:
                    </h4>
                    <ul>
                      <li>Show sustainability upfront</li>
                      <li>Reflect Aotearoa’s (New Zealand) culture</li>
                      <li>Help the two brands feel distinct at a glance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </article>

            <article
              id="research"
              ref={(el) => {
                sectionsRef.current.research = el;
              }}
              className="case-study-detail__split-card case-study-detail__split-card--reverse"
            >
              <div className="text-side case-study-detail__text-stack">
                <h3>Research</h3>
                <p>With a tight timeline, I focused on what would directly impact the outcome.</p>
                <h4>Sustainability and material</h4>
                <p>
                  I reviewed recycled bag design. Many relied on bright greens and leaf symbols that felt surface-level.
                </p>
                <p>
                  I focused on kraft behaviour in print, ink absorption, fibre strength, dielines, and detail limits,
                  grounding decisions in production and avoiding greenwashing.
                </p>
                <h4>How people see a bag</h4>
                <p>Bags aren’t studied. They’re glimpsed.</p>
                <p>
                  Insights from Nielsen Norman Group shaped layouts. Hierarchy and contrast drive instant recognition.
                </p>
              </div>
              <figure className="media-side">
                <img src={IMG.research} alt="Research notes and references" />
              </figure>
            </article>

            <article
              id="process"
              ref={(el) => {
                sectionsRef.current.process = el;
              }}
              className="case-study-detail__split-card"
            >
              <figure className="media-side">
                <img src={IMG.process} alt="Process visual board" />
              </figure>
              <div className="text-side case-study-detail__text-stack">
                <h3>Process &amp; approach</h3>
                <p>
                  The project began with early concepts from an external agency. While they didn’t fully capture the
                  direction, I saw an opportunity to take a different approach and developed a new concept from scratch.
                </p>
                <p>
                  Over four days, I introduced warmth, clarity, and cultural grounding, helping build trust and set a
                  more collaborative path.
                </p>
                <h4>Direction</h4>
                <p>I created moodboards to quickly align both brands and establish a shared visual tone.</p>
                <p>
                  The direction drew from papercraft references. Burano lacework, artists like Karen Bit Vejle and Maude
                  White, and traditional Japanese kirie.
                </p>
                <p>
                  The focus wasn’t decoration. It was structure. Negative space and clean geometry created a system
                  designed for clarity, used where space allowed.
                </p>
              </div>
            </article>

            <article className="case-study-detail__panel">
              <img className="full-bleed-media" src={IMG.brief} alt="Early layout exploration for paper bags" />
            </article>
            <article className="case-study-detail__panel">
              <img className="full-bleed-media" src={IMG.typographyBanner} alt="Design system exploration boards" />
            </article>

            <article className="case-study-detail__text-panel">
              <h4>Messaging</h4>
              <p>I refined copy into short, high-impact lines designed to land instantly in busy retail:</p>
              <ul>
                <li>Life Pharmacy. “It’s what’s on the inside that counts”</li>
                <li>Unichem. “Our greatest wealth is health”</li>
              </ul>
              <p>
                Clear, human, and easy to absorb in motion. Side panels carried Living Rewards and sustainability details,
                keeping the main faces focused and uncluttered.
              </p>
            </article>

            <article className="case-study-detail__text-panel">
              <h4>Te reo Māori</h4>
              <p>
                I introduced te reo Māori to bring warmth and cultural meaning into the system, in a way that felt
                authentic, not decorative:
              </p>
              <ul>
                <li>Life Pharmacy. “Aroha nui” (much love)</li>
                <li>Unichem. “Kia ora” (a welcoming greeting)</li>
              </ul>
              <p>These phrases grounded the design in Aotearoa and reinforced tone, identity, and emotional connection.</p>
            </article>

            <article className="case-study-detail__panel">
              <img className="full-bleed-media" src={IMG.duo3} alt="Paper bag design development" />
            </article>

            <article className="case-study-detail__text-panel">
              <h4>Design development</h4>
              <p>
                I worked with suppliers and dielines to adapt motifs and copy across six bag sizes, simplifying where
                needed to maintain clarity.
              </p>
              <p>
                Negative space and simple geometry reduced visual noise and improved legibility on a challenging print
                surface.
              </p>
              <p>
                Final motifs were developed with Morgan Paige Taitoko, forming a subtle heart that introduced warmth and
                anchored the system.
              </p>
            </article>

            <article
              id="solution"
              ref={(el) => {
                sectionsRef.current.solution = el;
              }}
              className="case-study-detail__split-card case-study-detail__split-card--solution"
            >
              <figure className="media-side case-study-detail__solution-media">
                <img src={IMG.solution} alt="Design solution visual" />
              </figure>
              <div className="text-side case-study-detail__text-stack">
                <h3>Design solution</h3>
                <p>
                  The final system separates the two brands clearly while keeping sustainability, clarity, and usability at
                  the core.
                </p>
                <p>
                  Life Pharmacy takes a warmer, more expressive approach. Brush-stroke typography and papercut-inspired
                  motifs create a boutique feel, with Aroha nui acting as a clear, human focal point.
                </p>
                <p>
                  Unichem is more structured and knowledge-led. Kia ora is broken down across two lines, making it both
                  welcoming and informative, while maintaining consistency with the shared stencil and lace style.
                </p>
                <p>
                  Across both, negative space and high contrast improve readability on kraft, helping messages cut through
                  quickly in-store.
                </p>
                <p>The system scales cleanly across all six bag sizes, balancing visual impact with real-world production constraints.</p>
              </div>
            </article>

            <article className="case-study-detail__panel">
              <img
                className="full-bleed-media"
                src={IMG.duo2}
                alt="Unichem paper bag front and back in retail context"
              />
            </article>

            <article className="case-study-detail__split-card case-study-detail__split-card--reverse case-study-detail__split-card--digital">
              <div className="text-side case-study-detail__text-stack case-study-detail__digital-text">
                <h4>Bag system in use</h4>
                <p>Artwork translated across sizes while retaining hierarchy and brand cues.</p>
                <p>
                  Colour and icon decisions were tested for contrast and print consistency.
                </p>
                <p>Layouts were built from one system so each variant felt intentional, not retrofitted.</p>
                <h4>Design principles</h4>
                <p>The system balanced utility with distinct brand personality.</p>
                <ul>
                  <li>Clear hierarchy at a glance</li>
                  <li>Consistent lockups across sizes</li>
                  <li>Production-safe detail decisions</li>
                </ul>
                <p>A reusable file system made rollout faster across teams and suppliers.</p>
                <p>Distinct, practical, and easy to deploy at scale.</p>
              </div>
              <figure className="media-side case-study-detail__digital-media">
                <img
                  className="case-study-detail__digital-background"
                  src={IMG.digital}
                  alt="Digital campaign out-of-home visual"
                />
                <div className="case-study-detail__digital-overlay" aria-hidden="true">
                  <img
                    className="case-study-detail__digital-overlay-image"
                    src={IMG.digitalPoster}
                    alt=""
                  />
                </div>
              </figure>
            </article>

            <article className="case-study-detail__text-panel">
              <h4>Outcome</h4>
              <p>The final packaging unified intent and execution across two brands.</p>
              <p>
                From concept through print, the system remained clear, recognisable, and production-ready.
              </p>
              <p>The result: everyday brand touchpoints that feel considered and cohesive.</p>
            </article>

            <article
              id="impact"
              ref={(el) => {
                sectionsRef.current.impact = el;
              }}
              className="case-study-detail__split-card case-study-detail__split-card--impact"
            >
              <figure className="media-side case-study-detail__impact-media">
                <img src={IMG.impact} alt="Packaging impact visual" />
              </figure>
              <div className="text-side case-study-detail__text-stack">
                <h3>Impact &amp; learnings</h3>
                <p>
                  The redesign rolled out across ~360 pharmacies, turning a functional item into a high-frequency brand
                  touchpoint.
                </p>
                <p>
                  Each bag replaced single-use plastic while reinforcing brand, culture, and sustainability in everyday
                  moments.
                </p>
                <ul>
                  <li>Strengthened loyalty through Living Rewards messaging</li>
                  <li>Embedded te reo Māori and local motifs to build cultural presence</li>
                  <li>Designed for rollout, with production decisions supporting consistency at scale</li>
                </ul>
                <p>By elevating a disposable item, the system built brand equity in places most campaigns never reach.</p>
              </div>
            </article>

            <section className="case-study-detail__testimonials" aria-label="Testimonials">
              {TESTIMONIALS.map((item) => (
                <article key={item.quote} className={`case-study-detail__testimonial-card ${item.className}`}>
                  <img className="case-study-detail__testimonial-bubble" src={item.bubble} alt="" aria-hidden="true" />
                  <div className="case-study-detail__testimonial-content">
                    <p className="case-study-detail__testimonial-quote">{item.quote}</p>
                    <p className="case-study-detail__testimonial-author">{item.author}</p>
                  </div>
                </article>
              ))}
            </section>

            <article
              id="reflection"
              ref={(el) => {
                sectionsRef.current.reflection = el;
              }}
              className="case-study-detail__split-card case-study-detail__split-card--reverse case-study-detail__split-card--reflection"
            >
              <div className="text-side case-study-detail__text-stack">
                <h3>Reflection</h3>
                <p>
                  This project reinforced how much impact small, everyday touchpoints can carry when tied to strategy.
                </p>
                <p>
                  The bags are simple, but they deliver brand, culture, and consistency at scale. Clear, recognisable, and
                  grounded in Aotearoa.
                </p>
                <p>
                  It also highlighted the balance between creative ambition, cultural respect, and real-world feasibility,
                  and how much strong collaboration shapes the final outcome.
                </p>
                <p>Looking ahead, there’s opportunity to extend the system further:</p>
                <ul>
                  <li>Seasonal or rotating phrases tied to key moments like Matariki or Christmas</li>
                  <li>Deeper links into fashion and beauty culture through collaborations</li>
                  <li>A premium, fully sustainable line that elevates the everyday bag</li>
                </ul>
                <p>
                  For me, it reinforced a core belief. The most effective design isn’t always the most visible, it’s the
                  most considered.
                </p>
              </div>
              <figure className="media-side case-study-detail__reflection-media">
                <img src={IMG.reflection} alt="Reflection visual" />
              </figure>
            </article>

            <article
              id="sources"
              ref={(el) => {
                sectionsRef.current.sources = el;
              }}
              className="case-study-detail__split-card case-study-detail__split-card--sources"
            >
              <figure className="media-side media-side--tall case-study-detail__sources-media">
                <img src={IMG.sources} alt="Sources and credits visual" />
              </figure>
              <div className="text-side case-study-detail__text-stack">
                <h3>Sources &amp; credits</h3>
                <p>
                  Thanks to everyone involved across Green Cross Health, brand, packaging, and production teams.
                </p>
                <div className="credits-list">
                  <p>Nielsen Norman Group. Scan-reading and visual hierarchy research</p>
                  <p>TAPPI. Kraft paper and print performance studies</p>
                  <p>Ministry for the Environment (NZ). Plastic bag ban and sustainability guidance</p>
                  <p>Outdoor Advertising Association of America (OAAA). Visibility and readability research</p>
                  <p>Papercut traditions (Kirie, European lacework) and artists including Karen Bit Vejle and Maude White</p>
                </div>
              </div>
            </article>

          </div>
        </div>
        <section className="case-study-detail__more-projects" aria-label="Explore more projects">
          <div className="case-study-detail__more-projects-rule" aria-hidden="true" />
          <h2>Explore More Projects</h2>
          <div className="case-study-detail__more-projects-list">
            {MORE_PROJECTS.map((study) => (
              <CaseStudyCard key={study.subtitle} study={study} />
            ))}
          </div>
          <button type="button" className="case-study-detail__view-all">
            <Folders size={24} weight="regular" />
            <span>View all cases</span>
          </button>
        </section>
      </div>
      <SiteFooter />
    </section>
  );
};
