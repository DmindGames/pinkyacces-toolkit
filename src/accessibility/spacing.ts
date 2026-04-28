const LINE_HEIGHT_ATTR = 'data-pinky-line-height';
const LETTER_SPACING_ATTR = 'data-pinky-letter-spacing';

export function setLineHeight(value: number, root: HTMLElement = document.documentElement): void {
  const clamped = Math.max(1, Math.min(3, value));
  root.style.setProperty('--pinky-line-height', String(clamped));
  root.setAttribute(LINE_HEIGHT_ATTR, String(clamped));
}

export function getLineHeight(root: HTMLElement = document.documentElement): number {
  const attr = root.getAttribute(LINE_HEIGHT_ATTR);
  return attr ? parseFloat(attr) : 1.5;
}

export function setLetterSpacing(value: number, root: HTMLElement = document.documentElement): void {
  const clamped = Math.max(0, Math.min(10, value));
  root.style.setProperty('--pinky-letter-spacing', `${clamped}px`);
  root.setAttribute(LETTER_SPACING_ATTR, String(clamped));
}

export function getLetterSpacing(root: HTMLElement = document.documentElement): number {
  const attr = root.getAttribute(LETTER_SPACING_ATTR);
  return attr ? parseFloat(attr) : 0;
}

export function injectSpacingStyles(): void {
  const id = 'pinky-spacing-styles';
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    :root[data-pinky-line-height] * {
      line-height: var(--pinky-line-height) !important;
    }
    :root[data-pinky-letter-spacing] * {
      letter-spacing: var(--pinky-letter-spacing) !important;
    }
  `;
  document.head.appendChild(style);
}
