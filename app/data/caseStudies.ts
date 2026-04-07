export type CaseStudySection = {
  id: 'overview' | 'brief' | 'research' | 'process' | 'solution' | 'reflection' | 'impact' | 'sources';
  label: string;
  title: string;
  body: string;
  imageUrls?: string[];
  bullets?: string[];
};

export type CaseStudyDetail = {
  id: number;
  subtitle: string;
  title: string;
  duration: string;
  heroImage: string;
  readTime: string;
  sections: CaseStudySection[];
};

const PLACEHOLDER_IMAGES = [
  'https://picsum.photos/seed/case-study-1/1400/900',
  'https://picsum.photos/seed/case-study-2/1400/900',
  'https://picsum.photos/seed/case-study-3/1400/900',
  'https://picsum.photos/seed/case-study-4/1400/900',
  'https://picsum.photos/seed/case-study-5/1400/900',
  'https://picsum.photos/seed/case-study-6/1400/900',
  'https://picsum.photos/seed/case-study-7/1400/900',
];

export const caseStudyDetails: CaseStudyDetail[] = [1, 2, 3].map((id) => ({
  id,
  subtitle: 'Campaign | The Warehouse',
  title: id === 1 ? 'Summer Season' : id === 2 ? 'Retail Summer Launch' : 'Brand Storytelling Rollout',
  duration: '3 months',
  heroImage: PLACEHOLDER_IMAGES[0],
  readTime: '3 minutes',
  sections: [
    {
      id: 'overview',
      label: 'Overview',
      title: 'Campaign overview',
      body:
        'The Warehouse needed a bright summer campaign across store and digital touchpoints. I led the visual direction and layout system so each channel felt connected, simple, and unmistakably seasonal.',
    },
    {
      id: 'brief',
      label: 'Brief',
      title: 'Brief',
      body:
        'The brief asked for a campaign that felt energetic, highly visible in busy retail spaces, and flexible across social, in-store collateral, and outdoor placements. The visual system needed to move quickly without sacrificing consistency.',
      bullets: [
        'Unify in-store, social, and OOH creative with one visual language.',
        'Keep hierarchy clear for high-traffic retail environments.',
        'Build reusable templates for rapid weekly updates.',
      ],
    },
    {
      id: 'research',
      label: 'Research',
      title: 'Research',
      body:
        'I reviewed previous campaign performance, competitor retail creative, and internal merchandising constraints. The strongest outcomes came from high contrast, reduced copy load, and tighter alignment between hero imagery and promotion frames.',
      imageUrls: [PLACEHOLDER_IMAGES[1], PLACEHOLDER_IMAGES[2]],
    },
    {
      id: 'process',
      label: 'Process',
      title: 'Process',
      body:
        'The system was developed in phases: layout scaffolding, typography rhythm, then image treatment. Components were tested across formats early so desktop mockups translated cleanly into narrow and extra-wide placements.',
      imageUrls: [PLACEHOLDER_IMAGES[3], PLACEHOLDER_IMAGES[4]],
    },
    {
      id: 'solution',
      label: 'Solution',
      title: 'Solution',
      body:
        'The final solution used a modular grid with strong color blocking, practical promotional hierarchy, and reusable art-direction rules. This allowed quick swaps of products and offers without breaking the campaign identity.',
      imageUrls: [PLACEHOLDER_IMAGES[5]],
    },
    {
      id: 'reflection',
      label: 'Reflection',
      title: 'Reflection',
      body:
        'The most valuable shift was reducing visual noise. Fewer decorative moves and stricter spacing made the campaign feel more premium while remaining retail-functional.',
    },
    {
      id: 'impact',
      label: 'Impact',
      title: 'Impact',
      body:
        'The creative system improved speed-to-market and visual consistency across channels, while giving content teams a reliable structure to update offers through the season.',
      bullets: [
        'Faster campaign rollout across print and digital assets.',
        'Clearer reading flow in store viewing distance.',
        'Higher consistency across weekly campaign drops.',
      ],
    },
    {
      id: 'sources',
      label: 'Sources',
      title: 'Sources',
      body:
        'Campaign planning notes, internal retail guidelines, and archived creative references were used to define this case study.',
    },
  ],
}));

export function getCaseStudyById(id: number): CaseStudyDetail | undefined {
  return caseStudyDetails.find((item) => item.id === id);
}
