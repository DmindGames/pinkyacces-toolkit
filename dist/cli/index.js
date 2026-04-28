#!/usr/bin/env node
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';

function log(message) {
  console.log(message);
}
function success(message) {
  console.log(`\x1B[32m\u2714\x1B[0m ${message}`);
}
function error(message) {
  console.error(`\x1B[31m\u2716\x1B[0m ${message}`);
}
function warn(message) {
  console.warn(`\x1B[33m\u26A0\x1B[0m ${message}`);
}
function info(message) {
  console.log(`\x1B[36m\u2139\x1B[0m ${message}`);
}
function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}
function writeFile(filePath, content) {
  const dir = filePath.split("/").slice(0, -1).join("/");
  if (dir) ensureDir(dir);
  writeFileSync(filePath, content, "utf-8");
}
function fileExists(filePath) {
  return existsSync(filePath);
}
function getCwd() {
  return process.cwd();
}

// src/cli/commands/init.ts
var CONFIG_TEMPLATE = `// pinky.config.js - Configuraci\xF3n de accesibilidad
export default {
  // Perfil inicial (low-vision | dyslexia | senior | color-blind | default)
  defaultProfile: 'default',

  // Escala de fuente por defecto (0.5 - 3.0)
  fontScale: 1,

  // Tema inicial (default | high-contrast | sepia | dark)
  readingTheme: 'default',

  // Habilitar tipograf\xEDa para dislexia
  dyslexiaFont: false,

  // Mostrar regla de lectura
  readingRuler: false,

  // Persistir preferencias en localStorage
  persistPreferences: true,

  // Dominio o contexto de la app (opcional)
  appContext: undefined,
};
`;
async function runInit() {
  const cwd = getCwd();
  const configPath = join(cwd, "pinky.config.js");
  if (fileExists(configPath)) {
    warn("Ya existe un archivo pinky.config.js en este directorio.");
    info("Si deseas sobreescribirlo, elim\xEDnalo manualmente y vuelve a ejecutar pinky init.");
    return;
  }
  writeFile(configPath, CONFIG_TEMPLATE);
  success("Archivo pinky.config.js creado correctamente.");
  info("Edita el archivo para configurar tus preferencias de accesibilidad.");
  info("Ejemplo de uso:\n");
  console.log("  import { applyProfile } from 'pinkyacces-toolkit';");
  console.log("  applyProfile('low-vision');");
}
var TOUR_TEMPLATE = `// pinky-tour.config.js - Configuraci\xF3n de tour interactivo
import { TourEngine } from 'pinkyacces-toolkit';

/**
 * Ejemplo de tour de onboarding para sistema administrativo
 */
export const adminTour = new TourEngine({
  steps: [
    {
      target: '#nav-menu',
      title: 'Men\xFA de navegaci\xF3n',
      description: 'Desde aqu\xED puedes acceder a todas las secciones del sistema.',
      position: 'right',
    },
    {
      target: '#dashboard-summary',
      title: 'Resumen del panel',
      description: 'Aqu\xED encontrar\xE1s un resumen de las m\xE9tricas m\xE1s importantes.',
      position: 'bottom',
    },
    {
      target: '#user-profile',
      title: 'Perfil de usuario',
      description: 'Haz clic aqu\xED para editar tu perfil y preferencias.',
      position: 'bottom',
    },
    {
      target: null,
      title: '\xA1Listo!',
      description: 'Has completado el tour. Puedes iniciarlo de nuevo desde el men\xFA de ayuda.',
      position: 'center',
    },
  ],
  i18n: {
    next: 'Siguiente',
    prev: 'Anterior',
    finish: 'Finalizar',
    skip: 'Saltar tour',
  },
  callbacks: {
    onStart: () => console.log('Tour iniciado'),
    onStepChange: (index, step) => console.log('Paso:', index, step.title),
    onComplete: () => console.log('Tour completado'),
    onCancel: () => console.log('Tour cancelado'),
  },
  scrollToTarget: true,
  closeOnOverlayClick: false,
});

// Para iniciar el tour:
// adminTour.start();
`;
async function runTourInit() {
  const cwd = getCwd();
  const tourPath = join(cwd, "pinky-tour.config.js");
  if (fileExists(tourPath)) {
    warn("Ya existe un archivo pinky-tour.config.js en este directorio.");
    info("Si deseas sobreescribirlo, elim\xEDnalo manualmente y vuelve a ejecutar pinky tour:init.");
    return;
  }
  writeFile(tourPath, TOUR_TEMPLATE);
  success("Archivo pinky-tour.config.js creado correctamente.");
  info("Edita los steps del tour seg\xFAn tus necesidades.");
  info("Usa los selectores CSS de tu aplicaci\xF3n para los targets.\n");
  console.log("  Ejemplo de inicio:");
  console.log("  import { adminTour } from './pinky-tour.config.js';");
  console.log("  adminTour.start();");
}
function checkNodeVersion() {
  const version = process.version;
  const major = parseInt(version.split(".")[0].replace("v", ""), 10);
  if (major >= 18) {
    return { passed: true, message: `Node.js ${version} \u2713` };
  }
  return { passed: false, message: `Node.js ${version} - Se requiere >= 18.0.0` };
}
function checkPinkyConfig() {
  const cwd = getCwd();
  const configPath = join(cwd, "pinky.config.js");
  if (existsSync(configPath)) {
    return { passed: true, message: "pinky.config.js encontrado \u2713" };
  }
  return { passed: false, message: "pinky.config.js no encontrado. Ejecuta: pinky init" };
}
function checkPackageJson() {
  const cwd = getCwd();
  const pkgPath = join(cwd, "package.json");
  if (!existsSync(pkgPath)) {
    return { passed: false, message: "package.json no encontrado" };
  }
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    const deps = { ...pkg.dependencies ?? {}, ...pkg.devDependencies ?? {} };
    if ("pinkyacces-toolkit" in deps) {
      return { passed: true, message: `pinkyacces-toolkit en dependencias (${deps["pinkyacces-toolkit"]}) \u2713` };
    }
    return { passed: false, message: "pinkyacces-toolkit no encontrado en package.json" };
  } catch {
    return { passed: false, message: "Error al leer package.json" };
  }
}
function checkTourConfig() {
  const cwd = getCwd();
  const tourPath = join(cwd, "pinky-tour.config.js");
  if (existsSync(tourPath)) {
    return { passed: true, message: "pinky-tour.config.js encontrado \u2713" };
  }
  return { passed: false, message: "pinky-tour.config.js no encontrado. Ejecuta: pinky tour:init" };
}
async function runDoctor() {
  console.log("\n\u{1FA7A} Pinky Doctor - Validando configuraci\xF3n del proyecto\n");
  const checks = [
    checkNodeVersion(),
    checkPackageJson(),
    checkPinkyConfig(),
    checkTourConfig()
  ];
  let allPassed = true;
  for (const check of checks) {
    if (check.passed) {
      success(check.message);
    } else {
      error(check.message);
      allPassed = false;
    }
  }
  console.log("");
  if (allPassed) {
    success("Todo en orden. Tu proyecto est\xE1 listo para usar pinkyacces-toolkit.");
  } else {
    warn("Hay problemas que resolver. Revisa los mensajes anteriores.");
    info("Documentaci\xF3n: https://github.com/DmindGames/pinkyacces-toolkit");
  }
}

// src/cli/commands/demo.ts
async function runDemo() {
  console.log("\n\u{1F3A8} Pinky Demo - Instrucciones de integraci\xF3n\n");
  info("Instala la librer\xEDa:");
  log("  npm install pinkyacces-toolkit\n");
  info("Uso b\xE1sico de accesibilidad:");
  log(`  import { applyProfile, setFontScale, setReadingTheme } from 'pinkyacces-toolkit';

  // Aplicar perfil de baja visi\xF3n
  applyProfile('low-vision');

  // O configurar manualmente
  setFontScale(1.5);
  setReadingTheme('high-contrast');
`);
  info("Tour interactivo:");
  log(`  import { TourEngine } from 'pinkyacces-toolkit';

  const tour = new TourEngine({
    steps: [
      {
        target: '#header',
        title: 'Bienvenido',
        description: 'Esta es la cabecera de la aplicaci\xF3n.',
        position: 'bottom',
      },
      {
        target: '#main-content',
        title: 'Contenido principal',
        description: 'Aqu\xED encontrar\xE1s el contenido principal.',
        position: 'right',
      },
    ],
    callbacks: {
      onComplete: () => console.log('\xA1Tour completado!'),
    },
  });

  tour.start();
`);
  info("Uso con npx:");
  log("  npx pinkyacces-toolkit init          # Crea configuraci\xF3n base");
  log("  npx pinkyacces-toolkit tour:init     # Genera plantilla de tour");
  log("  npx pinkyacces-toolkit doctor        # Valida configuraci\xF3n");
  console.log("");
  success("Para m\xE1s ejemplos visita: https://github.com/DmindGames/pinkyacces-toolkit/tree/main/examples");
}

// src/cli/index.ts
var VERSION = "0.1.0";
function printHelp() {
  console.log(`
pinky - Pinkyacces Toolkit CLI v${VERSION}

Uso: pinky <comando>

Comandos:
  init          Crea configuraci\xF3n base de accesibilidad (pinky.config.js)
  tour:init     Genera plantilla de tour interactivo (pinky-tour.config.js)
  doctor        Valida configuraci\xF3n y dependencias del proyecto
  demo          Muestra instrucciones de integraci\xF3n y ejemplos

Opciones:
  --help, -h    Muestra esta ayuda
  --version, -v Muestra la versi\xF3n

Ejemplos:
  pinky init
  pinky tour:init
  pinky doctor
  pinky demo
`);
}
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }
  if (command === "--version" || command === "-v") {
    console.log(`pinkyacces-toolkit v${VERSION}`);
    return;
  }
  switch (command) {
    case "init":
      await runInit();
      break;
    case "tour:init":
      await runTourInit();
      break;
    case "doctor":
      await runDoctor();
      break;
    case "demo":
      await runDemo();
      break;
    default:
      error(`Comando desconocido: "${command}"`);
      info('Usa "pinky --help" para ver los comandos disponibles.');
      process.exit(1);
  }
}
main().catch((err) => {
  error(String(err));
  process.exit(1);
});
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map