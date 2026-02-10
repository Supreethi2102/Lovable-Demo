import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from '@phosphor-icons/react';
import { publications } from '../../data/publications';
import type { PublicationDetail } from '../../data/publications';
import './Publications.css';

interface PublicationCardProps {
  publication: PublicationDetail;
}

const PublicationCard: React.FC<PublicationCardProps> = ({ publication }) => {
  const navigate = useNavigate();

  return (
    <div
      className="publication-card"
      onClick={() => navigate(`/publications/${publication.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/publications/${publication.id}`);
        }
      }}
      aria-label={`${publication.title} - ${publication.subtitle}`}
    >
      <figure className="publication-card__image-container">
        <img 
          src={publication.image} 
          alt={`${publication.title} cover`}
          className="publication-card__image"
        />
      </figure>
      <div className="publication-card__info">
        <h3 className="publication-card__title">{publication.title}</h3>
        <p className="publication-card__subtitle">{publication.subtitle}</p>
      </div>
    </div>
  );
};

export const Publications: React.FC = () => {
  const [isViewHovered, setIsViewHovered] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const INITIAL_VISIBLE_COUNT = 6;
  const visiblePublications = showAll ? publications : publications.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = publications.length > INITIAL_VISIBLE_COUNT;

  return (
    <section 
      id="publications"
      className="publications"
      aria-labelledby="publications-title"
    >
      <h2 id="publications-title" className="publications__title">
        Publications <span className="publications__subtitle">Print and digital work</span>
      </h2>
      
      <div 
        className="publications__grid"
        role="list"
        aria-label="Publication portfolio"
      >
        {visiblePublications.map((pub) => (
          <PublicationCard key={pub.id} publication={pub} />
        ))}
      </div>

      {hasMore && (
        <footer className="publications__footer">
          <button 
            type="button"
            className="view-publications-btn"
            onMouseEnter={() => setIsViewHovered(true)}
            onMouseLeave={() => setIsViewHovered(false)}
            onClick={() => setShowAll(!showAll)}
            aria-label={showAll ? 'Show fewer publications' : 'View all publications'}
          >
            <BookOpen size={24} weight={isViewHovered ? 'fill' : 'regular'} color="#7150E5" className="view-publications-btn__icon" aria-hidden="true" />
            <span>{showAll ? 'View fewer publications' : 'View all publications'}</span>
          </button>
        </footer>
      )}
    </section>
  );
};

