import { join } from 'path';
import { success, warn, writeFile, fileExists, getCwd, info } from '../utils.js';

const TOUR_TEMPLATE = `// pinky-tour.config.js - Configuración de tour interactivo
import { TourEngine } from 'pinkyacces-toolkit';

/**
 * Ejemplo de tour de onboarding para sistema administrativo
 */
export const adminTour = new TourEngine({
  steps: [
    {
      target: '#nav-menu',
      title: 'Menú de navegación',
      description: 'Desde aquí puedes acceder a todas las secciones del sistema.',
      position: 'right',
    },
    {
      target: '#dashboard-summary',
      title: 'Resumen del panel',
      description: 'Aquí encontrarás un resumen de las métricas más importantes.',
      position: 'bottom',
    },
    {
      target: '#user-profile',
      title: 'Perfil de usuario',
      description: 'Haz clic aquí para editar tu perfil y preferencias.',
      position: 'bottom',
    },
    {
      target: null,
      title: '¡Listo!',
      description: 'Has completado el tour. Puedes iniciarlo de nuevo desde el menú de ayuda.',
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

export async function runTourInit(): Promise<void> {
  const cwd = getCwd();
  const tourPath = join(cwd, 'pinky-tour.config.js');

  if (fileExists(tourPath)) {
    warn('Ya existe un archivo pinky-tour.config.js en este directorio.');
    info('Si deseas sobreescribirlo, elimínalo manualmente y vuelve a ejecutar pinky tour:init.');
    return;
  }

  writeFile(tourPath, TOUR_TEMPLATE);
  success('Archivo pinky-tour.config.js creado correctamente.');
  info('Edita los steps del tour según tus necesidades.');
  info('Usa los selectores CSS de tu aplicación para los targets.\n');
  console.log('  Ejemplo de inicio:');
  console.log('  import { adminTour } from \'./pinky-tour.config.js\';');
  console.log('  adminTour.start();');
}
