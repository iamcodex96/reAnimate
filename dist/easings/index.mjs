const BASE_EASING = {
    /**
     * Linear easing
     * @param t - Progress from 0 to 1
     * @returns Linear interpolation (no easing)
     * @see https://easings.net/#linear
     */
    linear: (t) => t,
    /**
     * Quadratic ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInQuad
     */
    easeInQuad: (t) => t * t,
    /**
     * Quadratic ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutQuad
     */
    easeOutQuad: (t) => t * (2 - t),
    /**
     * Quadratic ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutQuad
     */
    easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    /**
     * Cubic ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInCubic
     */
    easeInCubic: (t) => t * t * t,
    /**
     * Cubic ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutCubic
     */
    easeOutCubic: (t) => (--t) * t * t + 1,
    /**
     * Cubic ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutCubic
     */
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    /**
     * Quartic ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInQuart
     */
    easeInQuart: (t) => t * t * t * t,
    /**
     * Quartic ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutQuart
     */
    easeOutQuart: (t) => 1 - (--t) * t * t * t,
    /**
     * Quartic ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutQuart
     */
    easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    /**
     * Quintic ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInQuint
     */
    easeInQuint: (t) => t * t * t * t * t,
    /**
     * Quintic ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutQuint
     */
    easeOutQuint: (t) => 1 + (--t) * t * t * t * t,
    /**
     * Quintic ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutQuint
     */
    easeInOutQuint: (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
    /**
     * Sinusoidal ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInSine
     */
    easeInSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
    /**
     * Sinusoidal ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutSine
     */
    easeOutSine: (t) => Math.sin((t * Math.PI) / 2),
    /**
     * Sinusoidal ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutSine
     */
    easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    /**
     * Exponential ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInExpo
     */
    easeInExpo: (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
    /**
     * Exponential ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutExpo
     */
    easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    /**
     * Exponential ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutExpo
     */
    easeInOutExpo: (t) => {
        if (t === 0)
            return 0;
        if (t === 1)
            return 1;
        if (t < 0.5)
            return Math.pow(2, 20 * t - 10) / 2;
        return (2 - Math.pow(2, -20 * t + 10)) / 2;
    },
    /**
     * Circular ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInCirc
     */
    easeInCirc: (t) => 1 - Math.sqrt(1 - t * t),
    /**
     * Circular ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutCirc
     */
    easeOutCirc: (t) => Math.sqrt(1 - (--t) * t),
    /**
     * Circular ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutCirc
     */
    easeInOutCirc: (t) => t < 0.5
        ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
        : (Math.sqrt(1 - 4 * (t - 1) * (t - 1)) + 1) / 2,
    /**
     * Back ease-in - Overshooting cubic easing
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity with overshoot
     * @see https://easings.net/#easeInBack
     */
    easeInBack: (t) => {
        const s = 1.70158;
        return t * t * ((s + 1) * t - s);
    },
    /**
     * Back ease-out - Overshooting cubic easing
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity with overshoot
     * @see https://easings.net/#easeOutBack
     */
    easeOutBack: (t) => {
        const s = 1.70158;
        return --t * t * ((s + 1) * t + s) + 1;
    },
    /**
     * Back ease-in-out - Overshooting cubic easing
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration with overshoot in both directions
     * @see https://easings.net/#easeInOutBack
     */
    easeInOutBack: (t) => {
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
    easeInElastic: (t) => {
        if (t === 0)
            return 0;
        if (t === 1)
            return 1;
        return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
    },
    /**
     * Elastic ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity with elastic effect
     * @see https://easings.net/#easeOutElastic
     */
    easeOutElastic: (t) => {
        if (t === 0)
            return 0;
        if (t === 1)
            return 1;
        return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
    },
    /**
     * Elastic ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration with elastic effect
     * @see https://easings.net/#easeInOutElastic
     */
    easeInOutElastic: (t) => {
        if (t === 0)
            return 0;
        if (t === 1)
            return 1;
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
    easeInBounce: (t) => 1 - BASE_EASING.easeOutBounce(1 - t),
    /**
     * Bounce ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity with bouncing effect
     * @see https://easings.net/#easeOutBounce
     */
    easeOutBounce: (t) => {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        }
        else if (t < 2 / 2.75) {
            t -= 1.5 / 2.75;
            return 7.5625 * t * t + 0.75;
        }
        else if (t < 2.5 / 2.75) {
            t -= 2.25 / 2.75;
            return 7.5625 * t * t + 0.9375;
        }
        else {
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
    easeInOutBounce: (t) => t < 0.5
        ? BASE_EASING.easeInBounce(t * 2) * 0.5
        : BASE_EASING.easeOutBounce(t * 2 - 1) * 0.5 + 0.5,
};

const createEasing = {
    /**
     * Creates a set of back easing functions with configurable overshoot
     * @param s - Overshoot amount (default: 1.70158). Higher values create more pronounced overshoot
     * @returns Object containing easeIn, easeOut, and easeInOut functions
     * @see https://easings.net/#easeInBack
     */
    backEasing: (s = 1.70158) => ({
        /**
         * Back ease-in with configurable overshoot
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating overshoot effect
         */
        easeIn: (t) => Number(t * t * ((s + 1) * t - s)) || 0,
        /**
         * Back ease-out with configurable overshoot
         * @param t - Progress from 0 to 1
         * @returns Value with decelerating overshoot effect
         */
        easeOut: (t) => --t * t * ((s + 1) * t + s) + 1,
        /**
         * Back ease-in-out with configurable overshoot
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating and decelerating overshoot effect
         */
        easeInOut: (t) => {
            const s2 = s * 1.525;
            t *= 2;
            if (t < 1)
                return 0.5 * (t * t * ((s2 + 1) * t - s2));
            return 0.5 * ((t -= 2) * t * ((s2 + 1) * t + s2) + 2);
        }
    }),
    /**
     * Creates a set of elastic easing functions with configurable parameters
     * @param amplitude - Amplitude of the elastic effect (default: 1). Higher values create larger oscillations
     * @param period - Period of the elastic effect (default: 0.3). Lower values create faster oscillations
     * @returns Object containing easeIn, easeOut, and easeInOut functions
     * @see https://easings.net/#easeInElastic
     */
    elasticEasing: (amplitude = 1, period = 0.3) => ({
        /**
         * Elastic ease-in with configurable amplitude and period
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating elastic effect
         */
        easeIn: (t) => {
            if (t === 0 || t === 1)
                return t;
            return -amplitude * Math.pow(2, 10 * (t - 1)) *
                Math.sin((t - 1 - period / (2 * Math.PI) * Math.asin(1 / amplitude)) *
                    (2 * Math.PI) / period);
        },
        /**
         * Elastic ease-out with configurable amplitude and period
         * @param t - Progress from 0 to 1
         * @returns Value with decelerating elastic effect
         */
        easeOut: (t) => {
            if (t === 0 || t === 1)
                return t;
            return amplitude * Math.pow(2, -10 * t) *
                Math.sin((t - period / (2 * Math.PI) * Math.asin(1 / amplitude)) *
                    (2 * Math.PI) / period) + 1;
        },
        /**
         * Elastic ease-in-out with configurable amplitude and period
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating and decelerating elastic effect
         */
        easeInOut: (t) => {
            if (t === 0 || t === 1)
                return t;
            t *= 2;
            if (t < 1) {
                return -0.5 * amplitude * Math.pow(2, 10 * (t - 1)) *
                    Math.sin((t - 1 - period / 4) * (2 * Math.PI) / period);
            }
            return amplitude * Math.pow(2, -10 * (t - 1)) *
                Math.sin((t - 1 - period / 4) * (2 * Math.PI) / period) * 0.5 + 1;
        }
    }),
    /**
     * Creates a set of bounce easing functions with configurable strength
     * @param strength - Strength of the bounce effect (default: 7.5625). Higher values create stronger bounces
     * @returns Object containing easeIn, easeOut, and easeInOut functions
     * @see https://easings.net/#easeInBounce
     */
    bouncyEasing: (strength = 7.5625) => ({
        /**
         * Bounce ease-in with configurable strength
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating bounce effect
         */
        easeIn: (t) => 1 - BASE_EASING.easeOutBounce(1 - t),
        /**
         * Bounce ease-out with configurable strength
         * @param t - Progress from 0 to 1
         * @returns Value with decelerating bounce effect
         */
        easeOut: (t) => {
            if (t < 1 / 2.75)
                return strength * t * t;
            if (t < 2 / 2.75) {
                t -= 1.5 / 2.75;
                return strength * t * t + 0.75;
            }
            if (t < 2.5 / 2.75) {
                t -= 2.25 / 2.75;
                return strength * t * t + 0.9375;
            }
            t -= 2.625 / 2.75;
            return strength * t * t + 0.984375;
        },
        /**
         * Bounce ease-in-out with configurable strength
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating and decelerating bounce effect
         */
        easeInOut: (t) => t < 0.5
            ? (1 - BASE_EASING.easeOutBounce(1 - 2 * t)) / 2
            : (1 + BASE_EASING.easeOutBounce(2 * t - 1)) / 2
    }),
    /**
     * Creates a set of exponential easing functions with configurable base
     * @param base - Base for exponential calculation (default: 2). Higher values create steeper curves
     * @returns Object containing easeIn, easeOut, and easeInOut functions
     * @see https://easings.net/#easeInExpo
     */
    expoEasing: (base = 2) => ({
        /**
         * Exponential ease-in with configurable base
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating exponential effect
         */
        easeIn: (t) => t === 0 ? 0 : Math.pow(base, 10 * (t - 1)),
        /**
         * Exponential ease-out with configurable base
         * @param t - Progress from 0 to 1
         * @returns Value with decelerating exponential effect
         */
        easeOut: (t) => t === 1 ? 1 : 1 - Math.pow(base, -10 * t),
        /**
         * Exponential ease-in-out with configurable base
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating and decelerating exponential effect
         */
        easeInOut: (t) => {
            if (t === 0)
                return 0;
            if (t === 1)
                return 1;
            if (t < 0.5)
                return Math.pow(base, 20 * t - 10) / 2;
            return (2 - Math.pow(base, -20 * t + 10)) / 2;
        }
    }),
    /**
     * Creates a set of circular easing functions with configurable radius
     * @param radius - Radius for circular calculation (default: 1). Affects the curvature of the easing
     * @returns Object containing easeIn, easeOut, and easeInOut functions
     * @see https://easings.net/#easeInCirc
     */
    circEasing: (radius = 1) => ({
        /**
         * Circular ease-in with configurable radius
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating circular effect
         */
        easeIn: (t) => 1 - Math.sqrt(1 - Math.pow(t, 2) / radius),
        /**
         * Circular ease-out with configurable radius
         * @param t - Progress from 0 to 1
         * @returns Value with decelerating circular effect
         */
        easeOut: (t) => Math.sqrt(1 - Math.pow(t - 1, 2) / radius),
        /**
         * Circular ease-in-out with configurable radius
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating and decelerating circular effect
         */
        easeInOut: (t) => {
            t *= 2;
            if (t < 1)
                return -0.5 * (Math.sqrt(1 - t * t) - 1);
            t -= 2;
            return 0.5 * (Math.sqrt(1 - t * t) + 1);
        }
    })
};

/**
 * Creates a collection of easing functions with optional configuration
 * @param config - Configuration for customizable easing functions
 * @returns Object containing all easing functions (base and configurable)
 */
const createEasings = (config = {}) => {
    const { overshoot = 1.70158, amplitude = 1, period = 0.3, bounceStrength = 7.5625 } = config;
    // Create configurable easings
    const backEasings = createEasing.backEasing(overshoot);
    const elasticEasings = createEasing.elasticEasing(amplitude, period);
    const bounceEasings = createEasing.bouncyEasing(bounceStrength);
    // Combine base easings with configurable ones
    return {
        ...BASE_EASING,
        // Configurable back easings
        configBackEaseIn: backEasings.easeIn,
        configBackEaseOut: backEasings.easeOut,
        configBackEaseInOut: backEasings.easeInOut,
        // Configurable elastic easings
        configElasticEaseIn: elasticEasings.easeIn,
        configElasticEaseOut: elasticEasings.easeOut,
        configElasticEaseInOut: elasticEasings.easeInOut,
        // Configurable bounce easings
        configBounceEaseIn: bounceEasings.easeIn,
        configBounceEaseOut: bounceEasings.easeOut,
        configBounceEaseInOut: bounceEasings.easeInOut
    };
};
/**
 * Utility functions that can be applied to any easing function
 */
const easingUtils = {
    /**
     * Reverses the easing function
     * @param easingFn - Original easing function
     * @returns Reversed easing function
     */
    reverse: (easingFn) => (t) => easingFn(1 - t),
    /**
     * Creates a mirrored version of the easing function
     * @param easingFn - Original easing function
     * @returns Mirrored easing function
     */
    mirror: (easingFn) => (t) => t <= 0.5 ? easingFn(2 * t) / 2 : (2 - easingFn(2 * (1 - t))) / 2,
    /**
     * Mixes two easing functions with a balance factor
     * @param easingFn1 - First easing function
     * @param easingFn2 - Second easing function
     * @param balance - Balance between the two functions (0 to 1)
     * @returns Mixed easing function
     */
    mix: (easingFn1, easingFn2, balance) => (t) => (1 - balance) * easingFn1(t) + balance * easingFn2(t)
};
/**
 * Creates enhanced easing functions with utility methods
 * @param config - Configuration for customizable easing functions
 * @returns Enhanced easing functions with utility methods
 */
const easings = (config) => {
    const baseEasings = config ? createEasings(config) : BASE_EASING;
    return Object.entries(baseEasings).reduce((acc, [name, fn]) => ({
        ...acc,
        [name]: Object.assign(fn, {
            reverse: () => easingUtils.reverse(fn),
            mirror: () => easingUtils.mirror(fn),
            mix: (other, balance) => easingUtils.mix(fn, other, balance)
        })
    }), {});
};

export { createEasings, easings as default, easingUtils, easings };
//# sourceMappingURL=index.mjs.map
