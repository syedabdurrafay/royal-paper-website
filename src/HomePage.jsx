// HomePage.jsx - Complete updated file (REMOVED ALL ICONS FROM CUBES)
import React, { useEffect, useState, useRef } from 'react';
import img1 from './assets/Gemini_Generated_Image_nd7cind7cind7cin.png';
import img2 from './assets/Gemini_Generated_Image_oi5pjzoi5pjzoi5p.png';
import img3 from './assets/Gemini_Generated_Image_xqqrn4xqqrn4xqqr.png';
import img4 from './assets/Gemini_Generated_Image_42fg9442fg9442fg.png';

export default function HomePage() {
  // Single theme state - only dark or light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Toggle between dark and light themes
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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

    // Interactive Cube Mouse Tracking
    const mainCube = document.getElementById('rotatingCube');
    let lastInteraction = Date.now();
    let currentX = 0, currentY = 0, targetX = 0, targetY = 0;
    let idleAngle = 0;

    const onCubeMouseEnter = () => {
      lastInteraction = Date.now();
      if (mainCube) mainCube.classList.add('hover');
    };

    const onCubeMouseLeave = () => {
      lastInteraction = Date.now();
      targetX = 0; targetY = 0;
      if (mainCube) mainCube.classList.remove('hover');
    };

    const onCubeMouseMove = (e) => {
      if (!mainCube) return;
      const rect = mainCube.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      targetY = dx * 40;
      targetX = dy * -40;
      lastInteraction = Date.now();
    };

    if (mainCube) {
      mainCube.addEventListener('mouseenter', onCubeMouseEnter);
      mainCube.addEventListener('mouseleave', onCubeMouseLeave);
      mainCube.addEventListener('mousemove', onCubeMouseMove);
    }

    const animateCube = () => {
      requestAnimationFrame(animateCube);
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      if (Date.now() - lastInteraction > 1500) {
        idleAngle += 0.5;
        const wobble = Math.sin(idleAngle * 0.008) * 5;
        if (mainCube) mainCube.style.transform = `rotateX(${currentX + wobble}deg) rotateY(${currentY + idleAngle}deg)`;
      } else {
        if (mainCube) mainCube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
      }
    };
    animateCube();

    // Secondary cube auto-rotation
    const secondaryCube = document.getElementById('secondaryCube');
    let secAngle = 0;
    if (secondaryCube) {
      const animateSec = () => {
        requestAnimationFrame(animateSec);
        secAngle += 0.8;
        secondaryCube.style.transform = `rotateX(${Math.sin(secAngle * 0.01) * 15}deg) rotateY(${secAngle}deg)`;
      };
      animateSec();
    }

    // Tertiary cube auto-rotation
    const tertiaryCube = document.getElementById('tertiaryCube');
    let tertAngle = 0;
    if (tertiaryCube) {
      const animateTert = () => {
        requestAnimationFrame(animateTert);
        tertAngle -= 0.6;
        tertiaryCube.style.transform = `rotateX(${Math.cos(tertAngle * 0.008) * 20}deg) rotateY(${tertAngle}deg)`;
      };
      animateTert();
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleParallax);
      if (mainCube) {
        mainCube.removeEventListener('mouseenter', onCubeMouseEnter);
        mainCube.removeEventListener('mouseleave', onCubeMouseLeave);
        mainCube.removeEventListener('mousemove', onCubeMouseMove);
      }
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
          <li><a href="#stats">Snapshot</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        
        <div className="nav-actions">
          {/* Single Theme Toggle Button - Dark/Light only */}
          <button onClick={toggleTheme} className="theme-toggle-single" aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
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
        
        {/* Main Large Interactive Cube - NO ICONS */}
        <div className="hero-3d-cube main-cube" id="rotatingCube">
          <div className="hero-3d-cube-face"></div>
          <div className="hero-3d-cube-face"></div>
          <div className="hero-3d-cube-face"></div>
          <div className="hero-3d-cube-face"></div>
          <div className="hero-3d-cube-face"></div>
          <div className="hero-3d-cube-face"></div>
        </div>
        
        {/* Secondary Cube - NO ICONS */}
        <div className="hero-3d-cube secondary-cube" id="secondaryCube">
          <div className="hero-3d-cube-face"></div>
          <div className="hero-3d-cube-face"></div>
          <div className="hero-3d-cube-face"></div>
          <div className="hero-3d-cube-face"></div>
          <div className="hero-3d-cube-face"></div>
          <div className="hero-3d-cube-face"></div>
        </div>
        
        {/* Tertiary Cube - NO ICONS */}
        <div className="hero-3d-cube tertiary-cube" id="tertiaryCube">
          <div className="hero-3d-cube-face"></div>
          <div className="hero-3d-cube-face"></div>
          <div className="hero-3d-cube-face"></div>
          <div className="hero-3d-cube-face"></div>
          <div className="hero-3d-cube-face"></div>
          <div className="hero-3d-cube-face"></div>
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
            {/* SVG Masks for soft fluid/blotch frame shapes (high visibility, minimal crop) */}
            <svg width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
              <defs>
                {/* Left Blotch Mask - Organic but large */}
                <clipPath id="blob-left-mask" clipPathUnits="objectBoundingBox">
                  <path d="M 0.08,0.12 C 0.28,-0.02, 0.82,0.05, 0.92,0.15 C 1.02,0.35, 0.95,0.72, 0.9,0.88 C 0.82,0.98, 0.65,1.02, 0.45,0.95 C 0.22,0.88, 0.08,0.95, 0.04,0.75 C 0,0.52, 0.05,0.28, 0.08,0.12 Z" />
                </clipPath>
                {/* Center Blotch Mask - Soft fluid wave */}
                <clipPath id="organic-center-mask" clipPathUnits="objectBoundingBox">
                  <path d="M 0.12,0.08 C 0.35,-0.05, 0.72,0.02, 0.88,0.12 C 1.02,0.28, 0.95,0.65, 0.98,0.82 C 1.02,0.98, 0.72,1.02, 0.52,0.95 C 0.32,0.88, 0.12,0.98, 0.05,0.8 C -0.02,0.62, 0.05,0.28, 0.12,0.08 Z" />
                </clipPath>
                {/* Right Blotch Mask - Organic distorted squircle */}
                <clipPath id="squircle-right-mask" clipPathUnits="objectBoundingBox">
                  <path d="M 0.15,0.05 C 0.45,-0.02, 0.8,0.05, 0.95,0.18 C 1.05,0.35, 0.98,0.7, 0.9,0.88 C 0.8,0.98, 0.5,1.02, 0.2,0.95 C 0.08,0.9, 0.02,0.75, 0.02,0.5 C 0.02,0.25, 0.05,0.12, 0.15,0.05 Z" />
                </clipPath>
                {/* Fourth Blotch Mask - Organic fluid shape */}
                <clipPath id="organic-fourth-mask" clipPathUnits="objectBoundingBox">
                  <path d="M 0.1,0.15 C 0.3,-0.05, 0.85,0.0, 0.95,0.2 C 1.05,0.4, 0.92,0.75, 0.85,0.9 C 0.75,1.0, 0.4,0.98, 0.15,0.9 C 0.05,0.82, -0.05,0.5, 0.05,0.25 C 0.08,0.18, 0.08,0.16, 0.1,0.15 Z" />
                </clipPath>
              </defs>
            </svg>

            <div className="hero-card-stack">
              {/* Make the outer and inner containers fully transparent with no borders or shadows */}
              <div className="hero-card hero-card-main" style={{ background: "transparent", border: "none", backdropFilter: "none", boxShadow: "none" }}>
                <div className="hero-card-main-inner" style={{ overflow: "visible", background: "transparent", border: "none", backdropFilter: "none", boxShadow: "none", padding: 0 }}>
                  <div className="parabola-frame">
                    <div className="parabola-img-wrapper">
                      <img src={img1} alt="Corrugation quality control" className="parabola-img" />
                      <div className="parabola-img-label">Corrugation Quality</div>
                    </div>
                    <div className="parabola-img-wrapper">
                      <img src={img2} alt="Vibrant print output" className="parabola-img" />
                      <div className="parabola-img-label">Print Precision</div>
                    </div>
                    <div className="parabola-img-wrapper">
                      <img src={img3} alt="Final assembly line" className="parabola-img" />
                      <div className="parabola-img-label">Final Assembly</div>
                    </div>
                    <div className="parabola-img-wrapper">
                      <img src={img4} alt="Eco Sourcing" className="parabola-img" />
                      <div className="parabola-img-label">Eco Sourcing</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="hero-mini-cards">
                <div className="hero-mini">
                  <div className="hero-mini-icon"></div>
                  <span>3, 5 & 7-ply Corrugation</span>
                </div>
                <div className="hero-mini">
                  <div className="hero-mini-icon"></div>
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
            <div className="trusted-card reveal reveal-delay-1">
              <div>
                <span className="trusted-name">Unilever Pakistan</span>
                <span className="trusted-sub">FMCG · Consumer Goods</span>
              </div>
            </div>
            <div className="trusted-card reveal reveal-delay-2">
              <div>
                <span className="trusted-name">Engro Foods</span>
                <span className="trusted-sub">Food & Beverage</span>
              </div>
            </div>
            <div className="trusted-card reveal reveal-delay-3">
              <div>
                <span className="trusted-name">Gul Ahmed Textile</span>
                <span className="trusted-sub">Textiles & Garments</span>
              </div>
            </div>
            <div className="trusted-card reveal reveal-delay-4">
              <div>
                <span className="trusted-name">Chevron Pakistan</span>
                <span className="trusted-sub">Energy & Lubricants</span>
              </div>
            </div>
            <div className="trusted-card reveal reveal-delay-1">
              <div>
                <span className="trusted-name">Dalda Foods</span>
                <span className="trusted-sub">Food Manufacturing</span>
              </div>
            </div>
            <div className="trusted-card reveal reveal-delay-2">
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
            <div className="product-card reveal reveal-delay-1">
              <div className="product-tag">3-Ply Construction</div>
              <div className="product-name">Single Wall Boxes</div>
              <div className="product-desc">Standard corrugated cartons built for everyday distribution needs. Reliable, lightweight, and cost-effective.</div>
              <div className="product-apps">
                <span className="product-app">FMCG</span>
                <span className="product-app">Food</span>
                <span className="product-app">Retail</span>
              </div>
            </div>
            
            <div className="product-card reveal reveal-delay-2">
              <div className="product-tag">5-Ply Heavy Duty</div>
              <div className="product-name">Double Wall Boxes</div>
              <div className="product-desc">Increased stacking strength and crush resistance for heavier goods and long-distance logistics.</div>
              <div className="product-apps">
                <span className="product-app">Electronics</span>
                <span className="product-app">Industrial</span>
              </div>
            </div>
            
            <div className="product-card reveal reveal-delay-3">
              <div className="product-tag">7-Ply Ultra-Strong</div>
              <div className="product-name">Triple Wall Boxes</div>
              <div className="product-desc">Ultra-heavy-duty solution for bulk industrial shipments and export containers. Maximum compression resistance.</div>
              <div className="product-apps">
                <span className="product-app">Machinery</span>
                <span className="product-app">Export</span>
              </div>
            </div>
            
            <div className="product-card reveal reveal-delay-4">
              <div className="product-tag">Precision Die-Cut</div>
              <div className="product-name">Die-Cut Boxes</div>
              <div className="product-desc">Custom-shaped boxes with precision die-cutting for branded retail, e-commerce unboxing experiences.</div>
              <div className="product-apps">
                <span className="product-app">E-Commerce</span>
                <span className="product-app">Gift</span>
                <span className="product-app">Retail</span>
              </div>
            </div>
            
            <div className="product-card reveal reveal-delay-1">
              <div className="product-tag">Up to 6 Colors</div>
              <div className="product-name">Printed Boxes</div>
              <div className="product-desc">Multi-color flexographic and offset printed corrugated boxes. Bring your brand to life.</div>
              <div className="product-apps">
                <span className="product-app">Branded Retail</span>
                <span className="product-app">FMCG</span>
              </div>
            </div>
            
            <div className="product-card reveal reveal-delay-2">
              <div className="product-tag">Lightweight & Strong</div>
              <div className="product-name">Honeycomb Boards</div>
              <div className="product-desc">Exceptional strength-to-weight ratio alternative to solid boards. Perfect for automotive parts.</div>
              <div className="product-apps">
                <span className="product-app">Automotive</span>
                <span className="product-app">White Goods</span>
              </div>
            </div>
            
            <div className="product-card reveal reveal-delay-3">
              <div className="product-tag">RSC Standard</div>
              <div className="product-name">Slotted Cartons</div>
              <div className="product-desc">Regular Slotted Cartons optimized for high-speed automated packing lines.</div>
              <div className="product-apps">
                <span className="product-app">Warehousing</span>
                <span className="product-app">Distribution</span>
              </div>
            </div>
            
            <div className="product-card reveal reveal-delay-4">
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
              <div className="why-stat-card">
                <div className="why-num">36+</div>
                <div className="why-num-label">Years of industry experience and continuous innovation</div>
              </div>
              <div className="why-stat-card">
                <div className="why-num">500K</div>
                <div className="why-num-label">Units manufactured every single month</div>
              </div>
              <div className="why-stat-card">
                <div className="why-num">350+</div>
                <div className="why-num-label">Skilled professionals across two facilities</div>
              </div>
              <div className="why-stat-card">
                <div className="why-num">75%</div>
                <div className="why-num-label">Raw materials from recycled & sustainable sources</div>
              </div>
            </div>
            
            <div className="why-features reveal reveal-delay-2">
              <div className="why-feature">
                <div>
                  <div className="why-feature-title">FSC® Certified Operations</div>
                  <div className="why-feature-desc">Globally recognized certification ensuring responsible forestry practices.</div>
                </div>
              </div>
              <div className="why-feature">
                <div>
                  <div className="why-feature-title">Zero-Downtime Guarantee</div>
                  <div className="why-feature-desc">500 KW backup generators ensure uninterrupted production.</div>
                </div>
              </div>
              <div className="why-feature">
                <div>
                  <div className="why-feature-title">6-Stage Quality Testing</div>
                  <div className="why-feature-desc">Every batch tested before dispatch for guaranteed quality.</div>
                </div>
              </div>
              <div className="why-feature">
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
            <div className="sustain-card reveal reveal-delay-1">
              <div className="sustain-pct">75%+</div>
              <div className="sustain-title">Recycled Raw Materials</div>
              <div className="sustain-desc">Over three-quarters of our raw materials are derived from recycled paper and fibre sources.</div>
            </div>
            <div className="sustain-card reveal reveal-delay-2">
              <div className="sustain-pct">0</div>
              <div className="sustain-title">Liquid Discharge Policy</div>
              <div className="sustain-desc">Zero liquid discharge enforced across all active production areas.</div>
            </div>
            <div className="sustain-card reveal reveal-delay-3">
              <div className="sustain-pct">100%</div>
              <div className="sustain-title">Water-Based Inks</div>
              <div className="sustain-desc">Exclusively water-based, non-toxic, VOC-free inks used across all print jobs.</div>
            </div>
          </div>
          
          <div style={{ marginTop: "2px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
            <div className="sustain-card reveal reveal-delay-1" style={{ display: "flex", alignItems: "center", gap: "24px", flexDirection: "row" }}>
              <div>
                <div className="sustain-title">In-House Waste Baling</div>
                <div className="sustain-desc">State-of-the-art commercial baling system processes all paper waste on-site.</div>
              </div>
            </div>
            <div className="sustain-card reveal reveal-delay-2" style={{ display: "flex", alignItems: "center", gap: "24px", flexDirection: "row" }}>
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
            <div className="process-step">
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
            <div className="process-step">
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
            <div className="process-step">
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
            <div className="process-step" style={{ marginBottom: "0" }}>
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
            <div className="testi-card reveal reveal-delay-1">
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
            <div className="testi-card reveal reveal-delay-2">
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
            <div className="testi-card reveal reveal-delay-3">
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
                <div className="contact-item">
                  <div>
                    <div className="contact-item-label">Factory Address</div>
                    <div className="contact-item-value">Plot # B-25, SITE II Super Highway<br />Scheme-33, Karachi, Pakistan</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div>
                    <div className="contact-item-label">Phone</div>
                    <div className="contact-item-value">+92-21-36881424<br />+92-21-36881425</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div>
                    <div className="contact-item-label">Email</div>
                    <div className="contact-item-value">royalpaperandplastic@gmail.com<br />info@royalppackages.com</div>
                  </div>
                </div>
                <div className="contact-item">
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
                <li><a href="#stats">Snapshot</a></li>
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
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", lineHeight: "2" }}>
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