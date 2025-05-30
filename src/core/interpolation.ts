/**
 * Interpolate between two values based on progress
 * @param from - Starting value
 * @param to - Ending value
 * @param progress - Current progress (0 to 1)
 * @returns Interpolated value
 */
// Add this to the interpolation.ts file
function interpolateTransform(from: string, to: string, progress: number): string {
  // Extract transform function names and values
  const fromMatches = from.match(/(\w+)\(([^)]+)\)/g) || [];
  const toMatches = to.match(/(\w+)\(([^)]+)\)/g) || [];
  
  // If both are the same transform function
  if (fromMatches.length === 1 && toMatches.length === 1) {
    const fromFn = fromMatches[0].match(/(\w+)\(([^)]+)\)/);
    const toFn = toMatches[0].match(/(\w+)\(([^)]+)\)/);
    
    if (fromFn && toFn && fromFn[1] === toFn[1]) {
      const fnName = fromFn[1];
      const fromValue = fromFn[2];
      const toValue = toFn[2];
      
      // Extract values and units
      const fromValueMatch = fromValue.match(/^([-+]?[\d.]+)([a-z%]*)$/i);
      const toValueMatch = toValue.match(/^([-+]?[\d.]+)([a-z%]*)$/i);
      
      if (fromValueMatch && toValueMatch && fromValueMatch[2] === toValueMatch[2]) {
        const fromNum = parseFloat(fromValueMatch[1]);
        const toNum = parseFloat(toValueMatch[1]);
        const unit = fromValueMatch[2];
        
        const interpolatedValue = fromNum + (toNum - fromNum) * progress;
        return `${fnName}(${interpolatedValue}${unit})`;
      }
    }
  }
  
  // If transforms don't match, fall back to discrete animation
  return progress < 0.5 ? from : to;
}

// Then modify the interpolate function to include transform handling
export function interpolate(from: any, to: any, progress: number): any {
  // Handle numeric values
  if (typeof from === 'number' && typeof to === 'number') {
    return from + (to - from) * progress;
  }
  
  // Handle string values with units (px, %, etc.)
  if (typeof from === 'string' && typeof to === 'string') {
    const fromMatch = from.match(/^([-+]?[\d.]+)([a-z%]*)$/i);
    const toMatch = to.match(/^([-+]?[\d.]+)([a-z%]*)$/i);
    
    if (fromMatch && toMatch && fromMatch[2] === toMatch[2]) {
      const fromValue = parseFloat(fromMatch[1]);
      const toValue = parseFloat(toMatch[1]);
      const unit = fromMatch[2];
      
      return (fromValue + (toValue - fromValue) * progress) + unit;
    }
  }
  
  // Handle colors (hex, rgb, rgba)
  if (typeof from === 'string' && typeof to === 'string') {
    const isColor = (val: string) => 
      /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(val) || 
      /^rgba?\((\d+,\s*){2,3}\d+\)$/.test(val);
      
    if (isColor(from) && isColor(to)) {
      return interpolateColors(from, to, progress);
    }
  }
  
  // Handle CSS transforms
  if (typeof from === 'string' && typeof to === 'string') {
    if (from.includes('translate') || from.includes('rotate') || from.includes('scale')) {
      return interpolateTransform(from, to, progress);
    }
  }
  
  // Default: use discrete values (no interpolation)
  return progress < 0.5 ? from : to;
}

/**
 * Interpolate between two colors
 * Supports hex (#fff, #ffffff) and rgb/rgba formats
 */
function interpolateColors(from: string, to: string, progress: number): string {
  // Convert colors to rgba
  const fromRgba = colorToRgba(from);
  const toRgba = colorToRgba(to);
  
  // Interpolate each component
  const r = Math.round(fromRgba[0] + (toRgba[0] - fromRgba[0]) * progress);
  const g = Math.round(fromRgba[1] + (toRgba[1] - fromRgba[1]) * progress);
  const b = Math.round(fromRgba[2] + (toRgba[2] - fromRgba[2]) * progress);
  const a = fromRgba[3] + (toRgba[3] - fromRgba[3]) * progress;
  
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Convert color string to rgba array [r, g, b, a]
 */
function colorToRgba(color: string): [number, number, number, number] {
  // Handle hex colors
  if (color.startsWith('#')) {
    let hex = color.substring(1);
    // Convert shorthand hex (#fff) to full form (#ffffff)
    if (hex.length === 3) {
      hex = hex.split('').map(h => h + h).join('');
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b, 1];
  }

  // Handle rgb/rgba colors
  if (color.startsWith('rgb')) {
    const values = color.match(/\d+(\.\d+)?/g) || [];

    // Check if values exist before parsing
    const r = values[0] !== undefined ? parseInt(values[0], 10) : 0;
    const g = values[1] !== undefined ? parseInt(values[1], 10) : 0;
    const b = values[2] !== undefined ? parseInt(values[2], 10) : 0;
    const a = values.length > 3 ? parseFloat(values[3]) : 1;

    return [r, g, b, a];
  }

  // Default: return black
  return [0, 0, 0, 1];
}

/**
 * Update target properties based on current values
 * @param target - Target element or object
 * @param properties - Map of property names to values
 */
export function updateTargetProperties(target: any, properties: Record<string, any>): void {
  Object.entries(properties).forEach(([prop, value]) => {
    // Handle DOM elements
    if (target instanceof HTMLElement) {
      if (prop === 'transform') {
        target.style.transform = value;
      } else if (prop in target.style) {
        target.style[prop as any] = value;
      } else {
        (target as any)[prop] = value;
      }
    } else {
      // Handle regular objects
      (target as any)[prop] = value;
    }
  });
}