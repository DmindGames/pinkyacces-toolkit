import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { applyProfile, PROFILES, resetProfile } from '../../src/accessibility/profiles.js';
import { getFontScale } from '../../src/accessibility/font.js';
import { getReadingTheme } from '../../src/accessibility/contrast.js';

describe('Accessibility Profiles', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => {
    root.remove();
  });

  it('should define all required profiles', () => {
    expect(PROFILES['low-vision']).toBeDefined();
    expect(PROFILES['dyslexia']).toBeDefined();
    expect(PROFILES['senior']).toBeDefined();
    expect(PROFILES['color-blind']).toBeDefined();
    expect(PROFILES['default']).toBeDefined();
  });

  it('should apply low-vision profile', () => {
    applyProfile('low-vision', root);
    expect(getFontScale(root)).toBe(1.5);
    expect(getReadingTheme(root)).toBe('dark');
  });

  it('should apply dyslexia profile', () => {
    applyProfile('dyslexia', root);
    expect(getFontScale(root)).toBe(1.2);
    expect(root.hasAttribute('data-pinky-dyslexia')).toBe(true);
  });

  it('should apply senior profile', () => {
    applyProfile('senior', root);
    expect(getFontScale(root)).toBe(1.4);
    expect(getReadingTheme(root)).toBe('sepia');
  });

  it('should apply color-blind profile', () => {
    applyProfile('color-blind', root);
    expect(getReadingTheme(root)).toBe('high-contrast');
  });

  it('should reset to default profile', () => {
    applyProfile('low-vision', root);
    resetProfile(root);
    expect(root.getAttribute('data-pinky-font-scale')).toBeNull();
  });
});
