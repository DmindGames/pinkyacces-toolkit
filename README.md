# pinkyacces-toolkit

> 🌸 Librería TypeScript de accesibilidad web con tours interactivos para aplicaciones web

[![CI](https://github.com/DmindGames/pinkyacces-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/DmindGames/pinkyacces-toolkit/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/pinkyacces-toolkit.svg)](https://www.npmjs.com/package/pinkyacces-toolkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-pink.svg)](LICENSE)

## Features

- ♿ **Accessibility profiles** – one-call presets for low-vision, dyslexia, senior, and color-blind users
- 🔤 **Font scaling** – smooth 0.5×–3× scaling
- 🎨 **Reading themes** – default, high-contrast, sepia, dark
- 📏 **Reading ruler** – floating guide line that follows the cursor
- 🧠 **Dyslexia font** – OpenDyslexic font injection
- 🔊 **Speech synthesis** – read any element aloud via Web Speech API
- 🎯 **Interactive tours** – step-by-step onboarding with overlay, tooltip, and keyboard navigation
- 💾 **Persistence** – saves preferences to localStorage
- 🖥 **CLI** – `pinky init`, `pinky tour:init`, `pinky doctor`, `pinky demo`
- 📦 **Dual ESM/CJS** – works in any bundler or vanilla JS
- 🏷 **Full TypeScript** – complete type declarations

## Installation

```bash
npm install pinkyacces-toolkit
```

## Quick Start

### Accessibility

```ts
import { applyProfile, setFontScale, setReadingTheme, injectContrastStyles } from 'pinkyacces-toolkit';

// Inject CSS (call once on app init)
injectContrastStyles();

// Apply a profile
applyProfile('low-vision');       // font 1.5×, dark theme, high contrast
applyProfile('dyslexia');         // OpenDyslexic font, wider spacing
applyProfile('senior');           // font 1.4×, sepia theme
applyProfile('color-blind');      // high-contrast theme
applyProfile('default');          // reset to defaults

// Or configure manually
setFontScale(1.3);
setReadingTheme('dark');
```

### Reading Ruler

```ts
import { enableReadingRuler, disableReadingRuler } from 'pinkyacces-toolkit';

enableReadingRuler();   // shows a horizontal line that follows the mouse
disableReadingRuler();
```

### Speech Synthesis

```ts
import { speak, stopSpeech } from 'pinkyacces-toolkit';

speak('Hello, welcome to our app!', 'en-US');
stopSpeech();
```

### Interactive Tours

```ts
import { TourEngine } from 'pinkyacces-toolkit';

const tour = new TourEngine({
  steps: [
    {
      target: '#navbar',
      title: 'Navigation',
      description: 'Use the nav bar to move between sections.',
      position: 'bottom',
    },
    {
      target: null,
      title: 'All done!',
      description: 'You completed the tour.',
      position: 'center',
    },
  ],
  callbacks: {
    onComplete: () => console.log('Tour finished'),
  },
});

tour.start();
```

### Persistence

```ts
import { savePreferences, loadPreferences, clearPreferences } from 'pinkyacces-toolkit';

const prefs = loadPreferences();   // restore saved settings
savePreferences({ fontScale: 1.4, readingTheme: 'sepia' });
clearPreferences();
```

## CLI

```bash
npx pinkyacces-toolkit init        # create pinky.config.js
npx pinkyacces-toolkit tour:init   # create pinky-tour.config.js
npx pinkyacces-toolkit doctor      # validate setup
npx pinkyacces-toolkit demo        # show examples
```

## API Reference

### Accessibility

| Function | Description |
|---|---|
| `applyProfile(name, root?)` | Apply a predefined accessibility profile |
| `resetProfile(root?)` | Reset to defaults |
| `setFontScale(scale, root?)` | Set font scale (0.5–3) |
| `getFontScale(root?)` | Get current font scale |
| `resetFontScale(root?)` | Reset font scale |
| `setReadingTheme(theme, root?)` | Set reading theme |
| `getReadingTheme(root?)` | Get current theme |
| `injectContrastStyles()` | Inject contrast CSS |
| `setLineHeight(value, root?)` | Set line height (1–3) |
| `setLetterSpacing(value, root?)` | Set letter spacing (0–10px) |
| `enableDyslexiaFont(root?)` | Enable OpenDyslexic font |
| `disableDyslexiaFont(root?)` | Disable dyslexia font |
| `enableReadingRuler()` | Show reading ruler |
| `disableReadingRuler()` | Hide reading ruler |
| `speak(text, lang?, rate?, pitch?)` | Read text aloud |
| `stopSpeech()` | Stop speech synthesis |
| `savePreferences(prefs)` | Persist preferences |
| `loadPreferences()` | Load persisted preferences |

### Tour Engine

| Method | Description |
|---|---|
| `new TourEngine(options)` | Create a tour instance |
| `tour.start()` | Start the tour |
| `tour.next()` | Go to next step |
| `tour.prev()` | Go to previous step |
| `tour.cancel()` | Cancel the tour |
| `tour.stepIndex` | Current step index |
| `tour.running` | Whether tour is active |

## Keyboard Navigation (Tour)

| Key | Action |
|---|---|
| `Escape` | Cancel tour |
| `ArrowRight` | Next step |
| `ArrowLeft` | Previous step |
| `Tab` | Focus trap within tooltip |

## License

MIT © [DmindGames](https://github.com/DmindGames)
Libreria para accesibilidad y tours 
