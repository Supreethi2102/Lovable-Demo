export type PublicationDetail = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  modalSubtitle?: string;
  intro?: string;
  bullets?: string[];
  conclusion?: string;
  galleryImages?: string[];
};

export const publications: PublicationDetail[] = [
  {
    id: 1,
    title: 'New Zealand Weddings',
    subtitle: 'Layout/Art direction',
    image: '/misc/81183903d1a5b39abc75683b7deb5957a7a26ddf.png',
    modalSubtitle: 'Archived magazine',
    intro: "Contributed to the art direction and editorial design of New Zealand Weddings, the country's go-to print magazine for bridal inspiration, fashion, and planning. I worked on:",
    bullets: [
      'Designing feature and style page layouts for elegant, cohesive spreads',
      'Crafting typography and storytelling that enhanced readability and flow',
      'Collaborating with editors to bring detail and celebration to each page',
    ],
    conclusion: 'My time on the title sharpened my instincts and still guides how I design for clarity, warmth, balance, and strong visual impact.',
    galleryImages: Array(16).fill('/misc/81183903d1a5b39abc75683b7deb5957a7a26ddf.png'),
  },
  {
    id: 2,
    title: 'The Warehouse Toy Guide',
    subtitle: 'Layout/Art direction',
    image: '/misc/81183903d1a5b39abc75683b7deb5957a7a26ddf.png',
    modalSubtitle: 'Archived mailer',
    intro:
      'Designed the Big Toy Mailer for The\u00A0Warehouse, a 48-page guide of toys, activities, and play. I led art direction with depth, colour, fun.\n\nBrainstormed interactive spreads with playful type and kid-friendly styled images. Action figures dressed up, dice rolled and toy products popped out.',
    bullets: ['Layered colour across pages', 'Added diverse culture, humour', 'Made simple craft projects'],
    conclusion: 'Each spread encouraged interaction. Kids and guardians explored toys to play and buy.',
    galleryImages: Array(16).fill('/misc/81183903d1a5b39abc75683b7deb5957a7a26ddf.png'),
  },
  {
    id: 4,
    title: 'Grooms Guide',
    subtitle: 'Layout/Art direction',
    image: '/misc/c42f3d209027b1a6214a728484bf8bd46aa2dd0e.png',
    modalSubtitle: 'Archived magazine supplement',
    intro:
      'In my role at New Zealand Weddings, I\u00A0also served as Art Director for the Grooms Guide, a companion title sold with the magazine.\n\nIt offered style tips, planning advice, and wedding essentials for grooms. I\u00A0created layout templates and led art direction, building a clear system for consistent features and ads.',
    bullets: ['Shaped the overall visual flow', 'Guided tone across key stories', 'Ensured clarity in print layouts'],
    conclusion: 'Though a limited-run project, it honed my skill in tailoring editorial design.',
    galleryImages: Array(16).fill('/misc/c42f3d209027b1a6214a728484bf8bd46aa2dd0e.png'),
  },
  {
    id: 5,
    title: 'SuperLife Booklet',
    subtitle: 'Layout/Art direction',
    image: '/misc/bb424cd2f5ccd63b32cb1d33d5c48409b7eac79b.png',
    modalSubtitle: 'Archived',
    intro:
      'Designed a Retirement booklet for SuperLife, guiding readers through investment decisions with a calm, clear, and approachable tone.\n\nThe design used natural imagery to support complex financial content.',
    bullets: [
      'Curated New Zealand nature photos',
      'Shaped dense content into clear, readable sections',
      'Aligned visuals with brand values and real reader needs',
    ],
    conclusion: 'This project strengthened my ability to balance warmth, clarity, and structure in print work.',
    galleryImages: Array(16).fill('/misc/bb424cd2f5ccd63b32cb1d33d5c48409b7eac79b.png'),
  },
  {
    id: 6,
    title: 'Pumpkin Patch',
    subtitle: 'Layout/Art direction',
    image: '/misc/fdabc05abb4416c7e2c0ef00313dce6bc3ce1fab.png',
    modalSubtitle: 'Archived catalogue',
    intro:
      "Pumpkin Patch was a well-loved brand in New Zealand, known for playful kids’s clothing and high-quality, imaginative design. It grew into a household name with a legacy that still resonates today.\n\nI contributed to direction and layout design for the seasonal catalogue, using a forest discovery theme.",
    bullets: ['shaped cohesive page layouts', 'strengthened the brand story', 'crafted imagery to guide families'],
    conclusion: 'Working closely with the creative team, I refined the look and feel to invite readers to explore and connect.',
    galleryImages: Array(16).fill('/misc/fdabc05abb4416c7e2c0ef00313dce6bc3ce1fab.png'),
  },
  {
    id: 8,
    title: 'Houses',
    subtitle: 'Layout/Art direction',
    image: '/misc/b462b5710a875a0246180de073b790296e347afd.png',
    modalSubtitle: 'Archived magazine',
    intro:
      'I freelanced for Houses magazine, a quarterly title by AGM Publishing showcasing New Zealand homes and interior design across the country.\n\nMy work focused on building clean, precise layout pages that followed the established style guides closely.',
    bullets: ['Crafted clear architectural layouts', 'Refined imagery and floor plans', 'Supported editors with clean visuals'],
    conclusion:
      'This project strengthened my attention to detail, sharpened my design focus, and reinforced solid discipline within structured editorial systems.',
    galleryImages: Array(16).fill('/misc/b462b5710a875a0246180de073b790296e347afd.png'),
  },
  {
    id: 9,
    title: 'Architecture New Zealand',
    subtitle: 'Layout/Art direction',
    image: '/misc/81183903d1a5b39abc75683b7deb5957a7a26ddf.png',
    modalSubtitle: 'Archived magazine',
    intro:
      'I freelanced for Architecture New\u00A0Zealand, AGM Publishing’s flagship journal covering built work and design discourse across Aotearoa.\n\nWork focused on layouts for long-form features, project showcases, and editorial articles across issues.',
    bullets: ['Organised dense content clearly', 'Applied systems to complex imagery', 'Balanced visuals and text for impact'],
    conclusion:
      'Collaborated closely with the editor to craft strong, clear visual narratives. The\u00A0project honed skills in adapting systems for image-rich work.',
    galleryImages: Array(16).fill('/misc/81183903d1a5b39abc75683b7deb5957a7a26ddf.png'),
  },
  {
    id: 11,
    title: 'Little Treasures',
    subtitle: 'Layout/Art direction',
    image: '/misc/bb424cd2f5ccd63b32cb1d33d5c48409b7eac79b.png',
    modalSubtitle: 'Archived magazine',
    intro: 'Designed and art directed for Little Treasures, a trusted parenting magazine in New Zealand. A bi-monthly title that supported thousands of families for over two decades. I worked on:',
    bullets: [
      'Milestone features and guides',
      'Product roundups for parents',
      'Warm stories from real families',
    ],
    conclusion: 'Creating accessible layouts for new and expectant readers. I worked with editors and illustrators to bring a warm tone.\n\nWhile my time there evolved, the experience still guides my design with clarity and care.',
    galleryImages: Array(13).fill('/misc/bb424cd2f5ccd63b32cb1d33d5c48409b7eac79b.png'),
  },
  {
    id: 12,
    title: 'Beauty Lookbook',
    subtitle: 'Layout/Art direction',
    image: '/misc/bc660a50bdd11425d3b6c0372e26dde94ed79648.png',
    modalSubtitle: 'Archived seasonal catalogue',
    intro:
      'As Art Director at NZ Weddings, I\u00A0designed the Beauty Look Book, a\u00A0limited guide with Green Cross Health that showcased key trends. Each page used a polished look with a fresh, modern beauty feel.',
    bullets: ['Shaped clear layout templates', 'Set visual style for all brands', 'Crafted spreads with purpose'],
    conclusion:
      'The cover featured an Andrea Moore silk scarf in rich colours and bold motifs hinting at new beginnings. It became a sought after keepsake for readers. This project sharpened my print editorial skills for beauty stories.',
    galleryImages: Array(16).fill('/misc/bc660a50bdd11425d3b6c0372e26dde94ed79648.png'),
  },
  {
    id: 13,
    title: 'NZ Weddings Planner',
    subtitle: 'Layout/Art direction',
    image: '/misc/47acc09551b581ea0204690ee9c9bf854e3a5309.png',
    modalSubtitle: 'Archived annual magazine',
    intro: 'As Art Director at New Zealand Weddings, I led design and art direction for New Zealand Wedding Planner, a yearly guide with planning advice, style, and vendors. I worked on:',
    bullets: [
      'Crafting elegant, approachable layouts for real weddings and fashion\u00A0shoots',
      'Designing practical tools and guides that balanced style with usability',
      'Ensuring flow across all pages',
    ],
    conclusion: 'Though a special project rather than a regular magazine, it required care and creative storytelling. The experience strengthened my ability to design high-impact print with clear design.',
    galleryImages: Array(16).fill('/misc/47acc09551b581ea0204690ee9c9bf854e3a5309.png'),
  },
];

export function getPublicationById(id: number): PublicationDetail | undefined {
  return publications.find((p) => p.id === id);
}

export function getGalleryImages(pub: PublicationDetail): string[] {
  const DEFAULT_A = 16;
  const DEFAULT_B = 13;
  const fallbackLen = pub.id % 2 === 0 ? DEFAULT_A : DEFAULT_B;

  const list = (pub.galleryImages ?? []).filter((s) => typeof s === 'string' && s.trim().length > 0);
  if (list.length > 1) return list;

  // If only one (or none), repeat the main image so the UI always shows 13/16.
  return Array(fallbackLen).fill(pub.image);
}

export function getPublicationCopy(pub: PublicationDetail) {
  return {
    modalSubtitle: pub.modalSubtitle ?? pub.subtitle,
    intro: pub.intro ?? `Contributed to the art direction and editorial design of ${pub.title}.`,
    bullets: pub.bullets ?? [
      'Designing layouts for elegant, cohesive spreads',
      'Crafting typography and storytelling for readability and flow',
      'Collaborating with editors to bring detail to each page',
    ],
    conclusion: pub.conclusion ?? 'My time on the title sharpened my instincts and still guides how I design for clarity, warmth, balance, and strong visual impact.',
  };
}
