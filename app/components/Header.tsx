import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import type { Icon } from '@phosphor-icons/react';
import { Palette, User, ChatsCircle, Sun, SunHorizon, CloudFog, MoonStars, CloudMoon, Moon, EnvelopeSimple, Megaphone, Package, BookOpen, Ruler, NotePencil, CaretDown } from '@phosphor-icons/react';
import {
  caseStudyCategories,
  projectHighlightItems,
  type MegaMenuTab,
} from '../data/caseStudiesNav';
import './Header.css';

const CATEGORY_ICONS: Record<string, Icon> = {
  campaigns: Megaphone,
  packaging: Package,
  ui: Ruler,
  ux: NotePencil,
};

type WorkMegaMenuContentProps = {
  tab: MegaMenuTab;
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void;
  linkTabIndex?: number;
};

const WorkMegaMenuContent: React.FC<WorkMegaMenuContentProps> = ({ tab, onNavigate, linkTabIndex }) => {
  if (tab === 'case-studies') {
    return (
      <div className="mega-menu__groups-grid">
        {caseStudyCategories.map((category) => {
          const CategoryIcon = CATEGORY_ICONS[category.id] ?? BookOpen;

          return (
            <section key={category.id} className="mega-menu__group" aria-label={category.title}>
              <div className="mega-menu__group-header">
                <CategoryIcon size={24} weight="regular" className="mega-menu__group-icon" aria-hidden="true" />
                <span className="mega-menu__group-title">{category.title}</span>
              </div>
              <ul className="mega-menu__group-list">
                {category.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.sectionId}
                      className="mega-menu__link"
                      onClick={(e) => onNavigate(e, item.sectionId)}
                      tabIndex={linkTabIndex}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <ul className="mega-menu__links-grid">
      {projectHighlightItems.map((item) => (
        <li key={item.label}>
          <a
            href={item.sectionId}
            className="mega-menu__link"
            onClick={(e) => onNavigate(e, item.sectionId)}
            tabIndex={linkTabIndex}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
};

export const Header: React.FC = () => {
  const headerRef = useRef<HTMLElement | null>(null);
  const megaMenuCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileWorkOpen, setIsMobileWorkOpen] = useState(false);
  const [isMobileThemeOpen, setIsMobileThemeOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [megaMenuTab, setMegaMenuTab] = useState<MegaMenuTab>('case-studies');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('light');
  const [hoveredThemeOption, setHoveredThemeOption] = useState<string | null>(null);
  const [isTabletViewport, setIsTabletViewport] = useState(false);

  const themeIconWeight = (themeId: string) =>
    activeTheme === themeId || hoveredThemeOption === themeId ? 'fill' : 'regular';

  // Expose the fixed header height as a CSS variable so pages can pad correctly.
  /* useLayoutEffect: set before paint so hero padding-top matches real header (avoids clipped headline). */
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const setHeaderHeightVar = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--header-height', `${Math.round(h)}px`);
    };

    setHeaderHeightVar();

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => setHeaderHeightVar()) : null;
    ro?.observe(el);
    window.addEventListener('resize', setHeaderHeightVar);

    return () => {
      window.removeEventListener('resize', setHeaderHeightVar);
      ro?.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tablet detection (768px - 1025px): click-open dropdowns when desktop nav is visible but viewport is tablet.
  // Use 1025px so 1024px is included; 768px is the breakpoint below which desktop nav is hidden.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (max-width: 1025px)');
    const update = () => setIsTabletViewport(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      setIsMobileWorkOpen(false);
      setIsMobileThemeOpen(false);
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
          setIsMobileWorkOpen(false);
          setIsMobileThemeOpen(false);
        }
        setIsMegaMenuOpen(false);
        setIsThemeMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  const clearMegaMenuCloseTimer = useCallback(() => {
    if (megaMenuCloseTimerRef.current) {
      clearTimeout(megaMenuCloseTimerRef.current);
      megaMenuCloseTimerRef.current = null;
    }
  }, []);

  const openMegaMenuHover = useCallback(() => {
    if (isTabletViewport) return;
    clearMegaMenuCloseTimer();
    setIsMegaMenuOpen(true);
  }, [isTabletViewport, clearMegaMenuCloseTimer]);

  const scheduleMegaMenuClose = useCallback(() => {
    if (isTabletViewport) return;
    clearMegaMenuCloseTimer();
    megaMenuCloseTimerRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
      megaMenuCloseTimerRef.current = null;
    }, 200);
  }, [isTabletViewport, clearMegaMenuCloseTimer]);

  useEffect(() => () => clearMegaMenuCloseTimer(), [clearMegaMenuCloseTimer]);

  // Close desktop dropdown menus when clicking outside the header
  useEffect(() => {
    const handleDocumentPointerDown = (e: MouseEvent) => {
      const headerEl = headerRef.current;
      if (!headerEl) return;
      if (!headerEl.contains(e.target as Node)) {
        clearMegaMenuCloseTimer();
        setIsMegaMenuOpen(false);
        setIsThemeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentPointerDown);
    return () => document.removeEventListener('mousedown', handleDocumentPointerDown);
  }, [clearMegaMenuCloseTimer]);

  // Smooth scroll to section — offset matches fixed header height
  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setIsMobileWorkOpen(false);
    setIsMobileThemeOpen(false);
    setIsMegaMenuOpen(false);
    setIsThemeMenuOpen(false);

    const el = document.querySelector(sectionId);
    if (!el) return;

    const headerRaw = getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim();
    const headerH = parseFloat(headerRaw) || 96;
    const offset = headerH + 12;
    const reduce =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);

    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });

    if (window.location.hash !== sectionId) {
      history.pushState(null, '', sectionId);
    }

    window.setTimeout(() => {
      (el as HTMLElement).focus({ preventScroll: true });
    }, reduce ? 0 : 400);
  }, []);

  const toggleMegaMenu = useCallback((e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    clearMegaMenuCloseTimer();
    setIsThemeMenuOpen(false);
    setIsMegaMenuOpen(prev => !prev);
  }, [clearMegaMenuCloseTimer]);

  const toggleThemeMenu = useCallback(() => {
    if (!isTabletViewport) return;
    setIsMegaMenuOpen(false);
    setIsThemeMenuOpen(prev => !prev);
  }, [isTabletViewport]);

  // Handle keyboard navigation in mobile menu
  const handleMobileMenuKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && isMobileMenuOpen) {
      // Trap focus within mobile menu when open
      const menu = e.currentTarget;
      const focusableElements = menu.querySelectorAll<HTMLElement>(
        'a, button:not([disabled])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }, [isMobileMenuOpen]);

  return (
    <header 
      ref={headerRef}
      className={`header ${isScrolled ? 'header--scrolled' : ''}`}
      role="banner"
    >
      {/* Logo */}
      <a 
        href="/" 
        className="header__logo"
        aria-label="Samantha Jane Smith - Home"
      >
        <img 
          src="/about/SJS Illustrator logo.svg" 
          alt="SJS" 
          className="header__logo-short"
        />
        <span className="header__logo-expand">
          <img 
            src="/about/my name brand.svg" 
            alt="Samantha Jane Smith" 
            className="header__logo-full"
          />
        </span>
      </a>
      
      {/* Desktop Navigation */}
      <nav className="header__nav" aria-label="Main navigation">
        <div 
          className="header__nav-item header__nav-item--has-mega"
          onMouseEnter={openMegaMenuHover}
          onMouseLeave={scheduleMegaMenuClose}
        >
          <a
            href="#work"
            className="header__nav-link"
            onClick={toggleMegaMenu}
            aria-expanded={isMegaMenuOpen}
            aria-haspopup="menu"
          >
            <Palette size={24} weight="regular" className="header__nav-icon" aria-hidden="true" />
            <span>Work</span>
          </a>
          
          {/* Work mega menu — Ruul-style panel */}
          <div
            className={`mega-menu ${isMegaMenuOpen ? 'mega-menu--open' : ''}`}
            role="menu"
            aria-label="Work"
            onMouseEnter={openMegaMenuHover}
            onMouseLeave={scheduleMegaMenuClose}
          >
            <div className="mega-menu__panel">
              <div
                className="mega-menu__tabs"
                role="tablist"
                aria-label="Work sections"
              >
                <div className="mega-menu__tabs-track" data-active-tab={megaMenuTab}>
                  <span className="mega-menu__tabs-thumb" aria-hidden="true" />
                  <button
                    type="button"
                    role="tab"
                    id="mega-tab-case-studies"
                    aria-selected={megaMenuTab === 'case-studies'}
                    aria-controls="mega-panel-work"
                    className="mega-menu__tab"
                    onClick={() => setMegaMenuTab('case-studies')}
                  >
                    Case Studies
                  </button>
                  <button
                    type="button"
                    role="tab"
                    id="mega-tab-project-highlights"
                    aria-selected={megaMenuTab === 'project-highlights'}
                    aria-controls="mega-panel-work"
                    className="mega-menu__tab"
                    onClick={() => setMegaMenuTab('project-highlights')}
                  >
                    Project highlights
                  </button>
                </div>
              </div>

              <div
                id="mega-panel-work"
                role="tabpanel"
                aria-labelledby={megaMenuTab === 'case-studies' ? 'mega-tab-case-studies' : 'mega-tab-project-highlights'}
                className="mega-menu__content"
              >
                <WorkMegaMenuContent tab={megaMenuTab} onNavigate={scrollToSection} />
              </div>
            </div>
          </div>
        </div>
        <a 
          href="#about" 
          className="header__nav-link"
          onClick={(e) => scrollToSection(e, '#about')}
        >
          <User size={24} weight="regular" className="header__nav-icon" aria-hidden="true" />
          <span>About</span>
        </a>
        <a 
          href="#testimonials" 
          className="header__nav-link"
          onClick={(e) => scrollToSection(e, '#testimonials')}
        >
          <ChatsCircle size={24} weight="regular" className="header__nav-icon" aria-hidden="true" />
          <span>Testimonials</span>
        </a>
        <div 
          className="header__nav-item header__nav-item--has-mega"
          onMouseEnter={() => {
            if (!isTabletViewport) setIsThemeMenuOpen(true);
          }}
          onMouseLeave={() => {
            if (!isTabletViewport) setIsThemeMenuOpen(false);
          }}
        >
          <button 
            type="button"
            className="header__nav-link header__theme-toggle"
            onClick={isTabletViewport ? toggleThemeMenu : undefined}
            aria-label="Toggle theme"
            aria-expanded={isThemeMenuOpen}
            aria-haspopup="menu"
          >
            <Sun size={24} weight="regular" className="header__nav-icon" aria-hidden="true" />
            <span>Light</span>
          </button>

          {/* Theme Menu */}
          <div className={`theme-menu ${isThemeMenuOpen ? 'theme-menu--open' : ''}`}>
            <div className="theme-menu__container" data-active-theme={activeTheme}>
              {/* Sliding indicator */}
              <div className="theme-menu__slider" />
              <button 
                type="button"
                className={`theme-menu__option ${activeTheme === 'light' ? 'theme-menu__option--active' : ''}`}
                onClick={() => setActiveTheme('light')}
                onMouseEnter={() => setHoveredThemeOption('light')}
                onMouseLeave={() => setHoveredThemeOption(null)}
                onFocus={() => setHoveredThemeOption('light')}
                onBlur={() => setHoveredThemeOption(null)}
              >
                <Sun size={24} weight={themeIconWeight('light')} aria-hidden="true" />
                <span>Light</span>
              </button>
              <button 
                type="button"
                className={`theme-menu__option ${activeTheme === 'dawn' ? 'theme-menu__option--active' : ''}`}
                onClick={() => setActiveTheme('dawn')}
                onMouseEnter={() => setHoveredThemeOption('dawn')}
                onMouseLeave={() => setHoveredThemeOption(null)}
                onFocus={() => setHoveredThemeOption('dawn')}
                onBlur={() => setHoveredThemeOption(null)}
              >
                <SunHorizon size={24} weight={themeIconWeight('dawn')} aria-hidden="true" />
                <span>Dawn</span>
              </button>
              <button 
                type="button"
                className={`theme-menu__option ${activeTheme === 'aurora' ? 'theme-menu__option--active' : ''}`}
                onClick={() => setActiveTheme('aurora')}
                onMouseEnter={() => setHoveredThemeOption('aurora')}
                onMouseLeave={() => setHoveredThemeOption(null)}
                onFocus={() => setHoveredThemeOption('aurora')}
                onBlur={() => setHoveredThemeOption(null)}
              >
                <CloudFog size={24} weight={themeIconWeight('aurora')} aria-hidden="true" />
                <span>Aurora</span>
              </button>
              <button 
                type="button"
                className={`theme-menu__option ${activeTheme === 'nebula' ? 'theme-menu__option--active' : ''}`}
                onClick={() => setActiveTheme('nebula')}
                onMouseEnter={() => setHoveredThemeOption('nebula')}
                onMouseLeave={() => setHoveredThemeOption(null)}
                onFocus={() => setHoveredThemeOption('nebula')}
                onBlur={() => setHoveredThemeOption(null)}
              >
                <CloudMoon size={24} weight={themeIconWeight('nebula')} aria-hidden="true" />
                <span>Nebula</span>
              </button>
              <button 
                type="button"
                className={`theme-menu__option ${activeTheme === 'eclipse' ? 'theme-menu__option--active' : ''}`}
                onClick={() => setActiveTheme('eclipse')}
                onMouseEnter={() => setHoveredThemeOption('eclipse')}
                onMouseLeave={() => setHoveredThemeOption(null)}
                onFocus={() => setHoveredThemeOption('eclipse')}
                onBlur={() => setHoveredThemeOption(null)}
              >
                <MoonStars size={24} weight={themeIconWeight('eclipse')} aria-hidden="true" />
                <span>Eclipse</span>
              </button>
              <button 
                type="button"
                className={`theme-menu__option ${activeTheme === 'dark' ? 'theme-menu__option--active' : ''}`}
                onClick={() => setActiveTheme('dark')}
                onMouseEnter={() => setHoveredThemeOption('dark')}
                onMouseLeave={() => setHoveredThemeOption(null)}
                onFocus={() => setHoveredThemeOption('dark')}
                onBlur={() => setHoveredThemeOption(null)}
              >
                <Moon size={24} weight={themeIconWeight('dark')} aria-hidden="true" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contact Button */}
      <a 
        href="#contact"
        className="btn btn--primary btn--icon-left header__contact-btn"
        onClick={(e) => scrollToSection(e, '#contact')}
      >
        <span className="btn__icon" aria-hidden="true">
          <EnvelopeSimple size={24} weight="regular" color="currentColor" />
        </span>
        <span>Contact</span>
      </a>

      {/* Mobile Menu Button */}
      <button 
        type="button"
        className="header__mobile-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-navigation"
      >
        <span className={`header__hamburger ${isMobileMenuOpen ? 'header__hamburger--open' : ''}`} aria-hidden="true"></span>
      </button>

      {/* Mobile Navigation */}
      <nav 
        id="mobile-navigation"
        className={`header__mobile-nav ${isMobileMenuOpen ? 'header__mobile-nav--open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!isMobileMenuOpen}
        onKeyDown={handleMobileMenuKeyDown}
      >
        <button
          type="button"
          className="header__mobile-link header__mobile-parent"
          onClick={() => setIsMobileWorkOpen(prev => !prev)}
          tabIndex={isMobileMenuOpen ? 0 : -1}
          aria-expanded={isMobileWorkOpen}
          aria-controls="mobile-work-submenu"
        >
          <Palette size={24} weight="regular" className="header__nav-icon" aria-hidden="true" />
          <span>Work</span>
          <CaretDown size={16} weight="bold" className={`header__mobile-caret ${isMobileWorkOpen ? 'header__mobile-caret--open' : ''}`} aria-hidden="true" />
        </button>
        <div
          id="mobile-work-submenu"
          className={`header__mobile-submenu header__mobile-submenu--mega ${isMobileWorkOpen ? 'header__mobile-submenu--open' : ''}`}
          aria-hidden={!isMobileWorkOpen}
        >
          <div className="mega-menu__tabs mega-menu__tabs--mobile" role="tablist" aria-label="Work sections">
            <div className="mega-menu__tabs-track" data-active-tab={megaMenuTab}>
              <span className="mega-menu__tabs-thumb" aria-hidden="true" />
              <button
                type="button"
                role="tab"
                className="mega-menu__tab"
                aria-selected={megaMenuTab === 'case-studies'}
                onClick={() => setMegaMenuTab('case-studies')}
                tabIndex={isMobileMenuOpen && isMobileWorkOpen ? 0 : -1}
              >
                Case Studies
              </button>
              <button
                type="button"
                role="tab"
                className="mega-menu__tab"
                aria-selected={megaMenuTab === 'project-highlights'}
                onClick={() => setMegaMenuTab('project-highlights')}
                tabIndex={isMobileMenuOpen && isMobileWorkOpen ? 0 : -1}
              >
                Project highlights
              </button>
            </div>
          </div>

          <WorkMegaMenuContent
            tab={megaMenuTab}
            onNavigate={scrollToSection}
            linkTabIndex={isMobileMenuOpen && isMobileWorkOpen ? 0 : -1}
          />
        </div>
        <a href="#about" className="header__mobile-link" onClick={(e) => scrollToSection(e, '#about')} tabIndex={isMobileMenuOpen ? 0 : -1}>
          <User size={24} weight="regular" className="header__nav-icon" aria-hidden="true" />
          <span>About</span>
        </a>
        <a href="#testimonials" className="header__mobile-link" onClick={(e) => scrollToSection(e, '#testimonials')} tabIndex={isMobileMenuOpen ? 0 : -1}>
          <ChatsCircle size={24} weight="regular" className="header__nav-icon" aria-hidden="true" />
          <span>Testimonials</span>
        </a>
        <button
          type="button"
          className="header__mobile-link header__mobile-parent"
          aria-label="Toggle light"
          onClick={() => setIsMobileThemeOpen(prev => !prev)}
          tabIndex={isMobileMenuOpen ? 0 : -1}
          aria-expanded={isMobileThemeOpen}
          aria-controls="mobile-theme-submenu"
        >
          <Sun size={24} weight="regular" className="header__nav-icon" aria-hidden="true" />
          <span>Light</span>
          <CaretDown size={16} weight="bold" className={`header__mobile-caret ${isMobileThemeOpen ? 'header__mobile-caret--open' : ''}`} aria-hidden="true" />
        </button>
        <div
          id="mobile-theme-submenu"
          className={`header__mobile-submenu ${isMobileThemeOpen ? 'header__mobile-submenu--open' : ''}`}
          aria-hidden={!isMobileThemeOpen}
        >
          <button type="button" className="header__mobile-subitem" onClick={() => setActiveTheme('light')} tabIndex={isMobileMenuOpen && isMobileThemeOpen ? 0 : -1}><Sun size={18} weight="regular" aria-hidden="true" /> <span>Light</span></button>
          <button type="button" className="header__mobile-subitem" onClick={() => setActiveTheme('dawn')} tabIndex={isMobileMenuOpen && isMobileThemeOpen ? 0 : -1}><SunHorizon size={18} weight="regular" aria-hidden="true" /> <span>Dawn</span></button>
          <button type="button" className="header__mobile-subitem" onClick={() => setActiveTheme('aurora')} tabIndex={isMobileMenuOpen && isMobileThemeOpen ? 0 : -1}><CloudFog size={18} weight="regular" aria-hidden="true" /> <span>Aurora</span></button>
          <button type="button" className="header__mobile-subitem" onClick={() => setActiveTheme('nebula')} tabIndex={isMobileMenuOpen && isMobileThemeOpen ? 0 : -1}><CloudMoon size={18} weight="regular" aria-hidden="true" /> <span>Nebula</span></button>
          <button type="button" className="header__mobile-subitem" onClick={() => setActiveTheme('eclipse')} tabIndex={isMobileMenuOpen && isMobileThemeOpen ? 0 : -1}><MoonStars size={18} weight="regular" aria-hidden="true" /> <span>Eclipse</span></button>
          <button type="button" className="header__mobile-subitem" onClick={() => setActiveTheme('dark')} tabIndex={isMobileMenuOpen && isMobileThemeOpen ? 0 : -1}><Moon size={18} weight="regular" aria-hidden="true" /> <span>Dark</span></button>
        </div>
        <a 
          href="#contact" 
          className="btn btn--primary btn--icon-left header__contact-btn header__contact-btn--mobile" 
          onClick={(e) => scrollToSection(e, '#contact')}
          tabIndex={isMobileMenuOpen ? 0 : -1}
        >
          <span className="btn__icon" aria-hidden="true">
            <EnvelopeSimple size={24} weight="regular" color="currentColor" />
          </span>
          <span>Contact</span>
        </a>
      </nav>
    </header>
  );
};
