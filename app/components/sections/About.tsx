import React, { useState, useEffect, useRef } from 'react';
import { SwatchCard, type SwatchCardMood } from './SwatchCard';
import './About.css';

/* =========================================
   BLOCK 1: Top Section - A World of Ideas
   ========================================= */
interface AboutBlock1Props {
  onMoreClick: () => void;
  isExpanded: boolean;
}

const AboutBlock1: React.FC<AboutBlock1Props> = ({ onMoreClick, isExpanded }) => {
  return (
    <article className="about-block1" aria-labelledby="about-title-1">
      <div className="about-block1__illustration">
        <img src="/about/Illustration-Sam.png" alt="Illustrated portrait of Samantha holding design tools" />
      </div>

      <div className="about-block1__content">
        <h2 id="about-title-1" className="about-block1__title">A world of ideas</h2>
        
        <div className="about-block1__text">
          <p>I'm a UX, UI, and graphic designer based in Aotearoa New Zealand. My background spans campaign concepts, art-directed photoshoots, print mailers, editorial layouts, and digital experiences. That mix taught me to design with clarity, emotion, and storytelling across any medium.</p>
          <p className="about-block1__spacer" aria-hidden="true">&nbsp;</p>
          <p>I'm drawn to work that:</p>
          <ul className="about-block1__list">
            <li>makes complex things feel simple</li>
            <li>blends function with beauty</li>
            <li>designs with culture, emotion, and context in mind</li>
          </ul>
          <p>I'm steadily building my accessibility practice. I care about designing for everyone and know there's always more to learn. I want to approach accessibility with intention, not box-ticking.</p>
          <p className="about-block1__spacer" aria-hidden="true">&nbsp;</p>
          <p>Most of my time is spent in Figma and InDesign, sketching flows, building design systems, refining typographic hierarchy, or nudging layouts until everything clicks. Whether solo or collaborating with developers, marketers, or writers, I bring curiosity, empathy, and a careful eye for the details that matter.</p>
          
          {!isExpanded && (
            <button 
              type="button"
              className="about-block1__more-link"
              onClick={onMoreClick}
              aria-expanded={isExpanded}
            >
              More about me
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

/* =========================================
   BLOCK 2: Quote Section (Romie font, NOT bold)
   ========================================= */
const AboutBlock2: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const quoteRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!quoteRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Stop observing after animation triggers
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(quoteRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <aside 
      className={`about-block2 ${isVisible ? 'about-block2--visible' : ''}`} 
      aria-label="Featured quote"
      ref={quoteRef}
    >
      <blockquote className="about-block2__quote">
        <p>Travel fuels my creativity. It's where I notice the small details, the moods, and the human moments that spark how I design.</p>
      </blockquote>
    </aside>
  );
};

/* =========================================
   BLOCK 3: Color Cards + Design in Practice
   ========================================= */

const colorCards: Array<{
  id: string;
  name: string;
  hex: string;
  color: string;
  mood: SwatchCardMood;
  rotation: number;
  zIndex: number;
  position: { top: number; left: number };
}> = [
  { 
    id: 'nympheas', 
    name: 'Nymphéas Blue', 
    hex: '#B3CDE2', 
    color: '#B3CDE2', 
    mood: {
      description: "Monet's Water Lilies at the Musée de l'Orangerie revealed a blue that shifts with light, space, and calm reflection.",
      contrastColor: '#4F5421',
      idealMatchHex: '#4F5421',
      idealMatchName: 'Island Grove Green',
      contrastRatio: '4.86:1',
      contrastRating: 'AA',
    },
    rotation: -2.122,
    zIndex: 3,
    position: { top: 0, left: 230 }
  },
  { 
    id: 'flamingo', 
    name: 'Sunlit Flamingo Pink', 
    hex: '#FC95B1', 
    color: '#FC95B1', 
    mood: {
      description: "At the San Diego Zoo, sunlight and flamingo feathers created a vivid pink that brings joy and bold energy.",
      contrastColor: '#060591',
      idealMatchHex: '#060591',
      idealMatchName: 'Gaudí Cathedral Blue',
      contrastRatio: '7:1',
      contrastRating: 'AAA',
    },
    rotation: -21.906,
    zIndex: 2,
    position: { top: 213, left: 0 }
  },
  { 
    id: 'gaudi', 
    name: 'Gaudí Cathedral Blue', 
    hex: '#060591', 
    color: '#060591', 
    mood: {
      description: "At the Sagrada Família, stained-glass light washed the stone in deep blue, balancing awe, structure, and imagination.",
      contrastColor: '#FC95B1',
      idealMatchHex: '#FC95B1',
      idealMatchName: 'Sunlit Flamingo Pink',
      contrastRatio: '7:1',
      contrastRating: 'AAA',
    },
    rotation: 15.525,
    zIndex: 1,
    position: { top: 356, left: 288 }
  },
];

interface ColorCardProps {
  card: typeof colorCards[0];
  isVisible: boolean;
  isExiting: boolean;
  animationDelay: number;
  exitDelay: number;
  isFlipped: boolean;
  onToggle: () => void;
  interactive?: boolean;
}

/** Single layer above the idle stack (z-index 1–3). Equal values use DOM order; Gaudí is last and paints on top. */
const FLIPPED_CARD_Z_INDEX = 40;

const ColorCard: React.FC<ColorCardProps> = ({
  card,
  isVisible,
  isExiting,
  animationDelay,
  exitDelay,
  isFlipped,
  onToggle,
  interactive = true,
}) => {
  const cardClasses = [
    'about-color-card',
    isVisible ? 'about-color-card--animate' : '',
    isExiting ? 'about-color-card--exit' : '',
    isFlipped ? 'about-color-card--flipped' : '',
  ].filter(Boolean).join(' ');

  return (
    <article 
      className={cardClasses}
      style={{ 
        '--card-rotation': `${card.rotation}deg`,
        '--card-top': `${card.position.top}px`,
        '--card-left': `${card.position.left}px`,
        '--animation-delay': `${animationDelay}ms`,
        '--exit-delay': `${exitDelay}ms`,
        zIndex: isFlipped ? FLIPPED_CARD_Z_INDEX : card.zIndex,
      } as React.CSSProperties}
      aria-label={`Color swatch: ${card.name}`}
      role="listitem"
    >
      <SwatchCard
        id={card.id}
        color={card.color}
        hex={card.hex}
        name={card.name}
        mood={card.mood}
        isFlipped={isFlipped}
        onToggle={onToggle}
        interactive={interactive}
      />
    </article>
  );
};

interface AboutBlock3Props {
  onCollapseClick: () => void;
}

const AboutBlock3: React.FC<AboutBlock3Props> = ({ onCollapseClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [flippedCardIds, setFlippedCardIds] = useState<Set<string>>(new Set());
  const block3Ref = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const toggleCard = (cardId: string) => {
    setFlippedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  };

  // Entry animation observer
  useEffect(() => {
    if (!block3Ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(block3Ref.current);
    return () => observer.disconnect();
  }, []);

  // Exit animation - triggers when About section ends
  useEffect(() => {
    if (!block3Ref.current || !isVisible || isExiting) return;

    const handleScroll = () => {
      if (!block3Ref.current) return;
      
      const rect = block3Ref.current.getBoundingClientRect();
      // Trigger when bottom of About block3 goes above viewport
      if (rect.bottom < 0) {
        setIsExiting(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible, isExiting]);

  return (
    <article className="about-block3" ref={block3Ref} aria-labelledby="about-title-3">
      {/* Original cards - always visible */}
      <div 
        className="about-block3__cards"
        role="list"
        aria-label="Travel-inspired color swatches"
        ref={cardsRef}
      >
          {colorCards.map((card, index) => (
            <ColorCard 
              key={card.id} 
              card={card} 
              isVisible={isVisible}
              isExiting={false}
              animationDelay={index * 400}
              exitDelay={0}
              isFlipped={flippedCardIds.has(card.id)}
              onToggle={() => toggleCard(card.id)}
            />
          ))}
        </div>
      
      {/* Falling ghost cards - only appear during exit animation */}
      {isExiting && (
        <div 
          className="about-block3__cards about-block3__cards--ghost"
          aria-hidden="true"
        >
          {colorCards.map((card, index) => (
            <ColorCard 
              key={`ghost-${card.id}`} 
              card={card} 
              isVisible={true}
              isExiting={true}
              animationDelay={0}
              exitDelay={index * 50}
              isFlipped={false}
              onToggle={() => {}}
              interactive={false}
            />
          ))}
        </div>
      )}
        
      <div className="about-block3__content">
        <div className="about-block3__text-block">
          <h3 id="about-title-3" className="about-block3__title">Creative influences</h3>
          <p>I find ideas in the places I wander. Like standing on Monet's bridge in Giverny, feeling I'd stepped into a painting, or lying on the Guggenheim floor, watching James Turrell's light installation shift across the spiral.</p>
          <p className="about-block3__spacer" aria-hidden="true">&nbsp;</p>
          <p>Other favourites:</p>
          <ul className="about-block3__list" aria-label="Creative influences">
            <li>Dior exhibition in Paris, pure craftsmanship and fabric magic</li>
            <li>Barcelona's Sagrada Familia, structure and imagination in harmony</li>
            <li>Yayoi Kusama's polka dot world in Wellington, joyful, surreal, human</li>
          </ul>
          <p>These experiences remind me why I design. To move people, even just a little.</p>
          <p className="about-block3__spacer" aria-hidden="true">&nbsp;</p>
          <h3 className="about-block3__title">Small Joys</h3>
          <p>Moodboards are where ideas start to form, and I probably have too much fun naming colour palettes. One recent favourite is Nymphéas Blue, inspired by sitting in front of Monet's Water Lilies at the Musée de l'Orangerie. Watching how the blue shifted with light and space reminded me how colour, mood, and context interact, lessons I carry into my work.</p>
          <p className="about-block3__spacer" aria-hidden="true">&nbsp;</p>
          <p>This site stays mostly black and white so the work takes centre stage. The accent purple adds a little personality, and you can switch modes if you want a touch more colour. If I'm deep in Figma, there's probably a stash of Natural Confectionery Co lollies nearby. Fruity chews are my unofficial reward system, one lolly at a time.</p>
          
          <button 
            type="button"
            className="about-block3__collapse-link"
            onClick={onCollapseClick}
          >
            Show less
          </button>
        </div>
        <img src="/about/Samantha signature 3.png" alt="Samantha's signature" className="about-block3__signature" />
      </div>
    </article>
  );
};

/* =========================================
   MAIN ABOUT SECTION
   ========================================= */
export const About: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandedRef = useRef<HTMLDivElement>(null);

  const handleMoreClick = () => {
    setIsExpanded(true);
    // Scroll to expanded content after a brief delay
    setTimeout(() => {
      expandedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleLessClick = () => {
    setIsExpanded(false);
    // Scroll back to the About section
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      setTimeout(() => {
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <section 
      className="about" 
      id="about"
      aria-labelledby="about-section-label"
      tabIndex={-1}
    >
      <div className="about__card">
        <h2 id="about-section-label" className="about__label">About</h2>
        <AboutBlock1 onMoreClick={handleMoreClick} isExpanded={isExpanded} />
        
        {/* Expandable content - blocks 2 and 3 */}
        <div 
          ref={expandedRef}
          className={`about__expandable ${isExpanded ? 'about__expandable--visible' : ''}`}
          aria-hidden={!isExpanded}
        >
          <AboutBlock2 />
          <AboutBlock3 onCollapseClick={handleLessClick} />
        </div>
      </div>
    </section>
  );
};

