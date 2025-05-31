import { AnimationDefinition, AnimationOptions } from '../core/types';
import { EasingFunction } from '../easings/easings.interface';
import easings from '../easings/easings.const';

/**
 * Configuration options for animation presets
 */
export interface PresetConfig {
  /** Animation duration in milliseconds */
  duration?: number;

  /** Delay before the animation starts */
  delay?: number;

  /** Easing function to use */
  easing?: EasingFunction;

  /** Additional properties to animate */
  extraProperties?: Record<string, [any, any]>;

  /** Distance for movement-based animations (px, rem, etc.) */
  distance?: string;

  /** Intensity of the animation effect (0-1) */
  intensity?: number;

  /** Scale factor for animations that use scaling */
  scale?: number;

  /** Rotation angle for animations that use rotation (in degrees) */
  rotation?: number;

  /** Animation direction ('left', 'right', 'up', 'down', etc.) */
  direction?: string;

  /** Whether the animation should autoplay */
  autoplay?: boolean;
}