export type ReadingTheme = 'default' | 'high-contrast' | 'sepia' | 'dark';

const THEME_ATTR = 'data-pinky-theme';

export function setReadingTheme(theme: ReadingTheme, root: HTMLElement = document.documentElement): void {
  root.setAttribute(THEME_ATTR, theme);
}

export function getReadingTheme(root: HTMLElement = document.documentElement): ReadingTheme {
  return (root.getAttribute(THEME_ATTR) as ReadingTheme) ?? 'default';
}

export function resetReadingTheme(root: HTMLElement = document.documentElement): void {
  root.removeAttribute(THEME_ATTR);
}

export function injectContrastStyles(): void {
  const id = 'pinky-contrast-styles';
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    [data-pinky-theme="high-contrast"] {
      filter: contrast(1.5) !important;
      background: #000 !important;
      color: #fff !important;
    }
    [data-pinky-theme="high-contrast"] a { color: #ff0 !important; }
    [data-pinky-theme="sepia"] {
      filter: sepia(0.5) !important;
      background: #f4ecd8 !important;
      color: #3b2c1a !important;
    }
    [data-pinky-theme="dark"] {
      background: #1a1a1a !important;
      color: #e0e0e0 !important;
    }
  `;
  document.head.appendChild(style);
}
