import React from 'react';

export type GchSwitchTab<T extends string> = {
  id: T;
  label: string;
  icon: React.ReactNode | ((isActive: boolean) => React.ReactNode);
};

type GchSwitchTabsProps<T extends string> = {
  tabs: Array<GchSwitchTab<T>>;
  active: T;
  onSelect: (id: T) => void;
  label: string;
  idPrefix: string;
  controls: string;
};

export function GchSwitchTabs<T extends string>({
  tabs,
  active,
  onSelect,
  label,
  idPrefix,
  controls,
}: GchSwitchTabsProps<T>) {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === active),
  );

  return (
    <div className="gch-switch-tabs" role="tablist" aria-label={label}>
      <div className="gch-switch-tabs__track" data-active-index={activeIndex}>
        <span className="gch-switch-tabs__thumb" aria-hidden="true" />
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${idPrefix}-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={controls}
              className={`gch-switch-tabs__tab${isActive ? ' gch-switch-tabs__tab--active' : ''}`}
              onClick={() => onSelect(tab.id)}
            >
              {typeof tab.icon === 'function' ? tab.icon(isActive) : tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
