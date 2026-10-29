import React, { useState } from 'react';
import { FirstAid, Heart } from '@phosphor-icons/react';
import type { RasterImageSources } from '../utils/imageFormats';
import { GchSwitchTabs } from './GchSwitchTabs';
import { useSwipeToggle, useTeaserSlide } from './useTeaserSlide';

export type GchBrandId = 'life' | 'unichem';

export type GchBrandPanel = {
  title: string;
  paragraphs: string[];
  image: RasterImageSources;
};

type GchBrandPairProps = {
  id: string;
  sectionRef?: (el: HTMLElement | null) => void;
  eyebrow: string;
  heading: string;
  sharedParagraphs: string[];
  closingParagraphs?: string[];
  life: GchBrandPanel;
  unichem: GchBrandPanel;
  tablistLabel: string;
  mediaOnRight?: boolean;
  className?: string;
};

const TABS: Array<{ id: GchBrandId; label: string; Icon: typeof Heart }> = [
  { id: 'life', label: 'Life Pharmacy', Icon: Heart },
  { id: 'unichem', label: 'Unichem', Icon: FirstAid },
];

export const GchBrandPair: React.FC<GchBrandPairProps> = ({
  id,
  sectionRef,
  eyebrow,
  heading,
  sharedParagraphs,
  closingParagraphs,
  life,
  unichem,
  tablistLabel,
  mediaOnRight = false,
  className,
}) => {
  const [active, setActive] = useState<GchBrandId>('life');
  const panel = active === 'life' ? life : unichem;
  const panelId = `${id}-brand-panel`;
  const { layerARef, layerBRef, slideTo } = useTeaserSlide(life.image.webp);

  const select = (next: GchBrandId) => {
    if (next === active) return;
    setActive(next);
    slideTo(next === 'life' ? life.image.webp : unichem.image.webp);
  };

  const swipe = useSwipeToggle(
    () => select('life'),
    () => select('unichem'),
  );

  return (
    <div
      id={id}
      ref={sectionRef}
      className={['gch-brand-pair', className].filter(Boolean).join(' ')}
    >
      <article
        className={[
          'case-study-detail__split-card',
          'case-study-detail__gch-brand-pair',
          mediaOnRight ? 'case-study-detail__split-card--reverse case-study-detail__gch-brand-pair--reverse' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <figure
          className="media-side gch-brand-pair__media"
          role="tabpanel"
          id={panelId}
          aria-labelledby={`${id}-tab-${active}`}
          {...swipe}
        >
          <div ref={layerARef} className="gch-brand-pair__layer" role="img" aria-label={panel.image.alt} />
          <div ref={layerBRef} className="gch-brand-pair__layer" aria-hidden="true" />
        </figure>
        <div className="text-side case-study-detail__text-stack gch-brand-pair__copy">
          <h3>{eyebrow}</h3>
          <h4 className="case-study-detail__display-subhead">{heading}</h4>
          {sharedParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <h4 key={`${active}-title`}>{panel.title}</h4>
          {panel.paragraphs.map((paragraph) => (
            <p key={`${active}-${paragraph}`}>{paragraph}</p>
          ))}
          {closingParagraphs?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
      <GchSwitchTabs
        tabs={TABS.map(({ id: tabId, label, Icon }) => ({
          id: tabId,
          label,
          icon: (isActive: boolean) => (
            <Icon
              size={24}
              weight={isActive ? 'fill' : 'regular'}
              color="currentColor"
              aria-hidden="true"
            />
          ),
        }))}
        active={active}
        onSelect={select}
        label={tablistLabel}
        idPrefix={id}
        controls={panelId}
      />
    </div>
  );
};
