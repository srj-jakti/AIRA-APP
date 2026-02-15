import fs from 'fs';
import path from 'path';

describe('PWA Configuration', () => {
  describe('Manifest', () => {
    let manifest: any;

    beforeAll(() => {
      const manifestPath = path.join(__dirname, '../../public/manifest.json');
      const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
      manifest = JSON.parse(manifestContent);
    });

    it('should have required fields', () => {
      expect(manifest.name).toBe('AIRA - AI Trading Platform');
      expect(manifest.short_name).toBe('AIRA');
      expect(manifest.start_url).toBe('/');
      expect(manifest.display).toBe('standalone');
      expect(manifest.theme_color).toBe('#3b82f6');
      expect(manifest.background_color).toBe('#0f172a');
    });

    it('should include all required icon sizes', () => {
      const requiredSizes = ['72x72', '96x96', '128x128', '144x144', '152x152', '192x192', '384x384', '512x512'];
      const iconSizes = manifest.icons
        .filter((icon: any) => icon.purpose === 'any')
        .map((icon: any) => icon.sizes);

      requiredSizes.forEach(size => {
        expect(iconSizes).toContain(size);
      });
    });

    it('should include maskable icons', () => {
      const maskableIcons = manifest.icons.filter((icon: any) => icon.purpose === 'maskable');
      expect(maskableIcons.length).toBeGreaterThanOrEqual(2);
      
      const maskableSizes = maskableIcons.map((icon: any) => icon.sizes);
      expect(maskableSizes).toContain('192x192');
      expect(maskableSizes).toContain('512x512');
    });

    it('should have proper categories', () => {
      expect(manifest.categories).toContain('finance');
      expect(manifest.categories).toContain('productivity');
    });

    it('should have shortcuts', () => {
      expect(manifest.shortcuts).toBeDefined();
      expect(manifest.shortcuts.length).toBeGreaterThan(0);
    });
  });

  describe('Service Worker', () => {
    let swContent: string;

    beforeAll(() => {
      const swPath = path.join(__dirname, '../../public/sw.js');
      swContent = fs.readFileSync(swPath, 'utf-8');
    });

    it('should exist', () => {
      expect(swContent).toBeDefined();
      expect(swContent.length).toBeGreaterThan(0);
    });

    it('should have cache names defined', () => {
      expect(swContent).toContain('CACHE_NAME');
      expect(swContent).toContain('RUNTIME_CACHE');
    });

    it('should have install event listener', () => {
      expect(swContent).toContain("addEventListener('install'");
    });

    it('should have activate event listener', () => {
      expect(swContent).toContain("addEventListener('activate'");
    });

    it('should have fetch event listener', () => {
      expect(swContent).toContain("addEventListener('fetch'");
    });

    it('should have push notification support', () => {
      expect(swContent).toContain("addEventListener('push'");
    });

    it('should precache essential pages', () => {
      expect(swContent).toContain('/login');
      expect(swContent).toContain('/signup');
      expect(swContent).toContain('/offline');
    });
  });

  describe('Icons', () => {
    const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
    const maskableSizes = [192, 512];

    iconSizes.forEach(size => {
      it(`should have ${size}x${size} icon`, () => {
        const iconPath = path.join(__dirname, `../../public/icons/icon-${size}x${size}.svg`);
        expect(fs.existsSync(iconPath)).toBe(true);
      });
    });

    maskableSizes.forEach(size => {
      it(`should have ${size}x${size} maskable icon`, () => {
        const iconPath = path.join(__dirname, `../../public/icons/icon-maskable-${size}x${size}.svg`);
        expect(fs.existsSync(iconPath)).toBe(true);
      });
    });
  });

  describe('Splash Screen', () => {
    it('should have splash screen', () => {
      const splashPath = path.join(__dirname, '../../public/splash/splash-640x1136.svg');
      expect(fs.existsSync(splashPath)).toBe(true);
    });
  });
});
