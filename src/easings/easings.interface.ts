export enum EasingType {
    Linear = 'linear',
    Quad = 'quad',
    Cubic = 'cubic',
    Elastic = 'elastic',
    Back = 'back',
    Bounce = 'bounce',
    Sine = 'sine',
    Circular = 'circular',
    Exponential = 'exponential',
    Quartic = 'quartic',
    Quintic = 'quintic',
    Quadratic = 'quadratic',
    CubicBezier = 'cubicBezier',
}

export interface EasingConfig {
    overshoot?: number;    // For back ease
    amplitude?: number;     // For elastic ease
    period?: number;       // For elastic ease
    bounceStrength?: number; // For bounce ease
}

export interface EasingFunction {
    (t: number): number;
    reverse?: () => EasingFunction;
    mirror?: () => EasingFunction;
    mix?: (other: EasingFunction, balance: number) => EasingFunction;
}
