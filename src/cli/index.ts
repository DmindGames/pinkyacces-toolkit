import { runInit } from './commands/init.js';
import { runTourInit } from './commands/tour-init.js';
import { runDoctor } from './commands/doctor.js';
import { runDemo } from './commands/demo.js';
import { error, info } from './utils.js';

const VERSION = '0.1.0';

function printHelp(): void {
  console.log(`
pinky - Pinkyacces Toolkit CLI v${VERSION}

Uso: pinky <comando>

Comandos:
  init          Crea configuración base de accesibilidad (pinky.config.js)
  tour:init     Genera plantilla de tour interactivo (pinky-tour.config.js)
  doctor        Valida configuración y dependencias del proyecto
  demo          Muestra instrucciones de integración y ejemplos

Opciones:
  --help, -h    Muestra esta ayuda
  --version, -v Muestra la versión

Ejemplos:
  pinky init
  pinky tour:init
  pinky doctor
  pinky demo
`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  if (command === '--version' || command === '-v') {
    console.log(`pinkyacces-toolkit v${VERSION}`);
    return;
  }

  switch (command) {
    case 'init':
      await runInit();
      break;
    case 'tour:init':
      await runTourInit();
      break;
    case 'doctor':
      await runDoctor();
      break;
    case 'demo':
      await runDemo();
      break;
    default:
      error(`Comando desconocido: "${command}"`);
      info('Usa "pinky --help" para ver los comandos disponibles.');
      process.exit(1);
  }
}

main().catch((err: unknown) => {
  error(String(err));
  process.exit(1);
});
