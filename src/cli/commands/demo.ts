import { info, success, log } from '../utils.js';

export async function runDemo(): Promise<void> {
  console.log('\n🎨 Pinky Demo - Instrucciones de integración\n');

  info('Instala la librería:');
  log('  npm install pinkyacces-toolkit\n');

  info('Uso básico de accesibilidad:');
  log(`  import { applyProfile, setFontScale, setReadingTheme } from 'pinkyacces-toolkit';

  // Aplicar perfil de baja visión
  applyProfile('low-vision');

  // O configurar manualmente
  setFontScale(1.5);
  setReadingTheme('high-contrast');
`);

  info('Tour interactivo:');
  log(`  import { TourEngine } from 'pinkyacces-toolkit';

  const tour = new TourEngine({
    steps: [
      {
        target: '#header',
        title: 'Bienvenido',
        description: 'Esta es la cabecera de la aplicación.',
        position: 'bottom',
      },
      {
        target: '#main-content',
        title: 'Contenido principal',
        description: 'Aquí encontrarás el contenido principal.',
        position: 'right',
      },
    ],
    callbacks: {
      onComplete: () => console.log('¡Tour completado!'),
    },
  });

  tour.start();
`);

  info('Uso con npx:');
  log('  npx pinkyacces-toolkit init          # Crea configuración base');
  log('  npx pinkyacces-toolkit tour:init     # Genera plantilla de tour');
  log('  npx pinkyacces-toolkit doctor        # Valida configuración');

  console.log('');
  success('Para más ejemplos visita: https://github.com/DmindGames/pinkyacces-toolkit/tree/main/examples');
}
