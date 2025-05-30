import { EasingConfig, EasingFunction } from './easings.interface';
import BASE_EASING from './easings.const';
import { createEasing } from './easings.util';

/**
 * Creates a collection of easing functions with optional configuration
 * @param config - Configuration for customizable easing functions
 * @returns Object containing all easing functions (base and configurable)
 */
export const createEasings = (config: EasingConfig = {}) => {
  const {
    overshoot = 1.70158,
    amplitude = 1,
    period = 0.3,
    bounceStrength = 7.5625
  } = config;

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
export const easingUtils = {
  /**
   * Reverses the easing function
   * @param easingFn - Original easing function
   * @returns Reversed easing function
   */
  reverse: (easingFn: EasingFunction): EasingFunction =>
      (t: number) => easingFn(1 - t),

  /**
   * Creates a mirrored version of the easing function
   * @param easingFn - Original easing function
   * @returns Mirrored easing function
   */
  mirror: (easingFn: EasingFunction): EasingFunction =>
      (t: number) => t <= 0.5 ? easingFn(2 * t) / 2 : (2 - easingFn(2 * (1 - t))) / 2,

  /**
   * Mixes two easing functions with a balance factor
   * @param easingFn1 - First easing function
   * @param easingFn2 - Second easing function
   * @param balance - Balance between the two functions (0 to 1)
   * @returns Mixed easing function
   */
  mix: (easingFn1: EasingFunction, easingFn2: EasingFunction, balance: number): EasingFunction =>
      (t: number) => (1 - balance) * easingFn1(t) + balance * easingFn2(t)
};

/**
 * Creates enhanced easing functions with utility methods
 * @param config - Configuration for customizable easing functions
 * @returns Enhanced easing functions with utility methods
 */
export const easings = (config?: EasingConfig) => {
  const baseEasings = config ? createEasings(config) : BASE_EASING;

  return Object.entries(baseEasings).reduce((acc, [name, fn]) => ({
    ...acc,
    [name]: Object.assign(fn, {
      reverse: () => easingUtils.reverse(fn),
      mirror: () => easingUtils.mirror(fn),
      mix: (other: EasingFunction, balance: number) =>
          easingUtils.mix(fn, other, balance)
    })
  }), {}) as Record<string, EasingFunction>;
};

export default easings;
