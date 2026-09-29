const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

// 1. Icon Logo (Square / App Icon)
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <defs>
    <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f766e"/>
      <stop offset="50%" stop-color="#0d9488"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
    <linearGradient id="crossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f0fdfa"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#0f766e" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Background Squircle Shield -->
  <rect x="15" y="15" width="170" height="170" rx="44" fill="url(#iconGrad)" filter="url(#glow)"/>
  
  <!-- Subtle Internal Glow Ring -->
  <rect x="18" y="18" width="164" height="164" rx="41" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.25"/>

  <!-- Medical Cross with Rounded Corners -->
  <g fill="url(#crossGrad)">
    <!-- Vertical Bar -->
    <rect x="85" y="50" width="30" height="100" rx="10"/>
    <!-- Horizontal Bar -->
    <rect x="50" y="85" width="100" height="30" rx="10"/>
  </g>

  <!-- Heartbeat / Pulse Wave in Center -->
  <path d="M 45 100 L 72 100 L 82 80 L 96 122 L 108 76 L 118 106 L 126 100 L 155 100" 
        fill="none" 
        stroke="#0d9488" 
        stroke-width="5" 
        stroke-linecap="round" 
        stroke-linejoin="round"/>

  <!-- Small Stethoscope Dot / Accent -->
  <circle cx="145" cy="55" r="7" fill="#38bdf8"/>
</svg>`;

// 2. Full Horizontal Brand Logo with "Online Doctor"
const fullLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 90" width="100%" height="100%">
  <defs>
    <linearGradient id="fullGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f766e"/>
      <stop offset="50%" stop-color="#0d9488"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
    <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#0f766e" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Left Icon Emblem -->
  <g transform="translate(10, 8)" filter="url(#badgeShadow)">
    <rect width="74" height="74" rx="20" fill="url(#fullGrad)"/>
    <rect x="2" y="2" width="70" height="70" rx="18" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.3"/>
    
    <!-- Medical Cross -->
    <rect x="30" y="16" width="14" height="42" rx="5" fill="#ffffff"/>
    <rect x="16" y="30" width="42" height="14" rx="5" fill="#ffffff"/>

    <!-- Integrated Pulse Wave -->
    <path d="M 14 37 L 26 37 L 31 28 L 37 46 L 42 27 L 46 40 L 50 37 L 60 37" 
          fill="none" 
          stroke="#0d9488" 
          stroke-width="2.5" 
          stroke-linecap="round" 
          stroke-linejoin="round"/>
  </g>

  <!-- Typography: Online Doctor -->
  <g transform="translate(98, 48)">
    <text font-family="Inter, system-ui, -apple-system, sans-serif" font-size="28" font-weight="900" fill="#0f172a" letter-spacing="-0.5">
      Online<tspan fill="#0d9488">Doctor</tspan>
    </text>
    
    <!-- Subtitle -->
    <text y="22" font-family="'Noto Sans Bengali', Inter, sans-serif" font-size="11.5" font-weight="600" fill="#64748b" letter-spacing="0.2">
      বাংলাদেশ ডিজিটাল স্বাস্থ্য সেবা
    </text>
  </g>

  <!-- Verified BD Badge -->
  <g transform="translate(290, 24)">
    <rect width="36" height="18" rx="5" fill="#ccfbf1" stroke="#99f6e4" stroke-width="1"/>
    <text x="18" y="13" font-family="system-ui, sans-serif" font-size="10" font-weight="800" fill="#0f766e" text-anchor="middle">BD</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), iconSvg);
fs.writeFileSync(path.join(publicDir, 'logo.svg'), fullLogoSvg);

console.log('Logo and Icon SVG generated successfully!');
