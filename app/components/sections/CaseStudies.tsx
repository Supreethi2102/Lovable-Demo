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
    id: 2,
    title: 'What if the most-seen brand asset wasn\u2019t digital at all?',
    subtitle: 'Green Cross Health | Packaging',
    description:
      'When New Zealand banned single-use plastic, Green Cross Health needed new bags that felt purposeful. The challenge was to create a system for Life Pharmacy and Unichem that communicated care, sustainability, and identity across a nationwide rollout.',
    duration: '4 weeks',
    category: 'packaging',
    image: '/misc/retail-bags-tab-challenge.png',
    frontTabs: {
      challenge: {
        title: 'What if the most-seen brand asset wasn\u2019t digital at all?',
        description:
          'When New Zealand banned single-use plastic, Green Cross Health needed new bags that felt purposeful. The challenge was to create a system for Life Pharmacy and Unichem that communicated care, sustainability, and identity across a nationwide rollout.',
        image: '/misc/retail-bags-tab-challenge.png',
      },
      focus: {
        title: 'What makes a bag feel unmistakably Kiwi at a glance?',
        description:
          'I set out to create two distinct bag systems that felt warm, local, and unmistakably Kiwi while carrying essential information. The challenge was to balance brand expression through hero phrases and Kiwi cues with clear messaging, sustainability, and constraints.',
        image: '/misc/retail-bags-tab-focus.png',
      },
      impact: {
        title: 'How far can a single bag travel in one week?',
        description:
          'Seen across around 360 stores nationwide each week, the new packaging turned a mandatory change into a recognisable brand moment. Clear hierarchy, local cues, and sustainability messaging enabled consistent production while reinforcing recall and loyalty.',
        image: '/misc/retail-bags-tab-impact.png',
      },
    },
    backTabs: {
      place: {
        title: 'How does Venetian craft meet Kiwi clarity?',
        description:
          'Burano, Italy, sparked the concept. Its lacework echoed Life Pharmacy\u2019s stencil-like illustrations and informed Unichem\u2019s cut-out typography. This link between lace and paper-cut design shaped abstract NZ motifs, bringing warmth to Life Pharmacy and structure to Unichem.',
        image: '/misc/retail-bags-tab-place.png',
      },
      influence: {
        title: 'What happens when craft meets type and language?',
        description:
          'Burano lace informed precision, negative space, and rhythm. Paper-cut artists and bold, graphic typography inspired by Barbara Kruger added structure and impact, while te reo Maori phrases grounded the work in culture. Together, these influences bridged craft and strategy.',
        image: '/misc/retail-bags-tab-influence.png',
      },
      discoveries: {
        title: 'What unexpected lessons hide inside a simple bag?',
        description:
          'Small details carried more weight than expected. Bags are seen in motion, so clarity and contrast had to land instantly. Scaling across sizes revealed when to simplify, letting larger formats lead while smaller ones rely on typography systems.',
        image: '/misc/retail-bags-tab-discoveries.png',
      },
    },
  },
  {
    id: 3,
    title: 'How do you make small spends feel like summer wins?',
    subtitle: 'The Warehouse | Summer Campaign',
    description:
      'After lockdowns and rising living costs, Kiwi families were cautious with spending. The Warehouse needed a bright summer campaign that balanced aspiration with approachability, making purchases feel clever and fun while standing out across all channels.',
    duration: '12 weeks',
    category: 'campaigns',
    image: '/misc/summer-tab-challenge.png',
    frontTabs: {
      challenge: {
        title: 'How do you make small spends feel like summer wins?',
        description:
          'After lockdowns and rising living costs, Kiwi families were cautious with spending. The Warehouse needed a bright summer campaign that balanced aspiration with approachability, making purchases feel clever and fun while standing out across all channels.',
        image: '/misc/summer-tab-challenge.png',
      },
      focus: {
        title: 'How do you stay unmistakable, no matter where you show up?',
        description:
          'The goal was to design a visual system that worked seamlessly across POS, digital, and social channels. It needed to balance clarity, warmth, and recognition, combining TBWA’s bold attitude with approachable Kiwi summer energy and warmth.',
        image: '/misc/summer-tab-focus-impact.png',
      },
      impact: {
        title: 'Did it cut through in-store and carry across every channel?',
        description:
          'While sales figures are confidential, feedback showed the work felt brighter, easier to scan, and more engaging. Assets rolled out seamlessly across in-store, out-of-home, social, and digital. Warmer visuals helped shoppers spot offers and buy with ease.',
        image: '/misc/summer-tab-focus-impact.png',
      },
    },
    backTabs: {
      place: {
        title: 'Why do San Francisco’s curves feel like summer?',
        description:
          'San Francisco sparked the idea. Its late 60s-70s supergraphics movement brought bold colour, sweeping curves, and large-scale forms into public spaces. These oversized arcs inspired the campaign’s bright, flowing energy and sense of movement.',
        image: '/misc/summer-tab-place.png',
      },
      influence: {
        title: 'How do bold curves and colour create a summer mood?',
        description:
          'The campaign draws on California’s graphic history. Barbara Stauffacher Solomon’s supergraphics informed bold curves, while Morag Myerscough and Deborah Sussman added playful colour. Retro typography and Maraetai Beach grounded it in a Kiwi summer.',
        background: '#f6f2c0',
      },
      discoveries: {
        title: 'What does it take to stand out in summer retail?',
        description:
          'In-store walkthroughs showed how hard it is to stand out in cluttered retail. Rainbow arcs and a buttery yellow base created movement and cut through, but needed careful scaling across store sizes. This shaped a flexible system across POS, digital, and social.',
        image: '/misc/summer-tab-discoveries.png',
      },
    },
  },
  {
    id: 4,
    title: 'How do you make play irresistible and value obvious?',
    subtitle: 'The Warehouse | Mega Toy Month Campaign',
    description:
      'With budgets tight post-lockdowns, families approached the July school holidays cautiously. The Warehouse needed a campaign that balanced playful immersion for kids with clear, value-led messaging for parents, while still driving sales.',
    duration: '4 weeks',
    category: 'campaigns',
    image: '/misc/mega-toy-tab-challenge.png',
    frontTabs: {
      challenge: {
        title: 'How do you make play irresistible and value obvious?',
        description:
          'With budgets tight post-lockdowns, families approached the July school holidays cautiously. The Warehouse needed a campaign that balanced playful immersion for kids with clear, value-led messaging for parents, while still driving sales.',
        image: '/misc/mega-toy-tab-challenge.png',
      },
      focus: {
        title: 'How do you turn play into a reason to buy?',
        description:
          'I led the creative direction for a kids\u2019 activity campaign that connected TVC, website, social, and in-store experience. The toy mailer anchored the idea, turning play into a clear path to purchase, designed to engage kids while guiding confident decisions.',
        image: '/misc/mega-toy-tab-focus.png',
      },
      impact: {
        title: 'What happens when play becomes part of the purchase?',
        description:
          'Turning play into participation moved kids from watching to doing, bringing them into the purchase alongside parents and influencing decisions in the moment, lifting basket size and driving stronger in-store and online conversion outcomes.',
        image: '/misc/mega-toy-tab-impact.png',
      },
    },
    backTabs: {
      place: {
        title: 'Why did a Kiwi toy campaign draw from Leiden?',
        description:
          'It began in Leiden in the Netherlands, home of the De Stijl movement. Its bold colours and clear outlines shaped how I approached kid-friendly clarity. Back in New Zealand, hands-on testing refined simple, at-home activities that connected to products across channels.',
        image: '/misc/mega-toy-tab-place.png',
      },
      influence: {
        title: 'Which artists shaped the colour, clarity, and play?',
        description:
          'The visual language drew on De Stijl, especially Piet Mondrian\u2019s bold colour blocks and black lines to bring clarity to busy layouts. Dick Bruna\u2019s simplicity shaped clean, easy-to-follow craft illustrations, paired with Leo Lionni\u2019s playful use of colour and composition.',
        image: '/misc/mega-toy-tab-influence.png',
      },
      discoveries: {
        title: 'What makes kids engage and parents see the value?',
        description:
          'Observing Kiwi kids showed that simple, hands-on crafts using everyday or Warehouse products engage everyone. Honest feedback from kids and parents revealed where instructions needed clarity, while aligning activities with products drove sales.',
        image: '/misc/mega-toy-tab-discoveries.png',
      },
    },
  },
  {
    id: 5,
    title: 'Why is booking a flight so hard to navigate?',
    subtitle: 'Amio Airways | UX',
    description:
      'Booking a flight should be quick, but time-poor users are slowed by cluttered flows, hidden trade-offs, and comparison overload. This project rethinks the journey to reduce friction, support flexible decisions, and enable fast, confident choices.',
    duration: '4 weeks',
    category: 'ux',
    image: '/misc/amio-airways-tab-challenge.png',
    frontTabs: {
      challenge: {
        title: 'Why is booking a flight so hard to navigate?',
        description:
          'Booking a flight should be quick, but time-poor users are slowed by cluttered flows, hidden trade-offs, and comparison overload. This project rethinks the journey to reduce friction, support flexible decisions, and enable fast, confident choices.',
        image: '/misc/amio-airways-tab-challenge.png',
      },
      focus: {
        title: 'What helps people book a flight with confidence?',
        description:
          'Rather than removing steps, the focus was on helping users move through booking with confidence across the full journey on desktop. Clear pricing, visible trade-offs, and real-time feedback keep choices simple, flexible, and easy to act on.',
        image: '/misc/amio-airways-tab-focus.png',
      },
      impact: {
        title: 'What happens when booking a flight no longer needs checking twice?',
        description:
          'Users backtracked less, re-checked selections less often, and moved through flight booking more quickly. Clear visibility of choices and pricing reduced hesitation, improved sense of control, and helped users commit with confidence faster.',
        image: '/misc/amio-airways-tab-impact.png',
      },
    },
    backTabs: {
      place: {
        title: 'What if booking a flight felt as serene as Lake Pukaki?',
        description:
          'Inspired by Mackenzie Country, Aotearoa New Zealand. Known for its turquoise lakes, open skies, and the steady presence of Aoraki, I created a booking flow that feels spacious, clear, and quietly reassuring from the very first click through to confirmation.',
        image: '/misc/amio-airways-tab-place.png',
      },
      influence: {
        title: 'Which design minds shaped Amio\u2019s clear, calm flow?',
        description:
          'Influenced by designers who prioritise human experience. Ilse Crawford\u2019s focus on wellbeing, IDEO\u2019s human-centred prototyping, and Nielsen Norman\u2019s clarity-first principles guided how I designed a flow that feels intuitive, calm, and easy to trust.',
        image: '/misc/amio-airways-tab-influence.png',
      },
      discoveries: {
        title: 'Which lessons turn clicks into confidence?',
        description:
          'My first UX project became a hands-on learning curve. Through research, wireframing, prototyping, and testing, I learnt how to design for clarity, flow, and reassurance, creating a booking experience that feels calm, intuitive, and easy to navigate.',
        image: '/misc/amio-airways-tab-discoveries.png',
      },
    },
  },
  {
    id: 1,
    title: 'What if your banking app knew how to smile?',
    subtitle: 'Palmy Bank | UI',
    description:
      'Palmy is a fictional challenger bank rethinking trust and clarity in everyday banking. Designed for those underserved by traditional banking, including Pacific peoples, Maori and women. Built to feel warm, human, and genuinely inclusive. Maybe even smile-worthy.',
    duration: '4 weeks',
    category: 'ui',
    image: '/misc/palmy-bank-tab-challenge.png',
    frontTabs: {
      challenge: {
        title: 'What if your banking app knew how to smile?',
        description:
          'Palmy is a fictional challenger bank rethinking trust and clarity in everyday banking. Designed for those underserved by traditional banking, including Pacific peoples, Maori and women. Built to feel warm, human, and genuinely inclusive. Maybe even smile-worthy.',
        image: '/misc/palmy-bank-tab-challenge.png',
      },
      focus: {
        title: 'What would banking feel like if it actually cared?',
        description:
          'I designed three responsive screens. Accounts, Transactions, and Spending Tracker, across light and dark modes, supported by a custom design system. Alohi, an animated hibiscus flower guide, brings care, personality, and cultural connection grounded in community.',
        image: '/misc/palmy-bank-tab-focus.png',
      },
      impact: {
        title: 'What happens when banking feels clear, not intimidating?',
        description:
          'Early feedback showed less hesitation, less re-checking, and a stronger sense of control. Clear hierarchy, structured layouts, and real-time feedback reduced overwhelm, helping users understand their finances, act with confidence, and feel good about their choices.',
        image: '/misc/palmy-bank-tab-impact.png',
      },
    },
    backTabs: {
      place: {
        title: 'Where does Palmy\u2019s sense of belonging begin?',
        description:
          'Inspired by the rhythm of the Moana, the ocean connecting Pacific communities. From Aotearoa to Hawaii, Samoa, Tonga, Fiji, Niue, the Cook Islands and Tokelau, and beyond, these islands share deep cultural ties. This connection shaped how I designed Palmy.',
        image: '/misc/palmy-bank-tab-challenge.png',
      },
      influence: {
        title: 'What happens when art, culture, and the Pacific meet?',
        description:
          'Inspired by Matisse\u2019s Tahiti cut-outs and Richard Killeen\u2019s symbolic forms, layered shapes echo traditional Cook Islands tivaevae quilts and patterns. A Pacific palette of ocean blues, palm greens, sandy whites and hibiscus pink adds energy.',
        image: '/misc/palmy-bank-tab-focus.png',
      },
      discoveries: {
        title: 'What matters most when designing inclusive UI?',
        description:
          'I found clarity, accessibility and tone mattered most. Simplifying hierarchy reduced hesitation, while contrast, spacing and plain-language labels improved usability. Thoughtful language and expressive visuals made the interface feel less intimidating.',
        image: '/misc/palmy-bank-tab-impact.png',
      },
    },
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
