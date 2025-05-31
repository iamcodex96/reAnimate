import { PropertyAnimation, NormalizedPropertyAnimation } from '../types/PropertyAnimation.types';

/**
 * Parse property animation value into a normalized format
 * @param value - The property animation value in any supported format
 * @param currentValue - Current value of the property (for implicit from values)
 * @returns Normalized property animation object
 */
export function parsePropertyAnimation(
  value: PropertyAnimation, 
  currentValue: any = undefined
): NormalizedPropertyAnimation {
  // Case 1: [from, to] array format
  if (Array.isArray(value) && value.length === 2) {
    return { from: value[0], to: value[1] };
  }
  
  // Case 2: Single value format (implicit from)
  if (typeof value !== 'object' || value === null) {
    return { from: currentValue, to: value };
  }
  
  // Case 3: Object format with from/to properties
  if ('from' in value && 'to' in value) {
    const result: NormalizedPropertyAnimation = {
      from: value.from,
      to: value.to
    };
    
    if ('steps' in value && Array.isArray(value.steps)) {
      result.steps = value.steps;
    }
    
    return result;
  }
  
  // Case 4: Object format with value and custom timing
  if ('value' in value) {
    const result: NormalizedPropertyAnimation = {
      from: currentValue,
      to: value.value
    };
    
    if ('duration' in value && typeof value.duration === 'number') {
      result.duration = value.duration;
    }
    
    if ('delay' in value && typeof value.delay === 'number') {
      result.delay = value.delay;
    }
    
    return result;
  }
  
  // Default: treat as to-value
  return { from: currentValue, to: value };
}

/**
 * Parse CSS units from string values
 * @param value - String value potentially containing units
 * @returns Object with numeric value and unit
 */
export function parseCssValue(value: string): { value: number; unit: string } {
  const match = String(value).match(/^([-+]?[\d.]+)([a-z%]*)$/i);
  
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: match[2] || ''
    };
  }
  
  return {
    value: 0,
    unit: ''
  };
}

/**
 * Detect if a value is a valid color
 * @param value - Value to check
 * @returns Boolean indicating if the value is a color
 */
export function isColor(value: any): boolean {
  if (typeof value !== 'string') return false;
  
  // Check for hex, rgb, rgba, hsl, hsla
  return (
    /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value) ||
    /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)$/.test(value) ||
    /^hsla?\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*(?:,\s*[\d.]+\s*)?\)$/.test(value)
  );
}

/**
 * Detect if a value is a transform function
 * @param value - Value to check
 * @returns Boolean indicating if the value is a transform
 */
export function isTransform(value: any): boolean {
  if (typeof value !== 'string') return false;
  
  // Check for common transform functions
  return (
    /^(translate|rotate|scale|skew|matrix|perspective)/.test(value) ||
    value === 'none'
  );
}

/**
 * Get the current computed value of a property on an element
 * @param target - Target element
 * @param property - CSS property name
 * @returns Current value of the property
 */
export function getCurrentValue(target: any, property: string): any {
  // For DOM elements
  if (target instanceof HTMLElement || target instanceof SVGElement) {
    // Get computed style for CSS properties
    if (property in target.style || isCustomCssProperty(property)) {
      const computedStyle = getComputedStyle(target);
      return computedStyle[property as any] || null;
    }
    
    // For transform properties, extract from the transform matrix
    if (isTransformProperty(property)) {
      return getComputedTransformValue(target, property);
    }
    
    // For attributes
    if (target.hasAttribute && target.hasAttribute(property)) {
      return target.getAttribute(property);
    }
  }
  
  // For regular objects
  if (property in target) {
    return target[property];
  }
  
  // Default: return undefined (will be replaced with sensible defaults later)
  return undefined;
}

/**
 * Check if a property is a CSS custom property
 */
function isCustomCssProperty(property: string): boolean {
  return property.startsWith('--');
}

/**
 * Check if a property is a transform property
 */
function isTransformProperty(property: string): boolean {
  const transformProps = [
    'translateX', 'translateY', 'translateZ', 'translate',
    'rotateX', 'rotateY', 'rotateZ', 'rotate',
    'scaleX', 'scaleY', 'scaleZ', 'scale',
    'skewX', 'skewY', 'skew'
  ];
  
  return transformProps.includes(property);
}

/**
 * Get computed transform value for an element
 * Simplified implementation - in a real library this would be more comprehensive
 */
function getComputedTransformValue(element: HTMLElement | SVGElement, property: string): string {
  // In a full implementation, this would extract specific transform values
  // from the computed transform matrix
  return '0';
}

/**
 * Get sensible default value for a property if current value is unknown
 */
export function getDefaultValue(property: string): any {
  // Common defaults for various properties
  const defaults: Record<string, any> = {
    opacity: 1,
    rotate: '0deg',
    scale: 1,
    translateX: '0px',
    translateY: '0px',
    translateZ: '0px',
    x: 0,
    y: 0,
    z: 0
  };
  
  return property in defaults ? defaults[property] : 0;
}