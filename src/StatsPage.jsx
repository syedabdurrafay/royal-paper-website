import React, { useEffect, useState } from 'react';

export default function StatsPage() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(scrolled);
      
      const nav = document.getElementById('nav');
      if(nav) nav.classList.toggle('scrolled', window.scrollY > 30);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const mobileBtn = document.getElementById('mobileBtn');
    const mobileNav = document.getElementById('mobileNav');
    
    const toggleMobile = () => {
      if (!mobileNav) return;
      const isOpen = mobileNav.classList.toggle('open');
      document.body.classList.toggle('mobile-open', isOpen);
      if (mobileBtn) mobileBtn.setAttribute('aria-expanded', String(isOpen));
    };

    mobileBtn && mobileBtn.addEventListener('click', toggleMobile);
    
    mobileNav && mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.classList.remove('mobile-open');
      if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
    }));

    return () => {
      mobileBtn && mobileBtn.removeEventListener('click', toggleMobile);
    };
  }, []);

  const handleQuoteClick = (e) => {
    e.preventDefault();
    window.location.hash = '#contact';
  };

  return (
    <>
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress / 100})` }}></div>
      
      <div id="cursor" style={{ display: "none" }}></div>
      <div id="cursor-ring" style={{ display: "none" }}></div>

      <nav id="nav" className="scrolled">
        <a href="#" className="nav-logo">
          <div className="nav-logo-mark">R</div>
          <div className="nav-brand">
            Royal Paper<span>& Plastic Products</span>
          </div>
        </a>
        
        <ul className="nav-links" id="mobileNav">
          <li><a href="#home">Home</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#capabilities">Capabilities</a></li>
          <li><a href="#sustainability">Sustainability</a></li>
          <li><a href="#clients">Clients</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        
        <div className="nav-actions">
          <button onClick={toggleTheme} className="theme-toggle-single" aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          <button className="nav-cta" onClick={handleQuoteClick}>
            Get a Quote
          </button>
          <button className="nav-mobile-btn" id="mobileBtn" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      <section className="stats-dashboard-hero">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="hero-grain"></div>

        <div className="stats-dashboard-container">
          <div className="stats-dashboard-header reveal in">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              <span>Production Metrics & Performance</span>
            </div>
            <h1 className="stats-dashboard-title">
              Monthly Production<br /><em>Snapshot</em>
            </h1>
            <p className="stats-dashboard-sub">
              Live operational metrics and utilization breakdown of our Karachi manufacturing plants. 
              Delivering high-volume packaging solutions with maximum precision and sustainability.
            </p>
          </div>

          <div className="stats-dashboard-grid">
            {/* Main numbers column */}
            <div className="stats-main-card-wrapper reveal in">
              <div className="stats-main-card">
                <div className="stats-card-label">Overall Performance</div>
                <div className="stats-grid-inner">
                  <div className="stats-item">
                    <div className="stats-item-num">500K+</div>
                    <div className="stats-item-label">Units / Month</div>
                    <p className="stats-item-desc">High-speed corrugation capacity across our 3-ply, 5-ply, and 7-ply lines.</p>
                  </div>
                  <div className="stats-item">
                    <div className="stats-item-num">36+</div>
                    <div className="stats-item-label">Years Experience</div>
                    <p className="stats-item-desc">Over three decades of industry experience and continuous quality innovation.</p>
                  </div>
                  <div className="stats-item">
                    <div className="stats-item-num">350+</div>
                    <div className="stats-item-label">Team Members</div>
                    <p className="stats-item-desc">Dedicated engineering, production control, and account management staff.</p>
                  </div>
                  <div className="stats-item">
                    <div className="stats-item-num">75%</div>
                    <div className="stats-item-label">Recycled Sourcing</div>
                    <p className="stats-item-desc">Raw materials obtained from sustainable and FSC® certified paper suppliers.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Utilization & Capacity column */}
            <div className="stats-charts-card-wrapper reveal in">
              <div className="stats-charts-card">
                <div className="stats-card-label">Production Line Utilization</div>
                
                <div className="stats-chart-group">
                  <div className="bar-group">
                    <div className="bar-label-row">
                      <span className="bar-label">Corrugation Lines</span>
                      <span className="bar-pct">92%</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                  <p className="bar-subdesc">Three high-speed lines running at peak efficiency to serve local and export demands.</p>
                </div>

                <div className="stats-chart-group">
                  <div className="bar-group">
                    <div className="bar-label-row">
                      <span className="bar-label">Print & Finishing</span>
                      <span className="bar-pct">88%</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: "88%" }}></div>
                    </div>
                  </div>
                  <p className="bar-subdesc">4-unit flexo printers and precision rotary die-cut systems operating round-the-clock.</p>
                </div>

                <div className="stats-chart-group">
                  <div className="bar-group">
                    <div className="bar-label-row">
                      <span className="bar-label">Eco-First Water Reuse</span>
                      <span className="bar-pct">100%</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                  <p className="bar-subdesc">Enforced zero liquid discharge policy. Process water is treated and completely recycled in-house.</p>
                </div>

                <div className="stats-chart-group" style={{ marginBottom: 0 }}>
                  <div className="bar-group">
                    <div className="bar-label-row">
                      <span className="bar-label">Generator Backup Capacity</span>
                      <span className="bar-pct">500 KW</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                  <p className="bar-subdesc">Heavy-duty power plant configuration ensures absolute zero-downtime manufacturing.</p>
                </div>

              </div>
            </div>
          </div>

          <div className="stats-cta-section reveal in">
            <h2>Ready to start your packaging project?</h2>
            <p>Get immediate technical specifications and volume-based pricing from our Karachi sales office.</p>
            <button className="btn-primary" onClick={handleQuoteClick}>
              Inquire Now <span>→</span>
            </button>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="nav-logo-mark">R</div>
                <div className="nav-brand">Royal Paper<span>& Plastic Products</span></div>
              </div>
              <p className="footer-tagline">Pakistan's most trusted corrugated packaging manufacturer. Engineering excellence since 1990, from Karachi to the world.</p>
              <div className="footer-certbadge">🌲 FSC® CERTIFIED COMPANY</div>
            </div>
            <div>
              <div className="footer-col-title">Products</div>
              <ul className="footer-links">
                <li><a href="#products">Single Wall Boxes</a></li>
                <li><a href="#products">Double Wall Boxes</a></li>
                <li><a href="#products">Triple Wall Boxes</a></li>
                <li><a href="#products">Die-Cut Boxes</a></li>
                <li><a href="#products">Printed Boxes</a></li>
                <li><a href="#products">Honeycomb Boards</a></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Company</div>
              <ul className="footer-links">
                <li><a href="#home">About Us</a></li>
                <li><a href="#capabilities">Capabilities</a></li>
                <li><a href="#sustainability">Sustainability</a></li>
                <li><a href="#clients">Our Clients</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Newsletter</div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "16px", lineHeight: "1.6" }}>
                Get updates on new capabilities and industry insights.
              </p>
              <div className="footer-newsletter">
                <input type="email" placeholder="your@email.com" />
                <button>Subscribe →</button>
              </div>
              <div style={{ marginTop: "20px" }}>
                <div className="footer-col-title" style={{ marginBottom: "12px" }}>Registration</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", lineHeight: "2" }}>
                  NTN: 7245050<br />
                  Reg: 32-77-8763-245-39<br />
                  Est. 1990 · Karachi, PK
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2025 <strong>Royal Paper & Plastic Products (Pvt) Ltd.</strong> All rights reserved. Packaging the Future – One Box at a Time.</div>
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
