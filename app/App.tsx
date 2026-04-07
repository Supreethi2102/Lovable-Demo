import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header, Hero, Footer, CaseStudies, Publications, PublicationDetail, CaseStudyDetail, About, Testimonials, Contact, Destinations, ColorSwatches } from './components';
import './App.css';
import './ButtonStyles.css';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const globe = document.getElementById('globe');
    if (globe) {
      globe.style.display = isHome ? '' : 'none';
    }
  }, [isHome]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/publications/:id" element={<PublicationDetailPage />} />
      <Route path="/case-studies/:id" element={<CaseStudyDetailPage />} />
    </Routes>
  );
};

const HomePage: React.FC = () => {
  const globeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const globeElement = document.getElementById('globe');
    if (globeElement && globeContainerRef.current) {
      globeContainerRef.current.appendChild(globeElement);
    }
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
              ref={globeContainerRef}
              role="img"
              aria-label="Interactive 3D globe showing design inspiration locations around the world"
            >
              {/* Globe will be moved here */}
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
