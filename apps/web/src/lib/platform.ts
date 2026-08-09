/**
 * App ID from App Store Connect. The URL is intentionally storefront-agnostic
 * (no `/id/` or `/us/` segment) so Apple redirects each visitor to their own
 * storefront. Keep in sync with `apps/landing/src/i18n/utils.ts` and the
 * `apple-itunes-app` meta tag in `index.html`.
 */
export const APP_STORE_ID = '6794289301';
export const APP_STORE_URL = `https://apps.apple.com/app/id${APP_STORE_ID}`;

const BANNER_DISMISSED_KEY = 'rinciku-app-banner-dismissed';

/** True on iPhone/iPad, including iPadOS 13+ which reports a Mac user agent. */
export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
  );
}

/** True when running as an installed PWA rather than inside a browser tab. */
function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // Safari's non-standard flag for home-screen web apps.
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/**
 * Whether to nudge this visitor toward the native iOS app.
 *
 * Deliberately narrow: only iOS browser users, and only until they dismiss it.
 * Android is excluded because there is no Android app yet — telling someone
 * about software they can't install is noise, not information. Installed PWA
 * users are excluded too; they already chose an app-like experience.
 */
export function shouldShowAppBanner(): boolean {
  if (!isIOS() || isStandalone()) return false;
  try {
    return localStorage.getItem(BANNER_DISMISSED_KEY) !== '1';
  } catch {
    // Private mode / blocked storage: show it, but it won't stay dismissed.
    return true;
  }
}

export function dismissAppBanner(): void {
  try {
    localStorage.setItem(BANNER_DISMISSED_KEY, '1');
  } catch {
    // Nothing to do — the banner still hides for this session.
  }
}
