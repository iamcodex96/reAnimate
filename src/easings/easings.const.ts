const BASE_EASING = {
    /**
     * Linear easing
     * @param t - Progress from 0 to 1
     * @returns Linear interpolation (no easing)
     * @see https://easings.net/#linear
     */
    linear: (t: number) => t,

    /**
     * Quadratic ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInQuad
     */
    easeInQuad: (t: number) => t * t,

    /**
     * Quadratic ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutQuad
     */
    easeOutQuad: (t: number) => t * (2 - t),

    /**
     * Quadratic ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutQuad
     */
    easeInOutQuad: (t: number) =>
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

    /**
     * Cubic ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInCubic
     */
    easeInCubic: (t: number) => t * t * t,

    /**
     * Cubic ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutCubic
     */
    easeOutCubic: (t: number) => (--t) * t * t + 1,

    /**
     * Cubic ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutCubic
     */
    easeInOutCubic: (t: number) =>
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

    /**
     * Quartic ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInQuart
     */
    easeInQuart: (t: number) => t * t * t * t,

    /**
     * Quartic ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutQuart
     */
    easeOutQuart: (t: number) => 1 - (--t) * t * t * t,

    /**
     * Quartic ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutQuart
     */
    easeInOutQuart: (t: number) =>
        t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,

    /**
     * Quintic ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInQuint
     */
    easeInQuint: (t: number) => t * t * t * t * t,

    /**
     * Quintic ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutQuint
     */
    easeOutQuint: (t: number) => 1 + (--t) * t * t * t * t,

    /**
     * Quintic ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutQuint
     */
    easeInOutQuint: (t: number) =>
        t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,

    /**
     * Sinusoidal ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInSine
     */
    easeInSine: (t: number) => 1 - Math.cos((t * Math.PI) / 2),

    /**
     * Sinusoidal ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutSine
     */
    easeOutSine: (t: number) => Math.sin((t * Math.PI) / 2),

    /**
     * Sinusoidal ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutSine
     */
    easeInOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,

    /**
     * Exponential ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInExpo
     */
    easeInExpo: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),

    /**
     * Exponential ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutExpo
     */
    easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),

    /**
     * Exponential ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutExpo
     */
    easeInOutExpo: (t: number) => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
        return (2 - Math.pow(2, -20 * t + 10)) / 2;
    },

    /**
     * Circular ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInCirc
     */
    easeInCirc: (t: number) => 1 - Math.sqrt(1 - t * t),

    /**
     * Circular ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutCirc
     */
    easeOutCirc: (t: number) => Math.sqrt(1 - (--t) * t),

    /**
     * Circular ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutCirc
     */
    easeInOutCirc: (t: number) =>
        t < 0.5
            ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
            : (Math.sqrt(1 - 4 * (t - 1) * (t - 1)) + 1) / 2,

    /**
     * Back ease-in - Overshooting cubic easing
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity with overshoot
     * @see https://easings.net/#easeInBack
     */
    easeInBack: (t: number) => {
        const s = 1.70158;
        return t * t * ((s + 1) * t - s);
    },

    /**
     * Back ease-out - Overshooting cubic easing
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity with overshoot
     * @see https://easings.net/#easeOutBack
     */
    easeOutBack: (t: number) => {
        const s = 1.70158;
        return --t * t * ((s + 1) * t + s) + 1;
    },

    /**
     * Back ease-in-out - Overshooting cubic easing
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration with overshoot in both directions
     * @see https://easings.net/#easeInOutBack
     */
    easeInOutBack: (t: number) => {
        const s = 1.70158 * 1.525;
        if (t < 0.5) {
            return t * t * ((s + 1) * 2 * t - s) / 2;
        }
        return ((t - 1) * t * ((s + 1) * 2 * t + s) + 2) / 2;
    },

    /**
     * Elastic ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity with elastic effect
     * @see https://easings.net/#easeInElastic
     */
    easeInElastic: (t: number) => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
    },

    /**
     * Elastic ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity with elastic effect
     * @see https://easings.net/#easeOutElastic
     */
    easeOutElastic: (t: number) => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
    },

    /**
     * Elastic ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration with elastic effect
     * @see https://easings.net/#easeInOutElastic
     */
    easeInOutElastic: (t: number) => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        t *= 2;
        if (t < 1) {
            return -0.5 * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
        }
        return 0.5 * Math.pow(2, -10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) + 1;
    },

    /**
     * Bounce ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity with bouncing effect
     * @see https://easings.net/#easeInBounce
     */
    easeInBounce: (t: number) => 1 - BASE_EASING.easeOutBounce(1 - t),

    /**
     * Bounce ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity with bouncing effect
     * @see https://easings.net/#easeOutBounce
     */
    easeOutBounce: (t: number) => {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            t -= 1.5 / 2.75;
            return 7.5625 * t * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            t -= 2.25 / 2.75;
            return 7.5625 * t * t + 0.9375;
        } else {
            t -= 2.625 / 2.75;
            return 7.5625 * t * t + 0.984375;
        }
    },

    /**
     * Bounce ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration with bouncing effect
     * @see https://easings.net/#easeInOutBounce
     */
    easeInOutBounce: (t: number) =>
        t < 0.5
            ? BASE_EASING.easeInBounce(t * 2) * 0.5
            : BASE_EASING.easeOutBounce(t * 2 - 1) * 0.5 + 0.5,
}

export default BASE_EASING;