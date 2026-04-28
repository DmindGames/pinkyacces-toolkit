// src/accessibility/font.ts
var FONT_SCALE_ATTR = "data-pinky-font-scale";
function setFontScale(scale, root = document.documentElement) {
  const clamped = Math.max(0.5, Math.min(3, scale));
  root.style.setProperty("--pinky-font-scale", String(clamped));
  root.setAttribute(FONT_SCALE_ATTR, String(clamped));
  root.style.fontSize = `${clamped * 100}%`;
}
function getFontScale(root = document.documentElement) {
  const attr = root.getAttribute(FONT_SCALE_ATTR);
  return attr ? parseFloat(attr) : 1;
}
function resetFontScale(root = document.documentElement) {
  root.style.removeProperty("--pinky-font-scale");
  root.removeAttribute(FONT_SCALE_ATTR);
  root.style.fontSize = "";
}

// src/accessibility/contrast.ts
var THEME_ATTR = "data-pinky-theme";
function setReadingTheme(theme, root = document.documentElement) {
  root.setAttribute(THEME_ATTR, theme);
}
function getReadingTheme(root = document.documentElement) {
  return root.getAttribute(THEME_ATTR) ?? "default";
}
function resetReadingTheme(root = document.documentElement) {
  root.removeAttribute(THEME_ATTR);
}
function injectContrastStyles() {
  const id = "pinky-contrast-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    [data-pinky-theme="high-contrast"] {
      filter: contrast(1.5) !important;
      background: #000 !important;
      color: #fff !important;
    }
    [data-pinky-theme="high-contrast"] a { color: #ff0 !important; }
    [data-pinky-theme="sepia"] {
      filter: sepia(0.5) !important;
      background: #f4ecd8 !important;
      color: #3b2c1a !important;
    }
    [data-pinky-theme="dark"] {
      background: #1a1a1a !important;
      color: #e0e0e0 !important;
    }
  `;
  document.head.appendChild(style);
}

// src/accessibility/spacing.ts
var LINE_HEIGHT_ATTR = "data-pinky-line-height";
var LETTER_SPACING_ATTR = "data-pinky-letter-spacing";
function setLineHeight(value, root = document.documentElement) {
  const clamped = Math.max(1, Math.min(3, value));
  root.style.setProperty("--pinky-line-height", String(clamped));
  root.setAttribute(LINE_HEIGHT_ATTR, String(clamped));
}
function getLineHeight(root = document.documentElement) {
  const attr = root.getAttribute(LINE_HEIGHT_ATTR);
  return attr ? parseFloat(attr) : 1.5;
}
function setLetterSpacing(value, root = document.documentElement) {
  const clamped = Math.max(0, Math.min(10, value));
  root.style.setProperty("--pinky-letter-spacing", `${clamped}px`);
  root.setAttribute(LETTER_SPACING_ATTR, String(clamped));
}
function getLetterSpacing(root = document.documentElement) {
  const attr = root.getAttribute(LETTER_SPACING_ATTR);
  return attr ? parseFloat(attr) : 0;
}
function injectSpacingStyles() {
  const id = "pinky-spacing-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    :root[data-pinky-line-height] * {
      line-height: var(--pinky-line-height) !important;
    }
    :root[data-pinky-letter-spacing] * {
      letter-spacing: var(--pinky-letter-spacing) !important;
    }
  `;
  document.head.appendChild(style);
}

// src/accessibility/dyslexia.ts
var DYSLEXIA_ATTR = "data-pinky-dyslexia";
var FONT_URL = "https://fonts.googleapis.com/css2?family=OpenDyslexic&display=swap";
function enableDyslexiaFont(root = document.documentElement) {
  loadDyslexiaFont();
  root.setAttribute(DYSLEXIA_ATTR, "true");
  injectDyslexiaStyles();
}
function disableDyslexiaFont(root = document.documentElement) {
  root.removeAttribute(DYSLEXIA_ATTR);
}
function isDyslexiaFontEnabled(root = document.documentElement) {
  return root.hasAttribute(DYSLEXIA_ATTR);
}
function loadDyslexiaFont() {
  const id = "pinky-dyslexia-font";
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = FONT_URL;
  document.head.appendChild(link);
}
function injectDyslexiaStyles() {
  const id = "pinky-dyslexia-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
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

// src/accessibility/reading-ruler.ts
var rulerEl = null;
var rulerHandler = null;
function enableReadingRuler() {
  if (rulerEl) return;
  rulerEl = document.createElement("div");
  rulerEl.id = "pinky-reading-ruler";
  rulerEl.setAttribute("aria-hidden", "true");
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
  rulerHandler = (e) => {
    if (rulerEl) rulerEl.style.top = `${e.clientY}px`;
  };
  document.addEventListener("mousemove", rulerHandler);
}
function disableReadingRuler() {
  if (rulerEl) {
    rulerEl.remove();
    rulerEl = null;
  }
  if (rulerHandler) {
    document.removeEventListener("mousemove", rulerHandler);
    rulerHandler = null;
  }
}
function isReadingRulerEnabled() {
  return rulerEl !== null;
}

// src/accessibility/speech.ts
var utterance = null;
function isSpeechAvailable() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
function speak(text, lang = "es-ES", rate = 1, pitch = 1) {
  if (!isSpeechAvailable()) return;
  stopSpeech();
  utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = pitch;
  window.speechSynthesis.speak(utterance);
}
function stopSpeech() {
  if (isSpeechAvailable()) window.speechSynthesis.cancel();
  utterance = null;
}
function speakElement(element, lang = "es-ES") {
  const text = element.getAttribute("aria-label") ?? element.textContent ?? "";
  speak(text.trim(), lang);
}
function isSpeaking() {
  return isSpeechAvailable() && window.speechSynthesis.speaking;
}

// src/accessibility/storage.ts
var STORAGE_KEY = "pinkyacces-prefs";
function savePreferences(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
  }
}
function loadPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
  }
  return {};
}
function clearPreferences() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
  }
}

// src/accessibility/profiles.ts
var PROFILES = {
  "low-vision": {
    name: "low-vision",
    label: "Baja visi\xF3n",
    preferences: {
      fontScale: 1.5,
      highContrast: true,
      readingTheme: "dark",
      lineHeight: 1.8,
      letterSpacing: 1
    }
  },
  dyslexia: {
    name: "dyslexia",
    label: "Dislexia",
    preferences: {
      fontScale: 1.2,
      dyslexiaFont: true,
      lineHeight: 2,
      letterSpacing: 2
    }
  },
  senior: {
    name: "senior",
    label: "Adulto mayor",
    preferences: {
      fontScale: 1.4,
      lineHeight: 1.8,
      readingTheme: "sepia",
      letterSpacing: 1
    }
  },
  "color-blind": {
    name: "color-blind",
    label: "Daltonismo",
    preferences: {
      highContrast: true,
      readingTheme: "high-contrast"
    }
  },
  default: {
    name: "default",
    label: "Por defecto",
    preferences: {}
  }
};
function applyProfile(profileName, root = document.documentElement) {
  const profile = PROFILES[profileName];
  if (!profile) return;
  const prefs = profile.preferences;
  resetFontScale(root);
  resetReadingTheme(root);
  disableDyslexiaFont(root);
  if (prefs.fontScale !== void 0) setFontScale(prefs.fontScale, root);
  if (prefs.readingTheme) setReadingTheme(prefs.readingTheme, root);
  if (prefs.lineHeight !== void 0) setLineHeight(prefs.lineHeight, root);
  if (prefs.letterSpacing !== void 0) setLetterSpacing(prefs.letterSpacing, root);
  if (prefs.dyslexiaFont) enableDyslexiaFont(root);
  savePreferences({ ...prefs, profile: profileName });
}
function resetProfile(root = document.documentElement) {
  applyProfile("default", root);
}

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

export { DEFAULT_I18N, I18N_EN, PROFILES, TourEngine, TourKeyboard, TourOverlay, TourTooltip, applyProfile, clearPreferences, disableDyslexiaFont, disableReadingRuler, enableDyslexiaFont, enableReadingRuler, getFontScale, getLetterSpacing, getLineHeight, getReadingTheme, injectContrastStyles, injectSpacingStyles, isDyslexiaFontEnabled, isReadingRulerEnabled, isSpeaking, isSpeechAvailable, loadPreferences, mergeI18n, resetFontScale, resetProfile, resetReadingTheme, savePreferences, setFontScale, setLetterSpacing, setLineHeight, setReadingTheme, speak, speakElement, stopSpeech };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map