import React, { useLayoutEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import {
  Header,
  Hero,
  Footer,
  CaseStudies,
  Publications,
  PublicationDetail,
  CaseStudyDetail,
  About,
  Testimonials,
  Contact,
  Destinations,
  ColorSwatches,
} from './components';
import './App.css';
import './ButtonStyles.css';
import './tablet-700-1024.css';
import './small-laptop-1100.css';

function scheduleGlobeLayoutResize() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.__portfolioGlobeResize?.();
    });
  });
}

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  useLayoutEffect(() => {
    const globe = document.getElementById('globe');
    if (globe) {
      globe.style.display = isHome ? '' : 'none';
    }
    if (isHome) {
      scheduleGlobeLayoutResize();
    }
  }, [isHome]);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/publications/:id" element={<PublicationDetailPage />} />
      <Route path="/case-studies/:id" element={<CaseStudyDetailPage />} />
      <Route path="/case-study/:id" element={<CaseStudyDetailPage />} />
    </Routes>
  );
};

const HomePage: React.FC = () => {
  const globeContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const globeElement = document.getElementById('globe');
    if (globeElement && globeContainerRef.current) {
      globeContainerRef.current.appendChild(globeElement);
    }
    scheduleGlobeLayoutResize();
    return () => {
      const globe = document.getElementById('globe');
      if (globe && document.body) {
        document.body.appendChild(globe);
      }
    };
  }, []);

  return (
    <div className="app">
      <Header />
      
      {/* Hero Section with Globe */}
      <section className="hero-section" aria-label="Introduction">
        <main id="main-content" className="main" role="main">
          {/* Left Side - Hero */}
          <div className="main__left">
            <Hero />
          </div>
          
          {/* Right Side - Globe + Footer */}
          <div className="main__right">
            <div
              className="main__globe"
              role="img"
              aria-label="Interactive rotating globe highlighting places that inspire design and UX work around the world"
            >
              <div className="main__globe-inner" ref={globeContainerRef}>
                <img
                  className="main__globe-ring"
                  src={encodeURI('/Images/Illustrations 2/illustration-global-outline-circle.svg')}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                />
                {/* #globe is moved here from index.html */}
              </div>
            </div>
            <Footer />
          </div>
        </main>
      </section>

      {/* Case Studies Section */}
      <CaseStudies />

      {/* Publications Section */}
      <Publications />

      {/* About Section */}
      <About />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Contact Section */}
      <Contact />

      {/* Destinations Section */}
      <Destinations />

      {/* Color Swatches Footer */}
      <ColorSwatches />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

const PublicationDetailPage: React.FC = () => {
  return (
    <div className="app app--detail">
      <Header />
      <PublicationDetail />
    </div>
  );
};

const CaseStudyDetailPage: React.FC = () => {
  return (
    <div className="app app--detail">
      <Header />
      <CaseStudyDetail />
    </div>
  );
};
