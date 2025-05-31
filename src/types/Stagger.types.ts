import { EasingFunction } from '../easings/easings.interface';

/**
 * Direction for stagger animations
 */
export type StaggerDirection = 'normal' | 'reverse' | 'alternate';

/**
 * From position for stagger animations
 */
export type StaggerFrom = 'first' | 'last' | 'center' | number;

/**
 * Grid configuration for 2D stagger animations
 */
export interface StaggerGrid {
  cols: number;
  direction?: 'row' | 'column' | 'diagonal';
  fromX?: StaggerFrom;
  fromY?: StaggerFrom;
}

/**
 * Options for stagger animations
 */
export interface StaggerOptions {
  /** Start delay before the first animation */
  start?: number;
  
  /** Position to start the stagger from */
  from?: StaggerFrom;
  
  /** Direction of the stagger */
  direction?: StaggerDirection;
  
  /** Easing function to apply to the stagger distribution */
  easing?: EasingFunction;
  
  /** Grid configuration for 2D stagger */
  grid?: StaggerGrid;
}

/**
 * Stagger value can be a fixed delay or a range [min, max]
 */
export type StaggerValue = number | [number, number];

/**
 * Stagger delay function type
 */
export type StaggerDelayFn = (index: number, total: number, element: any) => number;