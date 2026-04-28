import type { TourI18n } from './TourTypes.js';

export const DEFAULT_I18N: TourI18n = {
  next: 'Siguiente',
  prev: 'Anterior',
  finish: 'Finalizar',
  skip: 'Saltar tour',
  close: 'Cerrar',
  stepOf: (current, total) => `Paso ${current} de ${total}`,
};

export const I18N_EN: TourI18n = {
  next: 'Next',
  prev: 'Previous',
  finish: 'Finish',
  skip: 'Skip tour',
  close: 'Close',
  stepOf: (current, total) => `Step ${current} of ${total}`,
};

export function mergeI18n(partial?: Partial<TourI18n>): TourI18n {
  return { ...DEFAULT_I18N, ...partial };
}
