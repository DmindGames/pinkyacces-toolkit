import type { TourOptions, TourStep, TourI18n } from './TourTypes.js';
import { TourOverlay } from './TourOverlay.js';
import { TourTooltip } from './TourTooltip.js';
import { TourKeyboard } from './TourKeyboard.js';
import { mergeI18n } from './i18n.js';

type ResolvedTourOptions = Omit<Required<TourOptions>, 'i18n'> & { i18n: TourI18n };

export class TourEngine {
  private options: ResolvedTourOptions;
  private currentStep = 0;
  private isRunning = false;
  private overlay: TourOverlay;
  private tooltip: TourTooltip;
  private keyboard: TourKeyboard;
  private previousFocus: HTMLElement | null = null;

  constructor(options: TourOptions) {
    this.options = {
      steps: options.steps,
      i18n: mergeI18n(options.i18n),
      callbacks: options.callbacks ?? {},
      showProgress: options.showProgress ?? true,
      closeOnOverlayClick: options.closeOnOverlayClick ?? false,
      scrollToTarget: options.scrollToTarget ?? true,
      zIndex: options.zIndex ?? 9000,
    } satisfies ResolvedTourOptions;
    this.overlay = new TourOverlay(this.options.zIndex);
    this.tooltip = new TourTooltip(this.options.zIndex + 2);
    this.keyboard = new TourKeyboard();
  }

  async start(): Promise<void> {
    if (this.isRunning) return;
    if (this.options.steps.length === 0) return;

    this.isRunning = true;
    this.currentStep = 0;
    this.previousFocus = document.activeElement as HTMLElement;

    this.overlay.mount(
      this.options.closeOnOverlayClick ? () => this.cancel() : undefined
    );
    this.tooltip.mount();
    this.keyboard.mount(
      {
        onNext: () => void this.next(),
        onPrev: () => void this.prev(),
        onCancel: () => void this.cancel(),
      },
      this.tooltip.getElement()
    );

    this.options.callbacks.onStart?.();
    await this.showStep(0);
  }

  async next(): Promise<void> {
    if (this.currentStep >= this.options.steps.length - 1) {
      await this.complete();
    } else {
      await this.showStep(this.currentStep + 1);
    }
  }

  async prev(): Promise<void> {
    if (this.currentStep > 0) {
      await this.showStep(this.currentStep - 1);
    }
  }

  async cancel(): Promise<void> {
    this.cleanup();
    this.options.callbacks.onCancel?.();
  }

  async complete(): Promise<void> {
    this.cleanup();
    this.options.callbacks.onComplete?.();
  }

  private async showStep(index: number): Promise<void> {
    this.currentStep = index;
    const step = this.options.steps[index];

    if (step.beforeShow) {
      const shouldShow = await step.beforeShow();
      if (shouldShow === false) {
        await this.next();
        return;
      }
    }

    const target = this.resolveTarget(step);

    if (target && this.options.scrollToTarget) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await this.delay(300);
    }

    this.overlay.highlight(target);

    this.tooltip.render(
      step,
      index,
      this.options.steps.length,
      this.options.i18n,
      {
        onNext: () => void this.next(),
        onPrev: () => void this.prev(),
        onSkip: () => void this.cancel(),
      },
      index === 0,
      index === this.options.steps.length - 1
    );

    this.tooltip.position(target, step.position ?? 'bottom');
    this.tooltip.focus();

    this.options.callbacks.onStepChange?.(index, step);
    await step.afterShow?.();
  }

  private resolveTarget(step: TourStep): HTMLElement | null {
    if (!step.target) return null;
    if (step.target instanceof HTMLElement) return step.target;
    return document.querySelector<HTMLElement>(step.target);
  }

  private cleanup(): void {
    this.isRunning = false;
    this.keyboard.unmount();
    this.tooltip.unmount();
    this.overlay.unmount();
    this.previousFocus?.focus();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  get stepIndex(): number {
    return this.currentStep;
  }

  get running(): boolean {
    return this.isRunning;
  }
}
