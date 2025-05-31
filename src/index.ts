// Import and re-export core functionality
export * from './core';

// Import and re-export types
export * from './types';

// Import and re-export easings
export * from './easings';
export { default as easings } from './easings';

// Import and re-export presets
export * from './presets';
export { default as presets } from './presets';

// Import and re-export utilities
export * from './utils';

// Import individual components for the default export
import { Animation, Timeline } from './core';
import easings from './easings';
import presets from './presets';
import { PRESETS } from './presets/presets.const';
import { stagger, createStaggeredAnimations } from './utils';
import type { PropertyAnimation } from './types/PropertyAnimation.types';
import type { AnimationOptions, TimelineOptions } from './types/Animation.types';
import type { StaggerValue, StaggerOptions } from './types/Stagger.types';
import type { PresetName, PresetConfig } from './types/Presets.types';

// Create a default export object
const animate = {
  Animation,
  Timeline,
  easings,
  stagger,
  createStaggeredAnimations,
  presets,

  // Convenience methods
  /**
   * Create an animation instance
   * @param target - Target element or object to animate
   * @param properties - Properties to animate with from/to values
   * @param options - Animation options
   * @returns Animation instance
   */
  create: (target: any, properties: Record<string, PropertyAnimation>, options: AnimationOptions): Animation => {
    return new Animation({
      target, 
      properties,
      options: {
        ...options,
        autoplay: options.autoplay ?? false // Default to false if not specified
      }
    });
  },

  /**
   * Create and play an animation
   * @param target - Target element or object to animate
   * @param properties - Properties to animate with from/to values
   * @param options - Animation options
   * @returns Animation instance
   */
  play: (target: any, properties: Record<string, PropertyAnimation>, options: AnimationOptions): Animation => {
    return new Animation({
      target, 
      properties,
      options: {
        ...options,
        autoplay: true // Override autoplay to true
      }
    });
  },
  
  /**
   * Create and play an animation, returning a Promise
   * @param target - Target element or object to animate
   * @param properties - Properties to animate with from/to values
   * @param options - Animation options
   * @returns Promise that resolves when animation completes
   */
  playAndWait: (target: any, properties: Record<string, PropertyAnimation>, options: AnimationOptions): Promise<void> => {
    return new Animation({
      target, 
      properties,
      options: {
        ...options,
        autoplay: true // Override autoplay to true
      }
    }).toPromise();
  },
  
  /**
   * Create a timeline instance
   * @param options - Timeline options
   * @returns Timeline instance
   */
  createTimeline: (options: TimelineOptions = {}): Timeline => {
    return new Timeline({
      autoplay: options.autoplay ?? false // Default to false if not specified
    });
  },

  /**
   * Apply a preset animation
   * @param name - Preset animation name
   * @param target - Target element or object
   * @param config - Preset configuration
   * @returns Animation or Timeline instance
   */
  preset: (name: PresetName, target: any, config: PresetConfig = {}): Animation | Timeline => {
    // Get the function name from PRESETS using the constant key
    const presetFunctionName = PRESETS[name];

    return presets[presetFunctionName as keyof typeof presets](target, {
      ...config,
      autoplay: config.autoplay ?? true // Default to true for backwards compatibility
    });
  },

  /**
   * Apply a preset animation and wait for completion
   * @param name - Preset animation name
   * @param target - Target element or object
   * @param config - Preset configuration
   * @returns Promise that resolves when animation completes
   */
  presetAndWait: (name: PresetName, target: any, config: PresetConfig = {}): Promise<void> => {
    // Get the function name from PRESETS using the constant key
    const presetFunctionName = PRESETS[name];

    return presets[presetFunctionName as keyof typeof presets](target, {
      ...config,
      autoplay: true // Override autoplay to true
    }).toPromise();
  },

  /**
   * Create staggered animations
   * @param targets - Array of elements to animate
   * @param properties - Properties to animate
   * @param options - Animation options
   * @param staggerValue - Stagger delay value
   * @param staggerOptions - Stagger configuration options
   * @returns Array of Animation instances
   */
  staggerAnimation: (
    targets: any[],
    properties: Record<string, PropertyAnimation>,
    options: AnimationOptions,
    staggerValue: StaggerValue,
    staggerOptions: StaggerOptions = {}
  ): Animation[] => {
    const autoplay = options.autoplay ?? false;
    return Animation.stagger(
      targets, 
      properties, 
      { ...options, autoplay },
      staggerValue, 
      staggerOptions
    );
  },
  
  /**
   * Create staggered animations and wait for all to complete
   * @param targets - Array of elements to animate
   * @param properties - Properties to animate
   * @param options - Animation options
   * @param staggerValue - Stagger delay value
   * @param staggerOptions - Stagger configuration options
   * @returns Promise that resolves when all animations complete
   */
  staggerAnimationAndWait: (
    targets: any[],
    properties: Record<string, PropertyAnimation>,
    options: AnimationOptions,
    staggerValue: StaggerValue,
    staggerOptions: StaggerOptions = {}
  ): Promise<void> => {
    const animations = Animation.stagger(
      targets, 
      properties, 
      { ...options, autoplay: true },
      staggerValue, 
      staggerOptions
    );
    
    // Return a promise that resolves when all animations complete
    return Promise.all(animations.map(anim => anim.toPromise())).then(() => {});
  },

  staggerPreset: (
      name: PresetName,
      targets: any[],
      config: PresetConfig = {},
      staggerValue: StaggerValue = 50,
      staggerOptions: StaggerOptions = {}
  ): (Animation | Timeline)[] => {
    // Get the function name from PRESETS using the constant key
    const presetFunctionName = PRESETS[name];

    // Create a stagger delay function
    const staggerFn = stagger(staggerValue, staggerOptions);

    // Create staggered animations
    return createStaggeredAnimations(
        targets,
        (target, index, total) => {
          return presets[presetFunctionName as keyof typeof presets](target, {
            ...config,
            autoplay: config.autoplay ?? false // Default to false for manual control
          });
        },
        staggerFn
    );
  },

  /**
   * Apply a preset animation with stagger and wait for all to complete
   * @param name - Preset animation name
   * @param targets - Array of elements to animate
   * @param config - Preset configuration
   * @param staggerValue - Stagger delay value
   * @param staggerOptions - Stagger configuration options
   * @returns Promise that resolves when all animations complete
   */
  staggerPresetAndWait: (
      name: PresetName,
      targets: any[],
      config: PresetConfig = {},
      staggerValue: StaggerValue = 50,
      staggerOptions: StaggerOptions = {}
  ): Promise<void> => {
    const animations = animate.staggerPreset(
        name,
        targets,
        { ...config, autoplay: true },  // Force autoplay for promise-based execution
        staggerValue,
        staggerOptions
    );

    // Return a promise that resolves when all animations complete
    return Promise.all(animations.map(animation => animation.toPromise())).then(() => {});
  }

};

// Export default
export default animate;