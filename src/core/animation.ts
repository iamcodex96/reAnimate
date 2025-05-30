import { Observable, Subscription } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

import { AnimationDefinition, AnimationOptions, AnimationState } from './types';
import { interpolate, updateTargetProperties } from './interpolation';
import { createAnimationObservable, createAnimationState } from '../utils/rxjs.util';

export class Animation {
  private animationState = createAnimationState();
  private animationSubscription: Subscription | null = null;
  
  private startTime = 0;
  private pausedTime = 0;
  
  /**
   * Create a new animation
   * @param definition - Animation definition
   */
  constructor(private definition: AnimationDefinition) {}
  
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
    
    Object.entries(properties).forEach(([prop, [from, to]]) => {
      interpolatedValues[prop] = interpolate(from, to, progress);
    });
    
    // Update target with all interpolated values
    updateTargetProperties(target, interpolatedValues);
  }
}