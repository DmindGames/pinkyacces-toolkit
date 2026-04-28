export class TourOverlay {
  private overlayEl: HTMLElement;
  private highlightEl: HTMLElement;
  private zIndex: number;

  constructor(zIndex = 9000) {
    this.zIndex = zIndex;
    this.overlayEl = document.createElement('div');
    this.overlayEl.id = 'pinky-tour-overlay';
    this.overlayEl.setAttribute('aria-hidden', 'true');
    this.overlayEl.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      z-index: ${this.zIndex};
      pointer-events: none;
    `;

    this.highlightEl = document.createElement('div');
    this.highlightEl.id = 'pinky-tour-highlight';
    this.highlightEl.setAttribute('aria-hidden', 'true');
    this.highlightEl.style.cssText = `
      position: fixed;
      z-index: ${this.zIndex + 1};
      border-radius: 4px;
      box-shadow: 0 0 0 4px #f472b6, 0 0 0 9999px rgba(0,0,0,0.55);
      pointer-events: none;
      transition: all 0.3s ease;
    `;
  }

  mount(onClick?: () => void): void {
    document.body.appendChild(this.overlayEl);
    document.body.appendChild(this.highlightEl);
    if (onClick) {
      this.overlayEl.style.pointerEvents = 'all';
      this.overlayEl.addEventListener('click', onClick);
    }
  }

  unmount(): void {
    this.overlayEl.remove();
    this.highlightEl.remove();
  }

  highlight(target: HTMLElement | null): void {
    if (!target) {
      this.highlightEl.style.display = 'none';
      return;
    }
    const rect = target.getBoundingClientRect();
    const padding = 6;
    this.highlightEl.style.display = 'block';
    this.highlightEl.style.top = `${rect.top - padding}px`;
    this.highlightEl.style.left = `${rect.left - padding}px`;
    this.highlightEl.style.width = `${rect.width + padding * 2}px`;
    this.highlightEl.style.height = `${rect.height + padding * 2}px`;
  }

  updateHighlight(target: HTMLElement | null): void {
    this.highlight(target);
  }
}
