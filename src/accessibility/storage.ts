const STORAGE_KEY = 'pinkyacces-prefs';

export interface AccessibilityPreferences {
  fontScale?: number;
  highContrast?: boolean;
  readingTheme?: 'default' | 'sepia' | 'dark' | 'high-contrast';
  lineHeight?: number;
  letterSpacing?: number;
  dyslexiaFont?: boolean;
  readingRuler?: boolean;
  focusParagraph?: boolean;
  hideDistractions?: boolean;
  profile?: string;
}

export function savePreferences(prefs: AccessibilityPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // storage not available
  }
}

export function loadPreferences(): AccessibilityPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AccessibilityPreferences;
  } catch {
    // storage not available
  }
  return {};
}

export function clearPreferences(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage not available
  }
}
