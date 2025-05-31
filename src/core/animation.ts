import { Observable, Subscription } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

import {AnimationDefinition, AnimationOptions, AnimationState, PropertyAnimation} from '../types/Animation.types';
import { interpolate, updateTargetProperties } from './interpolation';
import { createAnimationObservable, createAnimationState, stagger, createStaggeredAnimations, getCurrentValue, getDefaultValue, parsePropertyAnimation } from '../utils';
import { StaggerOptions, StaggerValue } from '../types/Stagger.types';

export class Animation {
  private animationState = createAnimationState();
  private animationSubscription: Subscription | null = null;
  
  private startTime = 0;
  private pausedTime = 0;
  
  /**
   * Create a new animation
   * @param definition - Animation definition
   */
  constructor(private definition: AnimationDefinition) {
    if (this.definition.options.autoplay) {
      setTimeout(() => this.play(), 0);
    }
  }

  /**
   * Play the animation
   * @returns This animation for chaining
   */
  play(): Animation {
    if (this.animationState.state$.value === 'running') return this;

    if (this.animationState.state$.value === 'paused') {
      this.startTime = performance.now() - this.pausedTime;
    } else {
      this.startTime = performance.now() + (this.definition.options.delay || 0);
    }

    this.animationState.state$.next('running');

    // Unsubscribe from previous animation if any
    this.cleanup();

    // Create and subscribe to animation observable
    const { duration, easing = t => t } = this.definition.options;

    this.animationSubscription = createAnimationObservable(
        duration,
        this.startTime,
        easing
    ).pipe(
        tap(progress => {
          this.animationState.progress$.next(progress);
          this.updateProperties(progress);
        }),
        finalize(() => {
          if (this.animationState.state$.value === 'running') {
            this.animationState.state$.next('completed');
          }
        })
    ).subscribe({
      error: this.handleError.bind(this)
    });

    return this;
  }

  /**
   * Pause the animation
   * @returns This animation for chaining
   */
  pause(): Animation {
    if (this.animationState.state$.value !== 'running') return this;
    
    this.pausedTime = performance.now() - this.startTime;
    this.animationState.state$.next('paused');
    this.cleanup();
    
    return this;
  }
  
  /**
   * Stop and reset the animation
   * @returns This animation for chaining
   */
  stop(): Animation {
    this.cleanup();
    this.animationState.state$.next('idle');
    this.animationState.progress$.next(0);
    this.updateProperties(0);
    
    return this;
  }
  
  /**
   * Seek to a specific progress point
   * @param progress - Progress value (0 to 1)
   * @returns This animation for chaining
   */
  seek(progress: number): Animation {
    const boundedProgress = Math.min(Math.max(progress, 0), 1);
    
    this.animationState.progress$.next(boundedProgress);
    this.updateProperties(boundedProgress);
    
    return this;
  }
  
  /**
   * Get the progress observable
   * @returns Observable that emits progress values (0 to 1)
   */
  progress(): Observable<number> {
    return this.animationState.progress;
  }
  
  /**
   * Get the animationState observable
   * @returns Observable that emits animation animationState
   */
  state(): Observable<AnimationState> {
    return this.animationState.state;
  }
  
  /**
   * Get the total duration of this animation (including delays)
   */
  get duration(): number {
    const { duration, delay = 0, endDelay = 0 } = this.definition.options;
    return duration + delay + endDelay;
  }
  
  /**
   * Clean up any active subscriptions
   */
  private cleanup(): void {
    if (this.animationSubscription) {
      this.animationSubscription.unsubscribe();
      this.animationSubscription = null;
    }
  }
  
  /**
   * Handle animation errors
   */
  private handleError(error: any): void {
    console.error('Animation error:', error);
    this.animationState.state$.next('idle');
    this.cleanup();
  }
  
  /**
   * Update properties based on current progress
   */
  private updateProperties(progress: number): void {
    const { target, properties } = this.definition;

    // Calculate interpolated values for all properties
    const interpolatedValues: Record<string, any> = {};

    Object.entries(properties).forEach(([prop, propAnimation]) => {
      // Get current value if needed for implicit "from" values
      const currentValue = getCurrentValue(target, prop) || getDefaultValue(prop);

      // Parse the property animation into a normalized format
      const normalized = parsePropertyAnimation(propAnimation, currentValue);

      // Apply property-specific duration/delay if defined
      const propertyProgress = progress;

      // Handle multi-step animations if defined
      if (normalized.steps && normalized.steps.length > 0) {
        interpolatedValues[prop] = this.interpolateSteps(
            [normalized.from, ...normalized.steps, normalized.to],
            propertyProgress
        );
      } else {
        // Standard from-to interpolation
        interpolatedValues[prop] = interpolate(normalized.from, normalized.to, propertyProgress);
      }
    });

    // Update target with all interpolated values
    updateTargetProperties(target, interpolatedValues);
  }
  /**
   * Interpolate through multiple steps based on progress
   * @param steps - Array of values including from and to
   * @param progress - Progress value (0 to 1)
   * @returns Interpolated value
   */
  interpolateSteps(steps: any[], progress: number): any {
    if (steps.length < 2) return steps[0];

    // Calculate which segment we're in
    const segmentCount = steps.length - 1;
    const segmentSize = 1 / segmentCount;
    const segmentIndex = Math.min(Math.floor(progress / segmentSize), segmentCount - 1);

    // Calculate local progress within this segment
    const segmentProgress = (progress - segmentIndex * segmentSize) / segmentSize;

    // Interpolate between segment start and end
    return interpolate(steps[segmentIndex], steps[segmentIndex + 1], segmentProgress);
  }
  /**
   * Create staggered animations for multiple targets
   * @param targets - Array of elements to animate
   * @param properties - Properties to animate
   * @param options - Animation options
   * @param staggerValue - Stagger delay value
   * @param staggerOptions - Stagger configuration options
   * @returns Array of Animation instances
   */
  static stagger(
      targets: any[],
      properties: Record<string, PropertyAnimation>,
      options: AnimationOptions,
      staggerValue: StaggerValue,
      staggerOptions: StaggerOptions = {}
  ): Animation[] {
    // Create a stagger delay function
    const staggerFn = stagger(staggerValue, staggerOptions);

    // Create staggered animations
    return createStaggeredAnimations(
        targets,
        (target, index, total) => new Animation({
          target,
          properties,
          options: { ...options }
        }),
        staggerFn
    );
  }
  /**
   * Convert the animation to a Promise that resolves when the animation completes
   * @returns Promise that resolves when the animation completes or rejects on error
   */
  toPromise(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Create a new subscription to the state observable
      const subscription = this.state().subscribe({
        next: (state) => {
          if (state === 'completed') {
            subscription.unsubscribe();
            resolve();
          }
        },
        error: (err) => {
          subscription.unsubscribe();
          reject(err);
        }
      });

      // If the animation is not running, start it
      if (this.animationState.state$.value !== 'running') {
        this.play();
      }
    });
  }

  /**
   * Make the Animation class "thenable" to support Promise-like usage
   */
  then<TResult1 = void, TResult2 = never>(
      onFulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    return this.toPromise().then(onFulfilled, onRejected);
  }

  /**
   * Add catch method for Promise-like error handling
   */
  catch<TResult = never>(
      onRejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
  ): Promise<void | TResult> {
    return this.toPromise().catch(onRejected);
  }

  /**
   * Add finally method for Promise-like cleanup
   */
  finally(onFinally?: (() => void) | undefined | null): Promise<void> {
    return this.toPromise().finally(onFinally);
  }
}