import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  { id: 'impact', label: 'Impact' },
  { id: 'reflection', label: 'Reflection' },
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

const PALE_YELLOW_PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='984' height='680' viewBox='0 0 984 680'><rect width='984' height='680' fill='%23F6F2C0'/></svg>";
const SOFT_PEACH_PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='984' height='680' viewBox='0 0 984 680'><rect width='984' height='680' fill='%23FFE9B8'/></svg>";

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
    quote: 'It drew people in more, especially around the summer promo areas.',
    author: 'Store team member, Auckland',
    className: 'case-study-detail__testimonial-card--top-left',
    bubble: '/case-study/464ed7b7414f42b86b14ae25bcac75852bc99010.svg',
  },
  {
    quote: 'It feels more welcoming, like you actually want to look around.',
    author: 'Customer, Auckland',
    className: 'case-study-detail__testimonial-card--top-right',
    bubble: '/case-study/18f9645bf37c99104bb50a07a5a4af98f0aec53a.svg',
  },
  {
    quote: 'The colour really lifted the space, especially on grey days.',
    author: 'Store team member, Auckland',
    className: 'case-study-detail__testimonial-card--bottom-left',
    bubble: '/case-study/67f34898ea6b9e22ca7d4c59fe0a19577d334a39.svg',
  },
  {
    quote: 'It’s bright and welcoming, it just makes the whole store feel better.',
    author: 'Customer, Auckland',
    className: 'case-study-detail__testimonial-card--bottom-right',
    bubble: '/case-study/55848b141f11b80be83c56000477a15b580f06a6.svg',
  },
];

const MORE_PROJECTS: CaseStudyCardStudy[] = [
  {
    id: 101,
    subtitle: 'Unichem | Packaging system',
    title: 'How do you make compliance feel branded and useful?',
    description:
      'Green Cross Health needed compliant paper bags that worked across Life Pharmacy and Unichem while maintaining distinct identities.',
    image: '/case-study-gch/1ed717e27b4208d7579d7f929d28b0624fde988e.png',
    duration: '4 weeks',
    category: 'campaigns',
  },
  {
    id: 102,
    subtitle: 'Green Cross Health | Packaging',
    title: 'How do you keep two brands distinct in one rollout?',
    description:
      'When New Zealand banned single-use plastic, Green Cross Health needed new bags that felt purposeful. The challenge was to create a system for Life Pharmacy and Unichem that communicated care, sustainability, and identity across a nationwide rollout.',
    image: '/case-study-gch/ae57819f1182ad7e22b284384065d1925c6aabd7.png',
    duration: '4 weeks',
    category: 'packaging',
  },
];

export const CaseStudyDetailGch: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<NavSectionId>('overview');
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const nodes = NAV_ITEMS.map((s) => sectionsRef.current[s.id])
      .filter((el): el is HTMLElement => Boolean(el));
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
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
                    <button
                      key={section.id}
                      type="button"
                      className={`case-study-detail__tab ${isActive ? 'is-active' : ''}`}
                      onClick={() => {
                        sectionsRef.current[section.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      aria-current={isActive ? 'location' : undefined}
                    >
                      <SectionIcon size={24} weight={isActive ? 'fill' : 'regular'} aria-hidden="true" />
                      <span>{section.label}</span>
                    </button>
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
                    className="case-study-detail__hero-image case-study-detail__hero-image--figma"
                    src={IMG.hero}
                    alt="Summer campaign hero visual"
                  />
                </figure>
                <div className="case-study-detail__hero-copy">
                  <p className="case-study-detail__hero-subtitle">Packaging | Green Cross Health</p>
                  <h1 id="case-study-detail-title" className="case-study-detail__hero-title">
                    Retail paper bags
                  </h1>
                  <p className="case-study-detail__hero-body">
                    A plastics ban opened the door to rethink how Life Pharmacy and Unichem show up. I designed paper bags as small moments of brand, culture and distinction.
                  </p>
                  <p className="case-study-detail__hero-meta">Estimated read time: 3 minutes | Duration: 4 weeks</p>
                </div>
              </article>

              <aside className="case-study-detail__summary" aria-label="Project summary">
                <h2>Project summary</h2>
                {[
                  {
                    label: 'Role',
                    value: 'Art direction, visual design, and photography direction across campaign assets',
                    size: 'summary-item--72',
                  },
                  {
                    label: 'Context',
                    value: 'Nationwide transition from plastic to paper bags for Life Pharmacy and Unichem',
                    size: 'summary-item--48',
                  },
                  { label: 'Tools', value: 'Figma, Miro, InDesign, Photoshop, Illustrator', size: 'summary-item--48' },
                  {
                    label: 'Platforms',
                    value: 'Platforms: In-store point of sale (POS), out-of-home (OOH), website, digital, social',
                    size: 'summary-item--auto',
                  },
                  { label: 'Audience', value: 'Life Pharmacy and Unichem customers', size: 'summary-item--24' },
                  {
                    label: 'Focus',
                    value: 'Packaging system, retail-ready artwork, print production, and rollout governance',
                    size: 'summary-item--48',
                  },
                  {
                    label: 'Designs',
                    value: 'Bag front/back artwork, lockups, print-ready variants, and supplier specs',
                    size: 'summary-item--48',
                  },
                  { label: 'Accessibility', value: 'Clear hierarchy, high visibility', size: 'summary-item--24' },
                  {
                    label: 'Team',
                    value: 'Brand, packaging, production, and retail operations stakeholders',
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
                <img src={IMG.brief} alt="Brief placeholder visual" />
              </figure>
              <div className="text-side case-study-detail__brief-text">
                <div className="case-study-detail__brief-content">
                  <div className="case-study-detail__brief-top-group">
                    <div className="case-study-detail__brief-intro">
                      <h3>The brief</h3>
                      <div className="case-study-detail__brief-business">
                        <h4>Business context</h4>
                        <p>
                          The NZ plastic-bag phase-out required compliant replacements across two brands. The system needed to preserve recognition while staying practical for rollout.
                        </p>
                      </div>
                    </div>

                    <div className="case-study-detail__brief-priorities">
                      <h4>Priorities:</h4>
                      <ul>
                        <li>Drive visibility in busy environments</li>
                        <li>Keep messaging clear across channels</li>
                        <li>Keep both brands distinct while sharing a practical production framework</li>
                      </ul>
                    </div>
                  </div>

                  <div className="case-study-detail__brief-question">
                    <h4 className="case-study-detail__brief-question-title">
                      How might we design compliant retail paper bags that:
                    </h4>
                    <ul>
                      <li>Preserve brand recognition for Life Pharmacy and Unichem</li>
                      <li>Work across small and large bag formats</li>
                      <li>Remain clear and legible in real-world retail use</li>
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
                <h4>Sustainability and material insight</h4>
                <p>Shoppers glance at bags quickly; recognition comes from bold hierarchy, symbols, and clear colour cues.</p>
                <p>Material, ink coverage, and print constraints strongly influence what survives production.</p>
                <h4>Key insights</h4>
                <ul>
                  <li>Bag graphics are seen in motion, not studied</li>
                  <li>Contrast and hierarchy drive instant recognition</li>
                  <li>Large iconography improves wayfinding at a glance</li>
                  <li>Print-safe colour and line weights reduce production risk</li>
                </ul>
              </div>
              <figure className="media-side">
                <img src={IMG.research} alt="Research placeholder visual" />
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
                <img src={IMG.process} alt="Process placeholder visual" />
              </figure>
              <div className="text-side case-study-detail__text-stack">
                <h3>Process &amp; approach</h3>
                <h4>Defining the visual direction</h4>
                <p>POS came first, anchoring the direction early.</p>
                <p>
                  I built rapid concept routes for front/back bag layouts, balancing brand expression with manufacturing constraints.
                </p>
                <p>Routes were tested against kraft stock, ink absorption, fold lines, and handle placements.</p>
                <p>The goal: practical production files that still feel branded, warm, and distinct.</p>
              </div>
            </article>

            <article className="case-study-detail__panel case-study-detail__composite-panel case-study-detail__composite-panel--typography">
              <figure className="case-study-detail__typography-specimen">
                <img
                  className="case-study-detail__typography-specimen-image"
                  src={IMG.typographySpecimen}
                  alt="Typography specimen board"
                />
              </figure>
              <figure className="case-study-detail__typography-banner">
                <img
                  className="case-study-detail__typography-banner-image"
                  src={IMG.typographyBanner}
                  alt="Packaging concept board"
                />
              </figure>
            </article>

            <article className="case-study-detail__panel case-study-detail__color-panel">
              <div className="case-study-detail__color-bars" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </article>

            <article className="case-study-detail__text-panel">
              <h4>Balancing brand attitude</h4>
              <p>
                I aligned both bag systems around recognisable icons, disciplined spacing, and consistent typography.
              </p>
              <p>Small touchpoints can carry significant brand weight when applied intentionally.</p>
            </article>

            <section className="case-study-detail__two-up case-study-detail__two-up--featured">
              <img className="case-study-detail__poster-image case-study-detail__poster-image--one" src={IMG.duo1} alt="Campaign visual placeholder one" />
              <img className="case-study-detail__poster-image case-study-detail__poster-image--two" src={IMG.duo2} alt="Campaign visual placeholder two" />
            </section>

            <article className="case-study-detail__text-panel">
              <h4>Finding the balance</h4>
              <p>
                Where possible, lower camera angles gave talent presence while keeping it open and approachable.
              </p>
              <p>The result. Bold, spirited imagery that still felt warm and human.</p>
            </article>

            <section className="case-study-detail__two-up case-study-detail__two-up--posters">
              <div className="case-study-detail__two-up-row">
                <img className="case-study-detail__poster-image case-study-detail__poster-image--three" src={IMG.duo3} alt="Life Pharmacy bag concept one" />
                <img className="case-study-detail__poster-image case-study-detail__poster-image--four" src={IMG.duo4} alt="Unichem bag concept one" />
              </div>
              <p className="case-study-detail__two-up-caption">Bag concept variants</p>
            </section>

            <article className="case-study-detail__text-panel">
              <h4>Designing for retail reality</h4>
              <p>
                Production constraints were locked early: dielines, gusset folds, handle clearance, and one-colour versus multi-colour print options.
              </p>
              <p>I created print-ready templates covering safe zones, lockups, and scalable front/back systems.</p>
            </article>

            <article className="case-study-detail__panel">
              <img className="full-bleed-media case-study-detail__store-image" src={IMG.posterWall} alt="Life Pharmacy and Unichem bag lineup" />
            </article>

            <article className="case-study-detail__text-panel">
              <h4>Efficiency and consistency at scale</h4>
              <p>This reduced rework, avoided crop issues, and ensured consistency across formats.</p>
              <p>Early mockups helped the team visualise how the campaign would land in-store.</p>
            </article>

            <article className="case-study-detail__panel case-study-detail__panel--retail-display">
              <img className="full-bleed-media case-study-detail__retail-display-image" src={IMG.retailDisplay} alt="Bag application in retail context" />
            </article>

            <article className="case-study-detail__text-panel case-study-detail__text-panel--scaling">
              <h4>Scaling across channels</h4>
              <p>Once POS was established, I extended the system into digital.</p>
              <p>I mapped twelve layout compositions across key banner sizes, planning for product hierarchy and messaging.</p>
              <ul>
                <li>POS carried in-store visibility and impact</li>
                <li>Consistent icon hierarchy reinforced recognition across both brands</li>
              </ul>
              <p>Layouts were tested early. From large posters to small mobile banners, everything remained clear and consistent.</p>
            </article>

            <section className="case-study-detail__four-up">
              <div className="case-study-detail__four-up-grid">
                <figure className="case-study-detail__four-up-tile case-study-detail__four-up-tile--1">
                  <img className="case-study-detail__four-up-image case-study-detail__four-up-image--1" src={IMG.outOfHome1} alt="Out of home concept visual one" />
                </figure>
                <figure className="case-study-detail__four-up-tile case-study-detail__four-up-tile--2">
                  <img className="case-study-detail__four-up-image case-study-detail__four-up-image--2" src={IMG.outOfHome2} alt="Out of home concept visual two" />
                </figure>
                <figure className="case-study-detail__four-up-tile case-study-detail__four-up-tile--3">
                  <img className="case-study-detail__four-up-image case-study-detail__four-up-image--3" src={IMG.outOfHome3} alt="Out of home concept visual three" />
                </figure>
                <figure className="case-study-detail__four-up-tile case-study-detail__four-up-tile--4">
                  <img className="case-study-detail__four-up-image case-study-detail__four-up-image--4" src={IMG.outOfHome4} alt="Out of home concept visual four" />
                </figure>
              </div>
              <p className="case-study-detail__four-up-caption">Example of out of home</p>
            </section>

            <article className="case-study-detail__text-panel">
              <h4>Crafting authentic moments</h4>
              <p>
                Supplier collaboration and iterative proofing ensured the final bags held up in real retail environments.
              </p>
              <p>
                I worked with brand, packaging, and production stakeholders to align visual intent with manufacturing constraints.
              </p>
              <p>Not just compliance - cohesive, recognisable bags at scale.</p>
            </article>

            <article className="case-study-detail__panel case-study-detail__panel--commercial-bay">
              <img
                className="full-bleed-media case-study-detail__commercial-bay-image"
                src={IMG.commercialBay}
                alt="Bag mockups in context"
              />
              <img
                className="case-study-detail__commercial-bay-poster"
                src={IMG.commercialBayPoster}
                alt="Street furniture poster close-up"
              />
            </article>

            <article
              id="solution"
              ref={(el) => {
                sectionsRef.current.solution = el;
              }}
              className="case-study-detail__split-card case-study-detail__split-card--solution"
            >
              <figure className="media-side case-study-detail__solution-media">
                <img src={IMG.solution} alt="Design solution placeholder visual" />
              </figure>
              <div className="text-side case-study-detail__text-stack">
                <h3>Design solution</h3>
                <p>
                  The packaging system was designed to scale across two retail brands with clear visual distinction and shared production logic.
                </p>
                <h4>Production-ready execution</h4>
                <p>
                  Final files balanced icon hierarchy, logo lockups, and clean information architecture on kraft stock. 
                  <br></br><br></br>A soft yellow
                  This improved legibility while preserving each brand's tone.
                </p>
                <p>Reusable templates reduced rework and approval cycles. 
                  <br></br><br></br>The result: practical, scalable, and recognisable packaging.</p>
              </div>
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
                  Full performance metrics weren’t available following my departure, but feedback from teams and
                  customers was strong.
                </p>
                <h4>What worked well:</h4>
                <ul>
                  <li>Brighter, easier-to-navigate POS (store teams)</li>
                  <li>Strong response to colour and photography</li>
                  <li>Arc system organised space without clutter</li>
                  <li>Templates enabled smooth digital rollout</li>
                </ul>
                <h4>Key learnings:</h4>
                <ul>
                  <li>Photography templates saved time</li>
                  <li>Early mockups aligned the team faster</li>
                  <li>Joining a fast-moving agile squad late required rapid collaboration</li>
                  <li>Small visual shifts had a big impact on mood</li>
                </ul>
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
                <p>I stepped into the campaign with POS needing delivery within 48 hours.</p>
                <p>
                  This meant prioritising what mattered most. Clarity, speed, and getting the system working in-store.
                </p>
                <p>
                  With more time, I would have developed POS and digital as one unified system, extending elements like
                  the arc more consistently across channels.
                </p>
                <p>
                  The takeaway. Strong campaigns aren’t just about ideas. They’re about making the right decisions
                  under pressure, and focusing effort where it has the biggest impact.
                </p>
              </div>
              <figure className="media-side case-study-detail__reflection-media">
                <img src={IMG.reflection} alt="Reflection campaign visual" />
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
                  Thanks to everyone involved in bringing this packaging rollout to life across brand, packaging, and production teams.
                </p>
                <p>Collaboration across design and production made execution smoother and more consistent.</p>
                <br></br>
                <div className="credits-list">
                  <p>
                    <strong>Client:</strong> Green Cross Health
                  </p>
                  <p>
                    <strong>Design Lead:</strong> Samantha Smith
                  </p>
                  <p>
                    <strong>Content Specialist:</strong> Amanda Sachtleben
                  </p>
                  <p>
                    <strong>Production Design:</strong> Isabella Clark, Rodney Hazelden
                  </p>
                  <p>
                    <strong>Brand Marketing:</strong> Vanessa Hitchcock, Tina Davis
                  </p>
                  <p>
                    <strong>Producer:</strong> Sarah Miller
                  </p>
                  <p>
                    <strong>Production Partner:</strong> Packaging and print suppliers
                  </p>
                  <p>
                    <strong>Photographer’s Assistant:</strong> Georgia Paalvast
                  </p>
                  <p>
                    <strong>POS Stylist:</strong> Anna Clark
                  </p>
                  <p>
                    <strong>Location Stylist:</strong> Lili Janes
                  </p>
                  <p>
                    <strong>Stylist Assistant:</strong> Rosie Galbraith
                  </p>
                  <p>
                    <strong>Hair &amp; Make-up:</strong> Sharon Laurence-Anderson, Greer Melrose, Angela Stewart
                  </p>
                  <p>
                    <strong>Retoucher:</strong> Adrian Fitzgerald
                  </p>
                  <p>
                    <strong>Social Media:</strong> Bhavika Rambhai
                  </p>
                  <p>
                    <strong>Brands:</strong> Life Pharmacy, Unichem
                  </p>
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
              <CaseStudyCard key={study.id} study={study} />
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
