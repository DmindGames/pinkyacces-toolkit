export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'center';

export interface TourStep {
  /** CSS selector or element reference */
  target: string | HTMLElement | null;
  title: string;
  description: string;
  position?: TooltipPosition;
  /** Called before this step is shown. Return false to skip */
  beforeShow?: () => boolean | Promise<boolean>;
  /** Called after this step is shown */
  afterShow?: () => void | Promise<void>;
}

export interface TourI18n {
  next: string;
  prev: string;
  finish: string;
  skip: string;
  stepOf: (current: number, total: number) => string;
  close: string;
}

export interface TourCallbacks {
  onStart?: () => void;
  onStepChange?: (stepIndex: number, step: TourStep) => void;
  onComplete?: () => void;
  onCancel?: () => void;
}

export interface TourOptions {
  steps: TourStep[];
  i18n?: Partial<TourI18n>;
  callbacks?: TourCallbacks;
  /** Whether to show a progress bar */
  showProgress?: boolean;
  /** Allow closing by clicking outside */
  closeOnOverlayClick?: boolean;
  /** Auto-scroll to target element */
  scrollToTarget?: boolean;
  /** z-index base */
  zIndex?: number;
}
