import {animate, AnimationConfig, AnimationState} from './animation';

describe('animate', () => {
  it('should emit states and complete for a simple linear animation', (done) => {
    const config: AnimationConfig = {
      from: 0,
      to: 100,
      duration: 100,
      easing: (t) => t,
    };

    const states: number[] = [];
    animate(config).subscribe({
      next: (state: AnimationState) => {
        states.push(state.value);
      },
      complete: () => {

        expect(states.length).toBeGreaterThan(0);
        expect(states[states.length - 1]).toBe(100);
        done();
      },
    });
  });
});