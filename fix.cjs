const fs = require('fs');
let code = fs.readFileSync('src/HomePage.jsx', 'utf8');

// 1. Add useState and theme logic
code = code.replace(/import React, \{ useEffect \} from 'react';\r?\n\r?\nexport default function Main\(\) \{/, `import React, { useEffect, useState } from 'react';

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
`);

// 2. Fix string onClicks
code = code.replace(/onClick="document\.getElementById\('contact'\)\.scrollIntoView\(\{behavior:'smooth'\}\)"/g, "onClick={() => document.getElementById('contact').scrollIntoView({behavior:'smooth'})}");
code = code.replace(/onClick="document\.getElementById\('contact'\)\.scrollIntoView\(\{behavior:'smooth'\}\); return false;"/g, "onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({behavior:'smooth'}); }}");
code = code.replace(/onClick="document\.getElementById\('products'\)\.scrollIntoView\(\{behavior:'smooth'\}\); return false;"/g, "onClick={(e) => { e.preventDefault(); document.getElementById('products').scrollIntoView({behavior:'smooth'}); }}");
code = code.replace(/onClick="toggleFaq\(this\)"/g, "onClick={toggleFaq}");
code = code.replace(/onClick="submitForm\(\)"/g, "onClick={submitForm}");

// 3. Add Theme Toggle Button to nav
code = code.replace(/<button className="nav-cta"/g, `<div style={{display:'flex', gap:'12px', alignItems:'center'}}><button onClick={toggleTheme} style={{background:'transparent', border:'1px solid var(--border)', color:'var(--cream)', borderRadius:'50%', cursor:'pointer', width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center'}}>{theme === 'dark' ? '☀️' : '🌙'}</button><button className="nav-cta"`);
code = code.replace(/Get a Quote<\/button>/g, "Get a Quote</button></div>");

fs.writeFileSync('src/HomePage.jsx', code);
