/**
 * All available animation presets
 */
export const PRESETS = {
  /** Fade in animation */
  FADE_IN: 'fadeIn',
  /** Fade out animation */
  FADE_OUT: 'fadeOut',
  /** Slide in animation */
  SLIDE_IN: 'slideIn',
  /** Slide out animation */
  SLIDE_OUT: 'slideOut',
  /** Zoom in animation */
  ZOOM_IN: 'zoomIn',
  /** Zoom out animation */
  ZOOM_OUT: 'zoomOut',
  /** Flip animation */
  FLIP: 'flip',
  /** Shake animation */
  SHAKE: 'shake',
  /** Pulse animation */
  PULSE: 'pulse',
  /** Bounce animation */
  BOUNCE: 'bounce',
  /** Swing animation */
  SWING: 'swing',
  /** Tada animation */
  TADA: 'tada',
  /** Jello animation */
  JELLO: 'jello',
  /** Heartbeat animation */
  HEARTBEAT: 'heartbeat',
  /** Hinge animation */
  HINGE: 'hinge',
  /** Roll in animation */
  ROLL_IN: 'rollIn',
  /** Roll out animation */
  ROLL_OUT: 'rollOut',
  /** Flash animation */
  FLASH: 'flash',
  /** Rubber band animation */
  RUBBER_BAND: 'rubberBand',
  /** Wobble animation */
  WOBBLE: 'wobble',
  /** Light speed in animation */
  LIGHT_SPEED_IN: 'lightSpeedIn',
  /** Light speed out animation */
  LIGHT_SPEED_OUT: 'lightSpeedOut'
} as const;

// Create a type from the values
export type PresetName = typeof PRESETS[keyof typeof PRESETS];