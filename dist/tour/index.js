// src/tour/TourOverlay.ts
var TourOverlay = class {
  constructor(zIndex = 9e3) {
    this.zIndex = zIndex;
    this.overlayEl = document.createElement("div");
    this.overlayEl.id = "pinky-tour-overlay";
    this.overlayEl.setAttribute("aria-hidden", "true");
    this.overlayEl.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      z-index: ${this.zIndex};
      pointer-events: none;
    `;
    this.highlightEl = document.createElement("div");
    this.highlightEl.id = "pinky-tour-highlight";
    this.highlightEl.setAttribute("aria-hidden", "true");
    this.highlightEl.style.cssText = `
      position: fixed;
      z-index: ${this.zIndex + 1};
      border-radius: 4px;
      box-shadow: 0 0 0 4px #f472b6, 0 0 0 9999px rgba(0,0,0,0.55);
      pointer-events: none;
      transition: all 0.3s ease;
    `;
  }
  mount(onClick) {
    document.body.appendChild(this.overlayEl);
    document.body.appendChild(this.highlightEl);
    if (onClick) {
      this.overlayEl.style.pointerEvents = "all";
      this.overlayEl.addEventListener("click", onClick);
    }
  }
  unmount() {
    this.overlayEl.remove();
    this.highlightEl.remove();
  }
  highlight(target) {
    if (!target) {
      this.highlightEl.style.display = "none";
      return;
    }
    const rect = target.getBoundingClientRect();
    const padding = 6;
    this.highlightEl.style.display = "block";
    this.highlightEl.style.top = `${rect.top - padding}px`;
    this.highlightEl.style.left = `${rect.left - padding}px`;
    this.highlightEl.style.width = `${rect.width + padding * 2}px`;
    this.highlightEl.style.height = `${rect.height + padding * 2}px`;
  }
  updateHighlight(target) {
    this.highlight(target);
  }
};

// src/tour/TourTooltip.ts
var TourTooltip = class {
  constructor(zIndex = 9002) {
    this.zIndex = zIndex;
    this.el = document.createElement("div");
    this.el.id = "pinky-tour-tooltip";
    this.el.setAttribute("role", "dialog");
    this.el.setAttribute("aria-modal", "true");
    this.el.setAttribute("aria-live", "polite");
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
  mount() {
    document.body.appendChild(this.el);
  }
  unmount() {
    this.el.remove();
  }
  render(step, stepIndex, totalSteps, i18n, callbacks, isFirst, isLast) {
    const progress = `${i18n.stepOf(stepIndex + 1, totalSteps)}`;
    this.el.setAttribute("aria-label", `${step.title} - ${progress}`);
    this.el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="font-size:0.75rem;color:#888;font-weight:500;">${progress}</span>
        <button id="pinky-tour-skip" aria-label="${i18n.skip}" style="background:none;border:none;cursor:pointer;color:#888;font-size:0.875rem;padding:2px 6px;">\u2715</button>
      </div>
      <h3 style="margin:0 0 8px;font-size:1.1rem;color:#111;">${step.title}</h3>
      <p style="margin:0 0 16px;font-size:0.925rem;color:#444;line-height:1.5;">${step.description}</p>
      <div style="display:flex;gap:8px;justify-content:flex-end;">
        ${!isFirst ? `<button id="pinky-tour-prev" style="padding:8px 16px;border:1px solid #ddd;border-radius:6px;background:#fff;cursor:pointer;font-size:0.875rem;">${i18n.prev}</button>` : ""}
        <button id="pinky-tour-next" style="padding:8px 16px;border:none;border-radius:6px;background:#f472b6;color:#fff;cursor:pointer;font-size:0.875rem;font-weight:600;">${isLast ? i18n.finish : i18n.next}</button>
      </div>
    `;
    this.el.querySelector("#pinky-tour-next")?.addEventListener("click", callbacks.onNext);
    this.el.querySelector("#pinky-tour-prev")?.addEventListener("click", callbacks.onPrev);
    this.el.querySelector("#pinky-tour-skip")?.addEventListener("click", callbacks.onSkip);
  }
  position(target, preferred = "bottom") {
    if (!target || preferred === "center") {
      this.el.style.top = "50%";
      this.el.style.left = "50%";
      this.el.style.transform = "translate(-50%, -50%)";
      return;
    }
    const rect = target.getBoundingClientRect();
    const tooltipRect = this.el.getBoundingClientRect();
    const margin = 16;
    this.el.style.transform = "";
    if (preferred === "bottom") {
      this.el.style.top = `${rect.bottom + margin}px`;
      this.el.style.left = `${Math.max(margin, rect.left + rect.width / 2 - tooltipRect.width / 2)}px`;
    } else if (preferred === "top") {
      this.el.style.top = `${rect.top - tooltipRect.height - margin}px`;
      this.el.style.left = `${Math.max(margin, rect.left + rect.width / 2 - tooltipRect.width / 2)}px`;
    } else if (preferred === "right") {
      this.el.style.top = `${rect.top + rect.height / 2 - tooltipRect.height / 2}px`;
      this.el.style.left = `${rect.right + margin}px`;
    } else if (preferred === "left") {
      this.el.style.top = `${rect.top + rect.height / 2 - tooltipRect.height / 2}px`;
      this.el.style.left = `${rect.left - tooltipRect.width - margin}px`;
    }
  }
  focus() {
    this.el.setAttribute("tabindex", "-1");
    this.el.focus();
  }
  getElement() {
    return this.el;
  }
};

// src/tour/TourKeyboard.ts
var TourKeyboard = class {
  constructor() {
    this.handler = null;
  }
  mount(callbacks, tooltipEl) {
    this.unmount();
    this.handler = (e) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          callbacks.onCancel();
          break;
        case "ArrowRight":
        case "Enter":
          if (e.target === tooltipEl || tooltipEl.contains(e.target)) break;
          e.preventDefault();
          callbacks.onNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          callbacks.onPrev();
          break;
      }
    };
    document.addEventListener("keydown", this.handler);
    tooltipEl.addEventListener("keydown", this.trapFocus.bind(this));
  }
  unmount() {
    if (this.handler) {
      document.removeEventListener("keydown", this.handler);
      this.handler = null;
    }
  }
  trapFocus(e) {
    const tooltip = e.currentTarget;
    const focusable = tooltip.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key === "Tab") {
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
};

// src/tour/i18n.ts
var DEFAULT_I18N = {
  next: "Siguiente",
  prev: "Anterior",
  finish: "Finalizar",
  skip: "Saltar tour",
  close: "Cerrar",
  stepOf: (current, total) => `Paso ${current} de ${total}`
};
var I18N_EN = {
  next: "Next",
  prev: "Previous",
  finish: "Finish",
  skip: "Skip tour",
  close: "Close",
  stepOf: (current, total) => `Step ${current} of ${total}`
};
function mergeI18n(partial) {
  return { ...DEFAULT_I18N, ...partial };
}

// src/tour/TourEngine.ts
var TourEngine = class {
  constructor(options) {
    this.currentStep = 0;
    this.isRunning = false;
    this.previousFocus = null;
    this.options = {
      steps: options.steps,
      i18n: mergeI18n(options.i18n),
      callbacks: options.callbacks ?? {},
      showProgress: options.showProgress ?? true,
      closeOnOverlayClick: options.closeOnOverlayClick ?? false,
      scrollToTarget: options.scrollToTarget ?? true,
      zIndex: options.zIndex ?? 9e3
    };
    this.overlay = new TourOverlay(this.options.zIndex);
    this.tooltip = new TourTooltip(this.options.zIndex + 2);
    this.keyboard = new TourKeyboard();
  }
  async start() {
    if (this.isRunning) return;
    if (this.options.steps.length === 0) return;
    this.isRunning = true;
    this.currentStep = 0;
    this.previousFocus = document.activeElement;
    this.overlay.mount(
      this.options.closeOnOverlayClick ? () => this.cancel() : void 0
    );
    this.tooltip.mount();
    this.keyboard.mount(
      {
        onNext: () => void this.next(),
        onPrev: () => void this.prev(),
        onCancel: () => void this.cancel()
      },
      this.tooltip.getElement()
    );
    this.options.callbacks.onStart?.();
    await this.showStep(0);
  }
  async next() {
    if (this.currentStep >= this.options.steps.length - 1) {
      await this.complete();
    } else {
      await this.showStep(this.currentStep + 1);
    }
  }
  async prev() {
    if (this.currentStep > 0) {
      await this.showStep(this.currentStep - 1);
    }
  }
  async cancel() {
    this.cleanup();
    this.options.callbacks.onCancel?.();
  }
  async complete() {
    this.cleanup();
    this.options.callbacks.onComplete?.();
  }
  async showStep(index) {
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
      target.scrollIntoView({ behavior: "smooth", block: "center" });
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
        onSkip: () => void this.cancel()
      },
      index === 0,
      index === this.options.steps.length - 1
    );
    this.tooltip.position(target, step.position ?? "bottom");
    this.tooltip.focus();
    this.options.callbacks.onStepChange?.(index, step);
    await step.afterShow?.();
  }
  resolveTarget(step) {
    if (!step.target) return null;
    if (step.target instanceof HTMLElement) return step.target;
    return document.querySelector(step.target);
  }
  cleanup() {
    this.isRunning = false;
    this.keyboard.unmount();
    this.tooltip.unmount();
    this.overlay.unmount();
    this.previousFocus?.focus();
  }
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  get stepIndex() {
    return this.currentStep;
  }
  get running() {
    return this.isRunning;
  }
};

export { DEFAULT_I18N, I18N_EN, TourEngine, TourKeyboard, TourOverlay, TourTooltip, mergeI18n };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map