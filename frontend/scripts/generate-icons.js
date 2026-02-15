const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes to generate
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const maskableSizes = [192, 512];

// Generate SVG icon template
function generateSVG(size, isMaskable = false) {
  const padding = isMaskable ? size * 0.2 : 0; // 20% padding for maskable icons
  const innerSize = size - (padding * 2);
  const fontSize = innerSize * 0.35;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="#3b82f6" rx="${size * 0.15}"/>
  
  <!-- Safe zone for maskable (if applicable) -->
  ${isMaskable ? `<rect x="${padding}" y="${padding}" width="${innerSize}" height="${innerSize}" fill="#2563eb" rx="${innerSize * 0.1}"/>` : ''}
  
  <!-- AIRA Text -->
  <text 
    x="${size / 2}" 
    y="${size / 2 + fontSize * 0.35}" 
    font-family="Arial, sans-serif" 
    font-size="${fontSize}" 
    font-weight="bold" 
    fill="white" 
    text-anchor="middle"
  >AIRA</text>
  
  <!-- AI Symbol (circuit pattern) -->
  <g transform="translate(${size / 2}, ${size * 0.25})">
    <circle cx="0" cy="0" r="${size * 0.04}" fill="white" opacity="0.9"/>
    <circle cx="${size * 0.08}" cy="0" r="${size * 0.025}" fill="white" opacity="0.7"/>
    <circle cx="${-size * 0.08}" cy="0" r="${size * 0.025}" fill="white" opacity="0.7"/>
    <line x1="0" y1="0" x2="${size * 0.08}" y2="0" stroke="white" stroke-width="${size * 0.01}" opacity="0.7"/>
    <line x1="0" y1="0" x2="${-size * 0.08}" y2="0" stroke="white" stroke-width="${size * 0.01}" opacity="0.7"/>
  </g>
  
  <!-- Trading Chart Symbol -->
  <g transform="translate(${size / 2}, ${size * 0.75})">
    <polyline 
      points="${-size * 0.1},${size * 0.03} ${-size * 0.05},${-size * 0.02} 0,${size * 0.01} ${size * 0.05},${-size * 0.03} ${size * 0.1},${size * 0.02}"
      fill="none"
      stroke="white"
      stroke-width="${size * 0.015}"
      opacity="0.8"
    />
  </g>
</svg>`;
}

// Convert SVG to PNG using a simple approach (creates SVG files that browsers will render)
// For production, you'd want to use a proper image conversion library
function createIcon(size, isMaskable = false) {
  const svg = generateSVG(size, isMaskable);
  const filename = isMaskable 
    ? `icon-maskable-${size}x${size}.svg`
    : `icon-${size}x${size}.svg`;
  
  const filepath = path.join(iconsDir, filename);
  fs.writeFileSync(filepath, svg);
  console.log(`Created ${filename}`);
}

// Generate all icons
console.log('Generating PWA icons...');

// Regular icons
sizes.forEach(size => createIcon(size, false));

// Maskable icons
maskableSizes.forEach(size => createIcon(size, true));

console.log('\n✓ All icons generated successfully!');
console.log('\nNote: SVG icons have been created. For production, convert these to PNG format.');
console.log('You can use tools like:');
console.log('  - ImageMagick: convert icon.svg -resize 512x512 icon.png');
console.log('  - Online converters: cloudconvert.com, convertio.co');
console.log('  - Design tools: Figma, Adobe Illustrator, Inkscape\n');
