import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Palette, User, ChatCircleDots, Sun, SunHorizon, MoonStars, CloudMoon, Moon, Phone, PaintBrush, Megaphone, Package, BookOpen, Ruler, PencilSimple } from '@phosphor-icons/react';
import './Header.css';

export const Header: React.FC = () => {
  const headerRef = useRef<HTMLElement | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('light');

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

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Smooth scroll to section using native browser behavior with scroll-padding
  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
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
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          onMouseLeave={() => setIsMegaMenuOpen(false)}
        >
          <a 
            href="#work" 
            className="header__nav-link"
            onClick={(e) => scrollToSection(e, '#work')}
            onMouseEnter={() => setHoveredLink('work')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <Palette size={24} weight={hoveredLink === 'work' || isMegaMenuOpen ? 'fill' : 'regular'} className="header__nav-icon" aria-hidden="true" />
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

              {/* UX - Phosphor pencil + ruler */}
              <div className="mega-menu__category">
                <div className="mega-menu__category-header">
                  <span className="mega-menu__icon mega-menu__icon-ux" aria-hidden="true">
                    <PencilSimple size={24} weight="regular" color="#3c3f43" />
                    <Ruler size={24} weight="regular" color="#3c3f43" />
                  </span>
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
          <User size={24} weight={hoveredLink === 'about' ? 'fill' : 'regular'} className="header__nav-icon" aria-hidden="true" />
          <span>About</span>
        </a>
        <a 
          href="#testimonials" 
          className="header__nav-link"
          onClick={(e) => scrollToSection(e, '#testimonials')}
          onMouseEnter={() => setHoveredLink('testimonials')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          <ChatCircleDots size={24} weight={hoveredLink === 'testimonials' ? 'fill' : 'regular'} className="header__nav-icon" aria-hidden="true" />
          <span>Testimonials</span>
        </a>
        <div 
          className="header__nav-item header__nav-item--has-mega"
          onMouseEnter={() => setIsThemeMenuOpen(true)}
          onMouseLeave={() => setIsThemeMenuOpen(false)}
        >
          <button 
            type="button"
            className="header__nav-link header__theme-toggle"
            onMouseEnter={() => setHoveredLink('theme')}
            onMouseLeave={() => setHoveredLink(null)}
            aria-label="Toggle theme"
          >
            <Sun size={24} weight={hoveredLink === 'theme' || isThemeMenuOpen ? 'fill' : 'regular'} className="header__nav-icon" aria-hidden="true" />
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
                <MoonStars size={24} weight="regular" aria-hidden="true" />
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
        className="header__contact-btn"
        onClick={(e) => scrollToSection(e, '#contact')}
        onMouseEnter={() => setHoveredLink('contact')}
        onMouseLeave={() => setHoveredLink(null)}
      >
        <Phone size={24} weight={hoveredLink === 'contact' ? 'fill' : 'regular'} className="header__contact-icon" aria-hidden="true" />
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
        <a href="#work" className="header__mobile-link" onClick={(e) => scrollToSection(e, '#work')} tabIndex={isMobileMenuOpen ? 0 : -1}>
          <Palette size={24} weight="regular" className="header__nav-icon" aria-hidden="true" />
          <span>Work</span>
        </a>
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
          className="header__mobile-link"
          aria-label="Toggle light mode"
          tabIndex={isMobileMenuOpen ? 0 : -1}
        >
          <Sun size={24} weight="regular" className="header__nav-icon" aria-hidden="true" />
          <span>Light Mode</span>
        </button>
        <a 
          href="#contact" 
          className="header__contact-btn header__contact-btn--mobile" 
          onClick={(e) => scrollToSection(e, '#contact')}
          tabIndex={isMobileMenuOpen ? 0 : -1}
        >
          <Phone size={24} weight="regular" className="header__contact-icon" aria-hidden="true" />
          <span>Contact</span>
        </a>
      </nav>
    </header>
  );
};
