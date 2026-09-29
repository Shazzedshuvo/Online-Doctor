const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/medicines');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const medicines = [
  {
    id: 'napa',
    brand: 'Napa',
    generic: 'Paracetamol 500 mg',
    company: 'Beximco Pharma',
    form: 'Tablet',
    bg: '#00529b',
    accent: '#00a3e0',
    tabletColor: '#ffffff',
    shape: 'round',
    stripType: 'blister-strip',
  },
  {
    id: 'napa-extra',
    brand: 'Napa Extra',
    generic: 'Paracetamol + Caffeine',
    company: 'Beximco Pharma',
    form: 'Tablet',
    bg: '#b30000',
    accent: '#ffd700',
    tabletColor: '#ffffff',
    shape: 'caplet',
    stripType: 'blister-strip',
  },
  {
    id: 'ace',
    brand: 'Ace',
    generic: 'Paracetamol 500 mg',
    company: 'Square Pharma',
    form: 'Tablet',
    bg: '#006837',
    accent: '#8dc63f',
    tabletColor: '#ffffff',
    shape: 'round',
    stripType: 'blister-strip',
  },
  {
    id: 'ace-plus',
    brand: 'Ace Plus',
    generic: 'Paracetamol + Caffeine',
    company: 'Square Pharma',
    form: 'Tablet',
    bg: '#990000',
    accent: '#ff6600',
    tabletColor: '#ffffff',
    shape: 'caplet',
    stripType: 'blister-strip',
  },
  {
    id: 'seclo',
    brand: 'Seclo 20',
    generic: 'Omeprazole 20 mg',
    company: 'Square Pharma',
    form: 'Capsule',
    bg: '#003366',
    accent: '#ffcc00',
    tabletColor: 'capsule-blue-yellow',
    shape: 'capsule',
    stripType: 'blister-strip',
  },
  {
    id: 'sergel',
    brand: 'Sergel 20',
    generic: 'Esomeprazole 20 mg',
    company: 'Healthcare Pharma',
    form: 'Tablet',
    bg: '#d94414',
    accent: '#ff9900',
    tabletColor: '#ffb380',
    shape: 'round',
    stripType: 'blister-strip',
  },
  {
    id: 'maxpro',
    brand: 'Maxpro 20',
    generic: 'Esomeprazole 20 mg',
    company: 'Square Pharma',
    form: 'Tablet',
    bg: '#4a154b',
    accent: '#b83280',
    tabletColor: '#f3e8ff',
    shape: 'round',
    stripType: 'blister-strip',
  },
  {
    id: 'pantonix',
    brand: 'Pantonix 20',
    generic: 'Pantoprazole 20 mg',
    company: 'Incepta Pharma',
    form: 'Tablet',
    bg: '#c5161d',
    accent: '#f9a01b',
    tabletColor: '#fff9c4',
    shape: 'oval',
    stripType: 'blister-strip',
  },
  {
    id: 'alatrol',
    brand: 'Alatrol',
    generic: 'Cetirizine 10 mg',
    company: 'Square Pharma',
    form: 'Tablet',
    bg: '#007a3d',
    accent: '#2bb673',
    tabletColor: '#ffffff',
    shape: 'small-round',
    stripType: 'blister-strip',
  },
  {
    id: 'fexo',
    brand: 'Fexo 120',
    generic: 'Fexofenadine 120 mg',
    company: 'Square Pharma',
    form: 'Tablet',
    bg: '#c2185b',
    accent: '#f06292',
    tabletColor: '#ffcdd2',
    shape: 'caplet',
    stripType: 'blister-strip',
  },
  {
    id: 'monas',
    brand: 'Monas 10',
    generic: 'Montelukast 10 mg',
    company: 'The ACME Labs',
    form: 'Chewable Tablet',
    bg: '#0d47a1',
    accent: '#42a5f5',
    tabletColor: '#ffe082',
    shape: 'rounded-square',
    stripType: 'blister-strip',
  },
  {
    id: 'ors',
    brand: 'ORS Saline',
    generic: 'Oral Rehydration Salts',
    company: 'SMC Enterprise',
    form: 'Sachet 500ml',
    bg: '#1b5e20',
    accent: '#66bb6a',
    tabletColor: '#ffffff',
    shape: 'sachet',
    stripType: 'packet',
  },
  {
    id: 'entacyd',
    brand: 'Entacyd',
    generic: 'Antacid Suspension',
    company: 'Square Pharma',
    form: 'Suspension / Chewable',
    bg: '#00695c',
    accent: '#26a69a',
    tabletColor: '#ffffff',
    shape: 'bottle',
    stripType: 'bottle',
  },
  {
    id: 'filwel-gold',
    brand: 'Filwel Gold',
    generic: '32 Vitamins & Minerals',
    company: 'Square Pharma',
    form: 'Tablet',
    bg: '#b8860b',
    accent: '#ffd700',
    tabletColor: '#d4af37',
    shape: 'caplet',
    stripType: 'blister-strip',
  },
  {
    id: 'coralcal-d',
    brand: 'Coralcal-D',
    generic: 'Coral Calcium + Vit D3',
    company: 'Radiant Pharma',
    form: 'Tablet',
    bg: '#d84315',
    accent: '#ff8a65',
    tabletColor: '#fff',
    shape: 'caplet',
    stripType: 'blister-strip',
  },
  {
    id: 'torax',
    brand: 'Torax 10',
    generic: 'Ketorolac 10 mg',
    company: 'Square Pharma',
    form: 'Tablet',
    bg: '#1565c0',
    accent: '#64b5f6',
    tabletColor: '#ffffff',
    shape: 'small-round',
    stripType: 'blister-strip',
  },
  {
    id: 'ciprocin',
    brand: 'Ciprocin 500',
    generic: 'Ciprofloxacin 500 mg',
    company: 'Square Pharma',
    form: 'Tablet',
    bg: '#283593',
    accent: '#5c6bc0',
    tabletColor: '#ffffff',
    shape: 'caplet',
    stripType: 'blister-strip',
  },
  {
    id: 'zithrox',
    brand: 'Zithrox 500',
    generic: 'Azithromycin 500 mg',
    company: 'Square Pharma',
    form: 'Tablet',
    bg: '#311b92',
    accent: '#7e57c2',
    tabletColor: '#ffffff',
    shape: 'caplet',
    stripType: 'blister-strip',
  },
  {
    id: 'motigut',
    brand: 'Motigut 10',
    generic: 'Domperidone 10 mg',
    company: 'Square Pharma',
    form: 'Tablet',
    bg: '#00838f',
    accent: '#4dd0e1',
    tabletColor: '#ffffff',
    shape: 'small-round',
    stripType: 'blister-strip',
  },
  {
    id: 'amodis',
    brand: 'Amodis 400',
    generic: 'Metronidazole 400 mg',
    company: 'Square Pharma',
    form: 'Tablet',
    bg: '#f57f17',
    accent: '#ffeb3b',
    tabletColor: '#fff59d',
    shape: 'round',
    stripType: 'blister-strip',
  },
  {
    id: 'viodin',
    brand: 'Viodin 10%',
    generic: 'Povidone Iodine',
    company: 'Square Pharma',
    form: 'Gargle / Solution',
    bg: '#4e342e',
    accent: '#8d6e63',
    tabletColor: '#3e2723',
    shape: 'bottle',
    stripType: 'bottle',
  },
  {
    id: 'clofenac',
    brand: 'Clofenac 50',
    generic: 'Diclofenac Sodium 50 mg',
    company: 'Square Pharma',
    form: 'Tablet',
    bg: '#b71c1c',
    accent: '#ef5350',
    tabletColor: '#ffab91',
    shape: 'small-round',
    stripType: 'blister-strip',
  },
  {
    id: 'moxacil',
    brand: 'Moxacil 500',
    generic: 'Amoxicillin 500 mg',
    company: 'Square Pharma',
    form: 'Capsule',
    bg: '#880e4f',
    accent: '#ec407a',
    tabletColor: 'capsule-red-yellow',
    shape: 'capsule',
    stripType: 'blister-strip',
  },
  {
    id: 'fast',
    brand: 'Fast 120',
    generic: 'Paracetamol Suppository',
    company: 'Square Pharma',
    form: 'Suppository',
    bg: '#0277bd',
    accent: '#4fc3f7',
    tabletColor: '#ffffff',
    shape: 'suppository',
    stripType: 'blister-strip',
  },
];

function generateSvg(med) {
  if (med.shape === 'bottle') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="bottle" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${med.bg}"/>
      <stop offset="50%" stop-color="${med.accent}"/>
      <stop offset="100%" stop-color="${med.bg}"/>
    </linearGradient>
    <linearGradient id="cap" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="3" dy="8" stdDeviation="6" flood-opacity="0.25"/>
    </filter>
  </defs>

  <rect width="100%" height="100%" fill="url(#bg)" rx="16"/>

  <!-- Bottle Group with Shadow -->
  <g filter="url(#shadow)" transform="translate(140, 25)">
    <!-- Cap -->
    <rect x="35" y="10" width="50" height="24" rx="4" fill="url(#cap)" stroke="#94a3b8" stroke-width="1.5"/>
    <line x1="42" y1="14" x2="42" y2="30" stroke="#94a3b8" stroke-width="1.5"/>
    <line x1="50" y1="14" x2="50" y2="30" stroke="#94a3b8" stroke-width="1.5"/>
    <line x1="60" y1="14" x2="60" y2="30" stroke="#94a3b8" stroke-width="1.5"/>
    <line x1="70" y1="14" x2="70" y2="30" stroke="#94a3b8" stroke-width="1.5"/>
    <line x1="78" y1="14" x2="78" y2="30" stroke="#94a3b8" stroke-width="1.5"/>

    <!-- Neck -->
    <rect x="42" y="34" width="36" height="18" fill="url(#bottle)"/>

    <!-- Body -->
    <path d="M 20 65 C 20 52 42 52 42 52 L 78 52 C 78 52 100 52 100 65 L 108 215 C 108 228 98 235 85 235 L 35 235 C 22 235 12 228 12 215 Z" fill="url(#bottle)"/>

    <!-- Label -->
    <rect x="18" y="90" width="84" height="110" rx="4" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"/>
    <rect x="18" y="90" width="84" height="12" fill="${med.bg}"/>
    <text x="60" y="125" font-family="Arial, sans-serif" font-size="14" font-weight="900" fill="${med.bg}" text-anchor="middle">${med.brand}</text>
    <text x="60" y="142" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#64748b" text-anchor="middle">${med.generic.split(' ')[0]}</text>
    <text x="60" y="160" font-family="Arial, sans-serif" font-size="7" fill="#0284c7" text-anchor="middle">SUSPENSION</text>
    <rect x="30" y="172" width="60" height="16" rx="3" fill="${med.accent}" opacity="0.2"/>
    <text x="60" y="183" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="${med.bg}" text-anchor="middle">${med.company}</text>
  </g>

  <!-- Product badge -->
  <g transform="translate(20, 20)">
    <rect width="90" height="24" rx="12" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"/>
    <circle cx="14" cy="12" r="5" fill="${med.accent}"/>
    <text x="26" y="16" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#334155">${med.form}</text>
  </g>
</svg>`;
  }

  if (med.shape === 'sachet') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0fdf4"/>
      <stop offset="100%" stop-color="#dcfce7"/>
    </linearGradient>
    <linearGradient id="foil" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#15803d"/>
      <stop offset="50%" stop-color="#16a34a"/>
      <stop offset="100%" stop-color="#14532d"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="3" dy="8" stdDeviation="6" flood-opacity="0.25"/>
    </filter>
  </defs>

  <rect width="100%" height="100%" fill="url(#bg)" rx="16"/>

  <!-- Sachet Group -->
  <g filter="url(#shadow)" transform="translate(100, 30)">
    <rect width="200" height="240" rx="8" fill="url(#foil)"/>
    <!-- Top & Bottom Crimps -->
    <rect width="200" height="15" fill="#14532d" opacity="0.6"/>
    <rect y="225" width="200" height="15" fill="#14532d" opacity="0.6"/>
    <line x1="0" y1="15" x2="200" y2="15" stroke="#ffffff" stroke-dasharray="2 3" opacity="0.4"/>
    <line x1="0" y1="225" x2="200" y2="225" stroke="#ffffff" stroke-dasharray="2 3" opacity="0.4"/>

    <!-- Center White Badge -->
    <rect x="20" y="35" width="160" height="170" rx="6" fill="#ffffff"/>
    <circle cx="100" cy="65" r="20" fill="#eab308"/>
    <text x="100" y="70" font-family="Arial, sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">SMC</text>
    <text x="100" y="105" font-family="Arial, sans-serif" font-size="20" font-weight="900" fill="#166534" text-anchor="middle">ORS Saline</text>
    <text x="100" y="125" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0284c7" text-anchor="middle">Oral Rehydration Salts</text>
    <text x="100" y="145" font-family="Arial, sans-serif" font-size="10" fill="#475569" text-anchor="middle">৫০০ মি.লি. পানির জন্য</text>
    <rect x="35" y="160" width="130" height="28" rx="4" fill="#fef3c7"/>
    <text x="100" y="177" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#92400e" text-anchor="middle">WHO Recommended</text>
  </g>
</svg>`;
  }

  // Standard Blister Pack Rendering with Realistic 3D Tablets / Capsules
  let tabletsSvg = '';

  if (med.shape === 'capsule') {
    const isRedYellow = med.tabletColor === 'capsule-red-yellow';
    const c1 = isRedYellow ? '#b91c1c' : '#1e3a8a';
    const c2 = isRedYellow ? '#facc15' : '#fbbf24';

    tabletsSvg = `
      <!-- Row 1 -->
      <g transform="translate(50, 45)">
        <rect width="65" height="24" rx="12" fill="${c1}" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"/>
        <rect x="32" width="33" height="24" rx="12" fill="${c2}"/>
        <rect x="32" width="4" height="24" fill="#000" opacity="0.15"/>
        <ellipse cx="20" cy="8" rx="8" ry="3" fill="#fff" opacity="0.4"/>
      </g>
      <g transform="translate(145, 45)">
        <rect width="65" height="24" rx="12" fill="${c1}" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"/>
        <rect x="32" width="33" height="24" rx="12" fill="${c2}"/>
        <rect x="32" width="4" height="24" fill="#000" opacity="0.15"/>
        <ellipse cx="20" cy="8" rx="8" ry="3" fill="#fff" opacity="0.4"/>
      </g>
      <!-- Row 2 -->
      <g transform="translate(50, 95)">
        <rect width="65" height="24" rx="12" fill="${c1}" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"/>
        <rect x="32" width="33" height="24" rx="12" fill="${c2}"/>
        <rect x="32" width="4" height="24" fill="#000" opacity="0.15"/>
        <ellipse cx="20" cy="8" rx="8" ry="3" fill="#fff" opacity="0.4"/>
      </g>
      <g transform="translate(145, 95)">
        <rect width="65" height="24" rx="12" fill="${c1}" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"/>
        <rect x="32" width="33" height="24" rx="12" fill="${c2}"/>
        <rect x="32" width="4" height="24" fill="#000" opacity="0.15"/>
        <ellipse cx="20" cy="8" rx="8" ry="3" fill="#fff" opacity="0.4"/>
      </g>
      <!-- Row 3 -->
      <g transform="translate(50, 145)">
        <rect width="65" height="24" rx="12" fill="${c1}" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"/>
        <rect x="32" width="33" height="24" rx="12" fill="${c2}"/>
        <rect x="32" width="4" height="24" fill="#000" opacity="0.15"/>
        <ellipse cx="20" cy="8" rx="8" ry="3" fill="#fff" opacity="0.4"/>
      </g>
      <g transform="translate(145, 145)">
        <rect width="65" height="24" rx="12" fill="${c1}" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"/>
        <rect x="32" width="33" height="24" rx="12" fill="${c2}"/>
        <rect x="32" width="4" height="24" fill="#000" opacity="0.15"/>
        <ellipse cx="20" cy="8" rx="8" ry="3" fill="#fff" opacity="0.4"/>
      </g>
    `;
  } else if (med.shape === 'caplet') {
    tabletsSvg = `
      <g transform="translate(45, 45)">
        <rect width="75" height="26" rx="13" fill="${med.tabletColor}" stroke="#e2e8f0" stroke-width="1" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.25))"/>
        <line x1="82" y1="46" x2="82" y2="70" stroke="#cbd5e1" stroke-width="1.5"/>
        <ellipse cx="75" cy="52" rx="14" ry="4" fill="#fff" opacity="0.6"/>
      </g>
      <g transform="translate(140, 45)">
        <rect width="75" height="26" rx="13" fill="${med.tabletColor}" stroke="#e2e8f0" stroke-width="1" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.25))"/>
        <line x1="177" y1="46" x2="177" y2="70" stroke="#cbd5e1" stroke-width="1.5"/>
        <ellipse cx="170" cy="52" rx="14" ry="4" fill="#fff" opacity="0.6"/>
      </g>
      <g transform="translate(45, 95)">
        <rect width="75" height="26" rx="13" fill="${med.tabletColor}" stroke="#e2e8f0" stroke-width="1" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.25))"/>
        <line x1="82" y1="96" x2="82" y2="120" stroke="#cbd5e1" stroke-width="1.5"/>
        <ellipse cx="75" cy="102" rx="14" ry="4" fill="#fff" opacity="0.6"/>
      </g>
      <g transform="translate(140, 95)">
        <rect width="75" height="26" rx="13" fill="${med.tabletColor}" stroke="#e2e8f0" stroke-width="1" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.25))"/>
        <line x1="177" y1="96" x2="177" y2="120" stroke="#cbd5e1" stroke-width="1.5"/>
        <ellipse cx="170" cy="102" rx="14" ry="4" fill="#fff" opacity="0.6"/>
      </g>
      <g transform="translate(45, 145)">
        <rect width="75" height="26" rx="13" fill="${med.tabletColor}" stroke="#e2e8f0" stroke-width="1" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.25))"/>
        <line x1="82" y1="146" x2="82" y2="170" stroke="#cbd5e1" stroke-width="1.5"/>
        <ellipse cx="75" cy="152" rx="14" ry="4" fill="#fff" opacity="0.6"/>
      </g>
      <g transform="translate(140, 145)">
        <rect width="75" height="26" rx="13" fill="${med.tabletColor}" stroke="#e2e8f0" stroke-width="1" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.25))"/>
        <line x1="177" y1="146" x2="177" y2="170" stroke="#cbd5e1" stroke-width="1.5"/>
        <ellipse cx="170" cy="152" rx="14" ry="4" fill="#fff" opacity="0.6"/>
      </g>
    `;
  } else {
    // Round tablets
    tabletsSvg = `
      <g transform="translate(55, 45)">
        <circle cx="20" cy="20" r="18" fill="${med.tabletColor}" stroke="#e2e8f0" stroke-width="1" filter="drop-shadow(0 3px 4px rgba(0,0,0,0.25))"/>
        <circle cx="20" cy="20" r="14" fill="none" stroke="#cbd5e1" stroke-width="0.8"/>
        <line x1="10" y1="20" x2="30" y2="20" stroke="#cbd5e1" stroke-width="1.2"/>
        <ellipse cx="16" cy="14" rx="6" ry="3" fill="#fff" opacity="0.6"/>
      </g>
      <g transform="translate(110, 45)">
        <circle cx="20" cy="20" r="18" fill="${med.tabletColor}" stroke="#e2e8f0" stroke-width="1" filter="drop-shadow(0 3px 4px rgba(0,0,0,0.25))"/>
        <circle cx="20" cy="20" r="14" fill="none" stroke="#cbd5e1" stroke-width="0.8"/>
        <line x1="10" y1="20" x2="30" y2="20" stroke="#cbd5e1" stroke-width="1.2"/>
        <ellipse cx="16" cy="14" rx="6" ry="3" fill="#fff" opacity="0.6"/>
      </g>
      <g transform="translate(165, 45)">
        <circle cx="20" cy="20" r="18" fill="${med.tabletColor}" stroke="#e2e8f0" stroke-width="1" filter="drop-shadow(0 3px 4px rgba(0,0,0,0.25))"/>
        <circle cx="20" cy="20" r="14" fill="none" stroke="#cbd5e1" stroke-width="0.8"/>
        <line x1="10" y1="20" x2="30" y2="20" stroke="#cbd5e1" stroke-width="1.2"/>
        <ellipse cx="16" cy="14" rx="6" ry="3" fill="#fff" opacity="0.6"/>
      </g>
      <g transform="translate(55, 95)">
        <circle cx="20" cy="20" r="18" fill="${med.tabletColor}" stroke="#e2e8f0" stroke-width="1" filter="drop-shadow(0 3px 4px rgba(0,0,0,0.25))"/>
        <circle cx="20" cy="20" r="14" fill="none" stroke="#cbd5e1" stroke-width="0.8"/>
        <line x1="10" y1="20" x2="30" y2="20" stroke="#cbd5e1" stroke-width="1.2"/>
        <ellipse cx="16" cy="14" rx="6" ry="3" fill="#fff" opacity="0.6"/>
      </g>
      <g transform="translate(110, 95)">
        <circle cx="20" cy="20" r="18" fill="${med.tabletColor}" stroke="#e2e8f0" stroke-width="1" filter="drop-shadow(0 3px 4px rgba(0,0,0,0.25))"/>
        <circle cx="20" cy="20" r="14" fill="none" stroke="#cbd5e1" stroke-width="0.8"/>
        <line x1="10" y1="20" x2="30" y2="20" stroke="#cbd5e1" stroke-width="1.2"/>
        <ellipse cx="16" cy="14" rx="6" ry="3" fill="#fff" opacity="0.6"/>
      </g>
      <g transform="translate(165, 95)">
        <circle cx="20" cy="20" r="18" fill="${med.tabletColor}" stroke="#e2e8f0" stroke-width="1" filter="drop-shadow(0 3px 4px rgba(0,0,0,0.25))"/>
        <circle cx="20" cy="20" r="14" fill="none" stroke="#cbd5e1" stroke-width="0.8"/>
        <line x1="10" y1="20" x2="30" y2="20" stroke="#cbd5e1" stroke-width="1.2"/>
        <ellipse cx="16" cy="14" rx="6" ry="3" fill="#fff" opacity="0.6"/>
      </g>
      <g transform="translate(55, 145)">
        <circle cx="20" cy="20" r="18" fill="${med.tabletColor}" stroke="#e2e8f0" stroke-width="1" filter="drop-shadow(0 3px 4px rgba(0,0,0,0.25))"/>
        <circle cx="20" cy="20" r="14" fill="none" stroke="#cbd5e1" stroke-width="0.8"/>
        <line x1="10" y1="20" x2="30" y2="20" stroke="#cbd5e1" stroke-width="1.2"/>
        <ellipse cx="16" cy="14" rx="6" ry="3" fill="#fff" opacity="0.6"/>
      </g>
      <g transform="translate(110, 145)">
        <circle cx="20" cy="20" r="18" fill="${med.tabletColor}" stroke="#e2e8f0" stroke-width="1" filter="drop-shadow(0 3px 4px rgba(0,0,0,0.25))"/>
        <circle cx="20" cy="20" r="14" fill="none" stroke="#cbd5e1" stroke-width="0.8"/>
        <line x1="10" y1="20" x2="30" y2="20" stroke="#cbd5e1" stroke-width="1.2"/>
        <ellipse cx="16" cy="14" rx="6" ry="3" fill="#fff" opacity="0.6"/>
      </g>
      <g transform="translate(165, 145)">
        <circle cx="20" cy="20" r="18" fill="${med.tabletColor}" stroke="#e2e8f0" stroke-width="1" filter="drop-shadow(0 3px 4px rgba(0,0,0,0.25))"/>
        <circle cx="20" cy="20" r="14" fill="none" stroke="#cbd5e1" stroke-width="0.8"/>
        <line x1="10" y1="20" x2="30" y2="20" stroke="#cbd5e1" stroke-width="1.2"/>
        <ellipse cx="16" cy="14" rx="6" ry="3" fill="#fff" opacity="0.6"/>
      </g>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="foil" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f1f5f9"/>
      <stop offset="50%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${med.bg}"/>
      <stop offset="100%" stop-color="${med.accent}"/>
    </linearGradient>
    <filter id="packShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="4" dy="8" stdDeviation="7" flood-opacity="0.22"/>
    </filter>
  </defs>

  <rect width="100%" height="100%" fill="url(#bg)" rx="16"/>

  <!-- Blister Strip Pack -->
  <g filter="url(#packShadow)" transform="translate(70, 25)">
    <!-- Silver Foil Backing -->
    <rect width="260" height="250" rx="12" fill="url(#foil)" stroke="#cbd5e1" stroke-width="1.5"/>

    <!-- Brand Header Ribbon -->
    <path d="M 0 12 C 0 5 5 0 12 0 L 248 0 C 255 0 260 5 260 12 L 260 45 L 0 45 Z" fill="url(#brandGrad)"/>
    <text x="16" y="28" font-family="Arial, sans-serif" font-size="16" font-weight="900" fill="#ffffff" letter-spacing="0.5">${med.brand}</text>
    <text x="245" y="27" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="end" opacity="0.9">${med.company}</text>

    <!-- Generic name bar -->
    <rect y="45" width="260" height="18" fill="#ffffff" opacity="0.9"/>
    <text x="16" y="57" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#475569">${med.generic}</text>

    <!-- Embossed Grid Texture Lines -->
    <line x1="30" y1="70" x2="30" y2="240" stroke="#cbd5e1" stroke-dasharray="2 3" opacity="0.5"/>
    <line x1="130" y1="70" x2="130" y2="240" stroke="#cbd5e1" stroke-dasharray="2 3" opacity="0.5"/>
    <line x1="230" y1="70" x2="230" y2="240" stroke="#cbd5e1" stroke-dasharray="2 3" opacity="0.5"/>

    <!-- 3D Realistic Tablets inside blisters -->
    <g transform="translate(0, 30)">
      ${tabletsSvg}
    </g>

    <!-- Footer DGDA BD mark -->
    <rect y="225" width="260" height="25" rx="0 0 12 12" fill="#ffffff" opacity="0.9"/>
    <text x="16" y="241" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#0f766e">✓ DGDA Bangladesh Approved</text>
    <text x="245" y="241" font-family="Arial, sans-serif" font-size="8" fill="#64748b" text-anchor="end">${med.form}</text>
  </g>

  <!-- Form Badge -->
  <g transform="translate(16, 16)">
    <rect width="84" height="24" rx="12" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"/>
    <circle cx="12" cy="12" r="4.5" fill="${med.bg}"/>
    <text x="22" y="16" font-family="Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#334155">${med.form}</text>
  </g>
</svg>`;
}

medicines.forEach((med) => {
  const svg = generateSvg(med);
  const filePath = path.join(outDir, `${med.id}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Generated: ${med.id}.svg`);
});

console.log('All authentic medicine images generated successfully!');
