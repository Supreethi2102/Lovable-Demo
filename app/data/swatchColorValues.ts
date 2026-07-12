/**
 * Colour value tooltips from Figma ("Tooltip / [Colour Name]").
 * Values are authored strings to match Figma exactly (including · separators).
 */
export type SwatchColorValues = {
  rgb: string;
  cmyk: string;
  hsl: string;
};

/** Lookup by swatch display name (case-insensitive, accent-insensitive enough for our set). */
export const SWATCH_COLOR_VALUES: Record<string, SwatchColorValues> = {
  'Boardwalk Amethyst': {
    rgb: '241 · 225 · 247',
    cmyk: '4 · 12 · 0 · 0',
    hsl: '284 · 58% · 93%',
  },
  'Nymphéas Blue': {
    rgb: '179 · 205 · 226',
    cmyk: '29 · 11 · 5 · 0',
    hsl: '207 · 45% · 79%',
  },
  'Gaudí Cathedral Blue': {
    rgb: '6 · 5 · 145',
    cmyk: '100 · 98 · 7 · 8',
    hsl: '240 · 93% · 29%',
  },
  'Studio Orange': {
    rgb: '194 · 90 · 53',
    cmyk: '18 · 76 · 90 · 6',
    hsl: '16 · 57% · 48%',
  },
  'Sunlit Flamingo Pink': {
    rgb: '252 · 149 · 177',
    cmyk: '0 · 53 · 9 · 0',
    hsl: '344 · 94% · 79%',
  },
  'Nightfall Onyx Eve': {
    rgb: '14 · 2 · 9',
    cmyk: '76 · 74 · 59 · 82',
    hsl: '282 · 81% · 4%',
  },
  'Island Grove Green': {
    rgb: '79 · 84 · 33',
    cmyk: '62 · 47 · 100 · 39',
    hsl: '66 · 44% · 23%',
  },
  'Royal Red': {
    rgb: '201 · 20 · 53',
    cmyk: '14 · 100 · 83 · 4',
    hsl: '349 · 82% · 43%',
  },
  /* Extra Figma pairs — ready when those swatches are added */
  'Glasshouse Plum': {
    rgb: '122 · 6 · 102',
    cmyk: '57 · 100 · 28 · 14',
    hsl: '310 · 91% · 25%',
  },
  'Spinning Light Gold': {
    rgb: '193 · 171 · 109',
    cmyk: '26 · 28 · 72 · 1',
    hsl: '46 · 43% · 57%',
  },
  'Paradise Tipani Yellow': {
    rgb: '246 · 224 · 103',
    cmyk: '5 · 7 · 72 · 0',
    hsl: '51 · 89% · 68%',
  },
  'Tiburtine Rouge': {
    rgb: '155 · 49 · 72',
    cmyk: '29 · 92 · 61 · 19',
    hsl: '347 · 52% · 40%',
  },
  'Gilded Turquoise': {
    rgb: '94 · 208 · 191',
    cmyk: '57 · 0 · 33 · 0',
    hsl: '171 · 55% · 59%',
  },
  'Silent Reverie Black': {
    rgb: '58 · 51 · 48',
    cmyk: '64 · 64 · 65 · 59',
    hsl: '18 · 9% · 21%',
  },
  'Luk Chai Grey': {
    rgb: '89 · 89 · 89',
    cmyk: '63 · 55 · 54 · 28',
    hsl: '0 · 0% · 35%',
  },
  'Lasting Apostle Green': {
    rgb: '198 · 221 · 159',
    cmyk: '24 · 1 · 47 · 0',
    hsl: '82 · 48% · 75%',
  },
};

function normalizeSwatchName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

const SWATCH_COLOR_VALUES_BY_KEY = new Map(
  Object.entries(SWATCH_COLOR_VALUES).map(([name, values]) => [normalizeSwatchName(name), values]),
);

export function getSwatchColorValues(name: string): SwatchColorValues | undefined {
  return SWATCH_COLOR_VALUES_BY_KEY.get(normalizeSwatchName(name));
}
