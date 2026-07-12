import type { PublicationImage, RasterImageSources } from '../utils/imageFormats';

export type PublicationDetail = {
  id: number;
  title: string;
  subtitle: string;
  image: PublicationImage;
  modalSubtitle?: string;
  intro?: string;
  bullets?: string[];
  conclusion?: string;
  galleryImages?: PublicationImage[];
};

/** Encode spaces and special chars in public asset paths for <picture>/<img>. */
function asset(path: string): string {
  return encodeURI(path);
}

function rasterImage(
  avifDir: string,
  webpDir: string,
  filename: string,
  alt: string,
  opts?: { avif?: string; webp?: string },
): RasterImageSources {
  const avifName = opts?.avif ?? filename;
  const webpName = opts?.webp ?? filename;
  return {
    avif: asset(`${avifDir}/${avifName}.avif`),
    webp: asset(`${webpDir}/${webpName}.webp`),
    alt,
  };
}

/* ─── Architecture New Zealand ─── */
const ARCH_NZ_AVIF = '/Images/Architecture NZ/Architecture NZ avif';
const ARCH_NZ_WEBP = '/Images/Architecture NZ/Architecture NZ webp';
const architectureNzImage = (filename: string, alt: string) =>
  rasterImage(ARCH_NZ_AVIF, ARCH_NZ_WEBP, filename, alt);

const ARCHITECTURE_NZ_HERO = architectureNzImage(
  'architecture-nz-hero',
  "Hero image for Architecture New Zealand magazine featuring the geometric timber interior of Wellington Airport's international terminal.",
);

const ARCHITECTURE_NZ_GALLERY: RasterImageSources[] = [
  architectureNzImage(
    'architecture-nz-across-the-board-01',
    'Double-page spread featuring the Madinat al-Zahra Museum in Spain and the Ipekyol Textile Factory in Turkey, combining architecture photography, plans and editorial layouts.',
  ),
  architectureNzImage(
    'architecture-nz-exhibition-reviews-01',
    'Exhibition review spread featuring a portrait of architect John Pawson alongside photographs of minimalist architectural interiors and landscapes.',
  ),
  architectureNzImage(
    'architecture-nz-kelly-ranges-the-bush-01',
    'Opening spread featuring the Waitomo Glowworm Caves Visitor Centre, with a sweeping timber roof structure integrated into the surrounding landscape.',
  ),
  architectureNzImage(
    'architecture-nz-kelly-ranges-the-bush-02',
    'Editorial spread combining architectural drawings, project analysis and a landscape photograph showing the visitor centre nestled within native bush.',
  ),
  architectureNzImage(
    'architecture-nz-kelly-ranges-the-bush-03',
    'Interior and exterior photographs highlighting the curved timber structure, walkway and roof system of the visitor centre.',
  ),
  architectureNzImage(
    'architecture-nz-kelly-ranges-the-bush-04',
    'Spread featuring construction details, diagrams and landscape photography documenting the design and engineering of the visitor centre.',
  ),
  architectureNzImage(
    'architecture-nz-rock-stars-01',
    "Opening feature spread showing the sculptural copper-clad exterior of Wellington Airport's international terminal against a blue sky.",
  ),
  architectureNzImage(
    'architecture-nz-rock-stars-02',
    "Editorial spread combining architectural sections with exterior photographs of Wellington Airport's copper-clad terminal buildings.",
  ),
  architectureNzImage(
    'architecture-nz-rock-stars-03',
    "Interior photographs of Wellington Airport's international terminal showing angular timber-lined spaces and passenger lounges.",
  ),
  architectureNzImage(
    'architecture-nz-rock-stars-04',
    'Spread featuring floor plans, architectural models and a large interior photograph of the Wellington Airport terminal.',
  ),
];

/* ─── Grooms Guide ─── */
const GROOMS_AVIF = '/Images/Grooms Guide/Grooms Guide avif';
const GROOMS_WEBP = '/Images/Grooms Guide/Grooms Guide webp';
const groomsGuideImage = (filename: string, alt: string, avifFilename = filename) =>
  rasterImage(GROOMS_AVIF, GROOMS_WEBP, filename, alt, { avif: avifFilename });

const GROOMS_GUIDE_HERO = groomsGuideImage(
  'nz-weddings-grooms-guide-hero',
  'Groom in formalwear photographed outdoors for the New Zealand Weddings Grooms Guide.',
);

const GROOMS_GUIDE_GALLERY: RasterImageSources[] = [
  groomsGuideImage(
    'nz-weddings-grooms-guide-cover',
    'Front and back cover for the New Zealand Weddings Grooms Guide featuring tailored menswear photography and editorial typography.',
    'nz-wedings-grooms-guide-cover',
  ),
  groomsGuideImage(
    'nz-weddings-grooms-guide-contents',
    'Contents double-page spread from the New Zealand Weddings Grooms Guide featuring editorial photography, illustrations, and article navigation.',
  ),
  groomsGuideImage(
    'nz-weddings-grooms-guide-on-the-road',
    'Opening feature spread from the New Zealand Weddings Grooms Guide featuring landscape photography and editorial typography.',
  ),
  groomsGuideImage(
    'nz-weddings-grooms-guide-speech-therapy',
    'Double-page spread from the New Zealand Weddings Grooms Guide featuring wedding speech advice, portrait photography, and article layout.',
  ),
  groomsGuideImage(
    'nz-weddings-grooms-guide-stag-in-the-headlights',
    'Double-page spread from the New Zealand Weddings Grooms Guide featuring cocktail recipes, stag do planning content, and photography.',
  ),
  groomsGuideImage(
    'nz-weddings-grooms-guide-stuff-of-legends',
    'Double-page spread from the New Zealand Weddings Grooms Guide featuring gift ideas, accessories, illustrations, and product photography.',
  ),
  groomsGuideImage(
    'nz-weddings-grooms-guide-anatomy-of-a-suit',
    'Double-page spread from the New Zealand Weddings Grooms Guide featuring menswear styling, tailoring details, and formalwear photography.',
  ),
];

/* ─── New Zealand Weddings magazine ─── */
const NZW_AVIF = '/Images/New Zealand Weddings magazine/New Zealand Weddings avif';
const NZW_WEBP = '/Images/New Zealand Weddings magazine/New Zealand Weddings webp';
const nzwImage = (filename: string, alt: string, opts?: { avif?: string; webp?: string }) =>
  rasterImage(NZW_AVIF, NZW_WEBP, filename, alt, opts);

const NZ_WEDDINGS_HERO = nzwImage(
  'nz-weddings-magazine-hero',
  'Hero image for New Zealand Weddings magazine featuring a bride in a lace wedding gown photographed in a light-filled editorial setting.',
);

const NZ_WEDDINGS_GALLERY: RasterImageSources[] = [
  nzwImage(
    'nz-weddings-modern-love-editorial-opening-spread',
    'Opening editorial spread for New Zealand Weddings magazine featuring a bridal fashion photograph, floral styling, and elegant magazine typography.',
  ),
  nzwImage(
    'nz-weddings-two-magazine-cover-bridal-fashion',
    'New Zealand Weddings magazine cover featuring a bridal fashion portrait and editorial cover design.',
  ),
  nzwImage(
    'nz-weddings-beauty-trend-report-layout',
    'Beauty feature layout for New Zealand Weddings magazine combining product photography, illustrations, and editorial typography.',
  ),
  nzwImage(
    'nz-weddings-honeymoon-destinations-editorial',
    'Honeymoon destinations feature combining travel photography, styling recommendations, and editorial magazine design.',
  ),
  nzwImage(
    'nz-weddings-bridal-hair-beauty-editorial',
    'Bridal hair and beauty editorial featuring photography, styling inspiration, and magazine layout design.',
  ),
  nzwImage(
    'nz-weddings-financial-planning-editorial-feature',
    'Editorial feature about wedding financial planning using typography, article design, and supporting imagery.',
  ),
  nzwImage(
    'nz-weddings-bridal-wellness-feature',
    'Bridal wellness feature combining photography, product recommendations, and editorial magazine design.',
  ),
  nzwImage(
    'nz-weddings-bridal-accessories-style-guide',
    'Bridal accessories guide featuring fashion products, styling recommendations, and editorial layout design.',
  ),
  nzwImage(
    'nz-weddings-wedding-day-timeline-feature',
    'Wedding planning feature presenting a timeline and practical guidance through editorial typography and layout design.',
  ),
  nzwImage(
    'nz-weddings-travel-section-opening-spread',
    'Travel section opener featuring resort photography and editorial magazine design for New Zealand Weddings.',
  ),
  nzwImage(
    'nz-weddings-bridal-party-styling-guide',
    'Bridal party styling guide featuring fashion products, accessories, and editorial layout design.',
  ),
  nzwImage(
    'nz-weddings-fragrance-nail-polish-buying-guide',
    'Fragrance buying guide featuring perfume recommendations, product photography, and editorial magazine design.',
  ),
  nzwImage(
    'nz-weddings-honeymoon-tv-show- inspiration-feature',
    'Honeymoon inspiration feature combining destination recommendations, photography, and editorial layout design.',
  ),
  nzwImage(
    'nz-weddings-venue-planning-guide',
    'Wedding venue planning guide featuring checklists, illustrations, and editorial magazine design.',
  ),
  nzwImage(
    'nz-weddings-honeymoon-planning-mistakes-to-avoid-article',
    'Honeymoon planning article featuring travel advice, illustration, and editorial magazine design.',
  ),
  nzwImage(
    'nz-weddings-first-dance-planning-feature',
    'Wedding planning feature offering first-dance advice through editorial typography, photography, and illustration.',
  ),
  nzwImage(
    'nz-weddings-pacific-honeymoon-destination-guide',
    'Pacific honeymoon destination guide using infographics, travel photography, and editorial magazine design.',
  ),
  nzwImage(
    'nz-weddings-luxury-honeymoon-destinations',
    'Luxury honeymoon destinations feature showcasing travel photography and editorial magazine design.',
  ),
  nzwImage(
    'nz-weddings-magazine-cover-fall-for-the-dress',
    'New Zealand Weddings magazine cover featuring a bridal fashion portrait and editorial cover design.',
  ),
];

/* ─── Houses magazine ─── */
const HOUSES_AVIF = '/Images/Houses magazine/Houses magazine avif';
const HOUSES_WEBP = '/Images/Houses magazine/Houses magazine webp';
const housesImage = (filename: string, alt: string) => rasterImage(HOUSES_AVIF, HOUSES_WEBP, filename, alt);

const HOUSES_HERO = housesImage(
  'houses-magazine-westmere-kitchen-hero',
  'Open-plan kitchen with timber cabinetry, concrete block walls, pendant lighting and a stainless steel island bench in a renovated Auckland home, featured in Houses magazine.',
);

const HOUSES_GALLERY: RasterImageSources[] = [
  housesImage(
    'houses-magazine-cover-modern-kitchens',
    'Houses magazine cover featuring a contemporary Auckland kitchen with timber cabinetry, concrete block walls and a large central island. Cover story highlights modern kitchen design.',
  ),
  housesImage(
    'houses-magazine-kitchens-in-focus-designers-spread-1',
    'Magazine feature showcasing contemporary kitchen projects from New Zealand designers, combining photography, designer profiles and editorial commentary.',
  ),
  housesImage(
    'houses-magazine-kitchens-in-focus-designers-spread-2',
    'Editorial spread profiling kitchen designers and their projects, featuring residential interiors, photography and expert design insights.',
  ),
  housesImage(
    'houses-magazine-mr-mod-design-profile',
    'Feature profile of Christchurch furniture retailers Monica Beaumont and Ross Morrison, paired with photography of mid-century furniture and interior design pieces.',
  ),
  housesImage(
    'houses- magazine-notable-design-products-part-1',
    'Product showcase featuring outdoor furniture, lighting, tables and home accessories selected for contemporary New Zealand homes.',
  ),
  housesImage(
    'houses-magazine-notable-design-products-part-2',
    'Continuation of the Houses magazine, curated collection of contemporary furniture, storage, seating and outdoor products presented in a magazine product feature.',
  ),
  housesImage(
    'houses-architectural-record-awards',
    'Award-winning residential architecture projects presented through large-format photography, project summaries and editorial layouts.',
  ),
  housesImage(
    'houses-magazine-three-of-a-kind-awards',
    'Editorial feature highlighting three internationally recognised residential architecture projects through photography and architectural commentary.',
  ),
  housesImage(
    'houses-magazine-nathan-goldsworthy-profile',
    'Profile interview with furniture designer Nathan Goldsworthy, accompanied by a portrait and examples of his contemporary furniture design work.',
  ),
  housesImage(
    'houses-magazine-westmere-refurbishment-part-1',
    'Opening spread from a Houses magazine feature on the refurbishment of a contemporary Westmere home.',
  ),
  housesImage(
    'houses-magazine-westmere-refurbishment-part-2',
    'Continuation of the Houses magazine feature, showcasing the refurbished Westmere kitchen with floor plans and project specifications.',
  ),
];

/* ─── Life Pharmacy Beauty Lookbook (folder has trailing space) ─── */
const BEAUTY_AVIF = '/Images/Life Pharmacy Beauty Lookbook /Life Pharmacy Beauty Lookbook avif';
const BEAUTY_WEBP = '/Images/Life Pharmacy Beauty Lookbook /Life Pharmacy Beauty Lookbook webp';
const beautyImage = (filename: string, alt: string) => rasterImage(BEAUTY_AVIF, BEAUTY_WEBP, filename, alt);

const BEAUTY_LOOKBOOK_HERO = beautyImage(
  'life-pharmacy-beauty-lookbook-luminous-skin-hero',
  'Editorial beauty still life featuring Clinique makeup products, pressed powders, and a makeup brush arranged in a luminous skin-inspired composition for the Life Pharmacy Beauty Lookbook.',
);

const BEAUTY_LOOKBOOK_GALLERY: RasterImageSources[] = [
  beautyImage(
    'life-pharmacy-beauty-lookbook-cover-fashion-issue',
    'Cover of the Life Pharmacy Beauty Lookbook featuring a fashion model wearing a bright yellow top and patterned scarf against a turquoise background.',
  ),
  beautyImage(
    'life-pharmacy-beauty-lookbook-contents-beauty-trends',
    'Double-page contents spread combining beauty product recommendations, fashion imagery, illustrations, and editorial typography.',
  ),
  beautyImage(
    'life-pharmacy-beauty-lookbook-fragrance-feature',
    "Editorial fragrance feature centred on Viktor & Rolf's Flowerbomb perfume, paired with fashion imagery and magazine-style feature.",
  ),
  beautyImage(
    'life-pharmacy-beauty-lookbook-super-serums-spread',
    'Beauty editorial spread highlighting skincare serums and treatments with product photography, numbered recommendations, and large typography.',
  ),
  beautyImage(
    'life-pharmacy-beauty-lookbook-smouldering-eyes-feature',
    'Beauty double-page spread featuring dramatic portrait photography with dark editorial styling and makeup product imagery.',
  ),
  beautyImage(
    'life-pharmacy-beauty-lookbook-statement-lip-feature',
    'Beauty double-page spread featuring vibrant coral lip colour, portrait photography, and product-focused layout design.',
  ),
  beautyImage(
    'life-pharmacy-beauty-lookbook-luminous=skin-feature',
    'Beauty double-page spread showcasing complexion products alongside portrait photography and neutral-toned art direction.',
  ),
  beautyImage(
    'life-pharmacy-beauty-lookbook-lipstick-nail-polish-guide',
    'Editorial beauty guide presenting lipstick shades and skin-tone recommendations through product imagery and magazine-style layout design.',
  ),
  beautyImage(
    'life-pharmacy-beauty-lookbook-back-cover',
    'Front and back cover design for the Life Pharmacy Beauty Lookbook featuring bold brand colours, floral graphics, and fashion photography.',
  ),
  beautyImage(
    'life-pharmacy-beauty-lookbook-designer-profile',
    'Editorial feature profiling New Zealand fashion designer Andrea Moore, combining portrait photography, beauty products, and magazine-style typography.',
  ),
];

/* ─── Little Treasures Magazine ─── */
const LT_AVIF = '/Images/Little Treasures Magazine/Little Teasures avif';
const LT_WEBP = '/Images/Little Treasures Magazine/Little Treasures webp';
const littleTreasuresImage = (filename: string, alt: string, opts?: { avif?: string; webp?: string }) =>
  rasterImage(LT_AVIF, LT_WEBP, filename, alt, opts);

const LITTLE_TREASURES_HERO = littleTreasuresImage(
  'little-treasures-baby-hero',
  'Editorial photography for Little Treasures magazine featuring a smiling baby wearing a knitted hat and cardigan.',
);

const LITTLE_TREASURES_GALLERY: RasterImageSources[] = [
  littleTreasuresImage(
    'little-treasures-magazine-cover-pure-joy',
    'Little Treasures magazine cover featuring a smiling baby in a yellow striped outfit standing on a beach with the headline “Pure Joy”.',
  ),
  littleTreasuresImage(
    'little-treasures-magazine-cover-bright-ideas',
    'Cover design for Little Treasures magazine featuring a child on a colourful knitted blanket and cover lines focused on parenting and family life.',
  ),
  littleTreasuresImage(
    'little-treasures-postnatal-phase-a-z-guide-spread-1',
    'Editorial spread presenting an A–L guide to the postnatal phase using photographs, illustrations, and practical advice for new mothers.',
  ),
  littleTreasuresImage(
    'little-treasures-postnatal-phase-a-z-guide-spread-2',
    'Editorial spread continuing an A–Z guide to postnatal life with tips, humour, and visual references for common parenting experiences.',
  ),
  littleTreasuresImage(
    'little-treasures-birth-traditions-around-the-world-spread-1',
    'Feature article exploring childbirth traditions around the world using a world map, photography, and cultural insights.',
  ),
  littleTreasuresImage(
    'little-treasures-birth-traditions-around-the-world-spread-2',
    'Editorial spread comparing international maternity leave policies and caesarean birth rates with supporting statistics and illustrations.',
  ),
  littleTreasuresImage(
    'little-treasures-bottle-feeding-basics-feature',
    'Educational feature explaining bottle-feeding basics with a milk bottle, feeding equipment, and step-by-step guidance for parents.',
  ),
  littleTreasuresImage(
    'little-treasures-breakfast-club-opening-spread-1',
    'Food feature opening spread showing breakfast tacos styled with avocado, salsa, and fresh ingredients.',
  ),
  littleTreasuresImage(
    'little-treasures-breakfast-club-recipes-spread-2',
    'Continuing recipe spread featuring breakfast dishes including smoked salmon slice and buckwheat coconut date porridge.',
  ),
  littleTreasuresImage(
    'little-treasures-financial-planning-for-baby-opening-page',
    'Feature opening page about preparing financially for a baby, illustrated with a savings jar and baby dummy.',
    { webp: 'little-treasures-financial-planning-for-baby-opening-page-1' },
  ),
  littleTreasuresImage(
    'little-treasures-difficult-deliveries-feature-opening',
    'Feature article about difficult deliveries, illustrated with photographs, medical references, and handwritten annotations.',
  ),
  littleTreasuresImage(
    'little-treasures-difficult-deliveries-feature-spread',
    'Continuing editorial spread sharing a personal story of a difficult birth experience supported by photographs and practical information.',
  ),
  littleTreasuresImage(
    'little-treasures-dots-and-stripes-shopping-feature',
    'Shopping feature showcasing colourful baby clothing, toys, and nursery accessories with dot and stripe patterns.',
  ),
  littleTreasuresImage(
    'little-treasures-facts-about-breastfeeding-opening-page-1',
    'Feature opening page examining breastfeeding myths and facts, illustrated with a mother feeding her baby and a magnifying glass graphic.',
  ),
  littleTreasuresImage(
    'little-treasures-facts-about-breastfeeding-spread-2',
    'Educational article exploring breastfeeding, nutrition, and maternal wellbeing with supporting illustrations and expert information.',
    { webp: 'little-treasures--facts-about-breastfeeding-spread-2' },
  ),
  littleTreasuresImage(
    'little-treasures-food-for-thought-feature-spread-1',
    'Nutrition feature discussing dietary needs for children, illustrated with a portrait of a baby and food photography.',
  ),
  littleTreasuresImage(
    'little-treasures-food-for-thought-feature-spread-2',
    'Continuing editorial spread exploring healthy food choices for children with recipes, nutritional guidance, and supporting imagery.',
  ),
  littleTreasuresImage(
    'little-treasures-happy-pills-spread-1',
    'Editorial feature titled "Happy Pills" exploring placenta encapsulation, featuring a capsule and a glass of water alongside magazine article content.',
  ),
  littleTreasuresImage(
    'little-treasures-in-the-bank-feature',
    'Magazine feature about umbilical cord blood banking, illustrated with a blood sample vial, family photographs and supporting editorial content.',
  ),
  littleTreasuresImage(
    'little-treasures-keep-in-check-spread',
    'Editorial article explaining pregnancy health checks and monitoring, featuring medical illustrations, testing equipment and supporting information.',
  ),
  littleTreasuresImage(
    'little-treasures-make-room-feature',
    'Nursery decorating feature showcasing furniture, toys and styling ideas arranged within an illustrated room setting.',
  ),
  littleTreasuresImage(
    'little-treasures-out-of-office-spread-1',
    'Editorial feature discussing maternity leave and returning to work, featuring a photograph of a pregnant woman in an office environment.',
  ),
  littleTreasuresImage(
    'little-treasures-out-of-office-spread-2',
    'Continuation of a maternity leave editorial feature, combining article content, pull quotes and workplace-themed imagery.',
  ),
  littleTreasuresImage(
    'little-treasures-mind-body-spirit-feature',
    'Wellbeing feature covering natural remedies and healthy lifestyle advice, featuring food photography, illustrations and editorial content.',
  ),
  littleTreasuresImage(
    'little-treasures-mountain-buggy-quiz',
    'Interactive magazine quiz helping readers choose a pram, using a decision tree and product comparisons.',
  ),
  littleTreasuresImage(
    'little-treasures-nature-versus-nurture-feature',
    'Magazine feature examining the influence of genetics and environment on child development, paired with lifestyle photography.',
  ),
  littleTreasuresImage(
    'little-treasures-feel-good-factor-feature',
    'Health and wellbeing editorial featuring practical advice, nutrition information and lifestyle photography for parents.',
  ),
];

/* ─── NZ Weddings Planner ─── */
const PLANNER_AVIF = '/Images/New Zealand Weddings Planner/New Zealand Wedding Planner avif';
const PLANNER_WEBP = '/Images/New Zealand Weddings Planner/New Zealand Wedding Planner webp';
const plannerImage = (filename: string, alt: string, opts?: { avif?: string; webp?: string }) =>
  rasterImage(PLANNER_AVIF, PLANNER_WEBP, filename, alt, opts);

const NZ_WEDDINGS_PLANNER_HERO = plannerImage(
  'nz-weddings-planner-rings-still-life',
  'Art-directed still life for the New Zealand Weddings Planner featuring wedding rings on hand-painted ceramic plates.',
);

const NZ_WEDDINGS_PLANNER_GALLERY: RasterImageSources[] = [
  plannerImage(
    'nz-weddings-planner-cover',
    'New Zealand Weddings Planner cover design featuring a white plate, gold typography, and wedding rings.',
  ),
  plannerImage(
    'nz-weddings-planner-contents',
    'New Zealand Weddings Planner contents page featuring editorial photography and section navigation.',
  ),
  plannerImage(
    'nz-weddings-planner-vision-infographic',
    'New Zealand Weddings Planner infographic spread helping couples define their wedding style, colour palette, and planning direction.',
  ),
  plannerImage(
    'nz-weddings-planner-pre-wedding-celebrations',
    'New Zealand Weddings Planner editorial spread exploring pre-wedding celebrations with photography and planning advice.',
    { avif: 'nz-weddings-pre-wedding-celebrations' },
  ),
  plannerImage(
    'nz-weddings-planner-bridal-party-guide',
    'New Zealand Weddings Planner editorial spread covering bridal party roles and responsibilities alongside full-page photography.',
  ),
  plannerImage(
    'nz-weddings-planner-budget-planning',
    'New Zealand Weddings Planner editorial spread presenting wedding budgeting advice with photography and financial planning guidance.',
  ),
  plannerImage(
    'nz-weddings-planner-budget-tracker',
    'New Zealand Weddings Planner spread featuring a wedding budget tracker and practical planning resources.',
  ),
  plannerImage(
    'nz-weddings-planner-cake-planning',
    'New Zealand Weddings Planner editorial spread focused on wedding cake inspiration featuring full-page photography and planning advice.',
  ),
];

/* ─── Pumpkin Patch Catalogue (folder has trailing space; webp folder typo “wepb”) ─── */
const PUMPKIN_AVIF = '/Images/Pumpkin Patch Catalogue /Pumpkin Patch Catalogue avif';
const PUMPKIN_WEBP = '/Images/Pumpkin Patch Catalogue /Pumpkin Patch Catalogue wepb';
const pumpkinImage = (filename: string, alt: string, opts?: { avif?: string; webp?: string }) =>
  rasterImage(PUMPKIN_AVIF, PUMPKIN_WEBP, filename, alt, opts);

const PUMPKIN_PATCH_HERO = pumpkinImage(
  'pumpkin-patch-autumn-winter-hero-image',
  'Child wearing layered autumn clothing including a hooded coat and checked shirt, photographed outdoors against a tree trunk.',
);

const PUMPKIN_PATCH_GALLERY: RasterImageSources[] = [
  pumpkinImage(
    'pumpkin-patch-autumn-winter-cover',
    'Pumpkin Patch Autumn Winter catalogue cover featuring children exploring a forest setting and seasonal childrenswear photography.',
  ),
  pumpkinImage(
    'pumpkin-patch-autumn-winter-cover-back-cover',
    'Pumpkin Patch Autumn Winter catalogue cover and back cover featuring children playing outdoors in a forest environment and seasonal fashion photography.',
    { avif: 'pumpkin-patch-autumn-cover-back-cover' },
  ),
  pumpkinImage(
    'pumpkin-patch-autumn-winter-welcome-spread',
    'Double-page spread from the Pumpkin Patch Autumn Winter catalogue featuring introductory editorial content, childrenswear photography, and seasonal product highlights.',
  ),
  pumpkinImage(
    'pumpkin-patch-autumn-winter-bright-spark-spread',
    'Double-page spread from the Pumpkin Patch Autumn Winter catalogue featuring boys’ outdoor fashion photography, layered clothing, and product information.',
  ),
  pumpkinImage(
    'pumpkin-patch-autumn-winter-day-dreamers-spread',
    'Double-page spread from the Pumpkin Patch Autumn Winter catalogue featuring baby clothing, lifestyle photography, and coordinated outfit selections.',
  ),
  pumpkinImage(
    'pumpkin-patch-autumn-winter-free-spirit-spread',
    'Double-page spread from the Pumpkin Patch Autumn Winter catalogue featuring girls’ fashion photography, seasonal clothing, and footwear product displays.',
  ),
  pumpkinImage(
    'pumpkin-patch-autumn-winter-boy-wonders-spread',
    'Double-page spread from the Pumpkin Patch Autumn Winter catalogue featuring boys’ fashion photography, outdoor imagery, and seasonal outfit collections.',
  ),
  pumpkinImage(
    'pumpkin-patch-autumn-winter-natural-wonders-spread',
    'Double-page spread from the Pumpkin Patch Autumn Winter catalogue featuring girls’ fashion photography, outdoor lifestyle imagery, and seasonal clothing collections.',
  ),
  pumpkinImage(
    'pumpkin-patch-autumn-winter-unite-spread',
    'Double-page spread from the Pumpkin Patch Autumn Winter catalogue featuring girls’ accessories, fashion details, and outdoor lifestyle photography.',
  ),
  pumpkinImage(
    'pumpkin-patch-autumn-winter-wild-and-free-spread',
    'Double-page spread from the Pumpkin Patch Autumn Winter catalogue featuring girls’ fashion photography, layered seasonal clothing, and editorial product layouts.',
  ),
];

/* ─── SuperLife ─── */
const SUPERLIFE_AVIF = '/Images/SuperLife/SuperLife avif';
const SUPERLIFE_WEBP = '/Images/SuperLife/SuperLife webp';
const superLifeImage = (filename: string, alt: string, opts?: { avif?: string; webp?: string }) =>
  rasterImage(SUPERLIFE_AVIF, SUPERLIFE_WEBP, filename, alt, opts);

const SUPERLIFE_HERO = superLifeImage(
  'superlife-retirement-guide-hero',
  'Hero image for the SuperLife retirement guide featuring calm New Zealand nature photography that supports financial wellbeing storytelling.',
  { webp: 'superlife-retirement-guide-hero copy' },
);

const SUPERLIFE_GALLERY: RasterImageSources[] = [
  superLifeImage(
    'superlife-retirement-guide-cover-butterfly',
    'SuperLife retirement guide cover design featuring a butterfly resting on native fern foliage.',
  ),
  superLifeImage(
    'superlife-retirement-guide-cover-leaf',
    'SuperLife retirement guide cover design featuring a green leaf held between two hands.',
  ),
  superLifeImage(
    'superlife-retirement-guide-cover-koru',
    'SuperLife retirement guide cover design featuring a koru fern unfurling against a green botanical background.',
    { avif: 'super life koru cover closed copy 2' },
  ),
  superLifeImage(
    'superlife-retirement-guide-contents-introduction-spread',
    'Contents and introduction spread from the SuperLife retirement guide, outlining key retirement planning topics.',
  ),
  superLifeImage(
    'superlife-retirement-guide-kiwisaver-spread',
    'Editorial spread explaining KiwiSaver contributions, government incentives and retirement savings planning.',
  ),
  superLifeImage(
    'superlife-retirement-guide-retirement-income-planning-spread',
    'Retirement planning spread featuring life expectancy data and income forecasting information.',
  ),
];

export const publications: PublicationDetail[] = [
  {
    id: 1,
    title: 'New Zealand Weddings',
    subtitle: 'Magazine',
    image: NZ_WEDDINGS_HERO,
    modalSubtitle: 'Archived magazine',
    intro:
      "Contributed to the art direction and editorial design of New Zealand Weddings, the country's go-to print magazine for bridal inspiration, fashion, and planning. I worked on:",
    bullets: [
      'Designing feature and style page layouts for elegant, cohesive spreads',
      'Crafting typography and storytelling that enhanced readability and flow',
      'Collaborating with editors to bring detail and celebration to each page',
    ],
    conclusion:
      'My time on the title sharpened my instincts and still guides how I design for clarity, warmth, balance, and strong visual impact.',
    galleryImages: NZ_WEDDINGS_GALLERY,
  },
  {
    id: 2,
    title: 'The Warehouse Toy Guide',
    subtitle: 'Mailer',
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
    subtitle: 'Booklet',
    image: GROOMS_GUIDE_HERO,
    modalSubtitle: 'Archived magazine supplement',
    intro:
      'In my role at New Zealand Weddings, I\u00A0also served as Art Director for the Grooms Guide, a companion title sold with the magazine.\n\nIt offered style tips, planning advice, and wedding essentials for grooms. I\u00A0created layout templates and led art direction, building a clear system for consistent features and ads.',
    bullets: ['Shaped the overall visual flow', 'Guided tone across key stories', 'Ensured clarity in print layouts'],
    conclusion: 'Though a limited-run project, it honed my skill in tailoring editorial design.',
    galleryImages: GROOMS_GUIDE_GALLERY,
  },
  {
    id: 5,
    title: 'SuperLife',
    subtitle: 'Booklet',
    image: SUPERLIFE_HERO,
    modalSubtitle: 'Archived booklet',
    intro:
      'Designed a Retirement booklet for SuperLife, guiding readers through investment decisions with a calm, clear, and approachable tone.\n\nThe design used natural imagery to support complex financial content.',
    bullets: [
      'Curated New Zealand nature photos',
      'Shaped dense content into clear, readable sections',
      'Aligned visuals with brand values and real reader needs',
    ],
    conclusion: 'This project strengthened my ability to balance warmth, clarity, and structure in print work.',
    galleryImages: SUPERLIFE_GALLERY,
  },
  {
    id: 6,
    title: 'Pumpkin Patch',
    subtitle: 'Catalogue',
    image: PUMPKIN_PATCH_HERO,
    modalSubtitle: 'Archived catalogue',
    intro:
      "Pumpkin Patch was a well-loved brand in New Zealand, known for playful kids’s clothing and high-quality, imaginative design. It grew into a household name with a legacy that still resonates today.\n\nI contributed to direction and layout design for the seasonal catalogue, using a forest discovery theme.",
    bullets: ['shaped cohesive page layouts', 'strengthened the brand story', 'crafted imagery to guide families'],
    conclusion: 'Working closely with the creative team, I refined the look and feel to invite readers to explore and connect.',
    galleryImages: PUMPKIN_PATCH_GALLERY,
  },
  {
    id: 8,
    title: 'Houses',
    subtitle: 'Magazine',
    image: HOUSES_HERO,
    modalSubtitle: 'Archived magazine',
    intro:
      'I freelanced for Houses magazine, a quarterly title by AGM Publishing showcasing New Zealand homes and interior design across the country.\n\nMy work focused on building clean, precise layout pages that followed the established style guides closely.',
    bullets: ['Crafted clear architectural layouts', 'Refined imagery and floor plans', 'Supported editors with clean visuals'],
    conclusion:
      'This project strengthened my attention to detail, sharpened my design focus, and reinforced solid discipline within structured editorial systems.',
    galleryImages: HOUSES_GALLERY,
  },
  {
    id: 9,
    title: 'Architecture New Zealand',
    subtitle: 'Magazine',
    image: ARCHITECTURE_NZ_HERO,
    modalSubtitle: 'Archived magazine',
    intro:
      'I freelanced for Architecture New\u00A0Zealand, AGM Publishing’s flagship journal covering built work and design discourse across Aotearoa.\n\nWork focused on layouts for long-form features, project showcases, and editorial articles across issues.',
    bullets: ['Organised dense content clearly', 'Applied systems to complex imagery', 'Balanced visuals and text for impact'],
    conclusion:
      'Collaborated closely with the editor to craft strong, clear visual narratives. The\u00A0project honed skills in adapting systems for image-rich work.',
    galleryImages: ARCHITECTURE_NZ_GALLERY,
  },
  {
    id: 11,
    title: 'Little Treasures',
    subtitle: 'Magazine',
    image: LITTLE_TREASURES_HERO,
    modalSubtitle: 'Archived magazine',
    intro:
      'Designed and art directed for Little Treasures, a trusted parenting magazine in New Zealand. A bi-monthly title that supported thousands of families for over two decades. I worked on:',
    bullets: [
      'Milestone features and guides',
      'Product roundups for parents',
      'Warm stories from real families',
    ],
    conclusion:
      'Creating accessible layouts for new and expectant readers. I worked with editors and illustrators to bring a warm tone.\n\nWhile my time there evolved, the experience still guides my design with clarity and care.',
    galleryImages: LITTLE_TREASURES_GALLERY,
  },
  {
    id: 12,
    title: 'Beauty Lookbook',
    subtitle: 'Lookbook',
    image: BEAUTY_LOOKBOOK_HERO,
    modalSubtitle: 'Archived seasonal lookbook',
    intro:
      'As Art Director at NZ Weddings, I\u00A0designed the Beauty Look Book, a\u00A0limited guide with Green Cross Health that showcased key trends. Each page used a polished look with a fresh, modern beauty feel.',
    bullets: ['Shaped clear layout templates', 'Set visual style for all brands', 'Crafted spreads with purpose'],
    conclusion:
      'The cover featured an Andrea Moore silk scarf in rich colours and bold motifs hinting at new beginnings. It became a sought after keepsake for readers. This project sharpened my print editorial skills for beauty stories.',
    galleryImages: BEAUTY_LOOKBOOK_GALLERY,
  },
  {
    id: 13,
    title: 'NZ Weddings Planner',
    subtitle: 'Planner',
    image: NZ_WEDDINGS_PLANNER_HERO,
    modalSubtitle: 'Archived annual planner',
    intro:
      'As Art Director at New Zealand Weddings, I led design and art direction for New Zealand Wedding Planner, a yearly guide with planning advice, style, and vendors. I worked on:',
    bullets: [
      'Crafting elegant, approachable layouts for real weddings and fashion\u00A0shoots',
      'Designing practical tools and guides that balanced style with usability',
      'Ensuring flow across all pages',
    ],
    conclusion:
      'Though a special project rather than a regular magazine, it required care and creative storytelling. The experience strengthened my ability to design high-impact print with clear design.',
    galleryImages: NZ_WEDDINGS_PLANNER_GALLERY,
  },
];

export function getPublicationById(id: number): PublicationDetail | undefined {
  return publications.find((p) => p.id === id);
}

export function getGalleryImages(pub: PublicationDetail): PublicationImage[] {
  const DEFAULT_A = 16;
  const DEFAULT_B = 13;
  const fallbackLen = pub.id % 2 === 0 ? DEFAULT_A : DEFAULT_B;

  const list = (pub.galleryImages ?? []).filter((item) => {
    if (typeof item === 'string') return item.trim().length > 0;
    return Boolean(item.avif && item.webp);
  });

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
    conclusion:
      pub.conclusion ??
      'My time on the title sharpened my instincts and still guides how I design for clarity, warmth, balance, and strong visual impact.',
  };
}
