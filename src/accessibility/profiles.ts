import type { AccessibilityPreferences } from './storage.js';
import { setFontScale, resetFontScale } from './font.js';
import { setReadingTheme, resetReadingTheme } from './contrast.js';
import { setLineHeight, setLetterSpacing } from './spacing.js';
import { enableDyslexiaFont, disableDyslexiaFont } from './dyslexia.js';
import { savePreferences } from './storage.js';

export type ProfileName = 'low-vision' | 'dyslexia' | 'senior' | 'color-blind' | 'default';

export interface ProfileConfig {
  name: ProfileName;
  label: string;
  preferences: AccessibilityPreferences;
}

export const PROFILES: Record<ProfileName, ProfileConfig> = {
  'low-vision': {
    name: 'low-vision',
    label: 'Baja visión',
    preferences: {
      fontScale: 1.5,
      highContrast: true,
      readingTheme: 'dark',
      lineHeight: 1.8,
      letterSpacing: 1,
    },
  },
  dyslexia: {
    name: 'dyslexia',
    label: 'Dislexia',
    preferences: {
      fontScale: 1.2,
      dyslexiaFont: true,
      lineHeight: 2,
      letterSpacing: 2,
    },
  },
  senior: {
    name: 'senior',
    label: 'Adulto mayor',
    preferences: {
      fontScale: 1.4,
      lineHeight: 1.8,
      readingTheme: 'sepia',
      letterSpacing: 1,
    },
  },
  'color-blind': {
    name: 'color-blind',
    label: 'Daltonismo',
    preferences: {
      highContrast: true,
      readingTheme: 'high-contrast',
    },
  },
  default: {
    name: 'default',
    label: 'Por defecto',
    preferences: {},
  },
};

export function applyProfile(
  profileName: ProfileName,
  root: HTMLElement = document.documentElement
): void {
  const profile = PROFILES[profileName];
  if (!profile) return;

  const prefs = profile.preferences;

  // Reset first
  resetFontScale(root);
  resetReadingTheme(root);
  disableDyslexiaFont(root);

  if (prefs.fontScale !== undefined) setFontScale(prefs.fontScale, root);
  if (prefs.readingTheme) setReadingTheme(prefs.readingTheme as 'default' | 'high-contrast' | 'sepia' | 'dark', root);
  if (prefs.lineHeight !== undefined) setLineHeight(prefs.lineHeight, root);
  if (prefs.letterSpacing !== undefined) setLetterSpacing(prefs.letterSpacing, root);
  if (prefs.dyslexiaFont) enableDyslexiaFont(root);

  savePreferences({ ...prefs, profile: profileName });
}

export function resetProfile(root: HTMLElement = document.documentElement): void {
  applyProfile('default', root);
}
