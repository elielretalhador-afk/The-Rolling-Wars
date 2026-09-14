const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const logoPath = path.join(rootDir, 'public', 'Icone-oficial.png');

if (!fs.existsSync(logoPath)) {
  console.error('Logo file not found:', logoPath);
  process.exit(0);
}

console.log('Generating icons from:', logoPath);

// Generate web / PWA icons
try {
  execSync(`convert "${logoPath}" -resize 150x150 -background "#080B0E" -gravity center -extent 192x192 "${path.join(rootDir, 'public', 'icon-192.png')}"`);
  execSync(`convert "${logoPath}" -resize 400x400 -background "#080B0E" -gravity center -extent 512x512 "${path.join(rootDir, 'public', 'icon-512.png')}"`);
  execSync(`convert "${logoPath}" -resize 140x140 -background "#080B0E" -gravity center -extent 180x180 "${path.join(rootDir, 'public', 'apple-touch-icon.png')}"`);
  execSync(`convert "${logoPath}" -resize 40x40 -background "#080B0E" -gravity center -extent 48x48 "${path.join(rootDir, 'public', 'favicon.ico')}"`);
  
  // SVG wrapper containing the base64 logo
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');
  const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#080B0E" rx="80"/>
  <image href="data:image/png;base64,${logoBase64}" x="56" y="56" width="400" height="400"/>
</svg>
`;
  fs.writeFileSync(path.join(rootDir, 'public', 'icon.svg'), svgContent);
  console.log('Web/PWA icons generated successfully.');
} catch (e) {
  console.error('Error generating web icons:', e.message);
}

const DENSITIES = [
  { name: 'mdpi', size: 48, fgSize: 108, fgLogo: 72 },
  { name: 'hdpi', size: 72, fgSize: 162, fgLogo: 108 },
  { name: 'xhdpi', size: 96, fgSize: 216, fgLogo: 144 },
  { name: 'xxhdpi', size: 144, fgSize: 324, fgLogo: 216 },
  { name: 'xxxhdpi', size: 192, fgSize: 432, fgLogo: 288 },
];

function generateIconsForRes(resDir) {
  if (!fs.existsSync(resDir)) return;
  console.log('Generating Android icons for:', resDir);

  for (const d of DENSITIES) {
    const dir = path.join(resDir, `mipmap-${d.name}`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const logoInnerSize = Math.round(d.size * 0.75);
    const roundInnerSize = Math.round(d.size * 0.70);
    const radius = Math.round(d.size / 2);

    // Standard square launcher
    execSync(`convert "${logoPath}" -resize ${logoInnerSize}x${logoInnerSize} -background "#080B0E" -gravity center -extent ${d.size}x${d.size} "${path.join(dir, 'ic_launcher.png')}"`);

    // Round launcher
    execSync(`convert -size ${d.size}x${d.size} xc:none -fill "#080B0E" -draw "circle ${radius},${radius} ${radius},1" \\( "${logoPath}" -resize ${roundInnerSize}x${roundInnerSize} \\) -gravity center -composite "${path.join(dir, 'ic_launcher_round.png')}"`);

    // Foreground for adaptive icons (transparent background, safe centered logo)
    execSync(`convert -size ${d.fgSize}x${d.fgSize} xc:none \\( "${logoPath}" -resize ${d.fgLogo}x${d.fgLogo} \\) -gravity center -composite "${path.join(dir, 'ic_launcher_foreground.png')}"`);
  }

  // Update background color in values/ic_launcher_background.xml
  const valuesDir = path.join(resDir, 'values');
  if (fs.existsSync(valuesDir)) {
    const bgXmlPath = path.join(valuesDir, 'ic_launcher_background.xml');
    fs.writeFileSync(bgXmlPath, `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#080B0E</color>
</resources>
`);
  }

  // Remove default vector foreground in drawable-v24 so adaptive icons use the actual raster logo
  const drawableBg = path.join(resDir, "drawable", "ic_launcher_background.xml");
  if (fs.existsSync(drawableBg)) { try { fs.unlinkSync(drawableBg); } catch (_) {} }
  const drawableV24 = path.join(resDir, 'drawable-v24', 'ic_launcher_foreground.xml');
  if (fs.existsSync(drawableV24)) {
    try {
      fs.unlinkSync(drawableV24);
    } catch (_) {}
  }
}

// 1. Generate for existing android project if present
const androidRes = path.join(rootDir, 'android', 'app', 'src', 'main', 'res');
if (fs.existsSync(androidRes)) {
  try {
    generateIconsForRes(androidRes);
  } catch (e) {
    console.error('Error writing to android/res:', e.message);
  }
}

// 2. Patch template archive so npx cap add android inherits the new icons
const templateTar = path.join(rootDir, 'node_modules', '@capacitor', 'cli', 'assets', 'android-template.tar.gz');
if (fs.existsSync(templateTar)) {
  try {
    const tmpDir = path.join('/tmp', 'cap_template_' + Date.now());
    fs.mkdirSync(tmpDir, { recursive: true });
    execSync(`tar -xzf "${templateTar}" -C "${tmpDir}"`);

    const templateRes = path.join(tmpDir, 'app', 'src', 'main', 'res');
    generateIconsForRes(templateRes);

    // Re-archive the template
    execSync(`tar -czf "${templateTar}" -C "${tmpDir}" .`);
    execSync(`rm -rf "${tmpDir}"`);
    console.log('Capacitor android-template.tar.gz patched successfully!');
  } catch (e) {
    console.error('Error patching capacitor template:', e.message);
  }
}

console.log('All icons generation completed.');
