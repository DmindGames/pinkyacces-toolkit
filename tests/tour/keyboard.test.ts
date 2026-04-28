import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TourKeyboard } from '../../src/tour/TourKeyboard.js';

describe('TourKeyboard', () => {
  let keyboard: TourKeyboard;
  let tooltipEl: HTMLElement;
  const onNext = vi.fn();
  const onPrev = vi.fn();
  const onCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    keyboard = new TourKeyboard();
    tooltipEl = document.createElement('div');
    document.body.appendChild(tooltipEl);
    keyboard.mount({ onNext, onPrev, onCancel }, tooltipEl);
  });

  afterEach(() => {
    keyboard.unmount();
    tooltipEl.remove();
  });

  function pressKey(key: string, options: KeyboardEventInit = {}): void {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, ...options });
    document.dispatchEvent(event);
  }

  it('should call onCancel on Escape', () => {
    pressKey('Escape');
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('should call onPrev on ArrowLeft', () => {
    pressKey('ArrowLeft');
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it('should unmount and stop handling events', () => {
    keyboard.unmount();
    pressKey('Escape');
    expect(onCancel).not.toHaveBeenCalled();
  });
});
