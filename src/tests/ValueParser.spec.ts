import { parsePropertyAnimation, parseCssValue, isColor, isTransform } from '../utils/propertyAnimation.util';

describe('Value Parser Utilities', () => {
  describe('parsePropertyAnimation', () => {
    test('should parse [from, to] array format', () => {
      const result = parsePropertyAnimation([0, 100]);
      expect(result).toEqual({ from: 0, to: 100 });
    });
    
    test('should parse single value format with current value', () => {
      const result = parsePropertyAnimation(100, 0);
      expect(result).toEqual({ from: 0, to: 100 });
    });
    
    test('should parse object with from/to properties', () => {
      const result = parsePropertyAnimation({ from: 0, to: 100 });
      expect(result).toEqual({ from: 0, to: 100 });
    });
    
    test('should parse object with steps', () => {
      const result = parsePropertyAnimation({ from: 0, to: 100, steps: [25, 50, 75] });
      expect(result).toEqual({ from: 0, to: 100, steps: [25, 50, 75] });
    });
    
    test('should parse object with value and timing', () => {
      const result = parsePropertyAnimation({ value: 100, duration: 500, delay: 200 }, 0);
      expect(result).toEqual({ from: 0, to: 100, duration: 500, delay: 200 });
    });
  });
  
  describe('parseCssValue', () => {
    test('should parse pixel values', () => {
      const result = parseCssValue('100px');
      expect(result).toEqual({ value: 100, unit: 'px' });
    });
    
    test('should parse percentage values', () => {
      const result = parseCssValue('50%');
      expect(result).toEqual({ value: 50, unit: '%' });
    });
    
    test('should parse unitless values', () => {
      const result = parseCssValue('0.5');
      expect(result).toEqual({ value: 0.5, unit: '' });
    });
    
    test('should handle negative values', () => {
      const result = parseCssValue('-10em');
      expect(result).toEqual({ value: -10, unit: 'em' });
    });
  });
  
  describe('isColor', () => {
    test('should detect hex colors', () => {
      expect(isColor('#fff')).toBe(true);
      expect(isColor('#ffffff')).toBe(true);
      expect(isColor('#00ff00')).toBe(true);
    });
    
    test('should detect rgb colors', () => {
      expect(isColor('rgb(255, 0, 0)')).toBe(true);
    });
    
    test('should detect rgba colors', () => {
      expect(isColor('rgba(255, 0, 0, 0.5)')).toBe(true);
    });
    
    test('should return false for non-color values', () => {
      expect(isColor('100px')).toBe(false);
      expect(isColor(100)).toBe(false);
    });
  });
  
  describe('isTransform', () => {
    test('should detect transform functions', () => {
      expect(isTransform('translateX(100px)')).toBe(true);
      expect(isTransform('rotate(45deg)')).toBe(true);
      expect(isTransform('scale(1.5)')).toBe(true);
    });
    
    test('should return false for non-transform values', () => {
      expect(isTransform('100px')).toBe(false);
      expect(isTransform('#ff0000')).toBe(false);
    });
  });
});