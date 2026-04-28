export class TourKeyboard {
  private handler: ((e: KeyboardEvent) => void) | null = null;

  mount(callbacks: {
    onNext: () => void;
    onPrev: () => void;
    onCancel: () => void;
  }, tooltipEl: HTMLElement): void {
    this.unmount();
    this.handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          callbacks.onCancel();
          break;
        case 'ArrowRight':
        case 'Enter':
          if (e.target === tooltipEl || tooltipEl.contains(e.target as Node)) break;
          e.preventDefault();
          callbacks.onNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          callbacks.onPrev();
          break;
      }
    };
    document.addEventListener('keydown', this.handler);

    // Focus trap inside tooltip
    tooltipEl.addEventListener('keydown', this.trapFocus.bind(this));
  }

  unmount(): void {
    if (this.handler) {
      document.removeEventListener('keydown', this.handler);
      this.handler = null;
    }
  }

  private trapFocus(e: KeyboardEvent): void {
    const tooltip = e.currentTarget as HTMLElement;
    const focusable = tooltip.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }
}
