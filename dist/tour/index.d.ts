type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'center';
interface TourStep {
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
interface TourI18n {
    next: string;
    prev: string;
    finish: string;
    skip: string;
    stepOf: (current: number, total: number) => string;
    close: string;
}
interface TourCallbacks {
    onStart?: () => void;
    onStepChange?: (stepIndex: number, step: TourStep) => void;
    onComplete?: () => void;
    onCancel?: () => void;
}
interface TourOptions {
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

declare class TourEngine {
    private options;
    private currentStep;
    private isRunning;
    private overlay;
    private tooltip;
    private keyboard;
    private previousFocus;
    constructor(options: TourOptions);
    start(): Promise<void>;
    next(): Promise<void>;
    prev(): Promise<void>;
    cancel(): Promise<void>;
    complete(): Promise<void>;
    private showStep;
    private resolveTarget;
    private cleanup;
    private delay;
    get stepIndex(): number;
    get running(): boolean;
}

declare class TourOverlay {
    private overlayEl;
    private highlightEl;
    private zIndex;
    constructor(zIndex?: number);
    mount(onClick?: () => void): void;
    unmount(): void;
    highlight(target: HTMLElement | null): void;
    updateHighlight(target: HTMLElement | null): void;
}

declare class TourTooltip {
    private el;
    private zIndex;
    constructor(zIndex?: number);
    mount(): void;
    unmount(): void;
    render(step: TourStep, stepIndex: number, totalSteps: number, i18n: TourI18n, callbacks: {
        onNext: () => void;
        onPrev: () => void;
        onSkip: () => void;
    }, isFirst: boolean, isLast: boolean): void;
    position(target: HTMLElement | null, preferred?: TooltipPosition): void;
    focus(): void;
    getElement(): HTMLElement;
}

declare class TourKeyboard {
    private handler;
    mount(callbacks: {
        onNext: () => void;
        onPrev: () => void;
        onCancel: () => void;
    }, tooltipEl: HTMLElement): void;
    unmount(): void;
    private trapFocus;
}

declare const DEFAULT_I18N: TourI18n;
declare const I18N_EN: TourI18n;
declare function mergeI18n(partial?: Partial<TourI18n>): TourI18n;

export { DEFAULT_I18N, I18N_EN, type TooltipPosition, type TourCallbacks, TourEngine, type TourI18n, TourKeyboard, type TourOptions, TourOverlay, type TourStep, TourTooltip, mergeI18n };
