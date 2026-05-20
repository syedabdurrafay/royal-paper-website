import React, { useEffect, useState, useRef } from 'react';

export default function Main() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const [showFab, setShowFab] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
      setShowFab(winScroll > 300);
      
      const nav = document.getElementById('nav');
      if(nav) nav.classList.toggle('scrolled', window.scrollY > 30);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    
    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if(cursor) cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    let animationFrameId;
    const animateRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if(ring) ring.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
      animationFrameId = requestAnimationFrame(animateRing);
    };
    animateRing();

    const interactiveElements = document.querySelectorAll('a, button, .product-card, .why-feature, .faq-q, .trusted-card, .testi-card, .sustain-card, .process-step, .cap-row, .contact-item, .nav-links a, .nav-cta');
    const addHover = () => document.body.classList.add('cursor-hover');
    const removeHover = () => document.body.classList.remove('cursor-hover');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    const heroBg = document.querySelector('.hero-bg');
    const handleParallax = () => {
      if(heroBg) {
        const scrolled = window.scrollY;
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleParallax);

    const spotlightCards = document.querySelectorAll('.spotlight-card');
    spotlightCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
      });
    });

    // ============================================================
    // ENHANCED 3D INTERACTIVE CUBE SYSTEM - Optimized for 3 cubes
    // ============================================================
    const mainCube = document.getElementById('rotatingCube');
    let rotationAngleMain = 0;
    
    const handleMouseMove3D = (e) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
      
      // Interactive rotation for main cube
      if (mainCube) {
        const cubeRotY = mouseX * 40;
        const cubeRotX = mouseY * -30;
        mainCube.style.transform = `rotateX(${cubeRotX}deg) rotateY(${cubeRotY}deg) rotateZ(${mouseX * 8}deg)`;
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove3D);

    // Auto-rotation for all cubes (continuous smooth rotation)
    const autoRotateCubes = () => {
      rotationAngleMain += 0.8;
      
      const secondaryCube = document.querySelector('.secondary-cube');
      const tertiaryCube = document.querySelector('.tertiary-cube');
      
      if (secondaryCube) {
        secondaryCube.style.transform = `rotateX(${rotationAngleMain * 0.6}deg) rotateY(${rotationAngleMain}deg) rotateZ(${rotationAngleMain * 0.4}deg)`;
      }
      
      if (tertiaryCube) {
        tertiaryCube.style.transform = `rotateX(${rotationAngleMain * 0.8}deg) rotateY(${rotationAngleMain * 1.2}deg) rotateZ(${rotationAngleMain * 0.5}deg)`;
      }
      
      animationFrameId = requestAnimationFrame(autoRotateCubes);
    };
    
    autoRotateCubes();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleParallax);
      document.removeEventListener('mousemove', handleMouseMove3D);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', addHover);
        el.removeEventListener('mouseleave', removeHover);
      });
    };
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

  const toggleFaq = (e) => {
    const item = e.currentTarget.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  };

  const submitForm = () => {
    const toast = document.getElementById('toast');
    if(toast) {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress / 100})` }}></div>
      
      <div id="cursor"></div>
      <div id="cursor-ring"></div>
      
      <div className="toast" id="toast">
        <div className="toast-icon">✓</div>
        <div>
          <div className="toast-title">Inquiry Sent Successfully!</div>
          <div className="toast-sub">Our team will respond within 24 hours</div>
        </div>
      </div>
      
      <button className={`fab ${showFab ? 'visible' : ''}`} onClick={scrollToTop} aria-label="Back to top">
        ↑
      </button>

      <nav id="nav">
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
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme" />
          <button className="nav-cta" onClick={() => document.getElementById('contact').scrollIntoView({behavior:'smooth'})}>
            Get a Quote
          </button>
          <button className="nav-mobile-btn" id="mobileBtn" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="hero-grain"></div>
        
        {/* PREMIUM 3D CUBES - Clean, Minimal, Professional (3 cubes with modern icons) */}
        
        {/* Main Cube - Large Primary Cube with Package Icon */}
        <div className="hero-3d-cube main-cube" id="rotatingCube">
          <div className="hero-3d-cube-face">
            <span className="cube-icon">◆</span>
          </div>
          <div className="hero-3d-cube-face">
            <span className="cube-icon">⬢</span>
          </div>
          <div className="hero-3d-cube-face">
            <span className="cube-icon">◇</span>
          </div>
          <div className="hero-3d-cube-face">
            <span className="cube-icon">⬡</span>
          </div>
          <div className="hero-3d-cube-face">
            <span className="cube-icon">●</span>
          </div>
          <div className="hero-3d-cube-face">
            <span className="cube-icon">■</span>
          </div>
        </div>
        
        {/* Secondary Cube - Right Side - Minimalist Design */}
        <div className="hero-3d-cube secondary-cube">
          <div className="hero-3d-cube-face">
            <span className="cube-icon">▲</span>
          </div>
          <div className="hero-3d-cube-face">
            <span className="cube-icon">◈</span>
          </div>
          <div className="hero-3d-cube-face">
            <span className="cube-icon">▼</span>
          </div>
          <div className="hero-3d-cube-face">
            <span className="cube-icon">◉</span>
          </div>
          <div className="hero-3d-cube-face">
            <span className="cube-icon">☐</span>
          </div>
          <div className="hero-3d-cube-face">
            <span className="cube-icon">✦</span>
          </div>
        </div>
        
        {/* Tertiary Cube - Left Side - Accent Cube */}
        <div className="hero-3d-cube tertiary-cube">
          <div className="hero-3d-cube-face">
            <span className="cube-icon">⬥</span>
          </div>
          <div className="hero-3d-cube-face">
            <span className="cube-icon">◬</span>
          </div>
          <div className="hero-3d-cube-face">
            <span className="cube-icon">✧</span>
          </div>
          <div className="hero-3d-cube-face">
            <span className="cube-icon">⬤</span>
          </div>
          <div className="hero-3d-cube-face">
            <span className="cube-icon">○</span>
          </div>
          <div className="hero-3d-cube-face">
            <span className="cube-icon">□</span>
          </div>
        </div>
        
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              <span>FSC® Certified · Est. 1990 · Karachi, Pakistan</span>
            </div>
            
            <h1 className="hero-title">
              Engineering<br />
              <em>Exceptional</em><br />
              <strong>Packaging</strong>
            </h1>
            
            <p className="hero-sub">
              Pakistan's leading manufacturer of corrugated and plastic packaging solutions. 
              Trusted by Fortune 500 companies and local champions for over 36 years.
            </p>
            
            <div className="hero-actions">
              <a href="#contact" className="btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({behavior:'smooth'}); }}>
                Request a Quote <span>→</span>
              </a>
              <a href="#products" className="btn-secondary" onClick={(e) => { e.preventDefault(); document.getElementById('products').scrollIntoView({behavior:'smooth'}); }}>
                Explore Products
              </a>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-card-stack">
              <div className="hero-card hero-card-main">
                <div className="hero-card-main-inner">
                  <div className="hero-card-label">Monthly Production Snapshot</div>
                  <div className="hero-stat-grid">
                    <div className="hero-stat">
                      <div className="hero-stat-num">500K+</div>
                      <div className="hero-stat-label">Units / Month</div>
                    </div>
                    <div className="hero-stat">
                      <div className="hero-stat-num">36+</div>
                      <div className="hero-stat-label">Years Experience</div>
                    </div>
                    <div className="hero-stat">
                      <div className="hero-stat-num">350+</div>
                      <div className="hero-stat-label">Team Members</div>
                    </div>
                    <div className="hero-stat">
                      <div className="hero-stat-num">75%</div>
                      <div className="hero-stat-label">Recycled Materials</div>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: "24px" }}>
                    <div className="cap-visual-title" style={{ marginBottom: "14px" }}>Production Line Utilization</div>
                    <div className="bar-group">
                      <div className="bar-label-row">
                        <span className="bar-label">Corrugation Lines</span>
                        <span className="bar-pct">92%</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: "92%" }}></div>
                      </div>
                    </div>
                    <div className="bar-group" style={{ marginBottom: "0" }}>
                      <div className="bar-label-row">
                        <span className="bar-label">Print & Finishing</span>
                        <span className="bar-pct">88%</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: "88%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="hero-mini-cards">
                <div className="hero-mini">
                  <div className="hero-mini-icon">📦</div>
                  <span>3, 5 & 7-ply Corrugation</span>
                </div>
                <div className="hero-mini">
                  <div className="hero-mini-icon">🌿</div>
                  <span>FSC® Certified Sourcing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="marquee-section">
        <div className="marquee-track">
          <div className="marquee-item"><strong>Unilever Pakistan</strong><span className="marquee-sep">✦</span></div>
          <div className="marquee-item"><strong>Engro Foods</strong><span className="marquee-sep">✦</span></div>
          <div className="marquee-item"><strong>Gul Ahmed Textile</strong><span className="marquee-sep">✦</span></div>
          <div className="marquee-item"><strong>Chevron Pakistan</strong><span className="marquee-sep">✦</span></div>
          <div className="marquee-item"><strong>Dalda Foods</strong><span className="marquee-sep">✦</span></div>
          <div className="marquee-item"><strong>Al-Karam Towels</strong><span className="marquee-sep">✦</span></div>
          <div className="marquee-item"><span style={{ color: "var(--primary)" }}>✦ 500K+ UNITS/MONTH ✦</span></div>
          <div className="marquee-item"><strong>Unilever Pakistan</strong><span className="marquee-sep">✦</span></div>
          <div className="marquee-item"><strong>Engro Foods</strong><span className="marquee-sep">✦</span></div>
          <div className="marquee-item"><strong>Gul Ahmed Textile</strong><span className="marquee-sep">✦</span></div>
          <div className="marquee-item"><strong>Chevron Pakistan</strong><span className="marquee-sep">✦</span></div>
          <div className="marquee-item"><strong>Dalda Foods</strong><span className="marquee-sep">✦</span></div>
          <div className="marquee-item"><strong>Al-Karam Towels</strong><span className="marquee-sep">✦</span></div>
          <div className="marquee-item"><span style={{ color: "var(--primary)" }}>✦ FSC® CERTIFIED ✦</span></div>
        </div>
      </div>

      <div className="section-wrapper" id="clients">
        <div className="section reveal">
          <div className="section-label">Trusted Partners</div>
          <h2 className="section-title">
            Powering Pakistan's<br /><em>most iconic brands</em>
          </h2>
          <p className="section-sub">
            From multinational corporations to homegrown champions — our packaging delivers results at every scale.
          </p>
          
          <div className="trusted-grid">
            <div className="trusted-card spotlight-card reveal reveal-delay-1">
              <div>
                <span className="trusted-name">Unilever Pakistan</span>
                <span className="trusted-sub">FMCG · Consumer Goods</span>
              </div>
            </div>
            <div className="trusted-card spotlight-card reveal reveal-delay-2">
              <div>
                <span className="trusted-name">Engro Foods</span>
                <span className="trusted-sub">Food & Beverage</span>
              </div>
            </div>
            <div className="trusted-card spotlight-card reveal reveal-delay-3">
              <div>
                <span className="trusted-name">Gul Ahmed Textile</span>
                <span className="trusted-sub">Textiles & Garments</span>
              </div>
            </div>
            <div className="trusted-card spotlight-card reveal reveal-delay-4">
              <div>
                <span className="trusted-name">Chevron Pakistan</span>
                <span className="trusted-sub">Energy & Lubricants</span>
              </div>
            </div>
            <div className="trusted-card spotlight-card reveal reveal-delay-1">
              <div>
                <span className="trusted-name">Dalda Foods</span>
                <span className="trusted-sub">Food Manufacturing</span>
              </div>
            </div>
            <div className="trusted-card spotlight-card reveal reveal-delay-2">
              <div>
                <span className="trusted-name">Al-Karam Towels</span>
                <span className="trusted-sub">Home Textiles</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="products-section" id="products">
        <div className="products-inner">
          <div className="products-header reveal">
            <div>
              <div className="section-label">Product Range</div>
              <h2 className="section-title" style={{ marginBottom: "0" }}>
                Every packaging<br /><em>challenge, solved</em>
              </h2>
            </div>
            <a href="#contact" className="btn-secondary" onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({behavior:'smooth'}); }}>
              Request Samples →
            </a>
          </div>
          
          <div className="products-grid">
            <div className="product-card spotlight-card reveal reveal-delay-1">
              <div className="product-icon">📦</div>
              <div className="product-tag">3-Ply Construction</div>
              <div className="product-name">Single Wall Boxes</div>
              <div className="product-desc">Standard corrugated cartons built for everyday distribution needs. Reliable, lightweight, and cost-effective.</div>
              <div className="product-apps">
                <span className="product-app">FMCG</span>
                <span className="product-app">Food</span>
                <span className="product-app">Retail</span>
              </div>
            </div>
            
            <div className="product-card spotlight-card reveal reveal-delay-2">
              <div className="product-icon">🏗️</div>
              <div className="product-tag">5-Ply Heavy Duty</div>
              <div className="product-name">Double Wall Boxes</div>
              <div className="product-desc">Increased stacking strength and crush resistance for heavier goods and long-distance logistics.</div>
              <div className="product-apps">
                <span className="product-app">Electronics</span>
                <span className="product-app">Industrial</span>
              </div>
            </div>
            
            <div className="product-card spotlight-card reveal reveal-delay-3">
              <div className="product-icon">⚙️</div>
              <div className="product-tag">7-Ply Ultra-Strong</div>
              <div className="product-name">Triple Wall Boxes</div>
              <div className="product-desc">Ultra-heavy-duty solution for bulk industrial shipments and export containers. Maximum compression resistance.</div>
              <div className="product-apps">
                <span className="product-app">Machinery</span>
                <span className="product-app">Export</span>
              </div>
            </div>
            
            <div className="product-card spotlight-card reveal reveal-delay-4">
              <div className="product-icon">✂️</div>
              <div className="product-tag">Precision Die-Cut</div>
              <div className="product-name">Die-Cut Boxes</div>
              <div className="product-desc">Custom-shaped boxes with precision die-cutting for branded retail, e-commerce unboxing experiences.</div>
              <div className="product-apps">
                <span className="product-app">E-Commerce</span>
                <span className="product-app">Gift</span>
                <span className="product-app">Retail</span>
              </div>
            </div>
            
            <div className="product-card spotlight-card reveal reveal-delay-1">
              <div className="product-icon">🎨</div>
              <div className="product-tag">Up to 6 Colors</div>
              <div className="product-name">Printed Boxes</div>
              <div className="product-desc">Multi-color flexographic and offset printed corrugated boxes. Bring your brand to life.</div>
              <div className="product-apps">
                <span className="product-app">Branded Retail</span>
                <span className="product-app">FMCG</span>
              </div>
            </div>
            
            <div className="product-card spotlight-card reveal reveal-delay-2">
              <div className="product-icon">🍯</div>
              <div className="product-tag">Lightweight & Strong</div>
              <div className="product-name">Honeycomb Boards</div>
              <div className="product-desc">Exceptional strength-to-weight ratio alternative to solid boards. Perfect for automotive parts.</div>
              <div className="product-apps">
                <span className="product-app">Automotive</span>
                <span className="product-app">White Goods</span>
              </div>
            </div>
            
            <div className="product-card spotlight-card reveal reveal-delay-3">
              <div className="product-icon">📋</div>
              <div className="product-tag">RSC Standard</div>
              <div className="product-name">Slotted Cartons</div>
              <div className="product-desc">Regular Slotted Cartons optimized for high-speed automated packing lines.</div>
              <div className="product-apps">
                <span className="product-app">Warehousing</span>
                <span className="product-app">Distribution</span>
              </div>
            </div>
            
            <div className="product-card spotlight-card reveal reveal-delay-4">
              <div className="product-icon">📄</div>
              <div className="product-tag">Raw Material</div>
              <div className="product-name">Corrugated Sheets</div>
              <div className="product-desc">Raw corrugated sheets for in-house converters, industrial fabricators, and wholesale buyers.</div>
              <div className="product-apps">
                <span className="product-app">Wholesale</span>
                <span className="product-app">Industrial</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="why-section">
        <div className="why-inner">
          <div className="section-label reveal">Why Royal Paper</div>
          <h2 className="section-title reveal">
            Three decades of<br /><em>uncompromising quality</em>
          </h2>
          
          <div className="why-grid">
            <div className="why-stats reveal">
              <div className="why-stat-card spotlight-card">
                <div className="why-num">36+</div>
                <div className="why-num-label">Years of industry experience and continuous innovation</div>
              </div>
              <div className="why-stat-card spotlight-card">
                <div className="why-num">500K</div>
                <div className="why-num-label">Units manufactured every single month</div>
              </div>
              <div className="why-stat-card spotlight-card">
                <div className="why-num">350+</div>
                <div className="why-num-label">Skilled professionals across two facilities</div>
              </div>
              <div className="why-stat-card spotlight-card">
                <div className="why-num">75%</div>
                <div className="why-num-label">Raw materials from recycled & sustainable sources</div>
              </div>
            </div>
            
            <div className="why-features reveal reveal-delay-2">
              <div className="why-feature spotlight-card">
                <div className="why-feature-icon">🏅</div>
                <div>
                  <div className="why-feature-title">FSC® Certified Operations</div>
                  <div className="why-feature-desc">Globally recognized certification ensuring responsible forestry practices.</div>
                </div>
              </div>
              <div className="why-feature spotlight-card">
                <div className="why-feature-icon">⚡</div>
                <div>
                  <div className="why-feature-title">Zero-Downtime Guarantee</div>
                  <div className="why-feature-desc">500 KW backup generators ensure uninterrupted production.</div>
                </div>
              </div>
              <div className="why-feature spotlight-card">
                <div className="why-feature-icon">🔬</div>
                <div>
                  <div className="why-feature-title">6-Stage Quality Testing</div>
                  <div className="why-feature-desc">Every batch tested before dispatch for guaranteed quality.</div>
                </div>
              </div>
              <div className="why-feature spotlight-card">
                <div className="why-feature-icon">🌿</div>
                <div>
                  <div className="why-feature-title">Eco-First Manufacturing</div>
                  <div className="why-feature-desc">Water-based inks, VOC-free processes, and zero liquid discharge.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="cap-section" id="capabilities">
        <div className="cap-inner">
          <div className="section-label reveal">Manufacturing</div>
          <h2 className="section-title reveal">
            State-of-the-art<br /><em>production facilities</em>
          </h2>
          
          <div className="cap-grid">
            <div className="cap-list reveal">
              <div className="cap-row"><span className="cap-label">Monthly Output</span><span className="cap-value">500,000+ boxes</span></div>
              <div className="cap-row"><span className="cap-label">Factory Footprint</span><span className="cap-value">4,000 sq. ft. × 2</span></div>
              <div className="cap-row"><span className="cap-label">Corrugation Lines</span><span className="cap-value">3 High-Speed (3, 5, 7-ply)</span></div>
              <div className="cap-row"><span className="cap-label">Flexo Printers</span><span className="cap-value">4 Units (6-color)</span></div>
              <div className="cap-row"><span className="cap-label">Die-Cut Setups</span><span className="cap-value">2 (Rotary + Flatbed)</span></div>
              <div className="cap-row"><span className="cap-label">Finishing Systems</span><span className="cap-value">Automated Glue & Stitch</span></div>
              <div className="cap-row"><span className="cap-label">Backup Power</span><span className="cap-value">500 KW Generator</span></div>
              <div className="cap-row"><span className="cap-label">Operating Hours</span><span className="cap-value">Mon–Sat · 9AM–6PM</span></div>
            </div>
            
            <div className="cap-visual reveal reveal-delay-2">
              <div className="cap-visual-title">Quality Testing Battery</div>
              <div className="bar-group">
                <div className="bar-label-row"><span className="bar-label">Bursting Strength Test</span><span className="bar-pct">✓ 100%</span></div>
                <div className="bar-track"><div className="bar-fill" style={{ width: "100%" }}></div></div>
              </div>
              <div className="bar-group">
                <div className="bar-label-row"><span className="bar-label">Edge Crush Test (ECT)</span><span className="bar-pct">✓ 100%</span></div>
                <div className="bar-track"><div className="bar-fill" style={{ width: "100%" }}></div></div>
              </div>
              <div className="bar-group">
                <div className="bar-label-row"><span className="bar-label">GSM Grammage Verify</span><span className="bar-pct">✓ 100%</span></div>
                <div className="bar-track"><div className="bar-fill" style={{ width: "100%" }}></div></div>
              </div>
              <div className="bar-group">
                <div className="bar-label-row"><span className="bar-label">Moisture Control</span><span className="bar-pct">✓ 100%</span></div>
                <div className="bar-track"><div className="bar-fill" style={{ width: "100%" }}></div></div>
              </div>
              <div className="bar-group">
                <div className="bar-label-row"><span className="bar-label">Box Compression Load</span><span className="bar-pct">✓ 100%</span></div>
                <div className="bar-track"><div className="bar-fill" style={{ width: "100%" }}></div></div>
              </div>
              <div className="bar-group" style={{ marginBottom: "0" }}>
                <div className="bar-label-row"><span className="bar-label">Print Fidelity Check</span><span className="bar-pct">✓ 100%</span></div>
                <div className="bar-track"><div className="bar-fill" style={{ width: "100%" }}></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sustain-section" id="sustainability">
        <div className="sustain-inner">
          <div className="section-label reveal">Green Commitment</div>
          <h2 className="section-title reveal">
            Packaging the future,<br /><em>responsibly</em>
          </h2>
          <p className="section-sub reveal">
            Every decision we make considers its environmental impact. Sustainability is not a policy — it is our process.
          </p>
          
          <div className="sustain-grid">
            <div className="sustain-card spotlight-card reveal reveal-delay-1">
              <div className="sustain-icon">♻️</div>
              <div className="sustain-pct">75%+</div>
              <div className="sustain-title">Recycled Raw Materials</div>
              <div className="sustain-desc">Over three-quarters of our raw materials are derived from recycled paper and fibre sources.</div>
            </div>
            <div className="sustain-card spotlight-card reveal reveal-delay-2">
              <div className="sustain-icon">💧</div>
              <div className="sustain-pct">0</div>
              <div className="sustain-title">Liquid Discharge Policy</div>
              <div className="sustain-desc">Zero liquid discharge enforced across all active production areas.</div>
            </div>
            <div className="sustain-card spotlight-card reveal reveal-delay-3">
              <div className="sustain-icon">🌱</div>
              <div className="sustain-pct">100%</div>
              <div className="sustain-title">Water-Based Inks</div>
              <div className="sustain-desc">Exclusively water-based, non-toxic, VOC-free inks used across all print jobs.</div>
            </div>
          </div>
          
          <div style={{ marginTop: "2px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
            <div className="sustain-card spotlight-card reveal reveal-delay-1" style={{ display: "flex", alignItems: "center", gap: "24px", flexDirection: "row" }}>
              <div style={{ fontSize: "1.8rem" }}>🏭</div>
              <div>
                <div className="sustain-title">In-House Waste Baling</div>
                <div className="sustain-desc">State-of-the-art commercial baling system processes all paper waste on-site.</div>
              </div>
            </div>
            <div className="sustain-card spotlight-card reveal reveal-delay-2" style={{ display: "flex", alignItems: "center", gap: "24px", flexDirection: "row" }}>
              <div style={{ fontSize: "1.8rem" }}>🌲</div>
              <div>
                <div className="sustain-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  FSC® Certified Procurement
                  <div className="fsc-badge" style={{ margin: "0" }}><span>FSC®</span></div>
                </div>
                <div className="sustain-desc">All paper sourced from FSC-certified mills — guaranteeing responsible forestry practices.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="process-section">
        <div className="process-inner">
          <div className="section-label reveal">Our Process</div>
          <h2 className="section-title reveal">
            From requirement<br /><em>to delivery</em>
          </h2>
          
          <div className="process-steps reveal">
            <div className="process-line"></div>
            <div className="process-step spotlight-card">
              <div className="process-num">01</div>
              <div>
                <div className="process-title">Consultation & Specification</div>
                <div className="process-desc">Our team evaluates your exact packaging specifications, budget, and timeline.</div>
                <div className="process-tags">
                  <span className="process-tag">Site Visit Available</span>
                  <span className="process-tag">Technical Assessment</span>
                </div>
              </div>
            </div>
            <div className="process-step spotlight-card">
              <div className="process-num">02</div>
              <div>
                <div className="process-title">Custom Design & Sampling</div>
                <div className="process-desc">Structural prototypes and print-ready artwork created for approval.</div>
                <div className="process-tags">
                  <span className="process-tag">Structural Prototypes</span>
                  <span className="process-tag">Print Proofing</span>
                </div>
              </div>
            </div>
            <div className="process-step spotlight-card">
              <div className="process-num">03</div>
              <div>
                <div className="process-title">Quality-Controlled Manufacturing</div>
                <div className="process-desc">Full-batch production monitored against 6-point quality testing battery.</div>
                <div className="process-tags">
                  <span className="process-tag">6-Stage QC</span>
                  <span className="process-tag">Batch Tracking</span>
                </div>
              </div>
            </div>
            <div className="process-step spotlight-card" style={{ marginBottom: "0" }}>
              <div className="process-num">04</div>
              <div>
                <div className="process-title">Delivery & After-Sales Support</div>
                <div className="process-desc">On-time delivery with full documentation and ongoing supply planning.</div>
                <div className="process-tags">
                  <span className="process-tag">Nationwide Delivery</span>
                  <span className="process-tag">Dedicated Account Manager</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="testi-section">
        <div className="why-inner">
          <div className="section-label reveal">Client Feedback</div>
          <h2 className="section-title reveal">
            What our partners<br /><em>say about us</em>
          </h2>
          
          <div className="testi-grid" style={{ marginTop: "56px" }}>
            <div className="testi-card spotlight-card reveal reveal-delay-1">
              <div className="testi-stars">★★★★★</div>
              <div className="testi-text">"Royal Paper has been our go-to packaging supplier for over a decade. Their consistency and quality is unmatched in Pakistan."</div>
              <div className="testi-author">
                <div className="testi-avatar">A</div>
                <div>
                  <div className="testi-name">Ahmed Raza</div>
                  <div className="testi-role">Supply Chain Director</div>
                </div>
              </div>
            </div>
            <div className="testi-card spotlight-card reveal reveal-delay-2">
              <div className="testi-stars">★★★★★</div>
              <div className="testi-text">"The FSC certification and eco-friendly processes exceeded every expectation in sustainability."</div>
              <div className="testi-author">
                <div className="testi-avatar">S</div>
                <div>
                  <div className="testi-name">Sara Malik</div>
                  <div className="testi-role">Procurement Manager</div>
                </div>
              </div>
            </div>
            <div className="testi-card spotlight-card reveal reveal-delay-3">
              <div className="testi-stars">★★★★★</div>
              <div className="testi-text">"From custom die-cut designs to bulk corrugated sheets, their range and turnaround time is exceptional."</div>
              <div className="testi-author">
                <div className="testi-avatar">M</div>
                <div>
                  <div className="testi-name">Muneeb Khan</div>
                  <div className="testi-role">Operations Head</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="faq-section">
        <div className="faq-inner">
          <div className="section-label reveal">FAQ</div>
          <h2 className="section-title reveal">
            Common questions<br /><em>answered</em>
          </h2>
          
          <div className="faq-list reveal">
            <div className="faq-item">
              <div className="faq-q" onClick={toggleFaq}>
                <span className="faq-q-text">What is your minimum order quantity?</span>
                <div className="faq-icon">+</div>
              </div>
              <div className="faq-a">
                <div className="faq-a-inner">
                  Minimum order quantities vary by product type. For standard RSC cartons, we typically work with runs starting from 500 units. Custom die-cut and printed boxes may require higher MOQs. Contact our sales team for a tailored quote.
                </div>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-q" onClick={toggleFaq}>
                <span className="faq-q-text">Do you provide product samples before full production?</span>
                <div className="faq-icon">+</div>
              </div>
              <div className="faq-a">
                <div className="faq-a-inner">
                  Absolutely. We produce physical structural samples and print proofs for client approval before any full production run. Sample timelines typically range from 3–7 business days.
                </div>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-q" onClick={toggleFaq}>
                <span className="faq-q-text">Are your inks and adhesives food-safe?</span>
                <div className="faq-icon">+</div>
              </div>
              <div className="faq-a">
                <div className="faq-a-inner">
                  Yes. We exclusively use water-based, non-toxic, VOC-free inks and food-safe adhesives across all product lines. All materials comply with food-contact packaging safety standards.
                </div>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-q" onClick={toggleFaq}>
                <span className="faq-q-text">What quality certifications do you hold?</span>
                <div className="faq-icon">+</div>
              </div>
              <div className="faq-a">
                <div className="faq-a-inner">
                  Royal Paper holds FSC® certification and conducts 6-stage quality testing on every production batch: Bursting Strength, ECT, GSM Grammage, Moisture, Box Compression, and Print Quality.
                </div>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-q" onClick={toggleFaq}>
                <span className="faq-q-text">Can you handle large-scale or urgent orders?</span>
                <div className="faq-icon">+</div>
              </div>
              <div className="faq-a">
                <div className="faq-a-inner">
                  With three high-speed corrugation lines and monthly capacity exceeding 500,000 units, we are well-equipped for large-scale and urgent requirements. Our 500 KW backup generators ensure zero production downtime.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-section" id="contact">
        <div className="contact-inner">
          <div className="section-label reveal">Get In Touch</div>
          <h2 className="section-title reveal">
            Start your packaging<br /><em>project today</em>
          </h2>
          
          <div className="contact-grid">
            <div>
              <div className="contact-info reveal">
                <div className="contact-item spotlight-card">
                  <div className="contact-item-icon">📍</div>
                  <div>
                    <div className="contact-item-label">Factory Address</div>
                    <div className="contact-item-value">Plot # B-25, SITE II Super Highway<br />Scheme-33, Karachi, Pakistan</div>
                  </div>
                </div>
                <div className="contact-item spotlight-card">
                  <div className="contact-item-icon">📞</div>
                  <div>
                    <div className="contact-item-label">Phone</div>
                    <div className="contact-item-value">+92-21-36881424<br />+92-21-36881425</div>
                  </div>
                </div>
                <div className="contact-item spotlight-card">
                  <div className="contact-item-icon">✉️</div>
                  <div>
                    <div className="contact-item-label">Email</div>
                    <div className="contact-item-value">royalpaperandplastic@gmail.com<br />info@royalppackages.com</div>
                  </div>
                </div>
                <div className="contact-item spotlight-card">
                  <div className="contact-item-icon">🕐</div>
                  <div>
                    <div className="contact-item-label">Operating Hours</div>
                    <div className="contact-item-value">Monday – Saturday<br />9:00 AM – 6:00 PM PKT</div>
                  </div>
                </div>
              </div>
              
              <div className="map-embed reveal">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.5!2d67.0622!3d24.9012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zU0lURSBJSSBTdXBlciBIaWdod2F5!5e0!3m2!1sen!2spk!4v1700000000000"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Royal Paper Factory Location"
                ></iframe>
              </div>
            </div>
            
            <div className="contact-form reveal reveal-delay-2">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" type="text" placeholder="e.g. Ahmed Khan" id="f-name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input className="form-input" type="text" placeholder="Company name" id="f-company" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="your@email.com" id="f-email" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" type="tel" placeholder="+92 300 000 0000" id="f-phone" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Product Interest</label>
                <select className="form-select" id="f-product">
                  <option value="">Select a product type...</option>
                  <option>Single Wall Boxes (3-ply)</option>
                  <option>Double Wall Boxes (5-ply)</option>
                  <option>Triple Wall Boxes (7-ply)</option>
                  <option>Die-Cut Custom Boxes</option>
                  <option>Printed Boxes (Multi-color)</option>
                  <option>Slotted Cartons (RSC)</option>
                  <option>Honeycomb Boards</option>
                  <option>Corrugated Sheets</option>
                  <option>Multiple Products</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Estimated Monthly Volume</label>
                <select className="form-select" id="f-volume">
                  <option value="">Select volume range...</option>
                  <option>Under 5,000 units</option>
                  <option>5,000 – 25,000 units</option>
                  <option>25,000 – 100,000 units</option>
                  <option>100,000 – 500,000 units</option>
                  <option>500,000+ units</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message / Specifications</label>
                <textarea className="form-textarea" placeholder="Describe your requirements — dimensions, print needs, delivery timeline..." id="f-msg"></textarea>
              </div>
              <button className="form-submit" onClick={submitForm}>Send Inquiry →</button>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="nav-logo-mark">R</div>
                <div className="nav-brand">Royal Paper<span>& Plastic Products</span></div>
              </div>
              <p className="footer-tagline">Pakistan's most trusted corrugated packaging manufacturer. Engineering excellence since 1990.</p>
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
                <li><a href="http://www.royalppackages.com" target="_blank" rel="noopener noreferrer">Website</a></li>
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
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-subtle)", lineHeight: "2" }}>
                  NTN: 7245050<br />
                  Reg: 32-77-8763-245-39<br />
                  Est. 1990 · Karachi, PK
                </div>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-copy">
              © 2025 <strong>Royal Paper & Plastic Products (Pvt) Ltd.</strong> All rights reserved.
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