import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  { id: 'overview', label: 'Intro' },
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

const GCH_IMG = {
  hero: '/case-study-gch/9912d40ae739a7575ec4a7abed1a19cf05d03244.png',
  brief: '/case-study-gch/d65aed70beb865887889dd3c5f06cd6bf5c9d477.png',
  research: '/case-study-gch/f4b71e3100c327a76d4ed5c72d9b0279829c97a0.png',
  process: '/case-study-gch/6921425df3fbd47838860bb0b5ca35d29859de9e.png',
  lifeFrontBack: '/case-study-gch/06d7fcc67fd2e50425416638866d9a8ffffe1f48.png',
  paperBagDesign: '/case-study-gch/1ed717e27b4208d7579d7f929d28b0624fde988e.png',
  unichemFrontBack: '/case-study-gch/ae57819f1182ad7e22b284384065d1925c6aabd7.png',
  imageFrame: '/case-study-gch/c8cdbdceb1fbf0c9bca7307bcba47c77cfbb2e81.png',
};

const TOY_IMG = {
  hero: '/case-study-toy/841c407b2a6d2d947745ddec0d9924043f152c9d.png',
  researchBoard: '/case-study-toy/db2bdd1a895d280d20156204607c3f2230574a82.png',
  girlImage: '/case-study-toy/db2bdd1a895d280d20156204607c3f2230574a82.png',
  girlBookOverlay: '/case-study-toy/427f9c07e09cfe71b1c9751e78e24a0770046b50.png',
  briefPanel: '/case-study-toy/724130231bf0d6e32cd8990db477bc64e77fb360.png',
  tvFrame: '/case-study-toy/mega-toy-tv-frame-selected.png',
  processImage: '/case-study-toy/c984945946c0cb13db76861623f7b94632ea22f3.png',
  websiteCraftLaptop: '/case-study-toy/mega-toy-website-craft-laptop.png',
  /**
   * Flow strip connector — replace `public/case-study-toy/figma-flow-arrow.svg` (or `.png`)
   * with the exact export from Figma Dev Mode for a pixel match.
   */
  seeTryBuyStepArrow: '/case-study-toy/figma-flow-arrow.svg',
  /** Figma 2363:2716 — TVC still (WHG-TOY-MONTH-30-10_13_final_dancing) */
  tvcStill: '/case-study-toy/335cbbd55b859ef906bdf49e1d4fcfb79096cb38.png',
};

/**
 * Figma 4034:1102 — still rows (2363:2971, 4054:1503–1505). Re-export: `npm run figma:mtm-stills` (Figma Desktop + file open).
 */
const TOY_ACTIVITY_STILLS: Array<{ src: string; alt: string; width: number; height: number }> = [
  {
    src: '/case-study-toy/mega-toy-mtm-planters.png',
    alt: 'Colourful DIY planters made from recycled packaging, Mega Toy Month crafts',
    width: 977,
    height: 624,
  },
  {
    src: '/case-study-toy/mega-toy-mtm-fortune-tiktok.png',
    alt: 'Paper fortune teller activity and phone mockup showing a craft tutorial',
    width: 1018,
    height: 545,
  },
  {
    src: '/case-study-toy/mega-toy-mtm-bling-bugs.png',
    alt: 'Bling your Ride TikTok frame and bottle-bug craft makes',
    width: 1024,
    height: 569,
  },
  {
    src: '/case-study-toy/mega-toy-mtm-guitars-baking.png',
    alt: 'Cardboard toy guitars and phone mockup showing a surprise-filled baking cake',
    width: 989,
    height: 590,
  },
];

const TOY_JAYDEN_QUOTE_LINE_1 =
  'The kaleidoscope was the coolest one. When you spin it all the colours ';
const TOY_JAYDEN_QUOTE_LINE_2 = 'move. I watched the video and then made it with my dad.';

/**
 * Mega Toy — Figma 2363:2999 / 3008 / 3005. Cards are white rounded rects + tails (not Summer SVG bubbles).
 */
const TOY_CUSTOMER_TESTIMONIALS: Array<{
  id: 'rebecca' | 'hayley' | 'jayden';
  quote: string;
  author: string;
}> = [
  {
    id: 'rebecca',
    quote:
      'My daughter had fun making her unicorn planter a few weeks ago. I bought her a Rainbocorn for her Birthday from The Warehouse. She reused the unicorn horn and fluffy hairclips from its packaging to make her planter and loved the word search in your pamphlet.',
    author: 'Rebecca, Auckland',
  },
  {
    id: 'hayley',
    quote:
      'My daughter and I made the giant cupcake from the catalogue together for her birthday. When we cut it and the lollies came spilling out, the kids went wild.',
    author: 'Hayley, New Plymouth',
  },
  {
    id: 'jayden',
    quote: `${TOY_JAYDEN_QUOTE_LINE_1}\n${TOY_JAYDEN_QUOTE_LINE_2}`,
    author: 'Jayden, Christchurch',
  },
];

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

const GCH_INSIGHTS = [
  {
    number: '1',
    title: 'Strategy',
    body: 'Small touchpoints carry significant brand weight when applied intentionally',
  },
  {
    number: '2',
    title: 'Execution',
    body: 'Creative ambition works best when grounded in production reality',
  },
  {
    number: '3',
    title: 'Collaboration',
    body: 'Strong teamwork allows design to scale beyond concept',
  },
];

const MORE_PROJECTS: CaseStudyCardStudy[] = [
  {
    id: 4,
    subtitle: 'The Warehouse | Mega Toy Month Campaign',
    title: 'How do you turn a toy sale into a month-long adventure?',
    description:
      'Families entered the July school holidays with tight budgets after lockdowns. The Warehouse needed a campaign that felt playful for kids, clear and value-driven for parents, and strong enough to drive online and in-store sales across busy retail channels.',
    image: '/case-study/c8cdbdceb1fbf0c9bca7307bcba47c77cfbb2e81.png',
    duration: '4 weeks',
    category: 'campaigns',
  },
  {
    id: 2,
    subtitle: 'Green Cross Health | Packaging',
    title: 'What if the most-seen brand asset wasn’t digital at all?',
    description:
      'When New Zealand banned single-use plastic, Green Cross Health needed new bags that felt purposeful. The challenge was to create a system for Life Pharmacy and Unichem that communicated care, sustainability, and identity across a nationwide rollout.',
    image: '/case-study-gch/9912d40ae739a7575ec4a7abed1a19cf05d03244.png',
    duration: '4 weeks',
    category: 'packaging',
  },
];

const MORE_PROJECTS_GCH: CaseStudyCardStudy[] = [
  {
    id: 4,
    subtitle: 'The Warehouse | Mega Toy Month Campaign',
    title: 'How do you turn a toy sale into a month-long adventure?',
    description:
      'Families entered the July school holidays with tight budgets after lockdowns. The Warehouse needed a campaign that felt playful for kids, clear and value-driven for parents, and strong enough to drive online and in-store sales.',
    image: '/case-study-gch/c8cdbdceb1fbf0c9bca7307bcba47c77cfbb2e81.png',
    duration: '4 weeks',
    category: 'campaigns',
  },
  {
    id: 3,
    subtitle: 'The Warehouse | Summer Campaign',
    title: 'How do you make small spends feel like summer wins?',
    description:
      'After lockdowns and rising living costs, Kiwi families were cautious with spending. The Warehouse needed a bright summer campaign that balanced aspiration with approachability.',
    image: '/case-study-gch/ae57819f1182ad7e22b284384065d1925c6aabd7.png',
    duration: '4 weeks',
    category: 'campaigns',
  },
];

const MORE_PROJECTS_TOY: CaseStudyCardStudy[] = [
  {
    id: 3,
    subtitle: 'The Warehouse | Summer Campaign',
    title: 'How do you make small spends feel like summer wins?',
    description:
      'After lockdowns and rising living costs, Kiwi families were cautious with spending. The Warehouse needed a bright summer campaign that balanced aspiration with approachability.',
    image: '/case-study/8d3d71c4521118f1643cfc2b643e9bdd6779cd20.png',
    duration: '12 weeks',
    category: 'campaigns',
  },
  {
    id: 2,
    subtitle: 'Green Cross Health | Packaging',
    title: 'How do you turn a plastics ban into a brand moment?',
    description:
      'A plastics ban opened the door to rethink how Life Pharmacy and Unichem show up. I designed paper bags as small moments of brand, culture and distinction.',
    image: '/case-study-gch/9912d40ae739a7575ec4a7abed1a19cf05d03244.png',
    duration: '4 weeks',
    category: 'packaging',
  },
];

export const CaseStudyDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isGreenCross = id === '2';
  const isSummer = id === '3';
  const isMegaToy = id === '4';
  const isPalmy = id === '1';
  const isAmio = id === '5';
  const isAmioLayout = isAmio || isPalmy;
  const overview = isGreenCross
    ? {
        heroImage: '/case-study-gch/9912d40ae739a7575ec4a7abed1a19cf05d03244.png',
        heroAlt: 'Brown paper retail bags in warm sunlight',
        subtitle: 'Packaging | Green Cross Health',
        title: 'Retail paper bags',
        body:
          'A plastics ban opened the door to rethink how Life Pharmacy and Unichem show up. I designed paper bags as small moments of brand, culture and distinction.',
        meta: 'Estimated read time: 3 minutes | Duration: 4 weeks',
      }
    : isMegaToy
      ? {
          heroImage: TOY_IMG.hero,
          heroAlt: 'Kids holding Warehouse toy campaign sign',
          subtitle: 'Campaign | The Warehouse',
          title: 'Mega Toy Month',
          body:
            'Mega Toy Month is one of The Warehouse’s biggest pre–July school holiday events. I helped bring the campaign to life across mailer, store and digital.',
          meta: 'Estimated read time: 3 minutes | Duration: 12 weeks',
        }
    : isAmioLayout
      ? {
          heroImage: PALE_YELLOW_PLACEHOLDER,
          heroAlt: '',
          subtitle: isPalmy ? 'UI | UX Design Insitute' : 'UX | UX Design Institute',
          title: isPalmy ? 'Palmy bank' : 'Āmio Airways',
          body:
            isPalmy
              ? 'A calm, modern banking experience built on trust, clarity and joy. Designed across desktop, mobile and tablet, with underserved communities at its core.'
              : 'Āmio Airways is a New Zealand airline concept where I designed a booking experience for clear, confident decisions. The goal was calm, transparent travel.',
          meta: isPalmy ? 'Estimated read time: 3 minutes | Duration: 9 months' : 'Estimated read time: 3 minutes | Duration: 12 months',
        }
    : {
        heroImage: IMG.hero,
        heroAlt: 'Summer campaign hero visual',
        subtitle: 'Campaign | The Warehouse',
        title: 'Summer Season',
        body:
          'The Warehouse needed a bright summer campaign across store and digital. I led direction, shaping photography and layouts into a cohesive look.',
        meta: 'Estimated read time: 3 minutes | Duration: 12 weeks',
      };
  const overviewSummaryItems = isGreenCross
    ? [
        { label: 'Role', value: 'Lead Designer', size: 'summary-item--24' },
        {
          label: 'Context',
          value: 'Green Cross Health plastic bag ban, requiring a scalable nationwide rollout across a large retail network.',
          size: 'summary-item--72',
        },
        { label: 'Tools', value: 'InDesign, Illustrator, Photoshop', size: 'summary-item--24' },
        {
          label: 'Platforms',
          value:
            'Retail packaging system designed for high-volume everyday use at point of sale, supporting consistent brand experience',
          size: 'summary-item--auto',
        },
        {
          label: 'Audience',
          value: 'Women 40-60, primary household decision-makers, community-focused',
          size: 'summary-item--48',
        },
        {
          label: 'Focus',
          value:
            'Sustainable, brand-led paper bags grounded in cultural authenticity, designed to balance everyday usability, brand expression, and a more thoughtful retail experience',
          size: 'summary-item--auto',
        },
        {
          label: 'Designs',
          value: 'Word-based storytelling, abstract NZ motifs, cohesive visual language',
          size: 'summary-item--48',
        },
        { label: 'Accessibility', value: 'High contrast, legible', size: 'summary-item--24' },
        { label: 'Team', value: 'Morgan Paige Taitoko (illustrator)', size: 'summary-item--24' },
      ]
    : isMegaToy
      ? [
          { label: 'Role', value: 'Creative', size: 'summary-item--24' },
          {
            label: 'Context',
            value: 'The Warehouse’s biggest retail moment outside Christmas',
            size: 'summary-item--48',
          },
          { label: 'Tools', value: 'InDesign, Photoshop, Illustrator, Miro', size: 'summary-item--24' },
          {
            label: 'Platforms',
            value: 'TV, digital, website, social, in-store, print',
            size: 'summary-item--48',
          },
          {
            label: 'Audience',
            value:
              'Mums (25–50) Research-driven, budget-conscious bargain hunters. Kids Imaginative, fun-seeking and highly influential. Kidults Gamers and collectors.',
            size: 'summary-item--auto',
          },
          {
            label: 'Focus',
            value: 'Turn a sale into a fun, school-holiday-ready experience while showcasing Warehouse products',
            size: 'summary-item--48',
          },
          {
            label: 'Designs',
            value: 'Toy mailer, kids activities, omni-channel creative toolkit',
            size: 'summary-item--48',
          },
          { label: 'Accessibility', value: 'High contrast, legible', size: 'summary-item--24' },
          {
            label: 'Team',
            value: 'Creative, Marketing, Media, Social, In-store, Web, Studio, and agency partners',
            size: 'summary-item--48',
          },
        ]
    : isAmioLayout
      ? [
          { label: 'Role', value: isPalmy ? 'UI Designer (solo project)' : 'UX Researcher, UX Designer', size: 'summary-item--24' },
          {
            label: 'Context',
            value: isPalmy
              ? 'Completed as part of a UI Design Certificate, UX Design Institute.'
              : 'UX Design Institute project. Concept airline booking experience.',
            size: 'summary-item--48',
          },
          { label: 'Tools', value: isPalmy ? 'Figma, Miro, Photoshop, Illustrator' : 'Figma, FigJam, Miro, Jotform, Lookback', size: 'summary-item--24' },
          {
            label: 'Platforms',
            value: isPalmy ? 'Mobile, Tablet, Desktop' : 'Desktop-first, with future mobile-first expansion',
            size: isPalmy ? 'summary-item--24' : 'summary-item--48',
          },
          {
            label: 'Audience',
            value:
              isPalmy
                ? 'Broad, with a focus on Pacific peoples, Māori, women, underserved and sustainability-minded communities.'
                : 'Leisure and budget-conscious travellers seeking affordable flights with a more considered, human-centred travel experience.',
            size: 'summary-item--auto',
          },
          {
            label: 'Focus',
            value: isPalmy
              ? 'Translating brand values into a clear, playful, trustworthy and sustainable experience throughout the interface.'
              : 'Clarity, reassurance, speed, flexibility, transparency, trust',
            size: 'summary-item--48',
          },
          {
            label: 'Designs',
            value: isPalmy
              ? 'Accounts, Transactions and Spending Tracker across light and dark modes, creating a cohesive and scalable UI system.'
              : 'Medium-fidelity wireframes and interactive prototype',
            size: 'summary-item--48',
          },
          {
            label: 'Accessibility',
            value: isPalmy
              ? 'WCAG-compliant contrast, neurodivergent-friendly design patterns, and responsive typography.'
              : 'Clear hierarchy, predictable patterns, visual confirmation states',
            size: 'summary-item--24',
          },
          {
            label: 'Team',
            value: isPalmy ? 'Solo-led, shaped by weekly feedback from mentors and peers.' : 'Solo-driven project, with peer feedback throughout the process',
            size: 'summary-item--24',
          },
        ]
    : [
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
      ];
  const briefContent = isGreenCross
    ? {
        image: PALE_YELLOW_PLACEHOLDER,
        imageAlt: 'Soft yellow section background',
        business:
          'With New Zealand’s single-use plastics ban kicking in, Green Cross Health needed packaging that felt like a step forward.',
        priorities: [
          'Make sustainability visible',
          'Strengthen each brand’s individual presence',
          'Turn a regulatory shift into a customer moment',
        ],
        question: 'How might we create paper bags that double as small billboards:',
        bullets: [
          'Shows sustainability upfront',
          'Reflects Aotearoa’s (New Zealand) culture',
          'Help the two brands feel distinct at a glance',
        ],
        postBriefImage: '/case-study-gch/06d7fcc67fd2e50425416638866d9a8ffffe1f48.png',
        postBriefAlt: 'Life Pharmacy paper bag front and back design',
      }
    : isMegaToy
      ? {
          image: PALE_YELLOW_PLACEHOLDER,
          imageAlt: 'Soft yellow section background',
          business:
            'Mega Toy Month 2021 needed to defend The Warehouse’s leadership in toys as Kmart competition intensified and post-COVID spending remained cautious. Ahead of the July school holidays, it needed to drive engagement and convert it into sales',
          priorities: [
            'Keep the event exciting and engaging for kids',
            'Make deals easy for parents to navigate',
            'Connect TVC, mailer, store, website, and social into one experience',
          ],
          question: 'How might we turn a toy sale into a playful campaign families could interact with at home and in store that:',
          bullets: [
            'Encourages play using Warehouse products.',
            'Connects mailer, website, in-store, and social into one experience.',
            'Gives kids and whānau simple activities to do at home.',
          ],
          postBriefImage: TOY_IMG.briefPanel,
          postBriefAlt: 'Mega Toy Month campaign board',
        }
    : isAmioLayout
      ? {
          image: PALE_YELLOW_PLACEHOLDER,
          imageAlt: 'Soft yellow section background',
          business:
            isPalmy
              ? 'Palmy is a concept for a digital-first challenger bank designed for people often underserved by traditional financial systems. The challenge wasn’t just visual. It was behavioural.'
              : 'Booking a flight is a high-stakes decision. Travellers juggle dates, pricing, baggage, meals and timing, often second-guessing hidden fees or the risk of choosing wrong, on top of already busy lives. This wasn’t just a usability problem. It was a decision-making problem under pressure.',
          priorities: [
            ...(isPalmy
              ? [
                  'High trust',
                  'Clear decision-making',
                  'Emotional reassurance',
                  'All within a system that’s often complex and intimidating.',
                ]
              : ['Clear, upfront pricing', 'Control over decisions', 'Reassurance at key moments']),
          ],
          question: isPalmy ? 'How might we design a banking interface that:' : 'How might we design a booking experience that:',
          bullets: [
            ...(isPalmy
              ? [
                  'Clear under pressure',
                  'Warm and human',
                  'Culturally aware',
                  'Consistent across mobile, tablet, and desktop',
                ]
              : [
                  'Simplifies complex decisions without oversimplifying',
                  'Shows total cost upfront, with no surprises',
                  'Supports both careful planners and returning users',
                  'Reinforces trust through every interaction',
                ]),
          ],
          postBriefImage: '',
          postBriefAlt: '',
        }
    : {
        image: IMG.brief,
        imageAlt: 'Brief placeholder visual',
        business:
          'Summer 2023 was a key retail window for The Warehouse. With declining foot traffic, the campaign needed to cut through across store and digital.',
        priorities: [
          'Drive visibility in busy environments',
          'Keep messaging clear across channels',
          'Make summer shopping feel easy and uplifting',
        ],
        question: 'How might we create a bright, cohesive summer campaign that:',
        bullets: [
          'Feels optimistic and unmistakably The Warehouse',
          'Connects POS and digital',
          'Helps customers browse quickly and confidently',
        ],
        postBriefImage: '',
        postBriefAlt: '',
      };
  const researchContent = isGreenCross
    ? {
        heading: 'Research',
        subheading: 'Sustainability and material',
        intro: 'With a tight timeline, I focused on what would directly impact the outcome.',
        paragraphs: [
          'I reviewed recycled bag design. Many relied on bright greens and leaf symbols that felt surface-level.',
          'I focused on kraft behaviour in print, ink absorption, fibre strength, dielines, and detail limits, grounding decisions in production and avoiding greenwashing.',
        ],
        secondHeading: 'How people see a bag',
        bullets: [
          'Bags aren’t studied. They’re glimpsed.',
          'Insights from Nielsen Norman Group shaped layouts. Hierarchy and contrast drive instant recognition.',
        ],
      }
    : isMegaToy
      ? {
          heading: 'Research',
          subheading: 'Customer insight',
          intro:
            'Parents planned ahead, comparing prices for birthdays and Christmas, while kids were driven by immediate play. Extended whānau needed clarity and simplicity at purchase.',
          paragraphs: [
            'Internal research revealed how families balance value, timing, and influence',
            'Activities were tested with children to refine clarity, engagement, and ease',
          ],
          secondHeading: 'Key insight',
          bullets: [
            'Kids don’t just influence toy purchases. They drive them.',
            'Engaging them directly, while giving parents clarity and confidence, allowed the campaign to work harder across every channel, with activities designed to feel affordable, sustainable, and grounded in everyday Kiwi life.',
          ],
        }
    : isAmioLayout
      ? {
          heading: 'Research',
          subheading: 'To understand booking behaviour, I combined:',
          intro:
            'User survey, usability testing across airline flows (Air New Zealand, Qantas), competitive benchmarking, and analysis of recorded usability tests (Aer Lingus, Eurowings).',
          paragraphs: [
            'A clear pattern emerged. Users weren’t struggling to complete bookings. They were struggling to trust their decisions.',
          ],
          secondHeading: 'Observed behaviours',
          bullets: [
            'Re-checking prices multiple times',
            'Comparing flights across multiple tabs',
            'Delaying commitment due to uncertainty',
            'Pricing was the biggest source of friction due to late-revealed fees',
          ],
        }
    : {
        heading: 'Research',
        subheading: 'Customer insight',
        intro: 'Kiwi families were balancing tighter budgets with the desire for a classic summer.',
        paragraphs: ['The experience needed to feel simple, bright, and easy to navigate.'],
        secondHeading: 'Key insights',
        bullets: [
          'Clarity wins in-store. Fast, scannable visuals',
          'Joyful, not chaotic. Bright colour with clean layouts',
          'Value matters. Products need to justify the cost',
          'Keep it real. Warm, authentically Kiwi photography',
        ],
      };
  const processContent = isGreenCross
    ? {
        heading: 'Process & approach',
        subheading: 'Direction',
        paragraphs: [
          'The project began with early concepts from an external agency. While they didn’t fully capture the direction, I saw an opportunity to take a different approach and developed a new concept from scratch.',
          'Over four days, I introduced warmth, clarity, and cultural grounding, helping build trust and set a more collaborative path.',
          'I created moodboards to quickly align both brands and establish a shared visual tone.',
          'The direction drew from papercraft references. Burano lacework, artists like Karen Bit Vejle and Maude White, and traditional Japanese kirie.',
          'The focus wasn’t decoration. It was structure. Negative space and clean geometry created a system designed for clarity, used where space allowed.',
        ],
      }
    : isMegaToy
      ? {
          heading: 'Process & Approach',
          subheading: 'TV commerical concept',
          paragraphs: [
            'I contributed to early concept development, drawing on the playful chaos of films like Matilda, where everyday spaces come alive. This shaped “Unleash the Fun”. A high-energy world where opening a Warehouse box sparks a burst of imagination, transforming the home into a space of play.',
            'We explored multiple creative routes, with consumer testing validating “Unleash the Fun” as the strongest direction.',
            'Working within an agile squad model, I collaborated across social, digital, and in-store teams to support a seamless cross-channel rollout.',
          ],
        }
    : isAmioLayout
      ? {
          heading: 'Process & Approach',
          subheading: 'This wasn’t a linear process',
          paragraphs: [
            'It moved between research, flows, sketching, and testing. Each step surfaced new questions and often led me back to refine earlier decisions.',
            'Using affinity mapping and a customer journey map, I mapped emotional highs and lows across the booking experience.',
            'Three key friction points emerged: pricing confusion, decision fatigue, and loss of certainty.',
            'A critical constraint became clear: passenger details are essential. The challenge was reducing effort and doubt within the journey.',
          ],
        }
    : {
        heading: 'Process & approach',
        subheading: 'Defining the visual direction',
        paragraphs: [
          'POS came first, anchoring the direction early.',
          'Moodboards explored colour, photography, styling, and tone. Inspired by Californian supergraphics, grounded in a distinctly Kiwi feel.',
          'Warm light, relaxed posing, and natural energy set the foundation.',
          'The goal. Bold enough to stand out in-store, yet effortless and local.',
        ],
      };
  const testimonials = TESTIMONIALS;
  const moreProjects = isGreenCross ? MORE_PROJECTS_GCH : isMegaToy ? MORE_PROJECTS_TOY : MORE_PROJECTS;
  const [activeSection, setActiveSection] = useState<NavSectionId>('overview');
  const [hoveredNavId, setHoveredNavId] = useState<NavSectionId | null>(null);
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});
  /** While true, section spy ignores IO (avoids dozens of setStates during smooth scroll = jank). */
  const suppressSectionSpyRef = useRef(false);
  const suppressSectionSpyTimerRef = useRef(0);
  const heroImageWrapRef = useRef<HTMLElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const heroScrollRafRef = useRef(0);
  /** 0 = full-bleed cinema; 1 = hero seated in card — driven by wheel/touch only (page does not scroll). */
  const cinemaProgressRef = useRef(0);
  const cinemaBackdropRef = useRef<HTMLDivElement>(null);

  /**
   * Hero “cinema”: full-width image first; wheel/trackpad/touch scrubs it into the card.
   * Until seated, document scroll is locked (no page movement). After seated, normal scrolling.
   */
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const wrap = heroImageWrapRef.current;
    const img = heroImageRef.current;
    const reduce =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (!wrap || !img || reduce) return;

    cinemaProgressRef.current = 0;

    const syncBackdrop = (visible: boolean) => {
      const bd = cinemaBackdropRef.current;
      if (!bd) return;
      bd.style.opacity = visible ? '1' : '0';
      bd.style.visibility = visible ? 'visible' : 'hidden';
    };

    /** ~1.0 progress per typical trackpad “page” of wheel delta */
    const WHEEL_FACTOR = 1 / 950;
    /** Finish morph before float noise leaves us stuck & re-reading rects forever */
    const PROGRESS_SNAP = 0.996;

    let cinemaComplete = false;
    let settleRaf = 0;

    const lockPageScroll = () => {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    };

    const unlockPageScroll = () => {
      document.documentElement.style.removeProperty('overflow');
      document.body.style.removeProperty('overflow');
    };

    const clearCinemaStyles = () => {
      [
        'position',
        'left',
        'top',
        'right',
        'bottom',
        'width',
        'height',
        'z-index',
        'object-fit',
        'border-top-left-radius',
        'border-top-right-radius',
        'border-bottom-left-radius',
        'border-bottom-right-radius',
        'max-width',
        'margin',
        'transform',
      ].forEach((p) => img.style.removeProperty(p));
    };

    const applyFixedToRect = (
      left: number,
      top: number,
      width: number,
      height: number,
      brTop: number,
      brBottom = 0,
    ) => {
      img.style.position = 'fixed';
      img.style.left = `${Math.round(left)}px`;
      img.style.top = `${Math.round(top)}px`;
      img.style.right = 'auto';
      img.style.bottom = 'auto';
      img.style.width = `${Math.round(width)}px`;
      img.style.height = `${Math.round(height)}px`;
      img.style.zIndex = '40';
      img.style.objectFit = 'cover';
      img.style.borderTopLeftRadius = `${Math.round(brTop)}px`;
      img.style.borderTopRightRadius = `${Math.round(brTop)}px`;
      img.style.borderBottomLeftRadius = `${Math.round(brBottom)}px`;
      img.style.borderBottomRightRadius = `${Math.round(brBottom)}px`;
      img.style.maxWidth = 'none';
      img.style.margin = '0';
      img.style.transform = 'none';
    };

    const scrollOpts: AddEventListenerOptions = { passive: true };
    const onResize = () => scheduleApply();

    const detachMorphHelpers = () => {
      window.removeEventListener('resize', onResize);
      img.removeEventListener('load', scheduleApply);
    };

    const finishCinema = () => {
      if (cinemaComplete) return;
      cinemaComplete = true;
      cinemaProgressRef.current = 1;

      const tr = wrap.getBoundingClientRect();
      applyFixedToRect(tr.left, tr.top, tr.width, tr.height, 24, 0);
      syncBackdrop(false);

      detachMorphHelpers();

      if (settleRaf) cancelAnimationFrame(settleRaf);
      settleRaf = requestAnimationFrame(() => {
        settleRaf = 0;
        clearCinemaStyles();
        unlockPageScroll();
      });
    };

    const apply = () => {
      heroScrollRafRef.current = 0;

      if (cinemaComplete) return;

      let tLin = Math.min(1, Math.max(0, cinemaProgressRef.current));
      if (tLin >= PROGRESS_SNAP) {
        tLin = 1;
        cinemaProgressRef.current = 1;
      }

      if (tLin >= 1) {
        finishCinema();
        return;
      }

      lockPageScroll();
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      syncBackdrop(true);

      const t = tLin;
      const target = wrap.getBoundingClientRect();
      const vw = window.innerWidth;
      const headerRaw = getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim();
      const headerH = parseFloat(headerRaw) || 96;
      const aspect = 398 / 592;
      /** Inset from full width so gutters show frosted page behind */
      const EXPANDED_WIDTH_RATIO = 0.88;
      const OPEN_CORNER_RADIUS = 20;
      const expW = vw * EXPANDED_WIDTH_RATIO;
      const expH = Math.min(expW * aspect, window.innerHeight - headerH - 24);
      const expL = (vw - expW) / 2;
      const expT = headerH + 12;

      const left = expL + (target.left - expL) * t;
      const top = expT + (target.top - expT) * t;
      const width = expW + (target.width - expW) * t;
      const height = expH + (target.height - expH) * t;
      const brTop = OPEN_CORNER_RADIUS + (24 - OPEN_CORNER_RADIUS) * t;
      const brBottom = OPEN_CORNER_RADIUS * (1 - t);

      applyFixedToRect(left, top, width, height, brTop, brBottom);
    };

    const scheduleApply = () => {
      if (heroScrollRafRef.current || cinemaComplete) return;
      heroScrollRafRef.current = requestAnimationFrame(apply);
    };

    const onWheel = (e: WheelEvent) => {
      if (cinemaComplete || cinemaProgressRef.current >= 1) return;
      e.preventDefault();
      const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      cinemaProgressRef.current = Math.min(
        1,
        Math.max(0, cinemaProgressRef.current + e.deltaY * WHEEL_FACTOR * scale),
      );
      scheduleApply();
    };

    let touchLastY: number | null = null;
    const TOUCH_FACTOR = 1 / 720;

    const onTouchStart = (e: TouchEvent) => {
      if (cinemaComplete || cinemaProgressRef.current >= 1) {
        touchLastY = null;
        return;
      }
      touchLastY = e.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (cinemaComplete || cinemaProgressRef.current >= 1) {
        touchLastY = null;
        return;
      }
      if (touchLastY == null || !e.touches[0]) return;
      e.preventDefault();
      const y = e.touches[0].clientY;
      const dy = touchLastY - y;
      touchLastY = y;
      cinemaProgressRef.current = Math.min(1, Math.max(0, cinemaProgressRef.current + dy * TOUCH_FACTOR));
      scheduleApply();
    };

    const onTouchEnd = () => {
      touchLastY = null;
    };

    lockPageScroll();
    syncBackdrop(true);
    window.addEventListener('resize', onResize, scrollOpts);
    img.addEventListener('load', scheduleApply);

    apply();

    const passiveFalse = { passive: false } as AddEventListenerOptions;
    window.addEventListener('wheel', onWheel, passiveFalse);
    window.addEventListener('touchstart', onTouchStart, passiveFalse);
    window.addEventListener('touchmove', onTouchMove, passiveFalse);
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      detachMorphHelpers();
      if (heroScrollRafRef.current) cancelAnimationFrame(heroScrollRafRef.current);
      if (settleRaf) cancelAnimationFrame(settleRaf);
      unlockPageScroll();
      clearCinemaStyles();
      syncBackdrop(false);
    };
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
    <section className={`case-study-detail ${isPalmy ? 'case-study-detail--palmy' : ''}`} aria-labelledby="case-study-detail-title">
      <div ref={cinemaBackdropRef} className="case-study-detail__cinema-backdrop" aria-hidden />
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
                  <ArrowLeft size={24} weight="regular" color="currentColor" aria-hidden="true" />
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
                <figure ref={heroImageWrapRef} className="case-study-detail__hero-image-wrap">
                  <img
                    ref={heroImageRef}
                    className={`case-study-detail__hero-image case-study-detail__hero-image--cinema ${
                      isGreenCross
                        ? 'case-study-detail__hero-image--gch'
                        : !isMegaToy && !isAmioLayout
                          ? 'case-study-detail__hero-image--figma'
                          : ''
                    }`}
                    src={overview.heroImage}
                    alt={overview.heroAlt}
                  />
                </figure>
                <div className="case-study-detail__hero-copy">
                  <p className="case-study-detail__hero-subtitle">{overview.subtitle}</p>
                  <h1 id="case-study-detail-title" className="case-study-detail__hero-title">
                    {overview.title}
                  </h1>
                  <p className="case-study-detail__hero-body">{overview.body}</p>
                  <p className="case-study-detail__hero-meta">{overview.meta}</p>
                </div>
              </article>

              <aside className="case-study-detail__summary" aria-label="Overview">
                <h2>Overview</h2>
                {overviewSummaryItems.map(({ label, value, size }, idx, arr) => (
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
              className={`case-study-detail__split-card case-study-detail__split-card--brief ${
                isMegaToy ? 'case-study-detail__split-card--mega-fluid' : isAmioLayout ? 'case-study-detail__split-card--brief-amio' : ''
              }`}
            >
              <figure className="media-side case-study-detail__brief-media">
                <img src={briefContent.image} alt={briefContent.imageAlt} />
              </figure>
              <div className="text-side case-study-detail__brief-text">
                <div className="case-study-detail__brief-content">
                  <div className="case-study-detail__brief-top-group">
                    <div className="case-study-detail__brief-intro">
                      <h3>The brief</h3>
                      <div className="case-study-detail__brief-business">
                        {!isAmioLayout && <h4>Business context</h4>}
                        {isPalmy ? (
                          <>
                            <p>Palmy is a concept for a digital-first challenger bank designed for people often underserved by traditional financial systems.</p>
                            <p>The challenge wasn’t just visual. It was behavioural.</p>
                          </>
                        ) : (
                          <p>{briefContent.business}</p>
                        )}
                      </div>
                    </div>

                    <div className="case-study-detail__brief-priorities">
                      {isPalmy ? (
                        <>
                          <h4>Banking requires:</h4>
                          <ul>
                            <li>High trust</li>
                            <li>Clear decision-making</li>
                            <li>Emotional reassurance</li>
                          </ul>
                          <p>All within a system that&apos;s often complex and intimidating.</p>
                        </>
                      ) : (
                        <>
                          <h4>{isAmioLayout ? 'Early research highlighted three core needs:' : 'Priorities:'}</h4>
                          <ul>
                            {briefContent.priorities.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="case-study-detail__brief-question">
                    {isPalmy ? (
                      <>
                        <h4 className="case-study-detail__brief-question-title">The goal was to design a UI that feels:</h4>
                        <ul>
                          <li>Clear under pressure</li>
                          <li>Warm and human</li>
                          <li>Culturally aware</li>
                          <li>Consistent across mobile, tablet, and desktop</li>
                        </ul>
                        <h4 className="case-study-detail__brief-question-title">Constraint</h4>
                        <p>Balancing brand values playful and trustworthy without reducing clarity.</p>
                        <h4 className="case-study-detail__brief-question-title">
                          How might we design a banking experience that builds trust, reduces friction, and helps users feel capable. Not confused.
                        </h4>
                      </>
                    ) : isAmioLayout ? (
                      <>
                        <p>
                          {isPalmy
                            ? 'The goal was to design a UI that feels:'
                            : 'Post-COVID behaviour added context. For high-value purchases, many users preferred booking on desktop. It felt more secure, easier to compare, and more considered.'}
                        </p>
                        <h4 className="case-study-detail__brief-question-title">Opportunity</h4>
                        <p>
                          {isPalmy
                            ? 'Balancing brand values playful and trustworthy without reducing clarity.'
                            : 'Reduce uncertainty to increase decision confidence.'}
                        </p>
                        <h4 className="case-study-detail__brief-question-title">{briefContent.question}</h4>
                        <ul>
                          {briefContent.bullets.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <>
                        <h4 className="case-study-detail__brief-question-title">{briefContent.question}</h4>
                        <ul>
                          {briefContent.bullets.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </article>

            {isGreenCross && (
              <article className="case-study-detail__panel">
                <img
                  className="full-bleed-media case-study-detail__store-image"
                  src={briefContent.postBriefImage}
                  alt={briefContent.postBriefAlt}
                />
              </article>
            )}

            {isAmioLayout && (
              <article className="case-study-detail__text-panel case-study-detail__text-panel--amio-intro" aria-label="Āmio meaning">
                <p className="case-study-detail__amio-intro-quote">
                  {isPalmy ? (
                    <>
                      <span className="case-study-detail__amio-intro-line">Palmy. Meaning flourishing. A name I chose to</span>
                      <span className="case-study-detail__amio-intro-line">reflect growth, prosperity, and the Pacific</span>
                      <span className="case-study-detail__amio-intro-line">communities at its heart.</span>
                    </>
                  ) : (
                    <>
                      <span className="case-study-detail__amio-intro-line">Āmio. Meaning to roam. Āmio Airways, a name</span>
                      <span className="case-study-detail__amio-intro-line">I chose from te reo Māori to reflect a calmer, more</span>
                      <span className="case-study-detail__amio-intro-line">considered approach to travel.</span>
                    </>
                  )}
                </p>
              </article>
            )}

            <article
              id="research"
              ref={(el) => {
                sectionsRef.current.research = el;
              }}
              className={`case-study-detail__split-card case-study-detail__split-card--reverse ${
                isMegaToy
                  ? 'case-study-detail__split-card--mega-fluid case-study-detail__split-card--research-toy'
                  : isAmioLayout
                    ? 'case-study-detail__split-card--amio-research'
                    : ''
              }`}
            >
              <div className="text-side case-study-detail__text-stack">
                {isGreenCross ? (
                  <>
                    <h3>Research</h3>
                    <p>With a tight timeline, I focused on what would directly impact the outcome.</p>
                    <h4>Sustainability and material</h4>
                    <p>
                      I reviewed recycled bag design. Many relied on bright greens and leaf symbols that felt
                      surface-level.
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
                  </>
                ) : isMegaToy ? (
                  <>
                    <h3>Research</h3>
                    <h4>Customer insight</h4>
                    <p>
                      Parents planned ahead, comparing prices for birthdays and Christmas, while kids were driven by
                      immediate play. Extended whānau (family) needed clarity and simplicity at purchase.
                    </p>
                    <ul>
                      <li>Internal research revealed how families balance value, timing, and influence</li>
                      <li>Activities were tested with children to refine clarity, engagement, and ease</li>
                    </ul>
                    <h4>Key insight</h4>
                    <p>
                      Kids don’t just influence toy purchases. They drive them. Engaging them directly, while giving
                      parents clarity and confidence, allowed the campaign to work harder across every channel, with
                      activities designed to feel affordable, sustainable, and grounded in everyday Kiwi life.
                    </p>
                  </>
                ) : isAmioLayout ? (
                  <>
                    <h3>Research</h3>
                    {isPalmy ? (
                      <>
                        <p>Before designing, I focused on the real barriers people face when managing money and building confidence.</p>
                        <h4>Existing research highlighted consistent issues, particularly for Pacific, Māori, and female users:</h4>
                        <ul>
                          <li>Financial services felt impersonal</li>
                          <li>Complex language reduced confidence</li>
                          <li>Limited cultural relevance weakened trust</li>
                          <li>Unclear information increased cognitive load</li>
                        </ul>
                      </>
                    ) : (
                      <>
                        <h4>To understand booking behaviour, I combined:</h4>
                        <ul>
                          <li>User survey</li>
                          <li>Usability testing across airline flows (Air New Zealand, Qantas)</li>
                          <li>Competitive benchmarking</li>
                          <li>Analysis of recorded usability tests (Aer Lingus, Eurowings)</li>
                        </ul>
                        <p>
                          A clear pattern emerged. Users weren’t struggling to complete bookings. They were struggling to trust their decisions.
                        </p>
                      </>
                    )}
                    <h4>{isPalmy ? 'Key Insight' : 'Observed behaviours'}</h4>
                    {isPalmy ? (
                      <>
                        <p>Confidence isn’t driven by features. <br></br> It’s driven by clarity, tone, and emotional safety.</p>
                        <h4>What this meant for UI</h4>
                        <ul>
                          <li>Reduce cognitive load through hierarchy and spacing</li>
                          <li>Use human, supportive language</li>
                          <li>Design for cultural presence, not surface styling</li>
                          <li>Reinforce feedback at every step</li>
                        </ul>
                      </>
                    ) : (
                      <>
                        <ul>
                          <li>Re-checking prices multiple times</li>
                          <li>Comparing flights across multiple tabs</li>
                          <li>Delaying commitment due to uncertainty</li>
                        </ul>
                        <p>
                          Pricing was the biggest source of friction. Hidden credit card fees, often revealed late, made it
                          difficult to trust the final cost.
                        </p>
                      </>
                    )}
                    {!isPalmy && (
                      <>
                        <h4>Behavioural insight</h4>
                        <p>
                          Booking a flight is shaped by perceived risk. Users described browsing on mobile but switching to
                          desktop to complete purchases, where it felt:
                        </p>
                        <ul>
                          <li>More secure</li>
                          <li>Easier to compare</li>
                          <li>More controlled</li>
                        </ul>
                        <p>
                          This reframed the problem. Improving usability alone wasn’t enough. The experience needed to
                          support clear decisions under pressure.
                        </p>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <h3>{researchContent.heading}</h3>
                    <h4>{researchContent.subheading}</h4>
                    <p>{researchContent.intro}</p>
                    {researchContent.paragraphs.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                    <h4>{researchContent.secondHeading}</h4>
                    <ul>
                      {researchContent.bullets.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <figure className="media-side">
                <img
                  src={
                    isGreenCross
                      ? PALE_YELLOW_PLACEHOLDER
                      : isMegaToy
                        ? TOY_IMG.researchBoard
                        : isAmioLayout
                          ? PALE_YELLOW_PLACEHOLDER
                          : IMG.research
                  }
                  alt="Research visual"
                />
              </figure>
            </article>

            {isPalmy && (
              <section className="case-study-detail__palmy-process-quote" aria-label="Research quote">
                <article className="case-study-detail__palmy-process-quote-card">
                  <p className="case-study-detail__palmy-process-quote-text">
                    <span className="case-study-detail__palmy-process-quote-line">
                      When people are afraid of the system and don’t know
                    </span>
                    <span className="case-study-detail__palmy-process-quote-line">
                      how to navigate it with confidence, they don’t engage.
                    </span>
                  </p>
                  <p className="case-study-detail__palmy-process-quote-author">
                    Pacific community leader, Digital Inclusion User Insights — Pacific Peoples (DIA)
                  </p>
                </article>
              </section>
            )}

            <article
              id="process"
              ref={(el) => {
                sectionsRef.current.process = el;
              }}
              className={`case-study-detail__split-card ${
                isMegaToy ? 'case-study-detail__split-card--mega-fluid' : isAmioLayout ? 'case-study-detail__split-card--amio-process-main' : ''
              }`}
            >
              <figure className="media-side">
                <img
                  src={
                    isGreenCross
                      ? PALE_YELLOW_PLACEHOLDER
                      : isMegaToy
                        ? PALE_YELLOW_PLACEHOLDER
                        : isAmioLayout
                          ? PALE_YELLOW_PLACEHOLDER
                          : IMG.process
                  }
                  alt="Process visual"
                />
              </figure>
              <div className={`text-side case-study-detail__text-stack ${isAmioLayout ? 'case-study-detail__text-stack--amio-flow' : ''}`}>
                {isGreenCross ? (
                  <>
                    <h3>Process &amp; approach</h3>
                    <p>{processContent.paragraphs[0]}</p>
                    <p>{processContent.paragraphs[1]}</p>
                    <h4>Direction</h4>
                    <p>{processContent.paragraphs[2]}</p>
                    <p>{processContent.paragraphs[3]}</p>
                    <p>{processContent.paragraphs[4]}</p>
                  </>
                ) : isMegaToy ? (
                  <>
                    <h3>Process &amp; Approach</h3>
                    <h4>TV commerical concept</h4>
                    <p>
                      I contributed to early concept development, drawing on the playful chaos of films like Matilda,
                      where everyday spaces come alive. This shaped “Unleash the Fun”. A high-energy world where
                      opening a Warehouse box sparks a burst of imagination, transforming the home into a space of play.
                    </p>
                    <p>
                      We explored multiple creative routes, with consumer testing validating “Unleash the Fun” as the
                      strongest direction.
                    </p>
                    <p>
                      Working within an agile squad model, I collaborated across social, digital, and in-store teams to
                      support a seamless cross-channel rollout.
                    </p>
                  </>
                ) : isAmioLayout ? (
                  <>
                    <h3>Process &amp; Approach</h3>
                    <p>
                      {isPalmy
                        ? 'I translated the brand values into guiding UI principles, turning intent into clear decisions across layout, interaction, and tone.'
                        : 'This wasn’t a linear process. It moved between research, flows, sketching, and testing. Each step surfaced new questions and often led me back to refine earlier decisions.'}
                    </p>
                    <h4>{isPalmy ? 'Clear' : 'Defining the structure'}</h4>
                    <p>
                      {isPalmy
                        ? 'Structured layouts, predictable patterns, strong hierarchy'
                        : 'Using affinity mapping and a customer journey map, I mapped emotional highs and lows across the booking experience.'}
                    </p>
                    <h4>{isPalmy ? 'Playful' : 'Three key friction points emerged'}</h4>
                    {isPalmy ? (
                      <>
                        <p>Moments of personality through tone and microinteraction</p>
                        <h4>Trustworthy</h4>
                        <p>Consistency, feedback, and controlled pacing</p>
                        <h4>Visual direction (intentional)</h4>
                        <ul>
                          <li>Tivaevae quilting &rarr; structure and layering</li>
                          <li>Henri Matisse &rarr; simplified forms and clarity</li>
                          <li>Richard Killeen &rarr; modular composition</li>
                        </ul>
                        <p>
                          These references influenced not just the visual style, but how content is grouped, spaced, and
                          understood.
                        </p>
                      </>
                    ) : (
                      <>
                        <ul>
                          <li>Pricing confusion</li>
                          <li>Decision fatigue</li>
                          <li>Loss of certainty</li>
                        </ul>
                        <p>
                          A critical constraint quickly became clear. Passenger details are essential. They can’t be
                          removed. The challenge wasn’t simplification. It was reducing effort and doubt within the journey.
                        </p>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <h3>{processContent.heading}</h3>
                    <h4>{processContent.subheading}</h4>
                    {processContent.paragraphs.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </>
                )}
              </div>
            </article>

            {isAmioLayout && (
              <>
                {isPalmy ? (
                  <article className="case-study-detail__split-card case-study-detail__split-card--reverse case-study-detail__split-card--amio-process-paths">
                    <div className="text-side case-study-detail__text-stack case-study-detail__text-stack--amio-flow">
                      <h4>Early exploration (structure before style)</h4>
                      <p>
                        Before moving into visual design, I explored layout, hierarchy, and flow through quick sketches and
                        low-fidelity wireframes.<br></br> This helped define how key screens. Accounts, Transactions, and Spending.
                        should behave before introducing brand or visual detail.
                      </p>
                      <h4>What this enabled</h4>
                      <ul>
                        <li>Tested hierarchy without visual bias</li>
                        <li>Reduced cognitive load early through layout decisions</li>
                        <li>Aligned three core screens into a consistent system</li>
                      </ul>
                    </div>
                    <figure className="media-side">
                      <img src={PALE_YELLOW_PLACEHOLDER} alt="Soft yellow section background" />
                    </figure>
                  </article>
                ) : (
                  <>
                    <article className="case-study-detail__split-card case-study-detail__split-card--reverse case-study-detail__split-card--amio-process-paths">
                      <div className="text-side case-study-detail__text-stack case-study-detail__text-stack--amio-flow">
                        <h4>A strategic shift: two booking paths</h4>
                        <p>Instead of forcing a single flow, I designed for two distinct behaviours:</p>
                        <h4>Full flow</h4>
                        <ul>
                          <li>Supports comparison and flexibility</li>
                          <li>Allows users to leave and return</li>
                          <li>Prioritises control and reassurance</li>
                        </ul>
                        <h4>Swift and Save</h4>
                        <ul>
                          <li>Designed for returning users</li>
                          <li>Stores passenger details and preferences</li>
                          <li>Reduces repeat effort</li>
                        </ul>
                        <h4>This revealed a key trade-off:</h4>
                        <p>control vs speed</p>
                        <p>Rather than choosing one, the experience supports both.</p>
                      </div>
                      <figure className="media-side">
                        <img src={PALE_YELLOW_PLACEHOLDER} alt="Soft yellow section background" />
                      </figure>
                    </article>

                    <article className="case-study-detail__split-card case-study-detail__split-card--amio-process-sketch">
                      <figure className="media-side">
                        <img src={PALE_YELLOW_PLACEHOLDER} alt="Soft yellow section background" />
                      </figure>
                      <div className="text-side case-study-detail__text-stack case-study-detail__text-stack--amio-flow">
                        <h4>Sketching and iteration</h4>
                        <p>Low-fidelity sketching helped resolve structure early.</p>
                        <h4>It exposed:</h4>
                        <ul>
                          <li>Unclear transitions between steps</li>
                          <li>Weak visibility of selections</li>
                          <li>Inconsistencies between flows</li>
                        </ul>
                        <p>Resolving these simplified the journey before moving into digital.</p>
                      </div>
                    </article>

                    <article className="case-study-detail__split-card case-study-detail__split-card--reverse case-study-detail__split-card--amio-process-test">
                      <div className="text-side case-study-detail__text-stack case-study-detail__text-stack--amio-flow">
                        <h4>Prototyping and testing</h4>
                        <p>By the time I moved into Figma, the structure was defined.</p>
                        <p>The focus shifted to pacing, interaction, and clarity.</p>
                        <h4>Testing revealed:</h4>
                        <ul>
                          <li>Dense layouts increased hesitation</li>
                          <li>Poor visibility led to repeated checking</li>
                          <li>Small friction points created disproportionate doubt</li>
                        </ul>
                        <h4>This led to targeted improvements:</h4>
                        <ul>
                          <li>Simplified layouts</li>
                          <li>Clearer pricing and selection states</li>
                          <li>Stronger feedback moments</li>
                        </ul>
                        <p>Each iteration reduced hesitation and improved decision flow.</p>
                      </div>
                      <figure className="media-side">
                        <img src={PALE_YELLOW_PLACEHOLDER} alt="Soft yellow section background" />
                      </figure>
                    </article>
                  </>
                )}
              </>
            )}

            {isMegaToy && (
              <article className="case-study-detail__panel case-study-detail__panel--gch-image case-study-detail__panel--gch-image-624">
                <div className="case-study-detail__toy-tv">
                  <img className="case-study-detail__toy-tv-frame" src={TOY_IMG.tvFrame} alt="Mega Toy TV campaign still" />
                </div>
              </article>
            )}

            {!isMegaToy && !isAmioLayout && (
              <article
                className={
                  isGreenCross
                    ? 'case-study-detail__panel case-study-detail__panel--gch-image case-study-detail__panel--gch-image-550'
                    : 'case-study-detail__panel case-study-detail__composite-panel case-study-detail__composite-panel--typography'
                }
              >
                {isGreenCross ? (
                  <img className="case-study-detail__gch-section-image" src={GCH_IMG.brief} alt="Typography reference board" />
                ) : (
                  <>
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
                  </>
                )}
              </article>
            )}

            {!isMegaToy && !isAmioLayout && (
              <article
                className={
                  isGreenCross
                    ? 'case-study-detail__panel case-study-detail__panel--gch-image case-study-detail__panel--gch-image-555'
                    : 'case-study-detail__panel case-study-detail__color-panel'
                }
              >
                {isGreenCross ? (
                  <img className="case-study-detail__gch-section-image" src={GCH_IMG.research} alt="Colour palette board" />
                ) : (
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
                )}
              </article>
            )}

            {isMegaToy ? (
              <article className="case-study-detail__split-card case-study-detail__split-card--reverse case-study-detail__split-card--mega-fluid">
                <div className="text-side case-study-detail__text-stack">
                  <h4>Connected play experience</h4>
                  <p>
                    I led the mailer as more than a catalogue, designing it as a hybrid of activity book and sales tool.
                    The goal was to extend play beyond the page, turning The Warehouse products, recycled toy packaging,
                    and everyday household items into simple, hands-on activities for kids.
                  </p>
                  <h4>Omni-Channel Kids Activity Layer</h4>
                  <ul>
                    <li>Mailer pages linked directly to website templates and social tutorials</li>
                    <li>TikTok, Facebook, and YouTube amplified engagement with quick demos and walkthroughs</li>
                  </ul>
                  <h4>Accessibility, Testing, &amp; Inclusion</h4>
                  <ul>
                    <li>Considered accessibility, sustainability, sensory play, and te reo Māori inclusion</li>
                    <li>Tested with kids to refine clarity, difficulty, and engagement</li>
                    <li>Simplified where needed, strengthened what worked</li>
                  </ul>
                  <p>
                    This created an experience that felt fun and achievable for kids, while remaining clear, practical,
                    and commercially effective for families.
                  </p>
                </div>
                <figure className="media-side">
                  <img src={PALE_YELLOW_PLACEHOLDER} alt="Soft yellow section background" />
                </figure>
              </article>
            ) : isAmioLayout ? null : (
              <article className="case-study-detail__text-panel">
                <h4>{isGreenCross ? 'Messaging' : 'Balancing brand attitude'}</h4>
                {isGreenCross ? (
                  <>
                    <p>I refined copy into short, high-impact lines designed to land instantly in busy retail:</p>
                    <ul>
                      <li>Life Pharmacy. "It's what's on the inside that counts"</li>
                      <li>Unichem. "Our greatest wealth is health"</li>
                    </ul>
                    <p>Clear, human, and easy to absorb in motion. <br></br>
                    Side panels carried Living Rewards and sustainability details, keeping the main faces focused and uncluttered.</p>
                  </>
                ) : (
                  <>
                    <p>
                      In partnership with TBWA, a global creative agency, the campaign embraced a confident “small spender”
                      attitude. Easy to overplay.
                    </p>
                    <p>Too confident risks distance. Too soft loses impact.</p>
                  </>
                )}
              </article>
            )}

            {isGreenCross ? (
              <article className="case-study-detail__panel case-study-detail__panel--gch-image case-study-detail__panel--gch-image-764">
                <img className="case-study-detail__gch-section-image" src={GCH_IMG.process} alt="Bag messaging section image" />
              </article>
            ) : isMegaToy ? (
              <article className="case-study-detail__panel case-study-detail__panel--gch-image case-study-detail__panel--gch-image-550">
                <img className="case-study-detail__gch-section-image" src={IMG.typographySpecimen} alt="Typeface board" />
              </article>
            ) : isAmioLayout ? null : (
              <section className="case-study-detail__two-up case-study-detail__two-up--featured">
                <img
                  className="case-study-detail__poster-image case-study-detail__poster-image--one"
                  src={IMG.duo1}
                  alt="Campaign visual placeholder one"
                />
                <img
                  className="case-study-detail__poster-image case-study-detail__poster-image--two"
                  src={IMG.duo2}
                  alt="Campaign visual placeholder two"
                />
              </section>
            )}

            {!isMegaToy && !isAmioLayout && (
              <article className="case-study-detail__text-panel">
                <h4>{isGreenCross ? 'Te reo Māori' : 'Finding the balance'}</h4>
                {isGreenCross ? (
                  <>
                    <p>
                      I introduced te reo Māori to bring warmth and cultural meaning into the system, in a way that felt
                      authentic, not decorative:
                    </p>
                    <ul>
                      <li>Life Pharmacy. "Aroha nui" (much love)</li>
                      <li>Unichem. "Kia ora" (a welcoming greeting)</li>
                    </ul>
                    <p>These phrases grounded the design in Aotearoa and reinforced tone, identity, and emotional connection.</p>
                  </>
                ) : (
                  <>
                    <p>
                      Where possible, lower camera angles gave talent presence while keeping it open and approachable.
                    </p>
                    <p>The result. Bold, spirited imagery that still felt warm and human.</p>
                  </>
                )}
              </article>
            )}

            {isGreenCross ? (
              <article className="case-study-detail__panel case-study-detail__panel--gch-image case-study-detail__panel--gch-image-624">
                <img className="case-study-detail__gch-section-image" src={GCH_IMG.paperBagDesign} alt="Paper bag design section image" />
              </article>
            ) : isMegaToy ? (
              <>
                <article className="case-study-detail__panel case-study-detail__panel--gch-image case-study-detail__panel--toy-toolkit-board">
                  <img
                    className="case-study-detail__gch-section-image case-study-detail__gch-section-image--contain"
                    src={TOY_IMG.processImage}
                    alt="Mega Toy toolkit board"
                  />
                </article>
                <article className="case-study-detail__panel case-study-detail__panel--gch-image case-study-detail__panel--gch-image-1112">
                  <div className="case-study-detail__toy-girl-panel">
                    <img className="case-study-detail__gch-section-image" src={TOY_IMG.girlImage} alt="Girl holding flyer" />
                    <img
                      className="case-study-detail__toy-girl-overlay"
                      src={TOY_IMG.girlBookOverlay}
                      alt=""
                      aria-hidden="true"
                    />
                  </div>
                </article>
              </>
            ) : isAmioLayout ? null : (
              <section className="case-study-detail__two-up case-study-detail__two-up--posters">
                <div className="case-study-detail__two-up-row">
                  <img
                    className="case-study-detail__poster-image case-study-detail__poster-image--three"
                    src={IMG.duo3}
                    alt="LP1 poster design visual one"
                  />
                  <img
                    className="case-study-detail__poster-image case-study-detail__poster-image--four"
                    src={IMG.duo4}
                    alt="LP1 poster design visual two"
                  />
                </div>
                <p className="case-study-detail__two-up-caption">LP1 Posters</p>
              </section>
            )}

            {!isGreenCross && !isMegaToy && !isAmioLayout && (
              <>
                <article className="case-study-detail__panel">
                  <img
                    className="full-bleed-media case-study-detail__store-image"
                    src={IMG.posterWall}
                    alt="In-store summer poster wall"
                  />
                </article>

                <article className="case-study-detail__text-panel">
                  <h4>Efficiency and consistency at scale</h4>
                  <>
                    <p>This reduced rework, avoided crop issues, and ensured consistency across formats.</p>
                    <p>Early mockups helped the team visualise how the campaign would land in-store.</p>
                  </>
                </article>

                <article className="case-study-detail__panel case-study-detail__panel--retail-display">
                  <img
                    className="full-bleed-media case-study-detail__retail-display-image"
                    src={IMG.retailDisplay}
                    alt="Summer retail display in store"
                  />
                </article>

                <article className="case-study-detail__text-panel case-study-detail__text-panel--scaling">
                  <h4>Scaling across channels</h4>
                  <>
                    <p>Once POS was established, I extended the system into digital.</p>
                    <p>I mapped twelve layout compositions across key banner sizes, planning for product hierarchy and messaging.</p>
                    <ul>
                      <li>POS carried in-store visibility and impact</li>
                      <li>Digital reinforced brand recognition through The Warehouse colour system</li>
                    </ul>
                    <p>Layouts were tested early. From large posters to small mobile banners, everything remained clear and consistent.</p>
                  </>
                </article>

                <section className="case-study-detail__four-up">
                  <div className="case-study-detail__four-up-grid">
                    <figure className="case-study-detail__four-up-tile case-study-detail__four-up-tile--1">
                      <img className="case-study-detail__four-up-image case-study-detail__four-up-image--1" src={IMG.outOfHome1} alt="Concept visual one" />
                    </figure>
                    <figure className="case-study-detail__four-up-tile case-study-detail__four-up-tile--2">
                      <img className="case-study-detail__four-up-image case-study-detail__four-up-image--2" src={IMG.outOfHome2} alt="Concept visual two" />
                    </figure>
                    <figure className="case-study-detail__four-up-tile case-study-detail__four-up-tile--3">
                      <img className="case-study-detail__four-up-image case-study-detail__four-up-image--3" src={IMG.outOfHome3} alt="Concept visual three" />
                    </figure>
                    <figure className="case-study-detail__four-up-tile case-study-detail__four-up-tile--4">
                      <img className="case-study-detail__four-up-image case-study-detail__four-up-image--4" src={IMG.outOfHome4} alt="Concept visual four" />
                    </figure>
                  </div>
                  <p className="case-study-detail__four-up-caption">Example of out of home</p>
                </section>

                <article className="case-study-detail__text-panel">
                  <h4>Crafting authentic moments</h4>
                  <>
                    <p>
                      A three-day lifestyle shoot at Maraetai Beach brought genuine Kiwi summer moments into the campaign.
                    </p>
                    <p>
                      I worked closely with photographers, a retoucher, production designers, a writer, and a producer to
                      refine selects and align visuals with messaging.
                    </p>
                    <p>Not just visual consistency. A shared feeling across every channel.</p>
                  </>
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
              </>
            )}

            {isPalmy && (
              <>
                <article className="case-study-detail__split-card case-study-detail__split-card--amio-process-test case-study-detail__split-card--palmy-alohi">
                  <figure className="media-side">
                    <img src={PALE_YELLOW_PLACEHOLDER} alt="Soft yellow section background" />
                  </figure>
                  <div className="text-side case-study-detail__text-stack case-study-detail__text-stack--amio-flow case-study-detail__text-stack--palmy-alohi">
                    <p>To make the experience more human,<br></br> I introduced Alohi.</p>
                    <h4>Alohi. Designing for emotional clarity</h4>
                    <p>Alohi is Palmy’s financial companion.</p>
                    <p>
                      Not decoration. A UI decision designed to support clarity and confidence.
                    </p>
                    <p>Alohi acts as a guide. Reassuring users and explaining complex actions in simple, human terms.</p>
                    <h4>Why it works</h4>
                    <ul>
                      <li>Reduces intimidation in financial tasks</li>
                      <li>Reinforces feedback through tone and motion</li>
                      <li>Creates a consistent emotional layer across the experience</li>
                    </ul>
                    <h4>Accessibility built in</h4>
                    <ul>
                      <li>Voice interaction support</li>
                      <li>Scalable typography</li>
                      <li>High contrast modes</li>
                      <li>Alohi shifts the experience from transactional to supportive.</li>
                    </ul>
                    <p>That changes how users engage.</p>
                  </div>
                </article>

                <article className="case-study-detail__split-card case-study-detail__split-card--amio-process-sketch case-study-detail__split-card--palmy-design-system">
                  <div className="text-side case-study-detail__text-stack case-study-detail__text-stack--amio-flow case-study-detail__text-stack--palmy-design-system">
                    <h4>Design System</h4>
                    <p>Everything was designed as a system, not screens.</p>
                    <h4>Foundations</h4>
                    <ul>
                      <li><strong>Font</strong> Figtree (primary), Sirenia (accent)</li>
                      <li><strong>Case</strong> Sentence case for readability</li>
                      <li><strong>Spacing</strong> 4pt system for consistency</li>
                      <li><strong>Type scale</strong> Responsive across breakpoints</li>
                    </ul>
                    <h4>Components</h4>
                    <ul>
                      <li><strong>Patterns</strong> Cards, navigation, and data visualisation</li>
                      <li><strong>Motion</strong> Consistent behaviour across interactions</li>
                      <li><strong>Theming</strong> Light and dark modes designed together</li>
                    </ul>
                    <h4>Accessibility</h4>
                    <ul>
                      <li><strong>Contrast</strong> WCAG AA across themes</li>
                      <li><strong>Focus</strong> Visible states and keyboard support</li>
                      <li><strong>Clarity</strong> Hierarchy and spacing for easy scanning</li>
                    </ul>
                  </div>
                  <figure className="media-side">
                    <img src={PALE_YELLOW_PLACEHOLDER} alt="Soft yellow section background" />
                  </figure>
                </article>
              </>
            )}

            <article
              id="solution"
              ref={(el) => {
                sectionsRef.current.solution = el;
              }}
              className={
                isGreenCross
                  ? 'case-study-detail__split-card case-study-detail__split-card--solution case-study-detail__split-card--reverse case-study-detail__split-card--solution-gch'
                  : isMegaToy
                    ? 'case-study-detail__split-card case-study-detail__split-card--solution case-study-detail__split-card--reverse case-study-detail__split-card--solution-toy'
                  : isAmioLayout
                    ? 'case-study-detail__split-card case-study-detail__split-card--solution case-study-detail__split-card--amio-solution-main'
                    : 'case-study-detail__split-card case-study-detail__split-card--solution'
              }
            >
              <figure className="media-side case-study-detail__solution-media">
                <img
                  src={isGreenCross || isMegaToy || isAmioLayout ? SOFT_PEACH_PLACEHOLDER : IMG.solution}
                  alt="Design solution visual"
                />
              </figure>
              <div className={`text-side case-study-detail__text-stack ${isAmioLayout ? 'case-study-detail__text-stack--amio-flow' : ''}`}>
                <h3>{isMegaToy || isAmioLayout ? 'Design Solution' : 'Design solution'}</h3>
                {isGreenCross ? (
                  <>
                    <p>The final system separates the two brands clearly while keeping sustainability, clarity, and usability at the core.</p>
                    <p>Life Pharmacy takes a warmer, more expressive approach. Brush-stroke typography and papercut-inspired motifs create a boutique feel, with Aroha nui acting as a clear, human focal point.</p>
                    <p>Unichem is more structured and knowledge-led. Kia ora is broken down across two lines, making it both welcoming and informative, while maintaining consistency with the shared stencil and lace style.</p>
                    <p>Across both, negative space and high contrast improve readability on kraft, helping messages cut through quickly in-store.</p>
                    <p>The system scales cleanly across all six bag sizes, balancing visual impact with real-world production constraints.</p>
                  </>
                ) : isMegaToy ? (
                  <>
                    <h4>Turning play into a system that drives purchase</h4>
                    <p>
                      “Unleash the Fun” became more than a campaign. It became a connected system designed to move
                      families from inspiration to action.
                    </p>
                    <h4>The mailer. From catalogue to catalyst</h4>
                    <p>The toy mailer was reimagined as a hybrid of catalogue, activity book, and planning tool.</p><br></br>
                    <ul>
                      <li>Activities sat alongside products, linking ideas directly to purchase</li>
                      <li>
                        Simple, achievable crafts used Warehouse products and everyday materials, lowering the barrier to
                        participation
                      </li>
                      <li>The format encouraged longer, shared browsing between kids and parents</li>
                    </ul><br></br>
                    <p>Instead of flipping pages, families stayed, explored, and built decisions together.</p>
                  </>
                ) : isAmioLayout ? (
                  <>
                    {isPalmy ? (
                      <>
                        <p>
                          A calm, structured banking experience designed to support confident decisions. <br></br>Not simplified
                          for the sake of appearance. <br></br>Clearer so users feel in control.
                        </p>
                        <h4>Accounts homepage</h4>
                        <ul>
                          <li>Dashboard layout with side navigation</li>
                          <li>Clear balance hierarchy</li>
                          <li>In-context guidance from Alohi</li>
                        </ul>
                        <p>Users always know where they are and what to do next</p>
                        <h4>Everyday transactions</h4>
                        <ul>
                          <li>Card-based layout for fast scanning</li>
                          <li>Humanised transaction labels</li>
                          <li>Immediate feedback on interaction</li>
                        </ul>
                        <p>Reduces effort when reviewing activity</p>
                        <h4>Spending tracker</h4>
                        <ul>
                          <li>Visualised monthly behaviour</li>
                          <li>Eco-impact surfaced through actions</li>
                          <li>Accessible colour adjustments across modes</li>
                        </ul>
                        <p>Makes financial behaviour visible and understandable</p>
                      </>
                    ) : (
                      <>
                        <p>The final prototype is a calm, structured desktop booking experience designed for decision-making under pressure.</p>
                        <h4>Every screen reinforces three things:</h4>
                        <ul>
                          <li>Where you are</li>
                          <li>What you have selected</li>
                          <li>What it costs</li>
                        </ul>
                        <p>The goal wasn’t speed alone. It was clarity when it matters most.</p>
                      </>
                    )}
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </article>

            {isAmio && (
              <>
                <article className="case-study-detail__split-card case-study-detail__split-card--reverse case-study-detail__split-card--amio-solution-decisions">
                  <div className="text-side case-study-detail__text-stack case-study-detail__text-stack--amio-flow">
                    <h4>Making decisions visible</h4>
                    <p>
                      {isPalmy
                        ? 'A key pattern is always-visible account context: balances, recent movement, and quick actions update in real time.'
                        : 'A key feature is the summary triangle. An always-visible, cart-like element that updates in real time.'}
                    </p>
                    <h4>{isPalmy ? 'When users review or act on money:' : 'When a user selects a flight:'}</h4>
                    <ul>
                      {isPalmy ? (
                        <>
                          <li>Transaction context stays visible</li>
                          <li>Balances and status update immediately</li>
                        </>
                      ) : (
                        <>
                          <li>A card moves into the triangle</li>
                          <li>The total price updates instantly</li>
                        </>
                      )}
                    </ul>
                    <h4>This creates two immediate effects:</h4>
                    <ul>
                      {isPalmy ? (
                        <>
                          <li>Users feel in control of their financial position</li>
                          <li>Key information stays visible at decision moments</li>
                        </>
                      ) : (
                        <>
                          <li>Selections feel stable and committed</li>
                          <li>Pricing is always visible</li>
                        </>
                      )}
                    </ul>
                    <p>{isPalmy ? 'This directly addresses a core banking anxiety.' : 'This directly addresses a core anxiety.'}</p>
                    <p>
                      {isPalmy
                        ? 'Not knowing where your money stands after each action.'
                        : "Not knowing what you've selected or how much it costs."}
                    </p>
                    <p>
                      {isPalmy
                        ? 'In testing, users relied on persistent context instead of re-checking multiple screens.'
                        : 'In testing, users relied on the triangle summary instead of re-checking the interface.'}
                    </p>
                    <p>{isPalmy ? 'It reduced uncertainty and helped users act faster with confidence.' : 'It reduced second-guessing and helped them move forward.'}</p>
                    <h4>Trade-off</h4>
                    <p>
                      {isPalmy
                        ? 'Keeping this context visible uses space, but testing showed clarity mattered more than secondary detail.'
                        : 'Keeping it visible reduced screen space. Testing showed visibility mattered more than additional content.'}
                    </p>
                  </div>
                  <figure className="media-side">
                    <img src={PALE_YELLOW_PLACEHOLDER} alt="Soft yellow section background" />
                  </figure>
                </article>

                <section className="case-study-detail__testimonials case-study-detail__testimonials--amio" aria-label="Participant feedback">
                  <article className="case-study-detail__testimonial-card case-study-detail__testimonial-card--amio">
                    <div className="case-study-detail__testimonial-content">
                      <p className="case-study-detail__testimonial-quote">
                        {isPalmy
                          ? 'I could understand my money at a glance without second-guessing every screen.'
                          : 'Seeing my choice jump into the summary gave me peace of mind.'}
                      </p>
                      <p className="case-study-detail__testimonial-author">{isPalmy ? 'Prototype participant' : 'Participant feedback'}</p>
                    </div>
                  </article>
                </section>

                <article className="case-study-detail__split-card case-study-detail__split-card--amio-solution-load">
                  <figure className="media-side">
                    <img src={PALE_YELLOW_PLACEHOLDER} alt="Soft yellow section background" />
                  </figure>
                  <div className="text-side case-study-detail__text-stack case-study-detail__text-stack--amio-flow">
                    <h4>Reducing cognitive load</h4>
                    <p>Every interface decision reduced mental effort:</p>
                    <ul>
                      {isPalmy ? (
                        <>
                          <li>Account summaries designed for fast scanning</li>
                          <li>Transaction rows spaced for quick comparison</li>
                          <li>Plain-language labels and status messages</li>
                          <li>Microinteractions provide subtle confirmation feedback</li>
                        </>
                      ) : (
                        <>
                          <li>Calendar designed for fast scanning</li>
                          <li>Flight results spaced for comparison</li>
                          <li>Extras written in plain, human language</li>
                          <li>Microinteractions provide subtle feedback</li>
                        </>
                      )}
                    </ul>
                    <p>
                      {isPalmy
                        ? 'Dense finance layouts cause hesitation and missed details. Simplifying hierarchy and language improved decision clarity.'
                        : 'Dense layouts caused hesitation and missed details. Simplifying layout and language improved decision clarity.'}
                    </p>
                    <p>The experience is intentionally calm.</p>
                    <p>{isPalmy ? 'Because money decisions already carry emotional weight.' : 'Because the task itself is already high-stakes.'}</p>
                    <h4>Supporting different decision styles</h4>
                    <p>The experience supports:</p>
                    <ul>
                      {isPalmy ? (
                        <>
                          <li>Careful, detail-oriented checking</li>
                          <li>Fast, habitual day-to-day actions</li>
                        </>
                      ) : (
                        <>
                          <li>Careful, comparison-led decisions</li>
                          <li>Fast, repeat bookings</li>
                        </>
                      )}
                    </ul>
                    <p>Rather than forcing one path, it adapts to real behaviour.</p>
                  </div>
                </article>
              </>
            )}

            {isGreenCross && (
              <article className="case-study-detail__panel case-study-detail__panel--gch-image case-study-detail__panel--gch-image-595">
                <img className="case-study-detail__gch-section-image" src={GCH_IMG.unichemFrontBack} alt="Unichem bag front and back" />
              </article>
            )}

            {isMegaToy && (
              <>
                <article className="case-study-detail__toy-flow-panel">
                  <div className="case-study-detail__toy-flow">
                    <div className="case-study-detail__toy-flow-box">See it</div>
                    <span className="case-study-detail__toy-flow-arrow">
                      <img
                        className="case-study-detail__toy-flow-arrow-img"
                        src={TOY_IMG.seeTryBuyStepArrow}
                        alt=""
                        aria-hidden="true"
                        decoding="async"
                      />
                    </span>
                    <div className="case-study-detail__toy-flow-box">Try it</div>
                    <span className="case-study-detail__toy-flow-arrow">
                      <img
                        className="case-study-detail__toy-flow-arrow-img"
                        src={TOY_IMG.seeTryBuyStepArrow}
                        alt=""
                        aria-hidden="true"
                        decoding="async"
                      />
                    </span>
                    <div className="case-study-detail__toy-flow-box">Buy it</div>
                  </div>
                  <p className="case-study-detail__toy-flow-caption">
                    Seen in the mailer and social, tried through simple at-home activities, and completed with products
                    available in-store and online.
                  </p>
                </article>

                <article className="case-study-detail__split-card case-study-detail__split-card--mega-fluid">
                  <figure className="media-side">
                    <img src={PALE_YELLOW_PLACEHOLDER} alt="Soft yellow section background" />
                  </figure>
                  <div className="text-side case-study-detail__text-stack">
                    <h4>A connected activity system</h4>
                    <p>The idea extended across channels, turning a single moment into an ongoing experience:</p>
                    <ul>
                      <li>Mailer activities linked to website templates and tutorials</li>
                      <li>Social content showed how to make, not just what to buy</li>
                      <li>EDMs connected activities to relevant deals and bundles</li>
                    </ul>
                    <h4>Designed to be easy to start and easy to buy</h4>
                    <p>Activities were intentionally low-cost, simple, and achievable.</p>
                    <p>Testing with kids helped refine clarity, difficulty, and what actually held attention.</p>
                    <p>The result felt practical for families, not aspirational or out of reach.</p>
                    <h4>Consistency at scale</h4>
                    <p>
                      The system carried across mailer, in-store, and digital, ensuring the energy built at home was
                      reinforced at shelf, supporting faster, more confident decisions.
                    </p>
                  </div>
                </article>

                <article className="case-study-detail__toy-website-mockup-panel">
                  <figure className="case-study-detail__toy-website-mockup-figure">
                    <img
                      className="case-study-detail__toy-website-mockup-img"
                      src={TOY_IMG.websiteCraftLaptop}
                      alt="Laptop screen showing website: craft online"
                      width={984}
                      height={596}
                      decoding="async"
                    />
                  </figure>
                </article>

                <article
                  className="case-study-detail__toy-activity-stills-panel"
                  aria-label="Mega Toy Month connected activity stills"
                >
                  <div className="case-study-detail__toy-activity-stills">
                    {TOY_ACTIVITY_STILLS.map((still) => (
                      <figure key={still.src} className="case-study-detail__toy-activity-stills-figure">
                        <img
                          className="case-study-detail__toy-activity-stills-img"
                          src={still.src}
                          alt={still.alt}
                          width={still.width}
                          height={still.height}
                          decoding="async"
                        />
                      </figure>
                    ))}
                  </div>
                </article>

                <section
                  className="case-study-detail__testimonials case-study-detail__testimonials--toy"
                  aria-label="Customer testimonials"
                >
                  {TOY_CUSTOMER_TESTIMONIALS.map((t) => (
                    <article
                      key={t.id}
                      className={`case-study-detail__toy-testimonial-card case-study-detail__toy-testimonial-card--${t.id}`}
                    >
                      <div className="case-study-detail__toy-testimonial-card__surface">
                        <div className="case-study-detail__toy-testimonial-card__content">
                          <p className="case-study-detail__toy-testimonial-card__quote">
                            {t.id === 'jayden' ? (
                              <>
                                <span className="case-study-detail__toy-testimonial-card__line case-study-detail__toy-testimonial-card__line--jayden-first">
                                  {TOY_JAYDEN_QUOTE_LINE_1}
                                </span>
                                <br />
                                <span className="case-study-detail__toy-testimonial-card__line case-study-detail__toy-testimonial-card__line--jayden-second">
                                  {TOY_JAYDEN_QUOTE_LINE_2}
                                </span>
                              </>
                            ) : (
                              t.quote.split('\n').map((line, idx) => (
                                <React.Fragment key={idx}>
                                  {idx > 0 ? <br /> : null}
                                  {line}
                                </React.Fragment>
                              ))
                            )}
                          </p>
                          <p className="case-study-detail__toy-testimonial-card__author">{t.author}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </section>
              </>
            )}

            {!isGreenCross && !isMegaToy && !isAmioLayout && (
              <article className="case-study-detail__split-card case-study-detail__split-card--reverse case-study-detail__split-card--digital">
                <div className="text-side case-study-detail__text-stack case-study-detail__digital-text">
                  <h4>Digital campaign</h4>
                  <>
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
                  </>
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
            )}

            {!isGreenCross && !isMegaToy && !isAmioLayout && (
              <article className="case-study-detail__text-panel">
                <h4>Outcome</h4>
                <>
                  <p>The campaign unified channels that often feel disconnected.</p>
                  <p>
                    From large-scale retail to small digital touchpoints, the system stayed clear, recognisable, and
                    cohesive.
                  </p>
                  <p>The result. Distinctly Kiwi. Bright, confident, and genuinely upbeat.</p>
                </>
              </article>
            )}

            <article
              id="impact"
              ref={(el) => {
                sectionsRef.current.impact = el;
              }}
              className={
                isGreenCross
                  ? 'case-study-detail__split-card case-study-detail__split-card--reverse case-study-detail__split-card--impact case-study-detail__split-card--impact-gch'
                  : isMegaToy
                    ? 'case-study-detail__split-card case-study-detail__split-card--reverse case-study-detail__split-card--impact case-study-detail__split-card--impact-toy'
                  : 'case-study-detail__split-card case-study-detail__split-card--reverse case-study-detail__split-card--impact'
              }
            >
              <figure className="media-side case-study-detail__impact-media">
                <img src={isGreenCross || isMegaToy || isAmioLayout ? PALE_YELLOW_PLACEHOLDER : IMG.impact} alt="Impact visual" />
              </figure>
              <div className={`text-side case-study-detail__text-stack ${isAmioLayout ? 'case-study-detail__text-stack--amio-impact' : ''}`}>
                <h3>{isPalmy ? 'Impact and learnings' : 'Impact & learnings'}</h3>
                {isGreenCross ? (
                  <>
                    <p>The redesign rolled out across ~360 pharmacies, turning a functional item into a high-frequency brand touchpoint.</p>
                    <p>Each bag replaced single-use plastic while reinforcing brand, culture, and sustainability in everyday moments.</p><br></br>
                    <ul>
                      <li>Strengthened loyalty through Living Rewards messaging</li>
                      <li>Embedded te reo Māori and local motifs to build cultural presence</li>
                      <li>Designed for rollout, with production decisions supporting consistency at scale</li>
                    </ul><br></br>
                    <p>By elevating a disposable item, the system built brand equity in places most campaigns never reach.</p>
                  </>
                ) : isMegaToy ? (
                  <>
                    <h4>Key results</h4>
                    <ul>
                      <li>Repositioned Mega Toy Month from a sale to a high-impact retail event customers anticipate</li>
                      <li>
                        Delivered strong category performance during peak school holiday trading, reinforcing The Warehouse
                        as a go-to destination for toys
                      </li>
                      <li>Reached hundreds of thousands of customers across digital and in-store channels</li>
                      <li>Established a scalable campaign system across store, mailer, and digital</li>
                    </ul>
                    <h4>Behaviour and engagement</h4>
                    <ul>
                      <li>"Unleash the Fun" shifted the campaign from functional messaging to imaginative play, increasing engagement</li>
                      <li>"Under $X" pricing made the event feel accessible to kids as active participants, not just parents</li>
                      <li>Activity-led content turned browsing into participation, supporting more efficient baskets and multi-item purchases</li>
                    </ul>
                    <h4>From browse to basket</h4>
                    <ul>
                      <li>Designed as a catalogue, activity book, and sales tool in one, extending engagement beyond a typical retail browse</li>
                      <li>
                        Integrated product + play ideas made it easier for families to add multiple items in a single
                        purchase, supported by clear structure and consistent in-store execution
                      </li>
                      <li>Testing with kids refined usability, improving clarity, participation, and overall experience</li>
                    </ul>
                  </>
                ) : isAmioLayout ? (
                  <>
                    {isPalmy ? (
                      <>
                        <h4>Observed outcomes (testing)</h4>
                        <ul>
                          <li>Users moved through tasks with less hesitation</li>
                          <li>Reduced re-checking of balances and actions</li>
                          <li>Faster understanding of spending behaviour</li>
                          <li>Stronger emotional engagement</li>
                        </ul>
                        <h4>Real behaviour shift</h4>
                        <p>
                          Users stopped scanning the interface repeatedly and instead relied on layout and feedback to
                          confirm decisions.
                        </p>
                        <h4>Why this matters</h4>
                        <p>Clarity reduces cognitive load. <br></br>But more importantly, it builds trust.</p>
                        <p className="case-study-detail__palmy-impact-lead">And trust drives:</p>
                        <ul>
                          <li>Engagement</li>
                          <li>Completion</li>
                          <li>Return behaviour</li>
                        </ul>
                        <h4>What I would validate next</h4>
                        <ul>
                          <li>Task success rate</li>
                          <li>Time on task</li>
                          <li>Feature engagement</li>
                          <li>Accessibility usage</li>
                          <li>Retention</li>
                        </ul>
                      </>
                    ) : (
                      <>
                        <p>Even at medium fidelity, the experience changed behaviour.</p>
                        <h4>Users:</h4>
                        <ul>
                          <li>Backtracked less</li>
                          <li>Re-checked selections less frequently</li>
                          <li>Made decisions faster once options were narrowed</li>
                          <li>Showed stronger commitment at final selection</li>
                        </ul>
                        <br></br>
                        <p>The summary triangle became a key anchor. Users relied on it instead of repeatedly scanning the interface.</p>
                        <h4>Why this matters</h4>
                        <p>These behaviours indicate:</p>
                        <ul>
                          <li>Reduced cognitive load</li>
                          <li>Increased trust in selections</li>
                          <li>Stronger decision momentum</li>
                        </ul>
                        <br></br>
                        <p>Confidence wasn’t just a feeling. It directly influenced progression through the flow.</p>
                        <h4>What I would validate next</h4>
                        <ul>
                          <li>Drop-off at key decision points</li>
                          <li>Time to complete booking</li>
                          <li>Interaction with the summary triangle</li>
                          <li>Returning-user completion rates.</li>
                        </ul>
                      </>
                    )}
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </article>

            {isPalmy && (
              <>
                <section className="case-study-detail__testimonials case-study-detail__testimonials--amio" aria-label="Participant feedback">
                  <article className="case-study-detail__testimonial-card case-study-detail__testimonial-card--amio">
                    <div className="case-study-detail__testimonial-content">
                      <p className="case-study-detail__testimonial-quote">
                        Alohi is cute. It made everything feel way less intimidating. And I loved the sustainability section.
                        It felt like I was doing something good.
                      </p>
                      <p className="case-study-detail__testimonial-author">Participant feedback</p>
                    </div>
                  </article>
                </section>
                <article className="case-study-detail__split-card case-study-detail__split-card--reverse case-study-detail__split-card--amio-solution-load case-study-detail__split-card--palmy-next-right">
                  <div className="text-side case-study-detail__text-stack case-study-detail__text-stack--amio-flow">
                    <h4>What I’d Build Next</h4>
                    <ul>
                      <li>Budgeting and financial education tools</li>
                      <li>Behaviour-driven nudges through Alohi</li>
                      <li>Personalised onboarding</li>
                      <li>Gamified saving systems</li>
                    </ul>
                    <h4>Next Steps</h4>
                    <ul>
                      <li>Formal usability testing with diverse users</li>
                      <li>Validate accessibility in real-world conditions</li>
                      <li>Measure engagement and drop-off across flows</li>
                      <li>Expand and document the design system</li>
                    </ul>
                  </div>
                  <figure className="media-side">
                    <img src={PALE_YELLOW_PLACEHOLDER} alt="Soft yellow section background" />
                  </figure>
                </article>
                <section className="case-study-detail__testimonials case-study-detail__testimonials--amio" aria-label="Participant feedback">
                  <article className="case-study-detail__testimonial-card case-study-detail__testimonial-card--amio">
                    <div className="case-study-detail__testimonial-content">
                      <p className="case-study-detail__testimonial-quote">
                        It feels more like me. I reckon I’d stay on top of my money way more. I’d actually use something like this.
                      </p>
                      <p className="case-study-detail__testimonial-author">Participant feedback</p>
                    </div>
                  </article>
                </section>
              </>
            )}

            {isGreenCross ? (
              <>
                <section className="case-study-detail__gch-testimonials" aria-label="Testimonials">
                  <article className="case-study-detail__gch-testimonial case-study-detail__gch-testimonial--top">
                    <img
                      className="case-study-detail__gch-testimonial-shape"
                      src="/case-study-gch/c02ec373ed4968fbd436f0ce057fa158c90daaaa.svg"
                      alt=""
                      aria-hidden="true"
                    />
                    <div className="case-study-detail__gch-testimonial-content case-study-detail__gch-testimonial-content--top">
                      <p className="case-study-detail__gch-testimonial-quote">
                        Customers comment on them more than the old ones. Especially the wording on the side.
                      </p>
                      <p className="case-study-detail__gch-testimonial-author">Pharmacy assistant, Auckland</p>
                    </div>
                  </article>

                  <article className="case-study-detail__gch-testimonial case-study-detail__gch-testimonial--bottom">
                    <img
                      className="case-study-detail__gch-testimonial-shape"
                      src="/case-study-gch/967166b76eb5c87584aae5c9931e7512e8db9251.svg"
                      alt=""
                      aria-hidden="true"
                    />
                    <div className="case-study-detail__gch-testimonial-content case-study-detail__gch-testimonial-content--bottom">
                      <p className="case-study-detail__gch-testimonial-quote case-study-detail__gch-testimonial-quote--bottom">
                        It&apos;s good to see something a bit more responsible, especially from a big chain.
                      </p>
                      <p className="case-study-detail__gch-testimonial-author">Customer, Auckland</p>
                    </div>
                  </article>

                  <article className="case-study-detail__gch-testimonial case-study-detail__gch-testimonial--right">
                    <img
                      className="case-study-detail__gch-testimonial-shape"
                      src="/case-study-gch/0d8d06d89735fa0262a8f52c25f1b070a107089a.svg"
                      alt=""
                      aria-hidden="true"
                    />
                    <div className="case-study-detail__gch-testimonial-content case-study-detail__gch-testimonial-content--right">
                      <p className="case-study-detail__gch-testimonial-quote case-study-detail__gch-testimonial-quote--right">
                        I liked the &lsquo;Kia ora&rsquo; on the bag. I didn&apos;t know the exact meaning until I saw it, and it
                        feels really Kiwi. It&apos;s nice seeing te reo Māori used more.
                      </p>
                      <p className="case-study-detail__gch-testimonial-author">Customer, Auckland</p>
                    </div>
                  </article>
                </section>
                <section className="case-study-detail__insight-trio" aria-label="Key insights">
                  {GCH_INSIGHTS.map((item) => (
                    <article key={item.number} className="case-study-detail__insight-card">
                      <p className="case-study-detail__insight-num">{item.number}</p>
                      <div className="case-study-detail__insight-copy">
                        <h4 className="case-study-detail__insight-title">{item.title}</h4>
                        <p className="case-study-detail__insight-body">
                          {item.number === '3' ? (
                            <>
                              Strong teamwork allows design to scale
                              <br />
                              beyond concept
                            </>
                          ) : (
                            item.body
                          )}
                        </p>
                      </div>
                    </article>
                  ))}
                </section>
              </>
            ) : isMegaToy ? (
              <>
                <section className="case-study-detail__toy-post-impact" aria-label="Campaign takeaway">
                  <blockquote className="case-study-detail__toy-post-impact__card">
                    <p className="case-study-detail__toy-post-impact__text">
                      This wasn’t just about selling toys. It turned browsing into participation, and participation{' '}
                      <br aria-hidden="true" />
                      into purchase.
                    </p>
                  </blockquote>
                </section>
                <article className="case-study-detail__toy-tvc-panel">
                  <figure
                    className="case-study-detail__toy-tvc-panel__figure"
                    aria-label="Mega Toy Month TVC key visual (Figma 2363:2716)"
                  >
                    <img
                      className="case-study-detail__toy-tvc-panel__img"
                      src={TOY_IMG.tvcStill}
                      alt="TVC frame: children playing with toys in a living room, rainbow flare across the scene"
                      width={984}
                      height={554}
                      decoding="async"
                    />
                  </figure>
                </article>
              </>
            ) : isAmioLayout ? null : (
              <section className="case-study-detail__testimonials" aria-label="Testimonials">
                {testimonials.map((item) => (
                  <article key={item.quote} className={`case-study-detail__testimonial-card ${item.className}`}>
                    <img className="case-study-detail__testimonial-bubble" src={item.bubble} alt="" aria-hidden="true" />
                    <div className="case-study-detail__testimonial-content">
                      <p className="case-study-detail__testimonial-quote">{item.quote}</p>
                      <p className="case-study-detail__testimonial-author">{item.author}</p>
                    </div>
                  </article>
                ))}
              </section>
            )}

            <article
              id="reflection"
              ref={(el) => {
                sectionsRef.current.reflection = el;
              }}
              className={
                isGreenCross
                  ? 'case-study-detail__split-card case-study-detail__split-card--reflection case-study-detail__split-card--reflection-gch'
                  : isMegaToy
                    ? 'case-study-detail__split-card case-study-detail__split-card--reflection case-study-detail__split-card--reflection-toy'
                  : isAmioLayout
                    ? `case-study-detail__split-card case-study-detail__split-card--reflection case-study-detail__split-card--amio-reflection${
                        isPalmy ? ' case-study-detail__split-card--palmy-reflection-left' : ''
                      }`
                    : `case-study-detail__split-card case-study-detail__split-card--reflection${
                        isSummer ? ' case-study-detail__split-card--summer-reflection-left' : ''
                      }`
              }
            >
              <figure className={isGreenCross ? 'media-side case-study-detail__reflection-media case-study-detail__reflection-media--gch' : isMegaToy ? 'media-side case-study-detail__reflection-media case-study-detail__reflection-media--toy' : 'media-side case-study-detail__reflection-media'}>
                <img
                  src={isGreenCross ? SOFT_PEACH_PLACEHOLDER : isMegaToy || isAmioLayout ? PALE_YELLOW_PLACEHOLDER : IMG.reflection}
                  alt="Reflection visual"
                />
              </figure>
              <div
                className={`text-side case-study-detail__text-stack ${isAmioLayout ? 'case-study-detail__text-stack--amio-reflection' : ''}${
                  isPalmy ? ' case-study-detail__text-stack--palmy-reflection' : ''
                }`}
              >
                <h3>Reflection</h3>
                {isGreenCross ? (
                  <>
                    <p>This project reinforced how much impact small, everyday touchpoints can carry when tied to strategy.</p>
                    <p>The bags are simple, but they deliver brand, culture, and consistency at scale. Clear, recognisable, and grounded in Aotearoa.</p>
                    <p>It also highlighted the balance between creative ambition, cultural respect, and real-world feasibility, and how much strong collaboration shapes the final outcome.</p>
                    <p>Looking ahead, there's opportunity to extend the system further:</p><br></br>
                    <ul>
                      <li>Seasonal or rotating phrases tied to key moments like Matariki or Christmas</li>
                      <li>Deeper links into fashion and beauty culture through collaborations</li>
                      <li>A premium, fully sustainable line that elevates the everyday bag</li>
                    </ul><br></br>
                    <p>For me, it reinforced a core belief. The most effective design isn't always the most visible, it's the most considered.</p>
                  </>
                ) : isMegaToy ? (
                  <>
                    <p>Mega Toy Month 2021 was a big cross-functional effort. My role spanned early TVC ideation, mailer creative direction, and building the multi-channel kids activity system that tied everything together.</p>
                    <ul>
                      <li>Reinforced that good design isn’t just about visuals, but how every touchpoint connects</li>
                      <li>
                        If time, budget, and circumstances had allowed, I would have expanded this into a full in-store
                        experience, alive with activities, imagination, and play, a space kids and families would truly
                        want to explore, where the commercial’s magic could come to life.
                      </li>
                    </ul>
                  </>
                ) : isAmioLayout ? (
                  <>
                    {isPalmy ? (
                      <>
                        <p>This project pushed me beyond interface design.</p>
                        <p className="case-study-detail__palmy-reflection-lead">It forced me to think about:</p>
                        <ul>
                          <li>Trust as a design outcome</li>
                          <li>Culture as structure, not styling</li>
                          <li>Emotion as part of usability</li>
                        </ul>
                        <h4>What I learned</h4>
                        <ul>
                          <li>Clarity is a competitive advantage</li>
                          <li>Systems thinking scales confidence</li>
                          <li>Small interactions can change behaviour</li>
                        </ul>
                        <h4>Palmy reinforced something simple:</h4>
                        <p>Good UI doesn’t just help people complete tasks.</p>
                        <p>It helps them feel capable while doing it.</p>
                      </>
                    ) : (
                      <>
                        <p>If I revisited this project, I would extend it into a cross-device experience.</p>
                        <p>Mobile leads discovery.</p>
                        <p>Desktop supports commitment.</p>
                        <p>Designing both intentionally would create a more seamless journey.</p>
                        <p>I would also prototype the Swift and Save flow to explore how returning-user behaviour reduces effort over time.</p>
                        <h4>Key reflection</h4>
                        <p>This project shifted my thinking.</p>
                        <p>From designing for completion to designing for decision confidence</p>
                        <p>When users clearly understand what they&apos;ve selected, what it costs, and what comes next, they stop hesitating.</p>
                        <p>They commit.</p>
                        <p>It reinforced the role of research.</p>
                        <p>Not just validating decisions, but shaping them from the start.</p>
                      </>
                    )}
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </article>

            <article
              id="sources"
              ref={(el) => {
                sectionsRef.current.sources = el;
              }}
              className={
                isGreenCross
                  ? 'case-study-detail__split-card case-study-detail__split-card--sources case-study-detail__split-card--sources-gch'
                  : isMegaToy
                    ? 'case-study-detail__split-card case-study-detail__split-card--sources case-study-detail__split-card--sources-toy'
                  : isAmioLayout
                    ? `case-study-detail__split-card case-study-detail__split-card--sources case-study-detail__split-card--amio-sources${
                        isPalmy ? ' case-study-detail__split-card--palmy-sources-right' : ''
                      }`
                    : `case-study-detail__split-card case-study-detail__split-card--sources${
                        isSummer ? ' case-study-detail__split-card--summer-sources-right' : ''
                      }`
              }
            >
              <div
                className={`text-side case-study-detail__text-stack ${isAmioLayout ? 'case-study-detail__text-stack--amio-sources' : ''}${
                  isPalmy ? ' case-study-detail__text-stack--palmy-sources' : ''
                }`}
              >
                <h3>Sources &amp; credits</h3>
                {isGreenCross ? (
                  <>
                    <br></br>
                    <ul>
                      <li>Nielsen Norman Group. Scan-reading and visual hierarchy research</li>
                      <li>TAPPI. Kraft paper and print performance studies</li>
                      <li>Ministry for the Environment (NZ). Plastic bag ban and sustainability guidance</li>
                      <li>Outdoor Advertising Association of America (OAAA). Visibility and readability research</li>
                      <li>Papercut traditions (Kirie, European lacework) and artists including Karen Bit Vejle and Maude White</li>
                    </ul>
                  </>
                ) : isMegaToy ? (
                  <>
                    <p>
                      Thanks to the kids who tested the activities, the on-screen talent, and parents who shared honest
                      feedback. Built during the in-between lockdown period, this campaign relied on a large,
                      cross-functional team across Creative, Studio, Marketing, Media, Web, Social, and In-store.
                    </p>
                    <div className="credits-list">
                      <p><strong>Advertiser:</strong> The Warehouse Group</p>
                      <p><strong>Tribe Lead, Customer Strategy:</strong> Andrew Stein</p>
                      <p><strong>Creatives:</strong> Catherine Jacka, Samantha Smith, Jacqueline Comer</p>
                      <p><strong>Content Specialist:</strong> Amanda Sachtleben</p>
                      <p><strong>Brand Marketing:</strong> Birgit Hoeglinger, Hetal Jivanji, Greta Rountree</p>
                      <p><strong>Media:</strong> Jessamy Benge, Maddie Smith</p>
                      <p><strong>Producers:</strong> Sonali de Silva, Lauren Olive</p>
                      <p><strong>Photographers:</strong> Jessica Eastwood, Tim Dobson, A.B Watson</p>
                      <p><strong>Stylist:</strong> Kelsey Linehan</p>
                      <p><strong>Retoucher:</strong> Adrian Fitzgerald</p>
                      <p><strong>Production and Digital Design:</strong> Kate McGregor, Caroline Santos-O'Connell</p>
                      <p><strong>Mailer Production:</strong> Deidre Kennedy, Andrea Williams</p>
                      <p><strong>Social media:</strong> Bhavika Rambhai</p>
                      <p><strong>Production Company:</strong> Reel Factory</p>
                      <p><strong>Director:</strong> Johnny Barker</p>
                      <p><strong>Executive Producer:</strong> Dan Watkins</p>
                      <p><strong>Producer:</strong> Lindsay Gough</p>
                      <p><strong>DOP:</strong> Chris Watkins</p>
                      <p><strong>Offline Editor:</strong> Phil Gow</p>
                      <p><strong>Online Editor / Colourist:</strong> Marc McCarthy</p>
                      <p><strong>Visual Effects:</strong> Leon Senf</p>
                      <p><strong>Music Composition:</strong> Mike Newport</p>
                      <p><strong>Sound Studio:</strong> Liquid Studios</p>
                      <p><strong>Studio Producer:</strong> Tamara O'Neill</p>
                      <p><strong>Audio Engineer / Sound Designer:</strong> Keegan Meiring</p>
                      <p><strong>Media Agency:</strong> OMG</p>
                      <p><strong>Business Manager:</strong> Sean Galvin</p>
                      <p><strong>Account Manager:</strong> Bridget Welsh</p>
                      <p><strong>Business Digital Manager:</strong> Clarissa Voon</p>
                      <p><strong>Account Executive:</strong> Bex Donald</p>
                      <p><strong>Planning Director:</strong> Suzanne Breslin</p>
                    </div>
                  </>
                ) : isAmioLayout ? (
                  <>
                    {isPalmy ? (
                      <ul>
                        <li>
                          <strong>Department of Internal Affairs (DIA). Digital Inclusion User Insights — Pacific Peoples.</strong>{' '}
                          New Zealand Government, 2020.
                        </li>
                        <li>
                          <strong>Financial Markets Authority (FMA).</strong> Consumer Experience with the Financial Sector.
                          2022.
                        </li>
                        <li>
                          <strong>Reserve Bank of New Zealand.</strong> Financial Inclusion Indicators. 2025.
                        </li>
                        <li>
                          <strong>NN/g (Nielsen Norman Group)</strong> — usability and cognitive load research
                        </li>
                        <li>
                          <strong>Google Material Design</strong> — motion and accessibility guidance
                        </li>
                        <li>
                          <strong>Microsoft Inclusive Design Toolkit</strong>
                        </li>
                      </ul>
                    ) : (
                      <>
                        <p>
                          This project was completed as part of the UX Design Institute Professional Diploma in UX Design.
                          While guided by the course brief, all research, analysis, and design decisions were carried out
                          independently.
                        </p>
                        <h4>Supporting materials</h4>
                        <ul>
                          <li>
                            Recorded usability tests. Aer Lingus, Eurowings
                            <br />
                            (UX Design Institute materials)
                          </li>
                          <li>Competitive reference platforms. Air New Zealand, Qantas</li>
                        </ul>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <p>
                      Thanks to everyone involved in bringing the campaign to life. From teams across Creative, Studio,
                      Marketing, Media, Web, Social, and In-store, to the talent and crews across studio and on-location
                      shoots at Big Manly Beach, Whangaparāoa, Takapuna, and Maraetai.
                    </p>
                    <p>After a stretch of rough weather, we struck it lucky with perfect conditions on shoot days.</p>
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
                  </>
                )}
              </div>
              <figure
                className={
                  isGreenCross
                    ? 'media-side case-study-detail__sources-media case-study-detail__sources-media--gch'
                    : isMegaToy
                      ? 'media-side case-study-detail__sources-media case-study-detail__sources-media--toy'
                    : 'media-side media-side--tall case-study-detail__sources-media'
                }
                aria-hidden={isGreenCross || isMegaToy || isAmioLayout ? true : undefined}
              >
                <img
                  src={isGreenCross || isMegaToy || isAmioLayout ? PALE_YELLOW_PLACEHOLDER : IMG.sources}
                  alt={isGreenCross || isMegaToy || isAmioLayout ? '' : 'Sources visual'}
                  decoding="async"
                />
              </figure>
            </article>

          </div>
        </div>
        <section className="case-study-detail__more-projects" aria-label="Explore more projects">
          <div className="case-study-detail__more-projects-rule" aria-hidden="true" />
          <h2>Explore More Projects</h2>
          <div className="case-study-detail__more-projects-list">
            {moreProjects.map((study) => (
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
