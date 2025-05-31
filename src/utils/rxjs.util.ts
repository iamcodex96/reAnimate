import { Observable, Subject, BehaviorSubject, animationFrameScheduler, interval } from 'rxjs';
import { map, takeWhile, finalize } from 'rxjs/operators';
import { AnimationState } from '../types/Animation.types';

/**
 * Create an animation frame observable that emits progress values
 * @param duration - Animation duration in milliseconds
 * @param startTime - Animation start time
 * @param easing - Optional easing function
 * @returns Observable that emits progress values from 0 to 1
 */
export function createAnimationObservable(
  duration: number,
  startTime: number,
  easing: (t: number) => number = t => t
): Observable<number> {
  return interval(0, animationFrameScheduler).pipe(
    map(() => performance.now()),
    map(now => (now - startTime) / duration),
    map(progress => Math.min(Math.max(progress, 0), 1)),
    map(progress => easing(progress)),
    takeWhile(progress => progress < 1, true),
  );
}

/**
 * Create animation state and progress subjects
 * @returns Object containing state and progress subjects and observables
 */
export function createAnimationState() {
  const progress$ = new BehaviorSubject<number>(0);
  const state$ = new BehaviorSubject<AnimationState>('idle');
  
  return {
    progress$,
    state$,
    progress: progress$.asObservable(),
    state: state$.asObservable()
  };
}