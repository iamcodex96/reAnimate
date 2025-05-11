import { Observable, animationFrameScheduler, SchedulerLike, Subscriber, observeOn } from 'rxjs';

export type AnimationConfig = {
  from: number;
  to: number;
  duration: number;
  easing?: (t: number) => number;
};

export type AnimationState = {
  value: number;
  progress: number;
  isDone: boolean;
};

/**
 * The main animation function built as a functional construct.
 * @param config - The configuration for animation
 * @param scheduler - Scheduler for controlling animation frame updates
 * @returns Observable<AnimationState>
 */
export const animate = (
  config: AnimationConfig,
  scheduler: SchedulerLike = animationFrameScheduler
): Observable<AnimationState> => {
  const { from, to, duration, easing = (t: number) => t } = config;

  return new Observable<AnimationState>((subscriber: Subscriber<AnimationState>) => {
    const startTime = performance.now();
    if (config.duration <= 0) {
      throw new Error('Invalid duration. Duration must be greater than 0');
    }
    // Steps through the animation frames
    const step = (now: number) => {
      const elapsedTime = now - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easing(progress);

      // Calculate the current value based on the easing function
      const currentValue = from + easedProgress * (to - from);

      subscriber.next({
        value: currentValue,
        progress,
        isDone: progress === 1,
      });

      if (progress < 1) {
        scheduler.schedule(() => step(performance.now()));
      } else {
        subscriber.complete();
      }
    };

    // Start the step logic
    step(performance.now());
  }).pipe(observeOn(scheduler));
};