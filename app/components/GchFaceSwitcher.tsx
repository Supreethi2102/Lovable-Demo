import React, { useState } from 'react';
import { GchBagBackIcon, GchBagFrontIcon } from './GchBagIcons';
import { GchSwitchTabs } from './GchSwitchTabs';
import { useSwipeToggle, useTeaserSlide } from './useTeaserSlide';

type FaceId = 'front' | 'back';

type FacePanel = {
  image: string;
  alt: string;
};

type GchFaceSwitcherProps = {
  front: FacePanel;
  back: FacePanel;
  captionTitle: string;
  caption: string;
};

const TABS: Array<{ id: FaceId; label: string; icon: (isActive: boolean) => React.ReactNode }> = [
  { id: 'front', label: 'Front', icon: (isActive) => <GchBagFrontIcon filled={isActive} /> },
  { id: 'back', label: 'Back', icon: (isActive) => <GchBagBackIcon filled={isActive} /> },
];

export const GchFaceSwitcher: React.FC<GchFaceSwitcherProps> = ({
  front,
  back,
  captionTitle,
  caption,
}) => {
  const [active, setActive] = useState<FaceId>('front');
  const panel = active === 'front' ? front : back;
  const { layerARef, layerBRef, slideTo } = useTeaserSlide(front.image);

  const select = (next: FaceId) => {
    if (next === active) return;
    setActive(next);
    slideTo(next === 'front' ? front.image : back.image);
  };

  const swipe = useSwipeToggle(
    () => select('front'),
    () => select('back'),
  );

  return (
    <div className="gch-face-switcher">
      <article className="case-study-detail__gch-captioned">
        <div
          className="gch-face-switcher__stage case-study-detail__panel case-study-detail__panel--gch-image case-study-detail__panel--gch-image-595"
          role="tabpanel"
          id="gch-face-panel"
          aria-labelledby={`gch-face-tab-${active}`}
          {...swipe}
        >
          <img className="gch-face-switcher__sizer" src={panel.image} alt="" aria-hidden="true" />
          <div
            ref={layerARef}
            className="gch-face-switcher__layer"
            role="img"
            aria-label={panel.alt}
          />
          <div ref={layerBRef} className="gch-face-switcher__layer" aria-hidden="true" />
        </div>
        <div className="case-study-detail__gch-caption">
          <p className="case-study-detail__gch-caption-title">{captionTitle}</p>
          <p>{caption}</p>
        </div>
      </article>
      <GchSwitchTabs
        tabs={TABS}
        active={active}
        onSelect={select}
        label="Bag face"
        idPrefix="gch-face"
        controls="gch-face-panel"
      />
    </div>
  );
};
