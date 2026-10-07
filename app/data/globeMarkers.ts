/** Globe inspiration markers — purple pins at the red-dot places from the reference screenshots. */

export type GlobeMarkerCategory = 'campaigns' | 'packaging' | 'ui' | 'ux';

export type GlobeMarker = {
  id: string;
  lng: number;
  lat: number;
  place: string;
  category: GlobeMarkerCategory;
  categoryLabel: string;
  client: string;
  cta: string;
  caseStudyId: number;
  /** Fallback only — live placement flips from pin screen Y */
  tooltipAbove: boolean;
  image: string;
  imageAlt?: string;
};

/**
 * One purple pin per red-dot screenshot:
 * Lake Pukaki · San Francisco · Pacific Ocean · Burano · Leiden
 */
export const GLOBE_MARKERS: GlobeMarker[] = [
  {
    id: 'lake-pukaki',
    // Drawn South Island on the stylized map (true 170/−44 sits on Antarctica)
    lng: 131.0,
    lat: -21.0,
    place: 'Lake Pukaki, NZ',
    category: 'ux',
    categoryLabel: 'UX',
    client: 'UX Design Institute',
    cta: 'View Āmio Airways',
    caseStudyId: 5,
    tooltipAbove: true,
    image: '/globe-tooltips/pukaki.png',
  },
  {
    id: 'san-francisco',
    // Drawn CA coast tip (true −122 sits inland on this map)
    lng: -129.1,
    lat: 37.5,
    place: 'San Francisco, USA',
    category: 'campaigns',
    categoryLabel: 'Campaign',
    client: 'The Warehouse',
    cta: 'View Summer Season',
    caseStudyId: 3,
    tooltipAbove: false,
    image: '/globe-tooltips/sf.png',
  },
  {
    id: 'pacific',
    // Red-dot center of the Pacific reference view
    lng: -159,
    lat: -9,
    place: 'Pacific Ocean',
    category: 'ui',
    categoryLabel: 'UI',
    client: 'UX Design Institute',
    cta: 'View Palmy Bank',
    caseStudyId: 1,
    tooltipAbove: false,
    image: '/globe-tooltips/pacific.png',
  },
  {
    id: 'burano',
    // Drawn northern Adriatic tip on stylized globe (WGS84 12.4/45.5 lands in Russia)
    lng: -6.0,
    lat: 35.0,
    place: 'Burano, Italy',
    category: 'packaging',
    categoryLabel: 'Packaging',
    client: 'Green Cross Health',
    cta: 'View Retail Bags',
    caseStudyId: 2,
    tooltipAbove: false,
    image: '/globe-tooltips/green-cross-health-globe.avif',
    imageAlt: 'Life Pharmacy Aroha nui bag standing beside a Unichem kia ora bag.',
  },
  {
    id: 'leiden',
    // Drawn NL North Sea coast on stylized globe (WGS84 4.5/52 lands in Baltic)
    lng: -13.0,
    lat: 39.0,
    place: 'Leiden, Netherlands',
    category: 'campaigns',
    categoryLabel: 'Campaign',
    client: 'The Warehouse',
    cta: 'View Mega Toy Month',
    caseStudyId: 4,
    tooltipAbove: false,
    image: '/globe-tooltips/leiden.png',
  },
];

/** Figma Phosphor Regular vectors — Megaphone / Package / Ruler / User-pencil */
const CATEGORY_ICONS: Record<GlobeMarkerCategory, string> = {
  campaigns: `<svg width="20.25" height="18.75" viewBox="0 0 20.25 18.7509" fill="currentColor" aria-hidden="true"><path d="M20.25 8.99886C20.2488 7.80577 19.7743 6.66189 18.9306 5.81825C18.087 4.9746 16.9431 4.5001 15.75 4.49886H12.0187C11.7459 4.48292 6.99188 4.14823 2.46469 0.351359C2.24607 0.167752 1.97959 0.0503474 1.69656 0.0129358C1.41353 -0.0244758 1.12571 0.01966 0.866889 0.140159C0.608073 0.260657 0.38902 0.452513 0.235461 0.69319C0.081903 0.933867 0.00021725 1.21337 0 1.49886V16.4989C3.88961e-05 16.7844 0.0815953 17.0641 0.235084 17.3049C0.388572 17.5457 0.607614 17.7377 0.866465 17.8583C1.12532 17.9789 1.41322 18.0231 1.69633 17.9858C1.97945 17.9484 2.24601 17.831 2.46469 17.6473C6.00563 14.6773 9.68344 13.826 11.25 13.5879V16.5617C11.2497 16.8088 11.3105 17.0523 11.4269 17.2703C11.5434 17.4883 11.7119 17.6742 11.9175 17.8114L12.9487 18.4985C13.1481 18.6316 13.3764 18.7149 13.6145 18.7416C13.8527 18.7683 14.0938 18.7375 14.3176 18.6518C14.5414 18.5662 14.7414 18.4282 14.901 18.2493C15.0605 18.0704 15.1748 17.856 15.2344 17.6239L16.3378 13.4651C17.4204 13.3211 18.4138 12.7888 19.1334 11.9673C19.853 11.1458 20.2498 10.091 20.25 8.99886ZM1.5 16.4923V1.49886C5.51344 4.86542 9.62156 5.71761 11.25 5.92761V12.0664C9.62344 12.2801 5.51625 13.1304 1.5 16.4923ZM13.7812 17.2423V17.2526L12.75 16.5654V13.4989H14.775L13.7812 17.2423ZM15.75 11.9989H12.75V5.99886H15.75C16.5456 5.99886 17.3087 6.31493 17.8713 6.87754C18.4339 7.44015 18.75 8.20321 18.75 8.99886C18.75 9.79451 18.4339 10.5576 17.8713 11.1202C17.3087 11.6828 16.5456 11.9989 15.75 11.9989Z"/></svg>`,
  packaging: `<svg width="19.5" height="21" viewBox="0 0 19.5 20.9945" fill="currentColor" aria-hidden="true"><path d="M18.72 4.69975L10.47 0.185686C10.2496 0.0638879 10.0018 0 9.75 0C9.49816 0 9.25043 0.0638879 9.03 0.185686L0.78 4.70162C0.544395 4.83053 0.347722 5.02034 0.210517 5.25121C0.0733127 5.48208 0.000609617 5.74556 0 6.01412V14.9804C0.000609617 15.2489 0.0733127 15.5124 0.210517 15.7433C0.347722 15.9742 0.544395 16.164 0.78 16.2929L9.03 20.8088C9.25043 20.9306 9.49816 20.9945 9.75 20.9945C10.0018 20.9945 10.2496 20.9306 10.47 20.8088L18.72 16.2929C18.9556 16.164 19.1523 15.9742 19.2895 15.7433C19.4267 15.5124 19.4994 15.2489 19.5 14.9804V6.01506C19.4999 5.74602 19.4274 5.48196 19.2902 5.25054C19.153 5.01913 18.956 4.82889 18.72 4.69975ZM9.75 1.49819L17.2819 5.62319L14.4909 7.15131L6.95813 3.02631L9.75 1.49819ZM9.75 9.74819L2.21812 5.62319L5.39625 3.88319L12.9281 8.00819L9.75 9.74819ZM1.5 6.93569L9 11.0401V19.0829L1.5 14.9813V6.93569ZM18 14.9776L10.5 19.0829V11.0438L13.5 9.40225V12.7482C13.5 12.9471 13.579 13.1379 13.7197 13.2785C13.8603 13.4192 14.0511 13.4982 14.25 13.4982C14.4489 13.4982 14.6397 13.4192 14.7803 13.2785C14.921 13.1379 15 12.9471 15 12.7482V8.581L18 6.93569V14.9766V14.9776Z"/></svg>`,
  ui: `<svg width="21" height="21" viewBox="0 0 21.0014 20.9995" fill="currentColor" aria-hidden="true"><path d="M20.562 5.37821L15.6223 0.439461C15.483 0.300137 15.3176 0.189617 15.1356 0.114213C14.9536 0.03881 14.7585 0 14.5615 0C14.3645 0 14.1694 0.03881 13.9874 0.114213C13.8054 0.189617 13.64 0.300137 13.5007 0.439461L0.439461 13.4998C0.300137 13.6391 0.189617 13.8044 0.114213 13.9865C0.03881 14.1685 0 14.3635 0 14.5606C0 14.7576 0.03881 14.9526 0.114213 15.1347C0.189617 15.3167 0.300137 15.482 0.439461 15.6213L5.37915 20.5601C5.51844 20.6994 5.68381 20.8099 5.86583 20.8853C6.04784 20.9607 6.24292 20.9995 6.43993 20.9995C6.63694 20.9995 6.83202 20.9607 7.01403 20.8853C7.19605 20.8099 7.36142 20.6994 7.50071 20.5601L20.562 7.49977C20.7013 7.36048 20.8118 7.19511 20.8872 7.0131C20.9626 6.83109 21.0014 6.636 21.0014 6.43899C21.0014 6.24198 20.9626 6.0469 20.8872 5.86489C20.8118 5.68288 20.7013 5.5175 20.562 5.37821ZM6.43946 19.4998L1.50071 14.5601L4.50071 11.5601L6.97009 14.0304C7.03977 14.1001 7.12249 14.1554 7.21354 14.1931C7.30458 14.2308 7.40217 14.2502 7.50071 14.2502C7.59926 14.2502 7.69684 14.2308 7.78788 14.1931C7.87893 14.1554 7.96165 14.1001 8.03134 14.0304C8.10102 13.9607 8.15629 13.878 8.19401 13.7869C8.23172 13.6959 8.25113 13.5983 8.25113 13.4998C8.25113 13.4012 8.23172 13.3036 8.19401 13.2126C8.15629 13.1216 8.10102 13.0388 8.03134 12.9691L5.56102 10.4998L7.50071 8.56009L9.97009 11.0304C10.1108 11.1711 10.3017 11.2502 10.5007 11.2502C10.6997 11.2502 10.8906 11.1711 11.0313 11.0304C11.1721 10.8897 11.2511 10.6988 11.2511 10.4998C11.2511 10.3008 11.1721 10.1099 11.0313 9.96915L8.56102 7.49977L10.5007 5.56009L12.9701 8.0304C13.0398 8.10008 13.1225 8.15536 13.2135 8.19307C13.3046 8.23078 13.4022 8.25019 13.5007 8.25019C13.5993 8.25019 13.6968 8.23078 13.7879 8.19307C13.8789 8.15536 13.9617 8.10008 14.0313 8.0304C14.101 7.96072 14.1563 7.87799 14.194 7.78695C14.2317 7.6959 14.2511 7.59832 14.2511 7.49977C14.2511 7.40123 14.2317 7.30365 14.194 7.2126C14.1563 7.12156 14.101 7.03883 14.0313 6.96915L11.561 4.49977L14.561 1.49977L19.5007 6.43946L6.43946 19.4998Z"/></svg>`,
  ux: `<svg width="18" height="20" viewBox="0 0 17.7411 19.4236" fill="none" aria-hidden="true"><path d="M6.32172 18.25H2.25C1.42157 18.25 0.75 17.5784 0.75 16.75V15.439C0.75 12.9537 2.76472 10.939 5.25 10.939H8.43945M14.3393 11.2015L16.3659 13.2281M11.9118 4.34459C11.9118 6.32983 10.3025 7.93918 8.31725 7.93918C6.33201 7.93918 4.72266 6.32983 4.72266 4.34459C4.72266 2.35935 6.33201 0.75 8.31725 0.75C10.3025 0.75 11.9118 2.35935 11.9118 4.34459ZM8.89376 18.6736L10.6407 18.4846C10.9808 18.4478 11.2981 18.2959 11.54 18.054L16.6982 12.8957C17.0887 12.5052 17.0887 11.8721 16.6982 11.4815L16.0859 10.8692C15.6953 10.4787 15.0622 10.4787 14.6716 10.8692L9.51342 16.0274C9.27152 16.2693 9.11958 16.5866 9.08278 16.9267L8.89376 18.6736Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

const BUBBLE_LANDSCAPE_PATH =
  'M194.637 16H360C364.418 16 368 19.5817 368 24V192C368 196.418 364.418 200 360 200H8C3.58172 200 0 196.418 0 192V24C0 19.5817 3.58172 16 8 16H173.363L184 0L194.637 16Z';

const BUBBLE_PORTRAIT_PATH =
  'M184 0C188.418 0 192 3.58172 192 8V324C192 328.418 188.418 332 184 332H107.302L96 349L84.6982 332H8C3.58172 332 0 328.418 0 324V8C0 3.58172 3.58172 0 8 0H184Z';

function bubbleSvgs(kind: 'fill' | 'stroke'): string {
  const fill = kind === 'fill' ? 'fill="#FCFCFD"' : 'fill="none" stroke="#B0B3B8" stroke-width="1"';
  return `
    <span class="globe-marker__shape globe-marker__shape--${kind}" aria-hidden="true">
      <svg class="globe-marker__shape-svg globe-marker__shape-svg--landscape" viewBox="0 0 368 200" width="368" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="${BUBBLE_LANDSCAPE_PATH}" ${fill}/>
      </svg>
      <svg class="globe-marker__shape-svg globe-marker__shape-svg--portrait" viewBox="0 0 192 349" width="192" height="349" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="${BUBBLE_PORTRAIT_PATH}" ${fill}/>
      </svg>
    </span>
  `;
}

export function buildGlobeMarkerHtml(marker: GlobeMarker): string {
  const icon = CATEGORY_ICONS[marker.category];
  const placement = marker.tooltipAbove ? 'globe-marker__tooltip--above' : 'globe-marker__tooltip--below';
  const cardPoint = marker.tooltipAbove ? 'globe-marker__card--above' : 'globe-marker__card--below';
  return `
    <div class="globe-marker" data-marker-id="${marker.id}" data-case-study-id="${marker.caseStudyId}">
      <button type="button" class="globe-marker__pin" aria-label="${marker.place}" aria-expanded="false" aria-controls="globe-tooltip-${marker.id}">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="25" cy="25" r="20" fill="#7150E5" fill-opacity="0.1"/>
          <circle cx="25" cy="25" r="12.5" fill="#7150E5" fill-opacity="0.2"/>
          <circle cx="25" cy="25" r="4.5" fill="#7150E5"/>
        </svg>
      </button>
      <div id="globe-tooltip-${marker.id}" class="globe-marker__tooltip ${placement}" role="tooltip">
        <button type="button" class="globe-marker__card ${cardPoint}" data-scroll-case-study="${marker.caseStudyId}">
          ${bubbleSvgs('fill')}
          <span class="globe-marker__body">
            <span class="globe-marker__media">
              ${marker.image.endsWith('.avif')
                ? `<picture>
                    <source type="image/avif" srcset="${encodeURI(marker.image)}" />
                    <img src="${encodeURI(marker.image.replace(/\\.avif$/, '.webp'))}" alt="${marker.imageAlt ?? ''}" width="160" height="184" loading="lazy" decoding="async" />
                  </picture>`
                : `<img src="${encodeURI(marker.image)}" alt="${marker.imageAlt ?? ''}" width="160" height="184" loading="lazy" decoding="async" />`}
            </span>
            <span class="globe-marker__copy">
              <span class="globe-marker__place">${marker.place}</span>
              <span class="globe-marker__details">
                <span class="globe-marker__meta">
                  <span class="globe-marker__category">
                    <span class="globe-marker__category-icon">${icon}</span>
                    <span class="globe-marker__category-label">${marker.categoryLabel}</span>
                  </span>
                  <span class="globe-marker__client">${marker.client}</span>
                </span>
                <span class="globe-marker__cta">${marker.cta}</span>
              </span>
            </span>
          </span>
          ${bubbleSvgs('stroke')}
        </button>
      </div>
    </div>
  `;
}

export function canUseGlobeHover(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(min-width: 1025px)').matches &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
}

export function focusCaseStudyCard(caseStudyId: number) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('portfolio:focus-case-study', {
      detail: { id: caseStudyId },
    }),
  );
}
