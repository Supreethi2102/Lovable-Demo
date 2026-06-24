export type CaseStudyNavItem = {
  label: string;
  sectionId: '#work' | '#publications';
};

export type CaseStudyNavCategory = {
  id: string;
  title: string;
  items: CaseStudyNavItem[];
};

export const caseStudyCategories: CaseStudyNavCategory[] = [
  {
    id: 'campaigns',
    title: 'Campaigns',
    items: [
      { label: 'The Warehouse Mega Toy Month', sectionId: '#work' },
      { label: 'The Warehouse Summer Campaign', sectionId: '#work' },
    ],
  },
  {
    id: 'packaging',
    title: 'Packaging',
    items: [{ label: 'Green Cross bags', sectionId: '#work' }],
  },
  {
    id: 'ui',
    title: 'UI',
    items: [{ label: 'Palmy Bank', sectionId: '#work' }],
  },
  {
    id: 'ux',
    title: 'UX',
    items: [{ label: 'Āmio Airways', sectionId: '#work' }],
  },
];

export const projectHighlightItems: CaseStudyNavItem[] = [
  { label: 'Architecture New Zealand Magazine', sectionId: '#publications' },
  { label: 'Houses Magazine', sectionId: '#publications' },
  { label: 'Life Pharmacy Mailer', sectionId: '#publications' },
  { label: 'Little Treasures Magazine', sectionId: '#publications' },
  { label: 'New Zealand Weddings Planner', sectionId: '#publications' },
  { label: 'NZW Grooms Guide Booklet', sectionId: '#publications' },
  { label: 'Pumpkin Patch Catalogue', sectionId: '#publications' },
  { label: 'Superlife Booklet', sectionId: '#publications' },
  { label: 'The Warehouse — Big Toy Month Mailer', sectionId: '#publications' },
];

export type MegaMenuTab = 'case-studies' | 'project-highlights';
