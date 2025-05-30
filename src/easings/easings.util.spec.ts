import { createEasing } from './easings.util';

describe('easings.util', () => {
  describe('backEasing', () => {
    describe('GIVEN default overshoot value', () => {
      describe('WHEN creating back easing functions', () => {
        const backEasings = createEasing.backEasing(0);

        it('THEN should create all required easing functions', () => {
          expect(backEasings.easeIn).toBeDefined();
          expect(backEasings.easeOut).toBeDefined();
          expect(backEasings.easeInOut).toBeDefined();
        });

        it('AND should return correct values for easeIn', () => {
          expect(backEasings.easeIn(0)).toBe(0);
          expect(backEasings.easeIn(1)).toBe(1);
          expect(backEasings.easeIn(0.5)).toBeLessThan(0.5); // Due to overshoot
        });

        it('AND should return correct values for easeOut', () => {
          expect(backEasings.easeOut(0)).toBe(0);
          expect(backEasings.easeOut(1)).toBe(1);
          expect(backEasings.easeOut(0.5)).toBeGreaterThan(0.5); // Due to overshoot
        });
      });
    });

    describe('GIVEN custom overshoot value', () => {
      const customOvershoot = 2.5;

      describe('WHEN creating back easing functions', () => {
        const backEasings = createEasing.backEasing(customOvershoot);
        const defaultBackEasings = createEasing.backEasing();

        it('THEN should produce different values than default overshoot', () => {
          expect(backEasings.easeIn(0.5)).not.toBe(defaultBackEasings.easeIn(0.5));
          expect(backEasings.easeOut(0.5)).not.toBe(defaultBackEasings.easeOut(0.5));
        });
      });
    });
  });

  describe('elasticEasing', () => {
    describe('GIVEN default amplitude and period', () => {
      describe('WHEN creating elastic easing functions', () => {
        const elasticEasings = createEasing.elasticEasing();

        it('THEN should create all required easing functions', () => {
          expect(elasticEasings.easeIn).toBeDefined();
          expect(elasticEasings.easeOut).toBeDefined();
          expect(elasticEasings.easeInOut).toBeDefined();
        });

        it('AND should handle boundary conditions for easeIn', () => {
          expect(elasticEasings.easeIn(0)).toBe(0);
          expect(elasticEasings.easeIn(1)).toBe(1);
        });

        it('AND should handle boundary conditions for easeOut', () => {
          expect(elasticEasings.easeOut(0)).toBe(0);
          expect(elasticEasings.easeOut(1)).toBe(1);
        });
      });
    });

    describe('GIVEN custom amplitude and period', () => {
      const customAmplitude = 1.5;
      const customPeriod = 0.4;

      describe('WHEN creating elastic easing functions', () => {
        const elasticEasings = createEasing.elasticEasing(customAmplitude, customPeriod);
        const defaultElasticEasings = createEasing.elasticEasing();

        it('THEN should produce different values than default parameters', () => {
          expect(elasticEasings.easeIn(0.5)).not.toBe(defaultElasticEasings.easeIn(0.5));
          expect(elasticEasings.easeOut(0.5)).not.toBe(defaultElasticEasings.easeOut(0.5));
        });
      });
    });
  });

  describe('bouncyEasing', () => {
    describe('GIVEN default bounce strength', () => {
      describe('WHEN creating bouncy easing functions', () => {
        const bounceEasings = createEasing.bouncyEasing();

        it('THEN should create all required easing functions', () => {
          expect(bounceEasings.easeIn).toBeDefined();
          expect(bounceEasings.easeOut).toBeDefined();
          expect(bounceEasings.easeInOut).toBeDefined();
        });

        it('AND should handle boundary conditions for easeOut', () => {
          expect(bounceEasings.easeOut(0)).toBe(0);
          expect(bounceEasings.easeOut(1)).toBe(1);
        });

        it('AND should create proper bounce effect', () => {
          const midPoint = bounceEasings.easeOut(0.5);
          expect(midPoint).toBeLessThan(1);
          expect(midPoint).toBeGreaterThan(0);
        });
      });
    });

    describe('GIVEN custom bounce strength', () => {
      const customStrength = 8.5;

      describe('WHEN creating bouncy easing functions', () => {
        const bounceEasings = createEasing.bouncyEasing(customStrength);
        const defaultBounceEasings = createEasing.bouncyEasing();

        it('THEN should produce different values than default strength', () => {
          expect(bounceEasings.easeOut(0.5)).not.toBe(defaultBounceEasings.easeOut(0.5));
        });
      });
    });
  });

  describe('circEasing', () => {
    describe('GIVEN default radius', () => {
      describe('WHEN creating circular easing functions', () => {
        const circEasings = createEasing.circEasing();

        it('THEN should create all required easing functions', () => {
          expect(circEasings.easeIn).toBeDefined();
          expect(circEasings.easeOut).toBeDefined();
          expect(circEasings.easeInOut).toBeDefined();
        });

        it('should handle boundary conditions', () => {
          expect(circEasings.easeIn(0)).toBeCloseTo(0);
          expect(circEasings.easeIn(1)).toBeCloseTo(1);
          expect(circEasings.easeOut(0)).toBeCloseTo(0);
          expect(circEasings.easeOut(1)).toBeCloseTo(1);
        });
      });
    });

    describe('GIVEN custom radius', () => {
      const customRadius = 1.5;

      describe('WHEN creating circular easing functions', () => {
        const circEasings = createEasing.circEasing(customRadius);
        const defaultCircEasings = createEasing.circEasing();

        it('THEN should produce different values than default radius', () => {
          expect(circEasings.easeIn(0.5)).not.toBe(defaultCircEasings.easeIn(0.5));
          expect(circEasings.easeOut(0.5)).not.toBe(defaultCircEasings.easeOut(0.5));
        });
      });
    });
  });
});