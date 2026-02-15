import React, { useState, useRef, useEffect, useId } from 'react';
import { ArrowSquareOut, X } from '@phosphor-icons/react';
import './Destinations.css';

// Destination data — expanded card layout matches Figma node 1408-2357 (Your rainbow panorama)
const destinations = {
  aarhus: { 
    id: 'denmark', 
    country: 'Denmark', 
    city: 'Aarhus', 
    image: '/destinations/here-to-travel-seqfFkckQcI-unsplash 8.png',
    expandedImage: '/destinations/Opened panorama.png',
    size: 'wide',
    title: 'Your rainbow panorama',
    artist: 'Your rainbow panorama by Olafur Eliasson.',
    photographer: 'Photo by Julia Taubitz',
    whyCity: 'ARoS Museum blends art and architecture into one experience. Its circular rooftop walkway turns the building into something you move through, not just view.',
    whatDrawsMe: 'Colour reshapes the city from within the walkway. Aarhus shifts mood without changing form.',
    howInfluences: 'I aim to create work that reveals itself gradually. Subtle cues guide users without\u00A0overwhelm.'
  },
  nevada: { 
    id: 'usa', 
    country: 'USA', 
    city: 'Nevada', 
    image: '/destinations/e-3Qf1QyJFs30-unsplash 6.png',
    expandedImage: '/destinations/Opened Nevada.png',
    gridImage: '/destinations/Grid Nevada.png',
    size: 'tall',
    title: 'Seven Magic Mountains',
    noImageBorder: true,
    imageStrokeTop: true,
    artist: 'Seven Magic Mountains by Ugo Rondinone.',
    photographer: 'Photo by Erda Estremera',
    whyCity: 'Seven Magic Mountains in Nevada brings colour and scale to the desert. Neon stacked limestone boulders, 9 to 11 metres tall, create a striking desert artwork.',
    whatDrawsMe: 'The towers balance spectacle with simplicity. Bright colours and organic forms create framed, deliberate views.',
    howInfluences: 'I think about how context shapes perception. Colour, scale, and placement become tools to spark curiosity and define\u00A0focus.'
  },
  calpe: { 
    id: 'spain', 
    country: 'Spain', 
    city: 'Calpe', 
    image: '/destinations/lena-polishko-XrUCHZO97Ak-unsplash 15.png',
    expandedImage: '/destinations/Calpe opened.png',
    size: 'normal',
    title: 'La Muralla Roja',
    artist: 'La Muralla Roja by Ricardo Bofill.',
    photographer: 'Photo by Lena Polishko',
    whyCity: 'La Muralla Roja reimagines a fortress through bold geometry and colour. Stepped volumes and interlocking courtyards make the structure feel sculptural and inhabitable.',
    whatDrawsMe: 'Its maze-like paths invite wandering. Private terraces and shared paths use warm and cool tones to frame views that feel intentional but open.',
    howInfluences: 'I consider how layout and colour guide focus. My work builds clear systems so people know where to look and what to\u00A0do.'
  },
  giza: { 
    id: 'egypt', 
    country: 'Egypt', 
    city: 'Giza', 
    image: '/destinations/dilip-poddar--lu6ThTe2g4-unsplash 6.png',
    expandedImage: '/destinations/Opened Giza.png',
    gridImage: '/destinations/Grid Giza.png',
    size: 'normal',
    title: 'The Great Sphinx',
    artist: 'The Great Sphinx, built under Pharaoh Khafre.',
    photographer: 'Photo by Dilip Podda',
    whyCity: 'The Great Sphinx is carved from a single limestone block. Its human head and lion body, combined with scale, reflect the ambition of early Egyptian builders.',
    whatDrawsMe: 'Its lines feel steady and assured. Weathering adds texture, and its placement ties it to the surrounding\u00A0pyramids.',
    howInfluences: 'I explore how form can communicate story and authority. Proportion and balance guide how I structure my own work.',
    drawsHeading: 'What draws me to the Sphinx?'
  },
  dubai: { 
    id: 'uae', 
    country: 'United Arab Emirates', 
    city: 'Dubai', 
    image: '/destinations/e-3Qf1QyJFs30-unsplash 7.png',
    expandedImage: '/destinations/Opened Creek Harbour.png',
    gridImage: '/destinations/Grid Creek Harbour.png',
    size: 'tall',
    title: 'Creek Harbour',
    noImageBorder: true,
    artist: 'Creek Harbour by Santiago Calatrava.',
    photographer: 'Photo by Florian Wehde.',
    whyCity: 'Dubai treats the city as a designed composition. Its mix of Islamic geometry, futurism, and engineered spectacle makes the urban landscape intentional.',
    whatDrawsMe: 'Calatrava-inspired arches frame the skyline like living artwork. Seen through them, the city becomes the central focus.',
    howInfluences: 'I explore how framing guides attention. Layout and hierarchy help highlight content without distraction.',
    drawsHeading: 'What draws me to Creek Harbour?'
  },
  marrakech: { 
    id: 'morocco', 
    country: 'Morocco', 
    city: 'Marrakech', 
    image: '/destinations/riccardo-monteleone-59mmHLj0sbQ-unsplash 6.png',
    expandedImage: '/destinations/Opened Marrakech.png',
    gridImage: '/destinations/Grid Marrakech.png',
    size: 'wide',
    title: 'The Jardin Majorelle',
    artist: 'The Jardin Majorelle by Jacques Majorelle.',
    photographer: 'Photo by Riccardo Monteleone.',
    whyCity: 'The Jardin Majorelle and the adjacent YSL Museum show how colour and craft shape identity. Moroccan design, modern lines, and lush planting give the spaces a vivid\u00A0feel.',
    whatDrawsMe: 'Majorelle Blue contrasts with dense greenery, while the museum highlights silhouette and palette as expressive tools.',
    howInfluences: 'I consider how visual language sets tone. Hierarchy, colour, and trend-aware choices shape a clear, intentional design\u00A0experience.'
  },
  jaipur: { 
    id: 'india', 
    country: 'India', 
    city: 'Jaipur', 
    image: '/destinations/aditya-kumar-gvY6OpSxNZY-unsplash 3.png',
    expandedImage: '/destinations/Opened hawa Mahal.png',
    gridImage: '/destinations/Grid hawa Mahal.png',
    size: 'normal',
    title: 'The Hawa Mahal',
    artist: 'The Hawa Mahal, pink sandstone façade.',
    photographer: 'Photo by Aditya Kumar.',
    whyCity: 'Jaipur shows how beauty, function, and colour coexist. Pink façades, natural cooling, and human-scale planning respond thoughtfully to daily life.',
    whatDrawsMe: 'Its façade and 953 jharokha windows create airflow, privacy, and rhythm. Practical needs become a defining visual\u00A0identity.',
    howInfluences: 'I focus on solving multiple needs simultaneously. Structure and detail allow me to create clarity and purpose in my\u00A0work.',
    drawsHeading: 'What draws me to The Hawa Mahal?'
  },
  naoshima: { 
    id: 'japan', 
    country: 'Japan', 
    city: 'Naoshima Island', 
    image: '/destinations/rebecca-lam-0uAUVfLxXsY-unsplash 7.png',
    expandedImage: '/destinations/Opened Naoshima Island.png',
    gridImage: '/destinations/Grid Naoshima Island.png',
    size: 'normal',
    title: 'Pumpkin',
    noImageBorder: true,
    imageStrokeTop: true,
    artist: 'Pumpkin by Yayoi Kusama.',
    photographer: 'Photo by Rebecca Lam.',
    whyCity: 'Naoshima blends art, architecture, and landscape with precision. Underground museums and site-specific installations make the island a curated experience.',
    whatDrawsMe: 'Kusama\'s spotted sculpture is playful yet calm. Its repetition and scale stand out against the natural shoreline.',
    howInfluences: 'I use pattern, scale, and colour intentionally. This helps me craft work that is organised, approachable, and invites\u00A0exploration.',
    drawsHeading: 'What draws me to the Pumpkin?'
  },
};

type DestinationKey = keyof typeof destinations;

interface Destination {
  id: string;
  country: string;
  city: string;
  image: string;
  expandedImage: string;
  gridImage?: string;
  size: string;
  title: string;
  artist: string;
  photographer: string;
  whyCity: string;
  whatDrawsMe: string;
  howInfluences: string;
  drawsHeading?: string;
  noImageBorder?: boolean;
  imageStrokeTop?: boolean;
}

interface DestinationCardProps {
  destination: Destination;
  destinationKey: DestinationKey;
  isExpanded: boolean;
  onExpand: (key: DestinationKey, el: HTMLElement) => void;
  onClose: () => void;
  layoutDirection?: 'image-left' | 'image-right';
}

const ExpandedContent: React.FC<{ destination: Destination; titleId: string }> = ({ destination, titleId }) => (
  <div className="destination-expanded__content" role="article">
    <div className="destination-expanded__header">
      <h3 id={titleId} className="destination-expanded__title">{destination.title}</h3>
      <p className="destination-expanded__location">{destination.city}, {destination.country}</p>
    </div>
    
    <div className="destination-expanded__sections">
      <section className="destination-expanded__section" aria-labelledby={`${titleId}-why`}>
        <h4 id={`${titleId}-why`}>Why {destination.city}?</h4>
        <p>{destination.whyCity}</p>
      </section>
      
      <section className="destination-expanded__section" aria-labelledby={`${titleId}-draws`}>
        <h4 id={`${titleId}-draws`}>{destination.drawsHeading || 'What draws me to this place?'}</h4>
        <p>{destination.whatDrawsMe}</p>
      </section>
      
      <section className="destination-expanded__section" aria-labelledby={`${titleId}-influences`}>
        <h4 id={`${titleId}-influences`}>How it influences my design?</h4>
        <p>{destination.howInfluences}</p>
      </section>
    </div>
  </div>
);

const ExpandedImage: React.FC<{ destination: Destination }> = ({ destination }) => (
  <figure className="destination-expanded__image-wrapper">
    <img 
      src={destination.expandedImage} 
      alt={`${destination.title} in ${destination.city}, ${destination.country}`}
      className={`destination-expanded__image${destination.noImageBorder ? ' destination-expanded__image--no-border' : ''}${destination.imageStrokeTop ? ' destination-expanded__image--stroke-top' : ''}`}
    />
    <figcaption className="destination-expanded__credit">
      <p className="destination-expanded__artist">{destination.artist}</p>
      <p className="destination-expanded__photographer">{destination.photographer}</p>
    </figcaption>
  </figure>
);

const DestinationCard: React.FC<DestinationCardProps> = ({ 
  destination, 
  destinationKey,
  isExpanded, 
  onExpand,
  onClose,
  layoutDirection = 'image-left'
}) => {
  const titleId = useId();
  
  if (isExpanded) {
    return (
      <article 
        className={`destination-expanded destination-expanded--${layoutDirection}`}
        aria-labelledby={titleId}
        aria-expanded="true"
      >
        <button 
          type="button"
          className="destination-expanded__close" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          aria-label={`Close ${destination.city} details`}
        >
          Close <X size={16} weight="regular" className="destination-expanded__close-icon" aria-hidden="true" />
        </button>
        
        {layoutDirection === 'image-left' ? (
          <>
            <ExpandedImage destination={destination} />
            <ExpandedContent destination={destination} titleId={titleId} />
          </>
        ) : (
          <>
            <ExpandedContent destination={destination} titleId={titleId} />
            <ExpandedImage destination={destination} />
          </>
        )}
      </article>
    );
  }

  return (
    <article 
      className={`destination-card destination-card--${destination.size}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onExpand(destinationKey, e.currentTarget as HTMLElement);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const target = e.currentTarget as HTMLElement;
          onExpand(destinationKey, target);
        }
      }}
      aria-label={`${destination.city}, ${destination.country}. Click to expand for more details`}
      aria-expanded="false"
    >
      <div className="destination-card__image-wrapper">
        <img 
          src={destination.image} 
          alt={`Photo of ${destination.city}, ${destination.country}`}
          className="destination-card__image"
        />
      </div>
      <div className="destination-card__info">
        <p className="destination-card__city">{destination.city}</p>
        <p className="destination-card__country">{destination.country}</p>
      </div>
    </article>
  );
};

// Small card component for the grid below expanded card
interface SmallCardProps {
  destination: Destination;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const SmallCard: React.FC<SmallCardProps> = ({ destination, onClick }) => (
  <article 
    className="destination-small" 
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(e);
    }}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick({ currentTarget: e.currentTarget } as React.MouseEvent<HTMLElement>);
      }
    }}
    aria-label={`${destination.city}, ${destination.country}. Click to view details`}
  >
    <div className="destination-small__image-wrapper">
      <img 
        src={destination.gridImage ?? destination.image} 
        alt={`Photo of ${destination.city}, ${destination.country}`}
        className="destination-small__image"
      />
    </div>
    <div className="destination-small__info">
      <p className="destination-small__city">{destination.city}</p>
      <p className="destination-small__country">{destination.country}</p>
    </div>
  </article>
);

const FLIP_DURATION_MS = 720;

export const Destinations: React.FC = () => {
  const [isShareHovered, setIsShareHovered] = useState(false);
  const [expandedCard, setExpandedCard] = useState<DestinationKey | null>(null);
  const expandedCardRef = useRef<HTMLDivElement>(null);
  const expandOriginRef = useRef<DOMRect | null>(null);
  const flipWrapperRef = useRef<HTMLDivElement>(null);

  const handleExpand = (id: DestinationKey, el: HTMLElement) => {
    expandOriginRef.current = el.getBoundingClientRect();
    setExpandedCard(id);
  };

  const handleClose = () => {
    setExpandedCard(null);
    expandOriginRef.current = null;
  };

  // FLIP: grow expanded card from clicked card position
  useEffect(() => {
    if (!expandedCard || !expandOriginRef.current || !flipWrapperRef.current) return;

    const origin = expandOriginRef.current;
    let rafId: number | undefined;

    const run = () => {
      const w = flipWrapperRef.current;
      if (!w) return;

      const end = w.getBoundingClientRect();
      const dx = origin.left - end.left;
      const dy = origin.top - end.top;
      const sx = origin.width / end.width;
      const sy = origin.height / end.height;

      w.style.transformOrigin = '0 0';
      w.style.transition = 'none';
      w.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
      w.style.opacity = '0.7';

      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(() => {
          w.style.transition = `transform ${FLIP_DURATION_MS}ms cubic-bezier(0.32, 0.72, 0, 1), opacity ${FLIP_DURATION_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`;
          w.style.transform = '';
          w.style.opacity = '';

          const onEnd = () => {
            w.removeEventListener('transitionend', onEnd);
            w.style.transformOrigin = '';
            w.style.transition = '';
          };
          w.addEventListener('transitionend', onEnd);
        });
      });
    };

    const t = setTimeout(run, 10);
    return () => {
      clearTimeout(t);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [expandedCard]);

  // Scroll to expanded card only after grow animation, and only if mostly off-screen
  useEffect(() => {
    if (!expandedCard || !expandedCardRef.current) return;

    const timeoutId = setTimeout(() => {
      const el = expandedCardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const headerOffset = 80;
      const padding = 24;
      const inView = rect.top >= headerOffset - padding && rect.bottom <= window.innerHeight + padding;
      if (inView) return;

      const offsetPosition = rect.top + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }, FLIP_DURATION_MS + 80);

    return () => clearTimeout(timeoutId);
  }, [expandedCard]);

  // Define which cards belong to which row
  const row1Cards: DestinationKey[] = ['aarhus', 'calpe', 'giza', 'nevada'];
  const row2Cards: DestinationKey[] = ['dubai', 'marrakech', 'jaipur', 'naoshima'];

  // Check if expanded card is from row 1 or row 2
  const isRow1Card = (key: DestinationKey) => row1Cards.includes(key);
  const isRow2Card = (key: DestinationKey) => row2Cards.includes(key);

  // Get other destinations based on which row the expanded card is in
  const getOtherRow1Cards = () => {
    if (!expandedCard) return [];
    return row1Cards.filter(key => key !== expandedCard);
  };

  const getOtherRow2Cards = () => {
    if (!expandedCard) return [];
    return row2Cards.filter(key => key !== expandedCard);
  };

  // Determine layout direction based on card
  const getLayoutDirection = (key: DestinationKey): 'image-left' | 'image-right' => {
    // Image on right: Nevada, Naoshima, Marrakech, Jaipur. Creek Harbour (Dubai) has image on left.
    if (['nevada', 'naoshima', 'marrakech', 'jaipur'].includes(key)) {
      return 'image-right';
    }
    return 'image-left';
  };

  return (
    <section 
      className="destinations"
      aria-labelledby="destinations-title"
    >
      {/* Header */}
      <header className="destinations__header">
        <h2 id="destinations-title" className="destinations__title">
          Design destinations <span className="destinations__subtitle">Unvisited places inspiring me</span>
        </h2>
      </header>

      {/* Content Area */}
      <div className="destinations__content">
        {expandedCard ? (
          <>
            {/* If Row 1 card is expanded: show expanded card, other Row 1 as small cards, Row 2 intact */}
            {isRow1Card(expandedCard) && (
              <>
                <div ref={expandedCardRef} className="destination-expanded__scroll-anchor">
                  <div ref={flipWrapperRef} className="destination-expanded__flip-wrapper">
                    <DestinationCard 
                      destination={destinations[expandedCard]} 
                      destinationKey={expandedCard}
                      isExpanded={true} 
                      onExpand={handleExpand}
                      onClose={handleClose}
                      layoutDirection={getLayoutDirection(expandedCard)}
                    />
                  </div>
                </div>
                
                {/* Other Row 1 cards as small cards */}
                <div className="destinations__small-grid destinations__small-grid--row1">
                  {getOtherRow1Cards().map(key => (
                    <SmallCard 
                      key={key}
                      destination={destinations[key]}
                      onClick={(e) => handleExpand(key, e.currentTarget)}
                    />
                  ))}
                </div>

                {/* Row 2 stays in original grid */}
                <div className="destinations__grid destinations__grid--compact">
                  <div className="destinations__row">
                    <DestinationCard 
                      destination={destinations.dubai} 
                      destinationKey="dubai"
                      isExpanded={false} 
                      onExpand={handleExpand}
                      onClose={handleClose}
                    />
                    <div className="destinations__column">
                      <DestinationCard 
                        destination={destinations.marrakech} 
                        destinationKey="marrakech"
                        isExpanded={false} 
                        onExpand={handleExpand}
                        onClose={handleClose}
                      />
                      <div className="destinations__row destinations__row--inner">
                        <DestinationCard 
                          destination={destinations.jaipur} 
                          destinationKey="jaipur"
                          isExpanded={false} 
                          onExpand={handleExpand}
                          onClose={handleClose}
                        />
                        <DestinationCard 
                          destination={destinations.naoshima} 
                          destinationKey="naoshima"
                          isExpanded={false} 
                          onExpand={handleExpand}
                          onClose={handleClose}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* If Row 2 card is expanded: show Row 1 grid first, then expanded card, then other Row 2 as small cards */}
            {isRow2Card(expandedCard) && (
              <>
                {/* Row 1 stays in original grid */}
                <div className="destinations__grid destinations__grid--compact">
                  <div className="destinations__row">
                    <div className="destinations__column">
                      <DestinationCard 
                        destination={destinations.aarhus} 
                        destinationKey="aarhus"
                        isExpanded={false} 
                        onExpand={handleExpand}
                        onClose={handleClose}
                      />
                      <div className="destinations__row destinations__row--inner">
                        <DestinationCard 
                          destination={destinations.calpe} 
                          destinationKey="calpe"
                          isExpanded={false} 
                          onExpand={handleExpand}
                          onClose={handleClose}
                        />
                        <DestinationCard 
                          destination={destinations.giza} 
                          destinationKey="giza"
                          isExpanded={false} 
                          onExpand={handleExpand}
                          onClose={handleClose}
                        />
                      </div>
                    </div>
                    <DestinationCard 
                      destination={destinations.nevada} 
                      destinationKey="nevada"
                      isExpanded={false} 
                      onExpand={handleExpand}
                      onClose={handleClose}
                    />
                  </div>
                </div>

                {/* Expanded Row 2 card */}
                <div ref={expandedCardRef} className="destination-expanded__scroll-anchor">
                  <div ref={flipWrapperRef} className="destination-expanded__flip-wrapper">
                    <DestinationCard 
                      destination={destinations[expandedCard]} 
                      destinationKey={expandedCard}
                      isExpanded={true} 
                      onExpand={handleExpand}
                      onClose={handleClose}
                      layoutDirection={getLayoutDirection(expandedCard)}
                    />
                  </div>
                </div>
                
                {/* Other Row 2 cards as small cards */}
                <div className="destinations__small-grid">
                  {getOtherRow2Cards().map(key => (
                    <SmallCard 
                      key={key}
                      destination={destinations[key]}
                      onClick={(e) => handleExpand(key, e.currentTarget)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          /* Default Grid View */
          <div className="destinations__grid">
            {/* Row 1: Aarhus (wide) + Calpe/Giza (stacked) + Nevada (tall) */}
            <div className="destinations__row">
              <div className="destinations__column">
                <DestinationCard 
                  destination={destinations.aarhus} 
                  destinationKey="aarhus"
                  isExpanded={false} 
                  onExpand={handleExpand}
                  onClose={handleClose}
                />
                <div className="destinations__row destinations__row--inner">
                  <DestinationCard 
                    destination={destinations.calpe} 
                    destinationKey="calpe"
                    isExpanded={false} 
                    onExpand={handleExpand}
                    onClose={handleClose}
                  />
                  <DestinationCard 
                    destination={destinations.giza} 
                    destinationKey="giza"
                    isExpanded={false} 
                    onExpand={handleExpand}
                    onClose={handleClose}
                  />
                </div>
              </div>
              <DestinationCard 
                destination={destinations.nevada} 
                destinationKey="nevada"
                isExpanded={false} 
                onExpand={handleExpand}
                onClose={handleClose}
              />
            </div>
            
            {/* Row 2: Dubai (tall) + Marrakech (wide) + Jaipur/Naoshima (stacked) */}
            <div className="destinations__row">
              <DestinationCard 
                destination={destinations.dubai} 
                destinationKey="dubai"
                isExpanded={false} 
                onExpand={handleExpand}
                onClose={handleClose}
              />
              <div className="destinations__column">
                <DestinationCard 
                  destination={destinations.marrakech} 
                  destinationKey="marrakech"
                  isExpanded={false} 
                  onExpand={handleExpand}
                  onClose={handleClose}
                />
                <div className="destinations__row destinations__row--inner">
                  <DestinationCard 
                    destination={destinations.jaipur} 
                    destinationKey="jaipur"
                    isExpanded={false} 
                    onExpand={handleExpand}
                    onClose={handleClose}
                  />
                  <DestinationCard 
                    destination={destinations.naoshima} 
                    destinationKey="naoshima"
                    isExpanded={false} 
                    onExpand={handleExpand}
                    onClose={handleClose}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <footer className="destinations__cta" role="contentinfo">
        <p className="destinations__cta-text">
          Been to any of these places? Spotted great design?
          <br />
          Let me know, I'd love to hear about it
        </p>
        <button 
          type="button"
          className="destinations__share-btn"
          onMouseEnter={() => setIsShareHovered(true)}
          onMouseLeave={() => setIsShareHovered(false)}
          aria-label="Share your design inspiration with me"
        >
          <ArrowSquareOut size={24} weight={isShareHovered ? 'fill' : 'regular'} color={isShareHovered ? '#fbfbfb' : '#7150E5'} className="destinations__share-icon" aria-hidden="true" />
          <span>Share inspiration</span>
        </button>
      </footer>
    </section>
  );
};
