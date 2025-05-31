import { StaggerOptions, StaggerValue, StaggerDelayFn, StaggerFrom, StaggerDirection } from '../types/Stagger.types';
import { EasingFunction } from '../easings/easings.interface';

/**
 * Linear interpolation between two values
 */
function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

/**
 * Calculate the stagger point based on from position
 * @param index - Element index
 * @param total - Total number of elements
 * @param from - Position to start from
 * @returns Stagger point (0 to total-1)
 */
function calculateStaggerPoint(index: number, total: number, from: StaggerFrom): number {
  if (from === 'first') {
    return index;
  } else if (from === 'last') {
    return total - index - 1;
  } else if (from === 'center') {
    return Math.abs((total - 1) / 2 - index);
  } else if (typeof from === 'number') {
    if (from >= 0 && from < total) {
      return Math.abs(from - index);
    }
    // Handle out of bounds
    const normalizedFrom = Math.max(0, Math.min(total - 1, from));
    return Math.abs(normalizedFrom - index);
  }
  return index; // Default to 'first'
}

/**
 * Apply direction to stagger point
 * @param point - Original stagger point
 * @param total - Total number of elements
 * @param direction - Direction to apply
 * @returns Modified stagger point
 */
function applyDirection(point: number, total: number, direction: StaggerDirection): number {
  if (direction === 'reverse') {
    return total - point - 1;
  } else if (direction === 'alternate') {
    // Alternate directions for even/odd elements
    return point % 2 === 0 ? point : total - point - 1;
  }
  return point; // 'normal'
}

/**
 * Calculate grid position based stagger point
 * @param index - Element index
 * @param total - Total number of elements
 * @param options - Grid options
 * @returns Stagger point
 */
function calculateGridStaggerPoint(index: number, total: number, options: StaggerOptions): number {
  const grid = options.grid;
  if (!grid || !grid.cols || grid.cols <= 0) {
    return calculateStaggerPoint(index, total, options.from || 'first');
  }

  const cols = grid.cols;
  const rows = Math.ceil(total / cols);
  const rowIndex = Math.floor(index / cols);
  const colIndex = index % cols;
  
  // Calculate base coordinates based on fromX and fromY
  const xPoint = calculateStaggerPoint(colIndex, cols, grid.fromX || options.from || 'first');
  const yPoint = calculateStaggerPoint(rowIndex, rows, grid.fromY || options.from || 'first');
  
  // Calculate final point based on grid direction
  if (grid.direction === 'column') {
    // Column-first traversal
    return yPoint * cols + xPoint;
  } else if (grid.direction === 'diagonal') {
    // Diagonal traversal - calculate distance from origin
    return xPoint + yPoint;
  } else {
    // Default: row-first traversal
    return yPoint * cols + xPoint;
  }
}

/**
 * Create a stagger delay function
 * @param value - Stagger delay value or range
 * @param options - Stagger options
 * @returns Function that calculates the delay for each element
 */
export function stagger(
  value: StaggerValue, 
  options: StaggerOptions = {}
): StaggerDelayFn {
  const {
    start = 0,
    from = 'first',
    direction = 'normal',
    easing = (t: number) => t
  } = options;
  
  /**
   * Calculate stagger delay for a specific element
   * @param index - Element index
   * @param total - Total number of elements
   * @param element - Target element (optional)
   * @returns Calculated delay in milliseconds
   */
  return (index: number, total: number, element?: any): number => {
    // Handle edge cases
    if (total <= 1) return start;
    
    // Calculate stagger point (normalized position in the sequence)
    let staggerPoint: number;
    
    if (options.grid) {
      staggerPoint = calculateGridStaggerPoint(index, total, options);
    } else {
      staggerPoint = calculateStaggerPoint(index, total, from);
      staggerPoint = applyDirection(staggerPoint, total, direction);
    }
    
    // Calculate progress (0 to 1)
    const progress = total > 1 ? staggerPoint / (total - 1) : 0;
    
    // Apply easing to the distribution
    const easedProgress = easing(progress);
    
    // Calculate the actual delay
    let delay: number;
    if (Array.isArray(value)) {
      const [min, max] = value;
      delay = start + lerp(min, max, easedProgress);
    } else {
      delay = start + (value * easedProgress);
    }
    
    return delay;
  };
}

/**
 * Create a timeline from staggered animations
 * @param targets - Elements to animate
 * @param animationFactory - Function that creates animation for each element
 * @param staggerDelay - Stagger delay function
 * @returns Array of animations with staggered delays
 */
export function createStaggeredAnimations(
  targets: any[],
  animationFactory: (target: any, index: number, total: number) => any,
  staggerDelay: StaggerDelayFn
): any[] {
  return targets.map((target, index, array) => {
    const animation = animationFactory(target, index, array.length);
    
    // Apply stagger delay to the animation
    const delay = staggerDelay(index, array.length, target);
    
    // Update animation options with the stagger delay
    if (typeof animation === 'object' && animation.options) {
      animation.options.delay = (animation.options.delay || 0) + delay;
    }
    
    return animation;
  });
}