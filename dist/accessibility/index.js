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

export { PROFILES, applyProfile, clearPreferences, disableDyslexiaFont, disableReadingRuler, enableDyslexiaFont, enableReadingRuler, getFontScale, getLetterSpacing, getLineHeight, getReadingTheme, injectContrastStyles, injectSpacingStyles, isDyslexiaFontEnabled, isReadingRulerEnabled, isSpeaking, isSpeechAvailable, loadPreferences, resetFontScale, resetProfile, resetReadingTheme, savePreferences, setFontScale, setLetterSpacing, setLineHeight, setReadingTheme, speak, speakElement, stopSpeech };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map