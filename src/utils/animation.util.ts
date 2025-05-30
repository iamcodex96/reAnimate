import { TimelineOffset } from '../core/types';

/**
 * Parse a timeline offset specification
 * @param offset - Offset specification (number or string like "+=100")
 * @param currentTime - Current timeline time (for relative offsets)
 * @returns Calculated offset in milliseconds
 */
export function parseTimelineOffset(offset: TimelineOffset, currentTime: number): number {
  if (typeof offset === 'number') {
    return offset;
  }
  
  // Handle relative positioning (+=100, -=100, etc)
  if (offset.startsWith('+=')) {
    return currentTime + parseFloat(offset.substring(2));
  } else if (offset.startsWith('-=')) {
    return Math.max(0, currentTime - parseFloat(offset.substring(2)));
  }
  
  // Default: treat as absolute time
  return parseFloat(offset) || 0;
}

/**
 * Get the end time of an animation based on its options
 * @param duration - Base duration
 * @param delay - Start delay
 * @param endDelay - End delay
 * @returns Total animation time
 */
export function getAnimationEndTime(
  duration: number,
  delay: number = 0,
  endDelay: number = 0
): number {
  return duration + delay + endDelay;
}