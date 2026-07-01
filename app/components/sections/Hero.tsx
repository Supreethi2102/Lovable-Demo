import React from 'react';
import './Hero.css';

export const Hero: React.FC = () => {
  return (
    // w-full: ensures the article fills its flex parent on all screen sizes
    // overflow-x-hidden: prevents any child element from causing horizontal scroll on mobile
    <article className="hero w-full" aria-label="Introduction">
      {/* min-w-0: prevents the flex child from overflowing its container on small screens */}
      <div className="hero__content">
        {/* Plain h1 (no text-wrap: balance + no sr-only/aria-hidden) so every line, including the first, paints reliably on mobile */}
        <h1 className="hero__title" id="hero-heading">
          I&rsquo;m Samantha.
          <br />
          Inspired by the world.
          <br />
          Driven by insight.
          <br />
          From places to pixels.
        </h1>
        
        <p className="hero__description">
          I craft and art direct thoughtful experiences across graphic design, UI, and UX, blending strategy, storytelling, and people-first thinking.
        </p>
      </div>
    </article>
  );
};

