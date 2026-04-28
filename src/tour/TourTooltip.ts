import type { TourStep, TourI18n, TooltipPosition } from './TourTypes.js';

export class TourTooltip {
  private el: HTMLElement;
  private zIndex: number;

  constructor(zIndex = 9002) {
    this.zIndex = zIndex;
    this.el = document.createElement('div');
    this.el.id = 'pinky-tour-tooltip';
    this.el.setAttribute('role', 'dialog');
    this.el.setAttribute('aria-modal', 'true');
    this.el.setAttribute('aria-live', 'polite');
    this.el.style.cssText = `
      position: fixed;
      z-index: ${this.zIndex};
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      padding: 20px 24px;
      max-width: 360px;
      min-width: 240px;
      font-family: system-ui, -apple-system, sans-serif;
      outline: none;
    `;
  }

  mount(): void {
    document.body.appendChild(this.el);
  }

  unmount(): void {
    this.el.remove();
  }

  render(
    step: TourStep,
    stepIndex: number,
    totalSteps: number,
    i18n: TourI18n,
    callbacks: {
      onNext: () => void;
      onPrev: () => void;
      onSkip: () => void;
    },
    isFirst: boolean,
    isLast: boolean
  ): void {
    const progress = `${i18n.stepOf(stepIndex + 1, totalSteps)}`;
    this.el.setAttribute('aria-label', `${step.title} - ${progress}`);
    this.el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="font-size:0.75rem;color:#888;font-weight:500;">${progress}</span>
        <button id="pinky-tour-skip" aria-label="${i18n.skip}" style="background:none;border:none;cursor:pointer;color:#888;font-size:0.875rem;padding:2px 6px;">✕</button>
      </div>
      <h3 style="margin:0 0 8px;font-size:1.1rem;color:#111;">${step.title}</h3>
      <p style="margin:0 0 16px;font-size:0.925rem;color:#444;line-height:1.5;">${step.description}</p>
      <div style="display:flex;gap:8px;justify-content:flex-end;">
        ${!isFirst ? `<button id="pinky-tour-prev" style="padding:8px 16px;border:1px solid #ddd;border-radius:6px;background:#fff;cursor:pointer;font-size:0.875rem;">${i18n.prev}</button>` : ''}
        <button id="pinky-tour-next" style="padding:8px 16px;border:none;border-radius:6px;background:#f472b6;color:#fff;cursor:pointer;font-size:0.875rem;font-weight:600;">${isLast ? i18n.finish : i18n.next}</button>
      </div>
    `;

    this.el.querySelector('#pinky-tour-next')?.addEventListener('click', callbacks.onNext);
    this.el.querySelector('#pinky-tour-prev')?.addEventListener('click', callbacks.onPrev);
    this.el.querySelector('#pinky-tour-skip')?.addEventListener('click', callbacks.onSkip);
  }

  position(target: HTMLElement | null, preferred: TooltipPosition = 'bottom'): void {
    if (!target || preferred === 'center') {
      this.el.style.top = '50%';
      this.el.style.left = '50%';
      this.el.style.transform = 'translate(-50%, -50%)';
      return;
    }

    const rect = target.getBoundingClientRect();
    const tooltipRect = this.el.getBoundingClientRect();
    const margin = 16;

    this.el.style.transform = '';

    if (preferred === 'bottom') {
      this.el.style.top = `${rect.bottom + margin}px`;
      this.el.style.left = `${Math.max(margin, rect.left + rect.width / 2 - tooltipRect.width / 2)}px`;
    } else if (preferred === 'top') {
      this.el.style.top = `${rect.top - tooltipRect.height - margin}px`;
      this.el.style.left = `${Math.max(margin, rect.left + rect.width / 2 - tooltipRect.width / 2)}px`;
    } else if (preferred === 'right') {
      this.el.style.top = `${rect.top + rect.height / 2 - tooltipRect.height / 2}px`;
      this.el.style.left = `${rect.right + margin}px`;
    } else if (preferred === 'left') {
      this.el.style.top = `${rect.top + rect.height / 2 - tooltipRect.height / 2}px`;
      this.el.style.left = `${rect.left - tooltipRect.width - margin}px`;
    }
  }

  focus(): void {
    this.el.setAttribute('tabindex', '-1');
    this.el.focus();
  }

  getElement(): HTMLElement {
    return this.el;
  }
}
