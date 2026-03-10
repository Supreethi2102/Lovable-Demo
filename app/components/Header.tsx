import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Palette, User, ChatCircleDots, Sun, SunHorizon, CloudFog, MoonStars, CloudMoon, Moon, Phone, PaintBrush, Megaphone, Package, BookOpen, Ruler, NotePencil, CaretDown } from '@phosphor-icons/react';
import './Header.css';

export const Header: React.FC = () => {
  const headerRef = useRef<HTMLElement | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileWorkOpen, setIsMobileWorkOpen] = useState(false);
  const [isMobileThemeOpen, setIsMobileThemeOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('light');
  const [isTabletViewport, setIsTabletViewport] = useState(false);

  // Expose the fixed header height as a CSS variable so pages can pad correctly.
  useEffect(() => {
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

  // Close desktop dropdown menus when clicking outside the header
  useEffect(() => {
    const handleDocumentPointerDown = (e: MouseEvent) => {
      const headerEl = headerRef.current;
      if (!headerEl) return;
      if (!headerEl.contains(e.target as Node)) {
        setIsMegaMenuOpen(false);
        setIsThemeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentPointerDown);
    return () => document.removeEventListener('mousedown', handleDocumentPointerDown);
  }, []);

  // Smooth scroll to section using native browser behavior with scroll-padding
  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setIsMobileWorkOpen(false);
    setIsMobileThemeOpen(false);
    setIsMegaMenuOpen(false);
    setIsThemeMenuOpen(false);
    
    // Update URL hash - this triggers native smooth scroll with scroll-padding-top
    window.location.hash = sectionId;
    
    // Set focus for screen readers after a brief delay
    setTimeout(() => {
      const element = document.querySelector(sectionId);
      if (element) {
        (element as HTMLElement).focus();
      }
    }, 100);
  }, []);

  const toggleMegaMenu = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Check viewport at click time so tablet behavior works even if state was stale (e.g. after resize)
    const w = typeof window !== 'undefined' ? window.innerWidth : 0;
    const isTablet = w >= 768 && w <= 1025;
    if (!isTablet) {
      scrollToSection(e, '#work');
      return;
    }
    setIsThemeMenuOpen(false);
    setIsMegaMenuOpen(prev => !prev);
  }, [scrollToSection]);

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
          onMouseEnter={() => {
            if (!isTabletViewport) setIsMegaMenuOpen(true);
          }}
          onMouseLeave={() => {
            if (!isTabletViewport) setIsMegaMenuOpen(false);
          }}
        >
          <a 
            href="#work" 
            className="header__nav-link"
            onClick={toggleMegaMenu}
            onMouseEnter={() => setHoveredLink('work')}
            onMouseLeave={() => setHoveredLink(null)}
            aria-expanded={isMegaMenuOpen}
            aria-haspopup="menu"
          >
            <Palette size={24} weight={'regular'} className="header__nav-icon" aria-hidden="true" />
            <span>Work</span>
          </a>
          
          {/* Mega Menu */}
          <div className={`mega-menu ${isMegaMenuOpen ? 'mega-menu--open' : ''}`}>
            <div className="mega-menu__content">
              {/* Branding - hidden for now */}
              <div className="mega-menu__category mega-menu__category--hidden" aria-hidden="true">
                <div className="mega-menu__category-header">
                  <PaintBrush size={24} weight="regular" className="mega-menu__icon" aria-hidden="true" />
                  <span className="mega-menu__category-title">Branding</span>
                </div>
              </div>

              {/* Campaigns */}
              <div className="mega-menu__category">
                <div className="mega-menu__category-header">
                  <Megaphone size={24} weight="regular" className="mega-menu__icon" aria-hidden="true" />
                  <span className="mega-menu__category-title">Campaigns</span>
                </div>
                <ul className="mega-menu__list">
                  <li><a href="#work" onClick={(e) => scrollToSection(e, '#work')}>The Warehouse<br />Mega Toy Month</a></li>
                  <li><a href="#work" onClick={(e) => scrollToSection(e, '#work')}>The Warehouse<br />Summer Campaign</a></li>
                </ul>
              </div>

              {/* Packaging */}
              <div className="mega-menu__category">
                <div className="mega-menu__category-header">
                  <Package size={24} weight="regular" className="mega-menu__icon" aria-hidden="true" />
                  <span className="mega-menu__category-title">Packaging</span>
                </div>
                <ul className="mega-menu__list">
                  <li><a href="#work" onClick={(e) => scrollToSection(e, '#work')}>Green Cross bags</a></li>
                </ul>
              </div>

              {/* Publications */}
              <div className="mega-menu__category mega-menu__category--publications">
                <div className="mega-menu__category-header">
                  <BookOpen size={24} weight="regular" className="mega-menu__icon" aria-hidden="true" />
                  <span className="mega-menu__category-title">Publications</span>
                </div>
                <ul className="mega-menu__list">
                  <li><a href="#publications" onClick={(e) => scrollToSection(e, '#publications')}>Architecture New Zealand Magazine</a></li>
                  <li><a href="#publications" onClick={(e) => scrollToSection(e, '#publications')}>Houses Magazine</a></li>
                  <li><a href="#publications" onClick={(e) => scrollToSection(e, '#publications')}>Life Pharmacy Mailer</a></li>
                  <li><a href="#publications" onClick={(e) => scrollToSection(e, '#publications')}>NZW Grooms Guide Booklet</a></li>
                  <li><a href="#publications" onClick={(e) => scrollToSection(e, '#publications')}>New Zealand Weddings Planner</a></li>
                  <li><a href="#publications" onClick={(e) => scrollToSection(e, '#publications')}>Pumpkin Patch Catalogue</a></li>
                  <li><a href="#publications" onClick={(e) => scrollToSection(e, '#publications')}>Superlife Booklet</a></li>
                  <li><a href="#publications" onClick={(e) => scrollToSection(e, '#publications')}>Little Treasures Magazine</a></li>
                  <li><a href="#publications" onClick={(e) => scrollToSection(e, '#publications')}>The Warehouse - Big Toy Month Mailer</a></li>
                </ul>
              </div>

              {/* UI */}
              <div className="mega-menu__category">
                <div className="mega-menu__category-header">
                  <Ruler size={24} weight="regular" className="mega-menu__icon" aria-hidden="true" />
                  <span className="mega-menu__category-title">UI</span>
                </div>
                <ul className="mega-menu__list">
                  <li><a href="#work" onClick={(e) => scrollToSection(e, '#work')}>Palmy Bank</a></li>
                </ul>
              </div>

              {/* UX - pen and notepad */}
              <div className="mega-menu__category">
                <div className="mega-menu__category-header">
                  <NotePencil size={24} weight="regular" className="mega-menu__icon" aria-hidden="true" />
                  <span className="mega-menu__category-title">UX</span>
                </div>
                <ul className="mega-menu__list">
                  <li><a href="#work" onClick={(e) => scrollToSection(e, '#work')}>Āmio Airways</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <a 
          href="#about" 
          className="header__nav-link"
          onClick={(e) => scrollToSection(e, '#about')}
          onMouseEnter={() => setHoveredLink('about')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          <User size={24} weight={'regular'} className="header__nav-icon" aria-hidden="true" />
          <span>About</span>
        </a>
        <a 
          href="#testimonials" 
          className="header__nav-link"
          onClick={(e) => scrollToSection(e, '#testimonials')}
          onMouseEnter={() => setHoveredLink('testimonials')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          <ChatCircleDots size={24} weight={'regular'} className="header__nav-icon" aria-hidden="true" />
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
            onMouseEnter={() => setHoveredLink('theme')}
            onMouseLeave={() => setHoveredLink(null)}
            aria-label="Toggle theme"
            aria-expanded={isThemeMenuOpen}
            aria-haspopup="menu"
          >
            <Sun size={24} weight={'regular'} className="header__nav-icon" aria-hidden="true" />
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
              >
                <Sun size={24} weight="regular" aria-hidden="true" />
                <span>Light</span>
              </button>
              <button 
                type="button"
                className={`theme-menu__option ${activeTheme === 'dawn' ? 'theme-menu__option--active' : ''}`}
                onClick={() => setActiveTheme('dawn')}
              >
                <SunHorizon size={24} weight="regular" aria-hidden="true" />
                <span>Dawn</span>
              </button>
              <button 
                type="button"
                className={`theme-menu__option ${activeTheme === 'aurora' ? 'theme-menu__option--active' : ''}`}
                onClick={() => setActiveTheme('aurora')}
              >
                <CloudFog size={24} weight="regular" aria-hidden="true" />
                <span>Aurora</span>
              </button>
              <button 
                type="button"
                className={`theme-menu__option ${activeTheme === 'nebula' ? 'theme-menu__option--active' : ''}`}
                onClick={() => setActiveTheme('nebula')}
              >
                <CloudMoon size={24} weight="regular" aria-hidden="true" />
                <span>Nebula</span>
              </button>
              <button 
                type="button"
                className={`theme-menu__option ${activeTheme === 'eclipse' ? 'theme-menu__option--active' : ''}`}
                onClick={() => setActiveTheme('eclipse')}
              >
                <MoonStars size={24} weight="regular" aria-hidden="true" />
                <span>Eclipse</span>
              </button>
              <button 
                type="button"
                className={`theme-menu__option ${activeTheme === 'dark' ? 'theme-menu__option--active' : ''}`}
                onClick={() => setActiveTheme('dark')}
              >
                <Moon size={24} weight="regular" aria-hidden="true" />
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
        onMouseEnter={() => setHoveredLink('contact')}
        onMouseLeave={() => setHoveredLink(null)}
      >
        <span className="btn__icon" aria-hidden="true">
          <Phone size={24} weight={hoveredLink === 'contact' ? 'fill' : 'regular'} color="currentColor" />
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
          className={`header__mobile-submenu ${isMobileWorkOpen ? 'header__mobile-submenu--open' : ''}`}
          aria-hidden={!isMobileWorkOpen}
        >
          <div className="header__mobile-subsection">
            <p className="header__mobile-subtitle"><Megaphone size={18} weight="regular" aria-hidden="true" /> <span>Campaigns</span></p>
            <a href="#work" className="header__mobile-subitem" onClick={(e) => scrollToSection(e, '#work')} tabIndex={isMobileMenuOpen && isMobileWorkOpen ? 0 : -1}>The Warehouse Mega Toy Month</a>
            <a href="#work" className="header__mobile-subitem" onClick={(e) => scrollToSection(e, '#work')} tabIndex={isMobileMenuOpen && isMobileWorkOpen ? 0 : -1}>The Warehouse Summer Campaign</a>
          </div>
          <div className="header__mobile-subsection">
            <p className="header__mobile-subtitle"><Package size={18} weight="regular" aria-hidden="true" /> <span>Packaging</span></p>
            <a href="#work" className="header__mobile-subitem" onClick={(e) => scrollToSection(e, '#work')} tabIndex={isMobileMenuOpen && isMobileWorkOpen ? 0 : -1}>Green Cross bags</a>
          </div>
          <div className="header__mobile-subsection">
            <p className="header__mobile-subtitle"><BookOpen size={18} weight="regular" aria-hidden="true" /> <span>Publications</span></p>
            <a href="#publications" className="header__mobile-subitem" onClick={(e) => scrollToSection(e, '#publications')} tabIndex={isMobileMenuOpen && isMobileWorkOpen ? 0 : -1}>Architecture New Zealand Magazine</a>
            <a href="#publications" className="header__mobile-subitem" onClick={(e) => scrollToSection(e, '#publications')} tabIndex={isMobileMenuOpen && isMobileWorkOpen ? 0 : -1}>Houses Magazine</a>
            <a href="#publications" className="header__mobile-subitem" onClick={(e) => scrollToSection(e, '#publications')} tabIndex={isMobileMenuOpen && isMobileWorkOpen ? 0 : -1}>Life Pharmacy Mailer</a>
            <a href="#publications" className="header__mobile-subitem" onClick={(e) => scrollToSection(e, '#publications')} tabIndex={isMobileMenuOpen && isMobileWorkOpen ? 0 : -1}>NZW Grooms Guide Booklet</a>
            <a href="#publications" className="header__mobile-subitem" onClick={(e) => scrollToSection(e, '#publications')} tabIndex={isMobileMenuOpen && isMobileWorkOpen ? 0 : -1}>New Zealand Weddings Planner</a>
            <a href="#publications" className="header__mobile-subitem" onClick={(e) => scrollToSection(e, '#publications')} tabIndex={isMobileMenuOpen && isMobileWorkOpen ? 0 : -1}>Pumpkin Patch Catalogue</a>
            <a href="#publications" className="header__mobile-subitem" onClick={(e) => scrollToSection(e, '#publications')} tabIndex={isMobileMenuOpen && isMobileWorkOpen ? 0 : -1}>Superlife Booklet</a>
            <a href="#publications" className="header__mobile-subitem" onClick={(e) => scrollToSection(e, '#publications')} tabIndex={isMobileMenuOpen && isMobileWorkOpen ? 0 : -1}>Little Treasures Magazine</a>
            <a href="#publications" className="header__mobile-subitem" onClick={(e) => scrollToSection(e, '#publications')} tabIndex={isMobileMenuOpen && isMobileWorkOpen ? 0 : -1}>The Warehouse - Big Toy Month Mailer</a>
          </div>
          <div className="header__mobile-subsection">
            <p className="header__mobile-subtitle"><Ruler size={18} weight="regular" aria-hidden="true" /> <span>UI</span></p>
            <a href="#work" className="header__mobile-subitem" onClick={(e) => scrollToSection(e, '#work')} tabIndex={isMobileMenuOpen && isMobileWorkOpen ? 0 : -1}>Palmy Bank</a>
          </div>
          <div className="header__mobile-subsection">
            <p className="header__mobile-subtitle"><NotePencil size={18} weight="regular" aria-hidden="true" /> <span>UX</span></p>
            <a href="#work" className="header__mobile-subitem" onClick={(e) => scrollToSection(e, '#work')} tabIndex={isMobileMenuOpen && isMobileWorkOpen ? 0 : -1}>Āmio Airways</a>
          </div>
        </div>
        <a href="#about" className="header__mobile-link" onClick={(e) => scrollToSection(e, '#about')} tabIndex={isMobileMenuOpen ? 0 : -1}>
          <User size={24} weight="regular" className="header__nav-icon" aria-hidden="true" />
          <span>About</span>
        </a>
        <a href="#testimonials" className="header__mobile-link" onClick={(e) => scrollToSection(e, '#testimonials')} tabIndex={isMobileMenuOpen ? 0 : -1}>
          <ChatCircleDots size={24} weight="regular" className="header__nav-icon" aria-hidden="true" />
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
            <Phone size={24} weight="regular" color="currentColor" />
          </span>
          <span>Contact</span>
        </a>
      </nav>
    </header>
  );
};
