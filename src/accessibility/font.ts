const FONT_SCALE_ATTR = 'data-pinky-font-scale';

export function setFontScale(scale: number, root: HTMLElement = document.documentElement): void {
  const clamped = Math.max(0.5, Math.min(3, scale));
  root.style.setProperty('--pinky-font-scale', String(clamped));
  root.setAttribute(FONT_SCALE_ATTR, String(clamped));
  root.style.fontSize = `${clamped * 100}%`;
}

export function getFontScale(root: HTMLElement = document.documentElement): number {
  const attr = root.getAttribute(FONT_SCALE_ATTR);
  return attr ? parseFloat(attr) : 1;
}

export function resetFontScale(root: HTMLElement = document.documentElement): void {
  root.style.removeProperty('--pinky-font-scale');
  root.removeAttribute(FONT_SCALE_ATTR);
  root.style.fontSize = '';
}
