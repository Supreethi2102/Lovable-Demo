import React, { useState, useEffect } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    quote: `I had the privilege of working with Sam in varying degrees and across many projects in our time together at The Warehouse Group. What always stood out about Sam was her infectious enthusiasm and dedication to every project she was involved in - resulting in many successful campaigns over the years. Sam is curious, empathetic, extremely hard working and strives for excellence in everything she does.`,
    author: 'Catherine Balle',
    role: 'International Event Retail at National Football League',
    company: 'NFL',
  },
  {
    id: 2,
    quote: `Samantha possesses excellent communication skills, and she is a pleasure to work with.
She has a natural ability to collaborate with colleagues and clients, and she always seeks to understand the needs and perspectives of others. Her innovative and creative thinking has allowed her to develop unique and effective solutions that have benefited our projects\u00A0immensely.`,
    author: 'Chiquita Taala',
    role: 'Trade Planning Manager - Home & Leisure',
    company: 'The Warehouse Group',
  },
  {
    id: 3,
    quote: `I had the privilege of working with Sam for nearly four years at TWG. Throughout this period, she orchestrated the design and art direction of numerous campaigns spanning print, TV, online, and in-store initiatives. Sam earned tremendous respect among production designers, thanks to her bubbly personality, unwavering guidance, composed demeanour, and meticulous attention to detail, making her the ideal art director. Her generosity in sharing knowledge and readiness to address inquiries further underscored her commitment. I wholeheartedly endorse Sam for any role that requires someone who can lead a team in an exciting campaign.`,
    author: 'Deidre Kennedy',
    role: 'Planning & Scheduling, Process Improvement',
    company: 'New Zealand Defence Force',
  },
  {
    id: 4,
    quote: `My experience working with Samantha was both synergetic and greatly enjoyable. As a graphic designer, Samantha has a wealth of knowledge and years of experience to draw upon, as well as a seemingly endless source of creativity. She can take a thread of an idea and turn it into a work of art, taking care to maintain aesthetic appeal, in-house style and a good reader/audience experience. Her attention to detail is impeccable – she takes great pride in the technical finesse of each file she works on, both from a visual consistency and digital asset management perspective.`,
    author: 'Rachel Ramsay',
    role: 'Social Media Manager',
    company: 'Envato',
  },
  {
    id: 5,
    quote: `I had the pleasure of collaborating with Sam on several occasions during our user experience studies at the UX Design Institute. We worked closely on UX research for our diploma project, as well as on brand identity and visual direction for a client's small business. What I genuinely admire about Sam is the depth and thoughtfulness she brings to every project. She approaches design with maturity and intention, combining strong analytical thinking with refined graphic design expertise. Sam has a rare ability to translate abstract ideas into clear, compelling digital solutions, from editorial and campaign design through to website and mobile experiences.`,
    author: 'Luba Hickey',
    role: 'CX & Digital Content Specialist transitioning into UX Design',
    company: 'Freelance',
  },
];

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredNav, setHoveredNav] = useState<'prev' | 'next' | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance testimonials
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 8000); // 8 seconds per testimonial
    
    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section 
      className="testimonials" 
      id="testimonials"
      aria-labelledby="testimonials-title"
      tabIndex={-1}
    >
      <div 
        className="testimonials__card"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Testimonials carousel"
      >
        <span className="testimonials__label">Testimonials</span>

        <div className="testimonials__content">
          {/* Mobile only: chevrons centered above the heading */}
          <div className="testimonials__nav-row-mobile" role="group" aria-label="Testimonial navigation">
            <button
              type="button"
              className="testimonials__nav testimonials__nav--mobile"
              onClick={handlePrev}
              onMouseEnter={() => setHoveredNav('prev')}
              onMouseLeave={() => setHoveredNav(null)}
              aria-label="Previous testimonial"
            >
              <CaretLeft size={24} weight={hoveredNav === 'prev' ? 'bold' : 'regular'} color={hoveredNav === 'prev' ? '#ffffff' : '#7150E5'} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="testimonials__nav testimonials__nav--mobile"
              onClick={handleNext}
              onMouseEnter={() => setHoveredNav('next')}
              onMouseLeave={() => setHoveredNav(null)}
              aria-label="Next testimonial"
            >
              <CaretRight size={24} weight={hoveredNav === 'next' ? 'bold' : 'regular'} color={hoveredNav === 'next' ? '#ffffff' : '#7150E5'} aria-hidden="true" />
            </button>
          </div>
          {/* Header */}
          <header className="testimonials__header">
            <h2 id="testimonials-title" className="testimonials__title">Global shoutout</h2>
            <p className="testimonials__subtitle">
              Here's what collaborators and colleagues say, near and far
            </p>
          </header>

          {/* Carousel - buttons aligned with quote */}
          <div 
            className="testimonials__carousel"
            role="group"
            aria-roledescription="slide"
            aria-label={`Testimonial ${currentIndex + 1} of ${testimonials.length}`}
          >
            {/* Left Arrow */}
            <button 
              type="button"
              className="testimonials__nav" 
              onClick={handlePrev}
              onMouseEnter={() => setHoveredNav('prev')}
              onMouseLeave={() => setHoveredNav(null)}
              aria-label="Previous testimonial"
            >
              <CaretLeft size={24} weight={hoveredNav === 'prev' ? 'bold' : 'regular'} color={hoveredNav === 'prev' ? '#ffffff' : '#7150E5'} aria-hidden="true" />
            </button>

            {/* Testimonial Quote */}
            <blockquote 
              className="testimonials__quote-wrapper"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="testimonials__quote">
                {currentTestimonial.quote}
              </p>
            </blockquote>

            {/* Right Arrow */}
            <button 
              type="button"
              className="testimonials__nav" 
              onClick={handleNext}
              onMouseEnter={() => setHoveredNav('next')}
              onMouseLeave={() => setHoveredNav(null)}
              aria-label="Next testimonial"
            >
              <CaretRight size={24} weight={hoveredNav === 'next' ? 'bold' : 'regular'} color={hoveredNav === 'next' ? '#ffffff' : '#7150E5'} aria-hidden="true" />
            </button>
          </div>

          {/* Author - below carousel */}
          <footer className="testimonials__author-block">
            <cite className="testimonials__author">
              <strong className="testimonials__author-name">{currentTestimonial.author}</strong>
              <span className="testimonials__author-role">{currentTestimonial.role}</span>
              {currentTestimonial.company && (
                <span className="testimonials__author-company">{currentTestimonial.company}</span>
              )}
            </cite>
          </footer>
        </div>
        
        {/* Pagination Dots - Fixed position */}
        <nav 
          className="testimonials__dots"
          role="tablist"
          aria-label="Testimonial navigation"
        >
          {testimonials.map((testimonial, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              className={`testimonials__dot ${index === currentIndex ? 'testimonials__dot--active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to testimonial from ${testimonial.author}`}
              aria-selected={index === currentIndex}
            />
          ))}
        </nav>
      </div>
    </section>
  );
};
