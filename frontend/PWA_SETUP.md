# PWA Configuration for AIRA

This document describes the Progressive Web App (PWA) implementation for AIRA.

## Features Implemented

### 1. Web App Manifest (`/public/manifest.json`)
- **App Name**: AIRA - AI Trading Platform
- **Display Mode**: Standalone (hides browser UI)
- **Theme Colors**: 
  - Background: `#0f172a` (slate-900)
  - Theme: `#3b82f6` (blue-600)
- **Icons**: Multiple sizes from 72x72 to 512x512
- **Maskable Icons**: Android adaptive icon support (192x192, 512x512)
- **Shortcuts**: Quick access to Dashboard and Strategies
- **Categories**: Finance, Productivity

### 2. Service Worker (`/public/sw.js`)
Implements offline-first caching strategy:
- **Precaching**: Essential pages (/, /login, /signup, /offline)
- **Runtime Caching**: API responses and static assets
- **Network Strategies**:
  - API calls: Network-first with cache fallback
  - Static assets: Cache-first with network fallback
- **Push Notifications**: Support for trade alerts
- **Background Sync**: Offline action synchronization

### 3. App Icons
Generated SVG icons in multiple sizes:
- Standard icons: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- Maskable icons: 192x192, 512x512 (with safe zone padding)

**Note**: SVG icons are used for development. For production, convert to PNG:
```bash
# Using ImageMagick
convert icon-512x512.svg -resize 512x512 icon-512x512.png

# Or use online tools:
# - cloudconvert.com
# - convertio.co
```

### 4. Splash Screens
iOS splash screen configured for various device sizes:
- iPhone 14 Pro Max, 14 Pro, 14 Plus, 14
- iPhone 13 Pro Max, 13 Pro, 13, 13 mini
- iPhone 12 Pro Max, 12 Pro, 12, 12 mini
- iPhone 11 Pro Max, 11 Pro, 11
- iPhone XS Max, XS, XR, X
- iPhone 8 Plus, 8, 7 Plus, 7, 6s Plus, 6s
- iPhone SE

### 5. Install Prompt Component
`PWAInstallPrompt` component features:
- Auto-displays after 3 seconds on first visit
- Dismissible with "Not Now" option
- Remembers user preference (localStorage)
- Responsive design (mobile and desktop)
- Only shows on supported browsers

### 6. PWA Hook (`usePWA`)
Custom React hook providing:
- Installation status detection
- Online/offline status monitoring
- Service worker registration
- Notification permission handling
- Push notification subscription

### 7. PWA Status Component
Visual indicators for:
- Online/Offline status (green/red badge)
- App installation status (blue badge)
- Responsive display (hides text on small screens)

## Installation

### For Users

#### Desktop (Chrome, Edge, Brave)
1. Visit the AIRA website
2. Look for the install icon in the address bar
3. Click "Install" in the prompt
4. App will be added to your applications

#### Mobile (Android)
1. Visit the AIRA website
2. Tap the menu (⋮) in Chrome
3. Select "Add to Home screen"
4. Confirm installation
5. App icon appears on home screen

#### Mobile (iOS)
1. Visit the AIRA website in Safari
2. Tap the Share button
3. Scroll and tap "Add to Home Screen"
4. Confirm and add
5. App icon appears on home screen

### For Developers

1. **Service Worker Registration**
   - Automatically registered in `usePWA` hook
   - Runs on all pages via root layout

2. **Testing PWA**
   ```bash
   # Build for production
   npm run build
   
   # Start production server
   npm start
   
   # Open in browser
   # Chrome DevTools > Application > Manifest
   # Chrome DevTools > Application > Service Workers
   ```

3. **Testing Offline Mode**
   - Open Chrome DevTools
   - Go to Network tab
   - Select "Offline" from throttling dropdown
   - Reload page - should show cached content

4. **Lighthouse Audit**
   ```bash
   # Run Lighthouse PWA audit
   # Chrome DevTools > Lighthouse > Progressive Web App
   ```

## Offline Capabilities

### Cached Content
- Landing page
- Login/Signup pages
- Offline fallback page
- App icons and manifest
- Previously visited pages (runtime cache)

### Online-Only Features
- Real-time market data
- Trade execution
- WebSocket connections
- API calls (with cache fallback)

### Offline Fallback
When offline and navigating to uncached pages:
- Shows `/offline` page
- Explains offline status
- Lists available offline features
- Provides "Try Again" button

## Push Notifications

### Setup Required
1. Generate VAPID keys for push notifications
2. Add to environment variables:
   ```env
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
   ```

### Usage
```typescript
import { usePWA } from '@/hooks/usePWA';

function MyComponent() {
  const { requestNotificationPermission, subscribeToPush } = usePWA();
  
  const enableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      const subscription = await subscribeToPush();
      // Send subscription to backend
    }
  };
}
```

## Browser Support

### Full PWA Support
- Chrome 67+ (Desktop & Android)
- Edge 79+
- Samsung Internet 8.2+
- Opera 54+

### Partial Support (iOS)
- Safari 11.3+ (iOS)
- Limited service worker features
- No push notifications
- Add to Home Screen supported

### No PWA Support
- Firefox (limited)
- Internet Explorer

## Performance Optimizations

1. **Lazy Loading**: Service worker loads in background
2. **Cache Strategy**: Optimized for fast load times
3. **Precaching**: Only essential pages cached on install
4. **Runtime Caching**: Dynamic content cached as needed
5. **Cache Expiration**: Old caches cleaned on activation

## Security Considerations

1. **HTTPS Required**: PWA only works on HTTPS
2. **Scope**: Service worker scoped to root (`/`)
3. **Cache Security**: No sensitive data in cache
4. **API Tokens**: Not cached, always fetched fresh
5. **User Data**: Stored in secure backend, not in cache

## Maintenance

### Updating Service Worker
1. Modify `/public/sw.js`
2. Update `CACHE_NAME` version
3. Deploy changes
4. Users will get update on next visit
5. Old caches automatically cleaned

### Updating Manifest
1. Modify `/public/manifest.json`
2. Deploy changes
3. Users may need to reinstall for changes

### Updating Icons
1. Replace icons in `/public/icons/`
2. Keep same filenames and sizes
3. Update manifest if changing formats
4. Clear browser cache for testing

## Testing Checklist

- [ ] Manifest loads without errors
- [ ] Service worker registers successfully
- [ ] Install prompt appears on supported browsers
- [ ] App installs and launches in standalone mode
- [ ] Icons display correctly on home screen
- [ ] Splash screen shows on iOS
- [ ] Offline page displays when offline
- [ ] Cached pages load offline
- [ ] Online/offline status updates correctly
- [ ] Push notifications work (if enabled)
- [ ] Theme colors apply to browser UI
- [ ] Shortcuts work (if supported)

## Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Ensure HTTPS is enabled
- Verify `/sw.js` is accessible
- Clear browser cache and reload

### Install Prompt Not Showing
- Check if already installed
- Verify manifest is valid
- Ensure all required fields present
- Check browser support

### Icons Not Displaying
- Verify icon paths in manifest
- Check icon files exist
- Ensure correct sizes and formats
- Clear browser cache

### Offline Mode Not Working
- Check service worker is active
- Verify cache strategy in sw.js
- Test with Chrome DevTools offline mode
- Check console for cache errors

## Resources

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Maskable.app](https://maskable.app/) - Test maskable icons
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - PWA audit tool

## Future Enhancements

- [ ] Background sync for offline trades
- [ ] Periodic background sync for data updates
- [ ] Web Share API integration
- [ ] File handling for strategy imports
- [ ] Badging API for unread notifications
- [ ] Install promotion based on user engagement
- [ ] A/B testing for install prompts
- [ ] Analytics for PWA usage metrics
