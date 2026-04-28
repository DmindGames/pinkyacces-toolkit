declare function setFontScale(scale: number, root?: HTMLElement): void;
declare function getFontScale(root?: HTMLElement): number;
declare function resetFontScale(root?: HTMLElement): void;

type ReadingTheme = 'default' | 'high-contrast' | 'sepia' | 'dark';
declare function setReadingTheme(theme: ReadingTheme, root?: HTMLElement): void;
declare function getReadingTheme(root?: HTMLElement): ReadingTheme;
declare function resetReadingTheme(root?: HTMLElement): void;
declare function injectContrastStyles(): void;

declare function setLineHeight(value: number, root?: HTMLElement): void;
declare function getLineHeight(root?: HTMLElement): number;
declare function setLetterSpacing(value: number, root?: HTMLElement): void;
declare function getLetterSpacing(root?: HTMLElement): number;
declare function injectSpacingStyles(): void;

declare function enableDyslexiaFont(root?: HTMLElement): void;
declare function disableDyslexiaFont(root?: HTMLElement): void;
declare function isDyslexiaFontEnabled(root?: HTMLElement): boolean;

declare function enableReadingRuler(): void;
declare function disableReadingRuler(): void;
declare function isReadingRulerEnabled(): boolean;

declare function isSpeechAvailable(): boolean;
declare function speak(text: string, lang?: string, rate?: number, pitch?: number): void;
declare function stopSpeech(): void;
declare function speakElement(element: HTMLElement, lang?: string): void;
declare function isSpeaking(): boolean;

interface AccessibilityPreferences {
    fontScale?: number;
    highContrast?: boolean;
    readingTheme?: 'default' | 'sepia' | 'dark' | 'high-contrast';
    lineHeight?: number;
    letterSpacing?: number;
    dyslexiaFont?: boolean;
    readingRuler?: boolean;
    focusParagraph?: boolean;
    hideDistactions?: boolean;
    profile?: string;
}
declare function savePreferences(prefs: AccessibilityPreferences): void;
declare function loadPreferences(): AccessibilityPreferences;
declare function clearPreferences(): void;

type ProfileName = 'low-vision' | 'dyslexia' | 'senior' | 'color-blind' | 'default';
interface ProfileConfig {
    name: ProfileName;
    label: string;
    preferences: AccessibilityPreferences;
}
declare const PROFILES: Record<ProfileName, ProfileConfig>;
declare function applyProfile(profileName: ProfileName, root?: HTMLElement): void;
declare function resetProfile(root?: HTMLElement): void;

export { type AccessibilityPreferences, PROFILES, type ProfileConfig, type ProfileName, type ReadingTheme, applyProfile, clearPreferences, disableDyslexiaFont, disableReadingRuler, enableDyslexiaFont, enableReadingRuler, getFontScale, getLetterSpacing, getLineHeight, getReadingTheme, injectContrastStyles, injectSpacingStyles, isDyslexiaFontEnabled, isReadingRulerEnabled, isSpeaking, isSpeechAvailable, loadPreferences, resetFontScale, resetProfile, resetReadingTheme, savePreferences, setFontScale, setLetterSpacing, setLineHeight, setReadingTheme, speak, speakElement, stopSpeech };
