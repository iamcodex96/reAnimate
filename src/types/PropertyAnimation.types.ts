/**
 * Property animation definition
 * Can be specified in multiple formats:
 * - [from, to] - Explicit start and end values
 * - to - Single value (implicit from current state)
 * - { from, to, steps } - Multi-step animation with intermediate values
 * - { value, duration, delay } - Value with custom timing
 */
export type PropertyAnimation =
    | [any, any]                              // [from, to] format
    | any                                     // to-value only format
    | { from: any; to: any; steps?: any[] }  // Multi-step format
    | { value: any; duration?: number; delay?: number }; // Custom timing format

/**
 * Normalized property animation
 * Internal representation after parsing input formats
 */
export interface NormalizedPropertyAnimation {
    from: any;
    to: any;
    steps?: any[];
    duration?: number;
    delay?: number;
}
