const fs = require('fs');

let html = fs.readFileSync('src/body_content.txt', 'utf8');

// remove scripts
html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

// replace class with className
html = html.replace(/class=/g, 'className=');

// replace onclick with onClick
html = html.replace(/onclick=/g, 'onClick=');

// replace for with htmlFor
html = html.replace(/for=/g, 'htmlFor=');

// fix self-closing tags
html = html.replace(/<input([^>]*)>/g, '<input$1 />');
html = html.replace(/<br>/g, '<br />');
html = html.replace(/<hr>/g, '<hr />');

// fix HTML comments
html = html.replace(/<\!--(.*?)-->/gs, '{/* $1 */}');
html = html.replace(/<\s*!--(.*?)-->/gs, '{/* $1 */}');

// parse simple style="key: value; ..."
html = html.replace(/style="([^"]*)"/g, (match, p1) => {
  const rules = p1.split(';').filter(r => r.includes(':'));
  const objStr = rules.map(rule => {
    const [k, ...vArr] = rule.split(':');
    let key = k.trim();
    let val = vArr.join(':').trim();
    
    // to camelCase
    key = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
    
    return `${key}: "${val}"`;
  }).join(', ');
  
  return `style={{ ${objStr} }}`;
});

const out = `
import React, { useEffect } from 'react';

export default function Main() {
  useEffect(() => {
    // Basic setup for scroll reveal
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('in');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    // Custom Cursor logic
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    
    const handleMouseMove = (e) => {
        mx = e.clientX; my = e.clientY;
        if(cursor) cursor.style.transform = \`translate(\${mx - 5}px, \${my - 5}px)\`;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    let animationFrameId;
    const animateRing = () => {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        if(ring) ring.style.transform = \`translate(\${rx - 18}px, \${ry - 18}px)\`;
        animationFrameId = requestAnimationFrame(animateRing);
    };
    animateRing();

    // Hover effect
    const elements = document.querySelectorAll('a, button, .product-card, .why-feature, .faq-q, .trusted-card, .testi-card, .sustain-card, .process-step, .cap-row, .contact-item');
    const addHover = () => document.body.classList.add('cursor-hover');
    const removeHover = () => document.body.classList.remove('cursor-hover');
    
    elements.forEach(el => {
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', removeHover);
    });

    // Nav scroll
    const handleScroll = () => {
        const nav = document.getElementById('nav');
        if(nav) nav.classList.toggle('scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      elements.forEach(el => {
          el.removeEventListener('mouseenter', addHover);
          el.removeEventListener('mouseleave', removeHover);
      });
    };
  }, []);

  const toggleFaq = (e) => {
    const item = e.currentTarget.parentElement;
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

  return (
    <>
${html}
    </>
  );
}
`;

fs.writeFileSync('src/HomePage.jsx', out);
