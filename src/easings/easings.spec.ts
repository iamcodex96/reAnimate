import { createEasings, easingUtils, easings } from './easings';
import { EasingConfig } from './easings.interface';

describe('Easing Functions', () => {
  describe('createEasings', () => {
    describe('with default configuration', () => {
      describe('GIVEN default easing parameters', () => {
        const expectedLinearValue = 0.5;
        const expectedQuadValue = 0.25;

        describe('WHEN creating easing functions', () => {
          const allEasings = createEasings();

          it('THEN should create valid easing functions', () => {
            expect(allEasings).toBeDefined();
            expect(allEasings.linear(0.5)).toBe(expectedLinearValue);
            expect(allEasings.easeInQuad(0.5)).toBe(expectedQuadValue);
          });
        });
      });
    });

    describe('with custom configuration', () => {
      describe('GIVEN custom easing parameters', () => {
        const config: EasingConfig = {
          overshoot: 2.5,
          amplitude: 1.2,
          period: 0.4,
          bounceStrength: 8.0
        };
        const defaultEasings = createEasings();

        describe('WHEN creating easing functions with custom config', () => {
          const customEasings = createEasings(config);

          it('THEN should create different easing functions than default', () => {
            expect(customEasings.configBackEaseIn(0.5))
              .not.toBe(defaultEasings.configBackEaseIn(0.5));
            expect(customEasings.configElasticEaseOut(0.5))
              .not.toBe(defaultEasings.configElasticEaseOut(0.5));
          });
        });
      });
    });
  });

  describe('easingUtils', () => {
    describe('reverse function', () => {
      describe('GIVEN a linear easing function', () => {
        const linear = (t: number) => t;

        describe('WHEN reversing the function', () => {
          const reversed = easingUtils.reverse(linear);

          it('THEN should correctly reverse the easing values', () => {
            console.log(reversed(1));
            expect(reversed(0)).toBe(1);  // 1 - linear(1) = 1 - 1 = 0
            expect(reversed(1)).toBe(0);  // 1 - linear(0) = 1 - 0 = 1
            expect(reversed(0.5)).toBe(0.5); // 1 - linear(0.5) = 1 - 0.5 = 0.5
          });
        });
      });
    });

    describe('mix function', () => {
      describe('GIVEN two easing functions and a balance', () => {
        const linear = (t: number) => t;
        const quadratic = (t: number) => t * t;
        const balance = 0.75;
        const t = 0.5;
        const expectedValue = 0.25 * 0.5 + 0.75 * 0.25;

        describe('WHEN mixing the functions', () => {
          const mixed = easingUtils.mix(linear, quadratic, balance);

          it('THEN should produce correct weighted average', () => {
            expect(mixed(t)).toBe(expectedValue);
          });
        });
      });
    });
  });

  describe('easings function with utilities', () => {
    describe('GIVEN enhanced easing functions', () => {
      const t = 0.5;
      const enhancedEasings = easings();

      describe('WHEN using utility methods', () => {
        const mirrored = enhancedEasings.easeInQuad.mirror!();
        const mixed = enhancedEasings.linear.mix!(enhancedEasings.easeInQuad, 0.5);

        it('THEN should correctly apply transformations', () => {
          expect(mirrored(t)).toBe(0.5);
          expect(mixed(t)).toBe(0.375);
        });
      });
    });
  });

  describe('Boundary conditions', () => {
    describe('GIVEN all easing functions', () => {
      const allEasings = easings();
      describe('WHEN evaluating at boundaries', () => {
        it('THEN should return correct values at t=0 and t=1', () => {
          Object.values(allEasings).forEach(fn => {
            expect(fn(0)).toBeCloseTo(0, 6);
            expect(fn(1)).toBeCloseTo(1, 6);
          });
        });
      });
    });
  });
});