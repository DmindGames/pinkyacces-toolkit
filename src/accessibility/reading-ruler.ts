let rulerEl: HTMLElement | null = null;
let rulerHandler: ((e: MouseEvent) => void) | null = null;

export function enableReadingRuler(): void {
  if (rulerEl) return;
  rulerEl = document.createElement('div');
  rulerEl.id = 'pinky-reading-ruler';
  rulerEl.setAttribute('aria-hidden', 'true');
  rulerEl.style.cssText = `
    position: fixed;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgba(255, 200, 0, 0.6);
    pointer-events: none;
    z-index: 9998;
    transition: top 0.05s ease;
  `;
  document.body.appendChild(rulerEl);

  rulerHandler = (e: MouseEvent) => {
    if (rulerEl) rulerEl.style.top = `${e.clientY}px`;
  };
  document.addEventListener('mousemove', rulerHandler);
}

export function disableReadingRuler(): void {
  if (rulerEl) {
    rulerEl.remove();
    rulerEl = null;
  }
  if (rulerHandler) {
    document.removeEventListener('mousemove', rulerHandler);
    rulerHandler = null;
  }
}

export function isReadingRulerEnabled(): boolean {
  return rulerEl !== null;
}
