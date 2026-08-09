export type Locale = 'en' | 'id';

export interface TitledItem {
  title: string;
  body: string;
}

export interface FeatureItem {
  emoji: string;
  title: string;
  body: string;
}

export interface Step {
  title: string;
  body: string;
}

export interface CompareRow {
  feature: string;
  rinciku: string;
  typical: string;
}

export interface QA {
  q: string;
  a: string;
}

/**
 * The full copy shape for one locale. Both `en` and `id` must satisfy this
 * exactly, so TypeScript flags any string that drifts or goes missing.
 */
export interface Copy {
  meta: {
    title: string;
    description: string;
    ogAlt: string;
  };
  nav: {
    tryFree: string;
    /** Replaces `tryFree` for iOS visitors — the nav CTA points at the App Store. */
    getApp: string;
    /** Label shown on the language toggle for the *other* locale. */
    switchLang: string;
    /** Skip-to-content link text (keyboard/screen-reader accessibility). */
    skipToContent: string;
    /** In-page anchor links (desktop header). */
    features: string;
    how: string;
    faq: string;
  };
  /** Labels for the App Store download badge (used in the hero and final CTA). */
  appStore: {
    /** Small line above the store name, e.g. "Download on the". */
    badgeSmall: string;
    /** The store name itself — stays "App Store" in every locale. */
    badgeLarge: string;
    /** Accessible name for the badge link. */
    ariaLabel: string;
  };
  hero: {
    badge: string;
    headline: string;
    headlineAccent: string;
    subhead: string;
    cta: string;
    ctaNote: string;
    /** Replaces `ctaNote` for iOS visitors, who are steered to the app instead. */
    ctaNoteIos: string;
    screenshotAlt: string;
  };
  problem: {
    heading: string;
    subhead: string;
    items: TitledItem[];
  };
  differentiator: {
    badge: string;
    heading: string;
    body: string;
    points: TitledItem[];
    screenshotAlt: string;
  };
  features: {
    heading: string;
    subhead: string;
    items: FeatureItem[];
  };
  howItWorks: {
    heading: string;
    subhead: string;
    steps: Step[];
  };
  compare: {
    heading: string;
    subhead: string;
    colRinciku: string;
    colTypical: string;
    rows: CompareRow[];
  };
  faq: {
    heading: string;
    subhead: string;
    items: QA[];
  };
  cta: {
    heading: string;
    body: string;
    button: string;
    note: string;
    /** Replaces `note` for iOS visitors. */
    noteIos: string;
  };
  footer: {
    tagline: string;
    madeWith: string;
    github: string;
    contact: string;
    privacy: string;
    terms: string;
    rights: string;
  };
}

export interface LegalSection {
  heading: string;
  /** Paragraphs, rendered in order. */
  body: string[];
  /** Optional bullet list rendered after the paragraphs. */
  list?: string[];
}

/**
 * Copy shape for the legal pages (`/privacy`, `/terms`, and their `/id/`
 * variants). Both locales in `privacy.ts` / `terms.ts` must satisfy this,
 * same drift-guard as `Copy`.
 */
export interface LegalCopy {
  meta: Copy['meta'];
  title: string;
  /** e.g. "Last updated: July 17, 2026" */
  updated: string;
  intro: string[];
  sections: LegalSection[];
  contactHeading: string;
  /** Rendered with the support email appended as a mailto link. */
  contactBody: string;
  backHome: string;
}
