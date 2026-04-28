import { join } from 'path';
import { success, warn, writeFile, fileExists, getCwd, info } from '../utils.js';

const CONFIG_TEMPLATE = `// pinky.config.js - Configuración de accesibilidad
export default {
  // Perfil inicial (low-vision | dyslexia | senior | color-blind | default)
  defaultProfile: 'default',

  // Escala de fuente por defecto (0.5 - 3.0)
  fontScale: 1,

  // Tema inicial (default | high-contrast | sepia | dark)
  readingTheme: 'default',

  // Habilitar tipografía para dislexia
  dyslexiaFont: false,

  // Mostrar regla de lectura
  readingRuler: false,

  // Persistir preferencias en localStorage
  persistPreferences: true,

  // Dominio o contexto de la app (opcional)
  appContext: undefined,
};
`;

export async function runInit(): Promise<void> {
  const cwd = getCwd();
  const configPath = join(cwd, 'pinky.config.js');

  if (fileExists(configPath)) {
    warn('Ya existe un archivo pinky.config.js en este directorio.');
    info('Si deseas sobreescribirlo, elimínalo manualmente y vuelve a ejecutar pinky init.');
    return;
  }

  writeFile(configPath, CONFIG_TEMPLATE);
  success('Archivo pinky.config.js creado correctamente.');
  info('Edita el archivo para configurar tus preferencias de accesibilidad.');
  info('Ejemplo de uso:\n');
  console.log('  import { applyProfile } from \'pinkyacces-toolkit\';');
  console.log('  applyProfile(\'low-vision\');');
}
