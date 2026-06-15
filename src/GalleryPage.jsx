// GalleryPage.jsx — Factory & Products Image Gallery
import React, { useState, useEffect } from 'react';


// ── Factory images (dynamic import from /src/assets/factory/) ──────────────
const factoryModules = import.meta.glob('./assets/factory/*.{jpg,jpeg,png,webp}', { eager: true });
const factoryImages = Object.entries(factoryModules).map(([path, mod]) => ({
  src: mod.default,
  name: path.split('/').pop().replace(/\.[^/.]+$/, ''),
}));

// ── Product images (dynamic import from /src/assets/products/) ─────────────
const productModules = import.meta.glob('./assets/products/*.{jpg,jpeg,png,webp}', { eager: true });
const productImages = Object.entries(productModules).map(([path, mod]) => ({
  src: mod.default,
  name: path.split('/').pop().replace(/\.[^/.]+$/, ''),
}));

export default function GalleryPage() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [activeTab, setActiveTab] = useState('factory'); // 'factory' | 'products'
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFab, setShowFab] = useState(false);
  const [loaded, setLoaded] = useState({}); // track which images have loaded

  const currentImages = activeTab === 'factory' ? factoryImages : productImages;

  // ── Theme ──────────────────────────────────────────────────────────────────
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ── Scroll & nav effects ───────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(height > 0 ? (scrollTop / height) * 100 : 0);
      setShowFab(scrollTop > 300);
      const nav = document.getElementById('nav');
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Mobile nav ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const btn = document.getElementById('mobileBtn');
    const navEl = document.getElementById('mobileNav');
    const toggle = () => {
      if (!navEl) return;
      const open = navEl.classList.toggle('open');
      document.body.classList.toggle('mobile-open', open);
      if (btn) btn.setAttribute('aria-expanded', String(open));
    };
    btn && btn.addEventListener('click', toggle);
    navEl && navEl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navEl.classList.remove('open');
      document.body.classList.remove('mobile-open');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }));
    return () => btn && btn.removeEventListener('click', toggle);
  }, []);

  // ── Keyboard: close lightbox on Escape, arrow keys to navigate ────────────
  useEffect(() => {
    const onKey = (e) => {
      if (!lightboxSrc) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxSrc, lightboxIdx, activeTab]);

  // ── Scroll lock when lightbox open ────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = lightboxSrc ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxSrc]);

  // ── Lightbox helpers ───────────────────────────────────────────────────────
  const openLightbox = (src, idx) => { setLightboxSrc(src); setLightboxIdx(idx); };
  const closeLightbox = () => { setLightboxSrc(null); setLightboxIdx(null); };
  const goNext = () => {
    const next = (lightboxIdx + 1) % currentImages.length;
    setLightboxIdx(next);
    setLightboxSrc(currentImages[next].src);
  };
  const goPrev = () => {
    const prev = (lightboxIdx - 1 + currentImages.length) % currentImages.length;
    setLightboxIdx(prev);
    setLightboxSrc(currentImages[prev].src);
  };

  const markLoaded = (idx) => setLoaded(prev => ({ ...prev, [activeTab + idx]: true }));

  return (
    <>
      {/* ── Scroll progress bar ── */}
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress / 100})` }} />

      {/* ── Cursor (hidden on gallery – too many images) ── */}
      <div id="cursor" style={{ display: 'none' }} />
      <div id="cursor-ring" style={{ display: 'none' }} />

      {/* ── Back to top FAB ── */}
      <button
        className={`fab${showFab ? ' visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >↑</button>

      {/* ── Navigation ── */}
      <nav id="nav" className="scrolled">
        <a href="#" className="nav-logo" onClick={e => { e.preventDefault(); window.location.hash = '#home'; }}>
          <div className="nav-logo-mark">R</div>
          <div className="nav-brand">Royal Paper<span>&amp; Plastic Products</span></div>
        </a>

        <ul className="nav-links" id="mobileNav">
          <li><a href="#home" onClick={e => { e.preventDefault(); window.location.hash = '#home'; }}>Home</a></li>
          <li><a href="#products" onClick={e => { e.preventDefault(); window.location.hash = '#products'; }}>Products</a></li>
          <li><a href="#capabilities" onClick={e => { e.preventDefault(); window.location.hash = '#capabilities'; }}>Capabilities</a></li>
          <li><a href="#sustainability" onClick={e => { e.preventDefault(); window.location.hash = '#sustainability'; }}>Sustainability</a></li>
          <li><a href="#clients" onClick={e => { e.preventDefault(); window.location.hash = '#clients'; }}>Clients</a></li>
          <li><a href="#stats" onClick={e => { e.preventDefault(); window.location.hash = '#stats'; }}>Snapshot</a></li>
          <li><a href="#gallery" className="gallery-nav-active">Gallery</a></li>
          <li><a href="#contact" onClick={e => { e.preventDefault(); window.location.hash = '#contact'; }}>Contact</a></li>
        </ul>

        <div className="nav-actions">
          <button onClick={toggleTheme} className="theme-toggle-single" aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="nav-cta" onClick={() => { window.location.hash = '#contact'; }}>
            Get a Quote
          </button>
          <button className="nav-mobile-btn" id="mobileBtn" aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── Page hero ── */}
      <section className="gallery-hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-grain" />
        <div className="gallery-hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span>Royal Paper &amp; Plastic Products · Karachi, Pakistan</span>
          </div>
          <h1 className="gallery-hero-title">
            Our <em>Gallery</em>
          </h1>
          <p className="gallery-hero-sub">
            A visual tour of our state-of-the-art manufacturing facility and the
            premium packaging products we engineer every day.
          </p>

          {/* ── Toggle switch ── */}
          <div className="gallery-toggle-row">
            <button
              id="gallery-tab-factory"
              className={`gallery-tab-btn${activeTab === 'factory' ? ' active' : ''}`}
              onClick={() => setActiveTab('factory')}
            >
              🏭 Factory Images
            </button>
            <button
              id="gallery-tab-products"
              className={`gallery-tab-btn${activeTab === 'products' ? ' active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              📦 Product Images
            </button>
          </div>
        </div>
      </section>

      {/* ── Gallery grid ── */}
      <section className="gallery-grid-section">
        <div className="gallery-grid-inner">
          <div className="gallery-count-row">
            <span className="gallery-count-label">
              {currentImages.length} {activeTab === 'factory' ? 'Factory' : 'Product'} Photos
            </span>
            <span className="gallery-count-hint">Click any image to view full size</span>
          </div>

          <div className="gallery-masonry">
            {currentImages.map((img, idx) => (
              <div
                key={activeTab + idx}
                className={`gallery-item${loaded[activeTab + idx] ? ' loaded' : ''}`}
                onClick={() => openLightbox(img.src, idx)}
                role="button"
                tabIndex={0}
                aria-label={`View ${img.name}`}
                onKeyDown={e => e.key === 'Enter' && openLightbox(img.src, idx)}
              >
                <div className="gallery-item-overlay">
                  <span className="gallery-item-zoom">⤢</span>
                </div>
                <img
                  src={img.src}
                  alt={img.name}
                  loading="lazy"
                  onLoad={() => markLoaded(idx)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxSrc && (
        <div className="gallery-lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">✕</button>

          <button
            className="lightbox-arrow lightbox-arrow-prev"
            onClick={e => { e.stopPropagation(); goPrev(); }}
            aria-label="Previous"
          >‹</button>

          <div className="lightbox-img-wrap" onClick={e => e.stopPropagation()}>
            <img src={lightboxSrc} alt="Gallery" className="lightbox-img" />
            <div className="lightbox-counter">
              {lightboxIdx + 1} / {currentImages.length}
            </div>
          </div>

          <button
            className="lightbox-arrow lightbox-arrow-next"
            onClick={e => { e.stopPropagation(); goNext(); }}
            aria-label="Next"
          >›</button>
        </div>
      )}

      {/* ── Footer ── */}
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="nav-logo-mark">R</div>
                <div className="nav-brand">Royal Paper<span>&amp; Plastic Products</span></div>
              </div>
              <p className="footer-tagline">
                Pakistan's most trusted corrugated packaging manufacturer.
                Engineering excellence since 1990, from Karachi to the world.
              </p>
              <div className="footer-certbadge">🌲 FSC® CERTIFIED COMPANY</div>
            </div>
            <div>
              <div className="footer-col-title">Quick Links</div>
              <ul className="footer-links">
                <li><a href="#home" onClick={e => { e.preventDefault(); window.location.hash = '#home'; }}>Home</a></li>
                <li><a href="#products" onClick={e => { e.preventDefault(); window.location.hash = '#products'; }}>Products</a></li>
                <li><a href="#capabilities" onClick={e => { e.preventDefault(); window.location.hash = '#capabilities'; }}>Capabilities</a></li>
                <li><a href="#gallery">Gallery</a></li>
                <li><a href="#contact" onClick={e => { e.preventDefault(); window.location.hash = '#contact'; }}>Contact</a></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Registration</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: '2' }}>
                NTN: 7245050<br />
                Reg: 32-77-8763-245-39<br />
                Est. 1990 · Karachi, PK
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">
              © 2025 <strong>Royal Paper &amp; Plastic Products (Pvt) Ltd.</strong> All rights reserved.
            </div>
            <div className="footer-meta">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="http://www.royalppackages.com" target="_blank" rel="noopener noreferrer">royalppackages.com</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
