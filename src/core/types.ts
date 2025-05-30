import { EasingFunction } from '../easings/easings.interface';

/**
 * Animation states
 */
export type AnimationState = 'idle' | 'running' | 'paused' | 'completed';

/**
 * Animation options
 */
export interface AnimationOptions {
  /** Duration in milliseconds */
  duration: number;
  
  /** Easing function to use */
  easing?: EasingFunction;
  
  /** Delay before animation starts */
  delay?: number;
  
  /** Delay after animation completes */
  endDelay?: number;
}

/**
 * Property animation definition
 * [from, to] values for a property
 */
export type PropertyAnimation = [any, any];

/**
 * Full animation definition
 */
export interface AnimationDefinition {
  /** Target element or object to animate */
  target: any;
  
  /** Properties to animate with from/to values */
  properties: Record<string, PropertyAnimation>;
  
  /** Animation options */
  options: AnimationOptions;
}

/**
 * Timeline offset specification
 * Can be a number (absolute milliseconds) or
 * a string like "+=100" (relative to previous animation end)
 */
export type TimelineOffset = number | string;