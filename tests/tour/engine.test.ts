import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TourEngine } from '../../src/tour/TourEngine.js';
import type { TourStep } from '../../src/tour/TourTypes.js';

const makeSteps = (): TourStep[] => [
  { target: null, title: 'Step 1', description: 'Description 1', position: 'center' },
  { target: null, title: 'Step 2', description: 'Description 2', position: 'center' },
  { target: null, title: 'Step 3', description: 'Description 3', position: 'center' },
];

describe('TourEngine', () => {
  let engine: TourEngine;
  const onStart = vi.fn();
  const onStepChange = vi.fn();
  const onComplete = vi.fn();
  const onCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    engine = new TourEngine({
      steps: makeSteps(),
      callbacks: { onStart, onStepChange, onComplete, onCancel },
      scrollToTarget: false,
    });
  });

  afterEach(() => {
    // Clean up DOM
    document.getElementById('pinky-tour-overlay')?.remove();
    document.getElementById('pinky-tour-tooltip')?.remove();
    document.getElementById('pinky-tour-highlight')?.remove();
  });

  it('should call onStart when tour starts', async () => {
    await engine.start();
    expect(onStart).toHaveBeenCalledOnce();
  });

  it('should call onStepChange on start', async () => {
    await engine.start();
    expect(onStepChange).toHaveBeenCalledWith(0, makeSteps()[0]);
  });

  it('should advance to next step', async () => {
    await engine.start();
    await engine.next();
    expect(engine.stepIndex).toBe(1);
    expect(onStepChange).toHaveBeenCalledWith(1, makeSteps()[1]);
  });

  it('should go back to previous step', async () => {
    await engine.start();
    await engine.next();
    await engine.prev();
    expect(engine.stepIndex).toBe(0);
  });

  it('should call onComplete when finishing last step', async () => {
    await engine.start();
    await engine.next();
    await engine.next();
    await engine.next(); // complete
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('should call onCancel when cancelled', async () => {
    await engine.start();
    await engine.cancel();
    expect(onCancel).toHaveBeenCalledOnce();
    expect(engine.running).toBe(false);
  });

  it('should not start if no steps', async () => {
    const emptyEngine = new TourEngine({ steps: [] });
    await emptyEngine.start();
    expect(emptyEngine.running).toBe(false);
  });

  it('should skip step when beforeShow returns false', async () => {
    const steps: TourStep[] = [
      { target: null, title: 'Step 1', description: 'Desc', beforeShow: () => false },
      { target: null, title: 'Step 2', description: 'Desc' },
    ];
    const skipEngine = new TourEngine({ steps, callbacks: { onStepChange }, scrollToTarget: false });
    await skipEngine.start();
    // Should skip step 0 and go to step 1
    expect(onStepChange).toHaveBeenCalledWith(1, steps[1]);
  });

  it('should not go before first step', async () => {
    await engine.start();
    await engine.prev(); // should not throw
    expect(engine.stepIndex).toBe(0);
  });
});
