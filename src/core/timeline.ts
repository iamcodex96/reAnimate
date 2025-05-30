import { Observable, Subscription } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

import { Animation } from './animation';
import { AnimationDefinition, TimelineOffset, AnimationState } from './types';
import { createAnimationObservable, createAnimationState } from '../utils/rxjs.util';
import { parseTimelineOffset } from '../utils/animation.util';

interface TimelineItem {
  animation: Animation;
  timeOffset: number;
}

export class Timeline {
  private animations: TimelineItem[] = [];
  private animationState = createAnimationState();
  private timelineSubscription: Subscription | null = null;
  
  private startTime = 0;
  private pausedTime = 0;
  private _duration = 0;
  
  /**
   * Add an animation to the timeline
   * @param animation - Animation or animation definition to add
   * @param timeOffset - When to start the animation
   * @returns This timeline for chaining
   */
  add(
    animation: Animation | AnimationDefinition, 
    timeOffset: TimelineOffset = '+=0'
  ): Timeline {
    // Convert AnimationDefinition to Animation if needed
    const anim = animation instanceof Animation ? 
      animation : new Animation(animation as AnimationDefinition);
    
    // Calculate offset based on last animation or absolute time
    const lastItem = this.animations[this.animations.length - 1];
    const lastEndTime = lastItem ? 
      lastItem.timeOffset + lastItem.animation.duration : 0;
    
    const offset = parseTimelineOffset(timeOffset, lastEndTime);
    
    // Add to animations list
    this.animations.push({ animation: anim, timeOffset: offset });
    
    // Update total timeline duration
    this._duration = Math.max(this._duration, offset + anim.duration);
    
    return this;
  }
  
  /**
   * Play the timeline
   * @returns This timeline for chaining
   */
  play(): Timeline {
    if (this.animationState.state$.value === 'running') return this;
    
    if (this.animationState.state$.value === 'paused') {
      this.startTime = performance.now() - this.pausedTime;
    } else {
      this.startTime = performance.now();
    }
    
    this.animationState.state$.next('running');
    
    // Cleanup previous subscription if any
    this.cleanup();
    
    // Create and subscribe to timeline observable
    this.timelineSubscription = createAnimationObservable(
      this._duration,
      this.startTime
    ).pipe(
      tap(progress => {
        this.animationState.progress$.next(progress);
        this.updateAnimations(progress);
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
   * Pause the timeline
   * @returns This timeline for chaining
   */
  pause(): Timeline {
    if (this.animationState.state$.value !== 'running') return this;
    
    this.pausedTime = performance.now() - this.startTime;
    this.animationState.state$.next('paused');
    this.cleanup();
    
    return this;
  }
  
  /**
   * Stop and reset the timeline
   * @returns This timeline for chaining
   */
  stop(): Timeline {
    this.cleanup();
    this.animationState.state$.next('idle');
    this.animationState.progress$.next(0);
    this.updateAnimations(0);
    
    return this;
  }
  
  /**
   * Seek to a specific point in the timeline
   * @param progress - Progress value (0 to 1)
   * @returns This timeline for chaining
   */
  seek(progress: number): Timeline {
    const boundedProgress = Math.min(Math.max(progress, 0), 1);
    
    this.animationState.progress$.next(boundedProgress);
    this.updateAnimations(boundedProgress);
    
    return this;
  }
  
  /**
   * Restart the timeline from the beginning
   * @returns This timeline for chaining
   */
  restart(): Timeline {
    this.seek(0);
    return this.play();
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
   * @returns Observable that emits timeline animationState
   */
  state(): Observable<AnimationState> {
    return this.animationState.state;
  }
  
  /**
   * Get the timeline duration
   */
  get duration(): number {
    return this._duration;
  }
  
  /**
   * Clean up any active subscriptions
   */
  private cleanup(): void {
    if (this.timelineSubscription) {
      this.timelineSubscription.unsubscribe();
      this.timelineSubscription = null;
    }
  }
  
  /**
   * Handle timeline errors
   */
  private handleError(error: any): void {
    console.error('Timeline error:', error);
    this.animationState.state$.next('idle');
    this.cleanup();
  }
  
  /**
   * Update animations based on timeline progress
   */
  private updateAnimations(progress: number): void {
    const currentTime = progress * this._duration;
    
    this.animations.forEach(({ animation, timeOffset }) => {
      // Calculate local animation progress
      const animationDuration = animation.duration;
      const animationStart = timeOffset;
      const animationEnd = animationStart + animationDuration;
      
      if (currentTime < animationStart) {
        // Animation hasn't started yet
        animation.seek(0);
      } else if (currentTime > animationEnd) {
        // Animation is complete
        animation.seek(1);
      } else {
        // Animation is in progress
        const localProgress = (currentTime - animationStart) / animationDuration;
        animation.seek(localProgress);
      }
    });
  }
}