// Import core functionality
import { Animation } from './core/animation';
import { Timeline } from './core/timeline';
import * as Types from './core/types';

// Import easings
import easings from './easings/easings';
import { createEasings, easingUtils } from './easings/easings';
import * as EasingTypes from './easings/easings.interface';

// Re-export named exports
export { Animation } from './core/animation';
export { Timeline } from './core/timeline';
export * from './core/types';
export { createEasings, easingUtils } from './easings/easings';
export * from './easings/easings.interface';
export { default as easings } from './easings/easings';

// Create a simple default export object
const animate = {
  Animation,
  Timeline,
  easings,
  createEasings,
  easingUtils,
  // Add any other exports here
};

// This is the critical part for default export
export default animate;