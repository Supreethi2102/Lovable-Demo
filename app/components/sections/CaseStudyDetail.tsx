import React, { useEffect, useRef, useState } from 'react';
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
  hero: '/case-study/d233035fbaa64737f4e909ea22998570595430a6.png',
  brief: PALE_YELLOW_PLACEHOLDER,
  research: PALE_YELLOW_PLACEHOLDER,
  process: PALE_YELLOW_PLACEHOLDER,
  typographySpecimen: '/case-study/d65aed70beb865887889dd3c5f06cd6bf5c9d477.png',
  typographyBanner: '/case-study/03547ee2bd4c8e085ddea659c7a441a7264e5dec.png',
  duo1: '/case-study/d4697502ed5e69abbaf0bb54b77e96e029f8e8b6.png',
  duo2: '/case-study/d7004698761ed6e3810eadf92d0903e5f4e82a66.png',
  duo3: '/case-study/62eeed7dd160a416968b60c5b7ef091e2a70a691.png',
  duo4: '/case-study/1434484e436c9792a4b3be4d3168f30402d459f9.png',
  posterWall: '/case-study/798ee256543e94c3048f8c61c1a32c6043c58432.png',
  retailDisplay: '/case-study/80d0fa33b8db01a571940684aff1b04390de245e.png',
  outOfHome1: '/case-study/b510a2000795945dd04e174ac1f4ff27b591944d.png',
  outOfHome2: '/case-study/0d3d8bb84f197f8dc776287e25dcd964a24ff88c.png',
  outOfHome3: '/case-study/0d3d8bb84f197f8dc776287e25dcd964a24ff88c.png',
  outOfHome4: '/case-study/32e97d51f7d8bf4db468bfa0e852b8b0364ccc34.png',
  commercialBay: '/case-study/b648eda156ce1609157f311528bb6ecf5c80f573.png',
  commercialBayPoster: '/case-study/c052fab905012d597ad9d12a9d89fbf2323c42ec.png',
  digitalPoster: '/case-study/9163a5067802a9e3cc0e8971deb021834c7de8c9.png',
  solution: SOFT_PEACH_PLACEHOLDER,
  digital: '/case-study/8d3d71c4521118f1643cfc2b643e9bdd6779cd20.png',
  impact: '/case-study/b3fa48388ea7dbd31884495c50ed00a9adf2ac9d.png',
  reflection: '/case-study/b167dc0821f705bdd7e5e2e689f7618823363a99.png',
  sources: '/case-study/82686ef1716fd19cdcf8bc4140790e3a68ac5475.png',
  explore1: '/case-study/c8cdbdceb1fbf0c9bca7307bcba47c77cfbb2e81.png',
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
    subtitle: 'The Warehouse | Mega Toy Month Campaign',
    title: 'How do you turn a toy sale into a month-long adventure?',
    description:
      'Families entered the July school holidays with tight budgets after lockdowns. The Warehouse needed a campaign that felt playful for kids, clear and value-driven for parents, and strong enough to drive online and in-store sales across busy retail channels.',
    image: '/case-study/c8cdbdceb1fbf0c9bca7307bcba47c77cfbb2e81.png',
    duration: '4 weeks',
    category: 'campaigns',
  },
  {
    id: 102,
    subtitle: 'Green Cross Health | Packaging',
    title: 'What if the most-seen brand asset wasn’t digital at all?',
    description:
      'When New Zealand banned single-use plastic, Green Cross Health needed new bags that felt purposeful. The challenge was to create a system for Life Pharmacy and Unichem that communicated care, sustainability, and identity across a nationwide rollout.',
    image: '/misc/Placeholder.png',
    duration: '4 weeks',
    category: 'packaging',
  },
];

export const CaseStudyDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState<NavSectionId>('overview');
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [id]);

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
                  <p className="case-study-detail__hero-subtitle">Campaign | The Warehouse</p>
                  <h1 id="case-study-detail-title" className="case-study-detail__hero-title">
                    Summer Season
                  </h1>
                  <p className="case-study-detail__hero-body">
                    The Warehouse needed a bright summer campaign across store and digital. I led direction, shaping
                    photography and layouts into a cohesive look.
                  </p>
                  <p className="case-study-detail__hero-meta">Estimated read time: 3 minutes | Duration: 12 weeks</p>
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
                    value: 'The Warehouse’s key summer campaign during peak holiday trading',
                    size: 'summary-item--48',
                  },
                  { label: 'Tools', value: 'Figma, Miro, InDesign, Photoshop, Illustrator', size: 'summary-item--48' },
                  {
                    label: 'Platforms',
                    value: 'Platforms: In-store point of sale (POS), out-of-home (OOH), website, digital, social',
                    size: 'summary-item--auto',
                  },
                  { label: 'Audience', value: 'Everyday Kiwi shoppers', size: 'summary-item--24' },
                  {
                    label: 'Focus',
                    value: 'POS system, photography direction, templates, digital campaign rollout',
                    size: 'summary-item--48',
                  },
                  {
                    label: 'Designs',
                    value: 'Campaign key visuals, in-store POS layouts, digital banner suite',
                    size: 'summary-item--48',
                  },
                  { label: 'Accessibility', value: 'Clear hierarchy, high visibility', size: 'summary-item--24' },
                  {
                    label: 'Team',
                    value: 'Production designers, photographers, stylists, writer, buyers, marketing, store ops',
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
                          Summer 2023 was a key retail window for The Warehouse. With declining foot traffic, the
                          campaign needed to cut through across store and digital.
                        </p>
                      </div>
                    </div>

                    <div className="case-study-detail__brief-priorities">
                      <h4>Priorities:</h4>
                      <ul>
                        <li>Drive visibility in busy environments</li>
                        <li>Keep messaging clear across channels</li>
                        <li>Make summer shopping feel easy and uplifting</li>
                      </ul>
                    </div>
                  </div>

                  <div className="case-study-detail__brief-question">
                    <h4 className="case-study-detail__brief-question-title">
                      How might we create a bright, cohesive summer campaign that:
                    </h4>
                    <ul>
                      <li>Feels optimistic and unmistakably The Warehouse</li>
                      <li>Connects POS and digital</li>
                      <li>Helps customers browse quickly and confidently</li>
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
                <h4>Customer insight</h4>
                <p>Kiwi families were balancing tighter budgets with the desire for a classic summer.</p>
                <p>The experience needed to feel simple, bright, and easy to navigate.</p>
                <h4>Key insights</h4>
                <ul>
                  <li>Clarity wins in-store. Fast, scannable visuals</li>
                  <li>Joyful, not chaotic. Bright colour with clean layouts</li>
                  <li>Value matters. Products need to justify the cost</li>
                  <li>Keep it real. Warm, authentically Kiwi photography</li>
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
                  Moodboards explored colour, photography, styling, and tone. Inspired by Californian supergraphics,
                  grounded in a distinctly Kiwi feel.
                </p>
                <p>Warm light, relaxed posing, and natural energy set the foundation.</p>
                <p>The goal. Bold enough to stand out in-store, yet effortless and local.</p>
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
                  alt="Summer savings banner"
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
                In partnership with TBWA, a global creative agency, the campaign embraced a confident “small spender”
                attitude. Easy to overplay.
              </p>
              <p>Too confident risks distance. Too soft loses impact.</p>
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
                <img className="case-study-detail__poster-image case-study-detail__poster-image--three" src={IMG.duo3} alt="LP1 poster design visual one" />
                <img className="case-study-detail__poster-image case-study-detail__poster-image--four" src={IMG.duo4} alt="LP1 poster design visual two" />
              </div>
              <p className="case-study-detail__two-up-caption">LP1 Posters</p>
            </section>

            <article className="case-study-detail__text-panel">
              <h4>Designing for retail reality</h4>
              <p>
                Retail constraints were locked in before the shoot. EAS security gates, pallet wraps, and LP1 posters
                all came with strict crop and messaging rules.
              </p>
              <p>I built POS templates covering crop ratios, safe zones, type placement, and fixture specs.</p>
            </article>

            <article className="case-study-detail__panel">
              <img className="full-bleed-media case-study-detail__store-image" src={IMG.posterWall} alt="In-store summer poster wall" />
            </article>

            <article className="case-study-detail__text-panel">
              <h4>Efficiency and consistency at scale</h4>
              <p>This reduced rework, avoided crop issues, and ensured consistency across formats.</p>
              <p>Early mockups helped the team visualise how the campaign would land in-store.</p>
            </article>

            <article className="case-study-detail__panel case-study-detail__panel--retail-display">
              <img className="full-bleed-media case-study-detail__retail-display-image" src={IMG.retailDisplay} alt="Summer retail display in store" />
            </article>

            <article className="case-study-detail__text-panel case-study-detail__text-panel--scaling">
              <h4>Scaling across channels</h4>
              <p>Once POS was established, I extended the system into digital.</p>
              <p>I mapped twelve layout compositions across key banner sizes, planning for product hierarchy and messaging.</p>
              <ul>
                <li>POS carried in-store visibility and impact</li>
                <li>Digital reinforced brand recognition through The Warehouse colour system</li>
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
                A three-day lifestyle shoot at Maraetai Beach brought genuine Kiwi summer moments into the campaign.
              </p>
              <p>
                I worked closely with photographers, a retoucher, production designers, a writer, and a producer to
                refine selects and align visuals with messaging.
              </p>
              <p>Not just visual consistency. A shared feeling across every channel.</p>
            </article>

            <article className="case-study-detail__panel case-study-detail__panel--commercial-bay">
              <img
                className="full-bleed-media case-study-detail__commercial-bay-image"
                src={IMG.commercialBay}
                alt="Commercial Bay out-of-home installation"
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
                  The campaign was built as a flexible system that moved seamlessly between retail and digital. One
                  unified visual language, designed to adapt across environments.
                </p>
                <h4>In-store POS</h4>
                <p>
                  The arc-based supergraphic created movement, framed products, and guided shoppers. 
                  <br></br><br></br>A soft yellow
                  backdrop increased visibility while keeping the tone warm.
                </p>
                <p>Photography allowed space for messaging. 
                  <br></br><br></br>The result. Clear at distance, energetic up close.</p>
              </div>
            </article>

            <article className="case-study-detail__split-card case-study-detail__split-card--reverse case-study-detail__split-card--digital">
              <div className="text-side case-study-detail__text-stack case-study-detail__digital-text">
                <h4>Digital campaign</h4>
                <p>The same photographic system carried into digital.</p>
                <p>
                  The palette shifted to The Warehouse brand colours, strengthening recognition in fast-moving
                  environments.
                </p>
                <p>Layouts followed early composition planning, so nothing felt stretched or retrofitted.</p>
                <h4>Tone and consistency</h4>
                <p>The campaign balanced confidence with approachability.</p>
                <ul>
                  <li>TBWA’s bold attitude remained</li>
                  <li>Relaxed posing softened the tone</li>
                  <li>Natural styling kept it grounded</li>
                </ul>
                <p>A consistent core cast, supported by extended talent and animals, added warmth and familiarity.</p>
                <p>Confident, but never exclusive. Aspirational, yet accessible.</p>
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
              <p>The campaign unified channels that often feel disconnected.</p>
              <p>
                From large-scale retail to small digital touchpoints, the system stayed clear, recognisable, and
                cohesive.
              </p>
              <p>The result. Distinctly Kiwi. Bright, confident, and genuinely upbeat.</p>
            </article>

            <article
              id="impact"
              ref={(el) => {
                sectionsRef.current.impact = el;
              }}
              className="case-study-detail__split-card case-study-detail__split-card--impact"
            >
              <figure className="media-side case-study-detail__impact-media">
                <img src={IMG.impact} alt="Summer impact campaign visual" />
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
                  Thanks to everyone involved in bringing the campaign to life. From teams across Creative, Studio,
                  Marketing, Media, Web, Social, and In-store, to the talent and crews across studio and on-location
                  shoots at Big Manly Beach, Whangaparāoa, Takapuna, and Maraetai.
                </p>
                <p>After a stretch of rough weather, we struck it lucky with perfect conditions on shoot days.</p>
                <br></br>
                <div className="credits-list">
                  <p>
                    <strong>Advertiser:</strong> The Warehouse Group
                  </p>
                  <p>
                    <strong>Creative:</strong> Samantha Smith
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
                    <strong>Photographers:</strong> AB Watson, Lisa Crabtree
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
                    <strong>Key Visual Family Talent:</strong> Shushila, Shem, Juliette, Hendrix
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
