import BASE_EASING from "./easings.const";

export const createEasing = {
  /**
   * Creates a set of back easing functions with configurable overshoot
   * @param s - Overshoot amount (default: 1.70158). Higher values create more pronounced overshoot
   * @returns Object containing easeIn, easeOut, and easeInOut functions
   * @see https://easings.net/#easeInBack
   */
  backEasing: (s: number = 1.70158) => ({
    /** 
     * Back ease-in with configurable overshoot
     * @param t - Progress from 0 to 1
     * @returns Value with accelerating overshoot effect
     */
    easeIn: (t: number) => Number(t * t * ((s + 1) * t - s)) || 0,
    
    /** 
     * Back ease-out with configurable overshoot
     * @param t - Progress from 0 to 1
     * @returns Value with decelerating overshoot effect
     */
    easeOut: (t: number) => --t * t * ((s + 1) * t + s) + 1,
    
    /** 
     * Back ease-in-out with configurable overshoot
     * @param t - Progress from 0 to 1
     * @returns Value with accelerating and decelerating overshoot effect
     */
    easeInOut: (t: number) => {
      const s2 = s * 1.525;
      t *= 2;
      if (t < 1) return 0.5 * (t * t * ((s2 + 1) * t - s2));
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
  elasticEasing: (amplitude: number = 1, period: number = 0.3) => ({
    /** 
     * Elastic ease-in with configurable amplitude and period
     * @param t - Progress from 0 to 1
     * @returns Value with accelerating elastic effect
     */
    easeIn: (t: number) => {
      if (t === 0 || t === 1) return t;
      return -amplitude * Math.pow(2, 10 * (t - 1)) * 
             Math.sin((t - 1 - period/(2 * Math.PI) * Math.asin(1/amplitude)) * 
             (2 * Math.PI) / period);
    },
    
    /** 
     * Elastic ease-out with configurable amplitude and period
     * @param t - Progress from 0 to 1
     * @returns Value with decelerating elastic effect
     */
    easeOut: (t: number) => {
      if (t === 0 || t === 1) return t;
      return amplitude * Math.pow(2, -10 * t) * 
             Math.sin((t - period/(2 * Math.PI) * Math.asin(1/amplitude)) * 
             (2 * Math.PI) / period) + 1;
    },
    
    /** 
     * Elastic ease-in-out with configurable amplitude and period
     * @param t - Progress from 0 to 1
     * @returns Value with accelerating and decelerating elastic effect
     */
    easeInOut: (t: number) => {
      if (t === 0 || t === 1) return t;
      t *= 2;
      if (t < 1) {
        return -0.5 * amplitude * Math.pow(2, 10 * (t - 1)) * 
               Math.sin((t - 1 - period/4) * (2 * Math.PI) / period);
      }
      return amplitude * Math.pow(2, -10 * (t - 1)) * 
             Math.sin((t - 1 - period/4) * (2 * Math.PI) / period) * 0.5 + 1;
    }
  }),

  /**
   * Creates a set of bounce easing functions with configurable strength
   * @param strength - Strength of the bounce effect (default: 7.5625). Higher values create stronger bounces
   * @returns Object containing easeIn, easeOut, and easeInOut functions
   * @see https://easings.net/#easeInBounce
   */
  bouncyEasing: (strength: number = 7.5625) => ({
    /** 
     * Bounce ease-in with configurable strength
     * @param t - Progress from 0 to 1
     * @returns Value with accelerating bounce effect
     */
    easeIn: (t: number) => 1 - BASE_EASING.easeOutBounce(1 - t),
    
    /** 
     * Bounce ease-out with configurable strength
     * @param t - Progress from 0 to 1
     * @returns Value with decelerating bounce effect
     */
    easeOut: (t: number) => {
      if (t < 1 / 2.75) return strength * t * t;
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
    easeInOut: (t: number) => 
      t < 0.5
        ? (1 - BASE_EASING.easeOutBounce(1 - 2 * t)) / 2
        : (1 + BASE_EASING.easeOutBounce(2 * t - 1)) / 2
  }),

  /**
   * Creates a set of exponential easing functions with configurable base
   * @param base - Base for exponential calculation (default: 2). Higher values create steeper curves
   * @returns Object containing easeIn, easeOut, and easeInOut functions
   * @see https://easings.net/#easeInExpo
   */
  expoEasing: (base: number = 2) => ({
    /** 
     * Exponential ease-in with configurable base
     * @param t - Progress from 0 to 1
     * @returns Value with accelerating exponential effect
     */
    easeIn: (t: number) => t === 0 ? 0 : Math.pow(base, 10 * (t - 1)),
    
    /** 
     * Exponential ease-out with configurable base
     * @param t - Progress from 0 to 1
     * @returns Value with decelerating exponential effect
     */
    easeOut: (t: number) => t === 1 ? 1 : 1 - Math.pow(base, -10 * t),
    
    /** 
     * Exponential ease-in-out with configurable base
     * @param t - Progress from 0 to 1
     * @returns Value with accelerating and decelerating exponential effect
     */
    easeInOut: (t: number) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      if (t < 0.5) return Math.pow(base, 20 * t - 10) / 2;
      return (2 - Math.pow(base, -20 * t + 10)) / 2;
    }
  }),

  /**
   * Creates a set of circular easing functions with configurable radius
   * @param radius - Radius for circular calculation (default: 1). Affects the curvature of the easing
   * @returns Object containing easeIn, easeOut, and easeInOut functions
   * @see https://easings.net/#easeInCirc
   */
  circEasing: (radius: number = 1) => ({
    /** 
     * Circular ease-in with configurable radius
     * @param t - Progress from 0 to 1
     * @returns Value with accelerating circular effect
     */
    easeIn: (t: number) => 1 - Math.sqrt(1 - Math.pow(t, 2) / radius),
    
    /** 
     * Circular ease-out with configurable radius
     * @param t - Progress from 0 to 1
     * @returns Value with decelerating circular effect
     */
    easeOut: (t: number) => Math.sqrt(1 - Math.pow(t - 1, 2) / radius),
    
    /** 
     * Circular ease-in-out with configurable radius
     * @param t - Progress from 0 to 1
     * @returns Value with accelerating and decelerating circular effect
     */
    easeInOut: (t: number) => {
      t *= 2;
      if (t < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
      t -= 2;
      return 0.5 * (Math.sqrt(1 - t * t) + 1);
    }
  })
};