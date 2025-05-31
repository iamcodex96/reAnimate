// Import core functionality
import { Animation } from './core/animation';
import { Timeline } from './core/timeline';
import * as Types from './core/types';

// Import easings
import easings from './easings/easings';
import { createEasings, easingUtils } from './easings/easings';
import * as EasingTypes from './easings/easings.interface';

// Import stagger utilities
import { stagger, createStaggeredAnimations } from './utils/stagger.util';
import * as StaggerTypes from './core/stagger.types';

// Import presets
import { presets, createPresetAnimation, PresetConfig } from './presets/presets';
import { PresetName } from './presets/presets.const';

// Re-export named exports
export { Animation } from './core/animation';
export { Timeline } from './core/timeline';
export * from './core/types';
export { createEasings, easingUtils } from './easings/easings';
export * from './easings/easings.interface';
export { default as easings } from './easings/easings';

// Re-export stagger functionality
export { stagger, createStaggeredAnimations } from './utils/stagger.util';
export * from './core/stagger.types';

// Re-export presets
export { presets, createPresetAnimation, PresetConfig } from './presets/presets';

// Create a simple default export object
const animate = {
  Animation,
  Timeline,
  easings,
  createEasings,
  easingUtils,
  stagger,
  createStaggeredAnimations,
  presets,
  createPresetAnimation,

  // Convenience methods
  /**
   * Create and play an animation
   */
  play: (target: any, properties: any, options: any) => {
    return new Animation({
      target, 
      properties,
      options
    }).play();
  },
  
  /**
   * Apply a preset animation
   */
  preset: (name: PresetName, target: any, config: any = {}) => {
    return presets[name](target, { ...config });
  },
  
  /**
   * Create staggered animations
   */
  staggerAnimation: (
    targets: any[],
    properties: Record<string, Types.PropertyAnimation>,
    options: Types.AnimationOptions,
    staggerValue: StaggerTypes.StaggerValue,
    staggerOptions: StaggerTypes.StaggerOptions = {}
  ) => {
    return Animation.stagger(targets, properties, options, staggerValue, staggerOptions);
  },
  
  /**
   * Apply a preset animation with stagger
   */
  staggerPreset: (
    name: keyof typeof presets,
    targets: any[],
    config: any = {},
    staggerValue: StaggerTypes.StaggerValue = 50,
    staggerOptions: StaggerTypes.StaggerOptions = {}
  ) => {
    // Create a stagger delay function
    const staggerFn = stagger(staggerValue, staggerOptions);
    
    // Create staggered animations
    return createStaggeredAnimations(
      targets,
      (target, index, total) => {
        return presets[name](target, { 
          ...config, 
          autoplay: false 
        });
      },
      staggerFn
    );
  }
};

// This is the critical part for default export
export default animate;