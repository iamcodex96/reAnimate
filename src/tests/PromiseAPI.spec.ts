import { Animation } from '../core/animation';
import { createAnimationState } from '../utils/rxjs.util';

// Mock performance.now to control time
const originalPerformanceNow = performance.now;
let mockTime = 0;
performance.now = jest.fn(() => mockTime);

describe('Animation Promise API', () => {
  afterAll(() => {
    performance.now = originalPerformanceNow;
  });

  beforeEach(() => {
    mockTime = 0;
  });

  test('toPromise resolves when animation completes', async () => {
    // Create a simple animation
    const target = {};
    const animation = new Animation({
      target,
      properties: { x: [0, 100] },
      options: { duration: 1000 }
    });

    // Start the promise but don't await it yet
    const promise = animation.toPromise();
    
    // The animation should auto-play
    expect(animation['animationState'].state$.value).toBe('running');
    
    // Advance time to complete the animation
    mockTime = 2000;
    
    // Manually trigger animation completion
    animation['animationState'].state$.next('completed');
    
    // Now wait for the promise to resolve
    await expect(promise).resolves.toBeUndefined();
  });

  test('then method works like a Promise', async () => {
    // Create a simple animation
    const target = {};
    const animation = new Animation({
      target,
      properties: { x: [0, 100] },
      options: { duration: 1000 }
    });

    // Use then directly without toPromise
    const thenPromise = animation.then(() => 'completed');
    
    // Manually trigger animation completion
    animation['animationState'].state$.next('completed');
    
    // Check the promise resolves with the transformed value
    await expect(thenPromise).resolves.toBe('completed');
  });

  test('catch method catches errors', async () => {
    // Create a simple animation
    const target = {};
    const animation = new Animation({
      target,
      properties: { x: [0, 100] },
      options: { duration: 1000 }
    });

    // Start a promise chain that will catch errors
    const promise = animation.catch(err => 'error caught');
    
    // Manually trigger an error
    animation['animationState'].state$.error(new Error('Test error'));
    
    // The catch handler should transform the error
    await expect(promise).resolves.toBe('error caught');
  });

  test('finally method executes regardless of result', async () => {
    // Create a simple animation
    const target = {};
    const animation = new Animation({
      target,
      properties: { x: [0, 100] },
      options: { duration: 1000 }
    });

    // Track if finally was called
    let finallyCalled = false;
    
    // Start a promise with finally
    const promise = animation.finally(() => {
      finallyCalled = true;
    });
    
    // Manually trigger animation completion
    animation['animationState'].state$.next('completed');
    
    // Wait for the promise to settle
    await promise;
    
    // Check that finally was called
    expect(finallyCalled).toBe(true);
  });
});