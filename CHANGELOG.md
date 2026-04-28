# Changelog

All notable changes to `pinkyacces-toolkit` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-01-01

### Added

#### Accessibility Module
- `setFontScale` / `getFontScale` / `resetFontScale` – dynamic font scaling (0.5×–3×)
- `setReadingTheme` / `getReadingTheme` / `resetReadingTheme` – reading themes: `default`, `high-contrast`, `sepia`, `dark`
- `injectContrastStyles` – injects CSS for contrast themes
- `setLineHeight` / `getLineHeight` – configurable line height (1–3)
- `setLetterSpacing` / `getLetterSpacing` – configurable letter spacing (0–10px)
- `injectSpacingStyles` – injects CSS for spacing customization
- `enableDyslexiaFont` / `disableDyslexiaFont` / `isDyslexiaFontEnabled` – OpenDyslexic font support
- `enableReadingRuler` / `disableReadingRuler` / `isReadingRulerEnabled` – floating reading guide
- `speak` / `stopSpeech` / `speakElement` / `isSpeaking` / `isSpeechAvailable` – Web Speech API integration
- `savePreferences` / `loadPreferences` / `clearPreferences` – localStorage persistence
- `applyProfile` / `resetProfile` – predefined accessibility profiles: `low-vision`, `dyslexia`, `senior`, `color-blind`, `default`

#### Tour Module
- `TourEngine` – core class for managing interactive step-by-step tours
  - `start()` / `next()` / `prev()` / `cancel()` / `complete()` methods
  - `stepIndex` and `running` getters
- `TourOverlay` – semi-transparent overlay with element highlighting
- `TourTooltip` – accessible dialog tooltip with progress indicator
- `TourKeyboard` – keyboard navigation (Escape, ArrowLeft/Right, Enter) and focus trapping
- `TourStep` / `TourOptions` / `TourI18n` / `TourCallbacks` TypeScript interfaces
- `DEFAULT_I18N` (Spanish) and `I18N_EN` (English) locale objects
- `mergeI18n` – merge partial i18n overrides

#### CLI (`pinky`)
- `pinky init` – generate `pinky.config.js` configuration file
- `pinky tour:init` – generate `pinky-tour.config.js` tour template
- `pinky doctor` – validate project setup and dependencies
- `pinky demo` – display integration instructions and code examples
- `pinky --help` / `pinky --version`

#### Developer Experience
- Full TypeScript support with `.d.ts` declarations and source maps
- Dual ESM/CJS output via `tsup`
- Named exports for all modules with tree-shaking support
- Vitest test suite with `happy-dom` environment
- ESLint configuration for TypeScript
- CI workflow for Node.js 18.x and 20.x

[0.1.0]: https://github.com/DmindGames/pinkyacces-toolkit/releases/tag/v0.1.0
