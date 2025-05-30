export { Animation } from './core/animation';
export { Timeline } from './core/timeline';

export { AnimationOptions, AnimationDefinition, AnimationState } from './core/types';

export { default as easings, createEasings, easingUtils } from './easings/easings';
export { EasingType, EasingConfig, EasingFunction } from './easings/easings.interface';

// Convenient animation presets
import { AnimationDefinition } from './core/types';
import { default as easings } from './easings/easings';
import { Animation } from './core/animation';
import { Timeline } from './core/timeline';
import { AnimationOptions } from './core/types';

/**
 * Common animation presets
 */
export const Presets = {
  /**
   * Fade in animation
   * @param target - Element to animate
   * @param duration - Animation duration in milliseconds
   * @returns Animation definition
   */
  fadeIn: (target: any, duration = 500): AnimationDefinition => ({
    target,
    properties: {
      opacity: [0, 1]
    },
    options: {
      duration,
      easing: easings().easeInOutQuad
    }
  }),
  
  /**
   * Fade out animation
   * @param target - Element to animate
   * @param duration - Animation duration in milliseconds
   * @returns Animation definition
   */
  fadeOut: (target: any, duration = 500): AnimationDefinition => ({
    target,
    properties: {
      opacity: [1, 0]
    },
    options: {
      duration,
      easing: easings().easeInOutQuad
    }
  }),
  
  /**
   * Slide in animation
   * @param target - Element to animate
   * @param direction - Direction to slide from
   * @param distance - Distance to slide
   * @param duration - Animation duration in milliseconds
   * @returns Animation definition
   */
  slideIn: (
    target: any, 
    direction: 'left' | 'right' | 'up' | 'down' = 'left',
    distance = '100px',
    duration = 500
  ): AnimationDefinition => {
    const transforms: Record<string, [string, string]> = {
      left: [`translateX(-${distance})`, 'translateX(0)'],
      right: [`translateX(${distance})`, 'translateX(0)'],
      up: [`translateY(-${distance})`, 'translateY(0)'],
      down: [`translateY(${distance})`, 'translateY(0)']
    };
    
    return {
      target,
      properties: {
        transform: transforms[direction],
        opacity: [0, 1]
      },
      options: {
        duration,
        easing: easings().easeOutQuint
      }
    };
  }
};

// Create a more convenient API
export const animate = {
  /**
   * Create and play an animation
   * @param target - Element to animate
   * @param properties - Properties to animate
   * @param options - Animation options
   * @returns Animation instance
   */
  create: (
    target: any,
    properties: Record<string, [any, any]>,
    options: AnimationOptions
  ): Animation => {
    const animation = new Animation({
      target,
      properties,
      options
    });
    
    return animation;
  },
  
  /**
   * Create and play a timeline
   * @returns Timeline instance
   */
  timeline: (): Timeline => {
    return new Timeline();
  },
  
  /**
   * Apply a preset animation
   * @param name - Preset name
   * @param target - Target element
   * @param options - Additional options
   * @returns Animation instance
   */
  preset: (name: keyof typeof Presets, target: any, options: any = {}): Animation => {
    const preset = Presets[name];
    if (!preset) {
      throw new Error(`Animation preset "${name}" not found`);
    }
    
    const definition = preset(target, options.duration);
    const animation = new Animation(definition);
    
    if (options.autoplay !== false) {
      animation.play();
    }
    
    return animation;
  }
};