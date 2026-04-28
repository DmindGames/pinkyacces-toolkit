const DYSLEXIA_ATTR = 'data-pinky-dyslexia';
const FONT_URL = 'https://fonts.googleapis.com/css2?family=OpenDyslexic&display=swap';

export function enableDyslexiaFont(root: HTMLElement = document.documentElement): void {
  loadDyslexiaFont();
  root.setAttribute(DYSLEXIA_ATTR, 'true');
  injectDyslexiaStyles();
}

export function disableDyslexiaFont(root: HTMLElement = document.documentElement): void {
  root.removeAttribute(DYSLEXIA_ATTR);
}

export function isDyslexiaFontEnabled(root: HTMLElement = document.documentElement): boolean {
  return root.hasAttribute(DYSLEXIA_ATTR);
}

function loadDyslexiaFont(): void {
  const id = 'pinky-dyslexia-font';
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = FONT_URL;
  document.head.appendChild(link);
}

function injectDyslexiaStyles(): void {
  const id = 'pinky-dyslexia-styles';
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    [data-pinky-dyslexia] * {
      font-family: 'OpenDyslexic', 'Comic Sans MS', cursive !important;
      word-spacing: 0.16em !important;
      letter-spacing: 0.12em !important;
    }
  `;
  document.head.appendChild(style);
}
