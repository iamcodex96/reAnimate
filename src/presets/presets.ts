// src/presets/presets.ts

import { AnimationDefinition } from '../core/types';
import { EasingFunction } from '../easings/easings.interface';
import EASINGS from '../easings/easings.const';
import { Animation } from '../core/animation';
import { Timeline } from '../core/timeline';
import {PresetName} from "./presets.const";

/**
 * Configuration options for animation presets
 */
export interface PresetConfig {
    /** Animation duration in milliseconds */
    duration?: number;

    /** Delay before the animation starts */
    delay?: number;

    /** Easing function to use */
    easing?: EasingFunction;

    /** Additional properties to animate */
    extraProperties?: Record<string, [any, any]>;

    /** Distance for movement-based animations (px, rem, etc.) */
    distance?: string;

    /** Intensity of the animation effect (0-1) */
    intensity?: number;

    /** Scale factor for animations that use scaling */
    scale?: number;

    /** Rotation angle for animations that use rotation (in degrees) */
    rotation?: number;

    /** Animation direction ('left', 'right', 'up', 'down', etc.) */
    direction?: string;

    /** Whether the animation should autoplay */
    autoplay?: boolean;
}

/**
 * Creates default animation options
 */
function createDefaultOptions(config: PresetConfig) {
    return {
        duration: config.duration || 500,
        easing: config.easing || EASINGS.easeOutQuint,
        delay: config.delay || 0
    };
}

/**
 * Merges additional properties with the base properties
 */
function mergeProperties(
    baseProperties: Record<string, [any, any]>,
    extraProperties?: Record<string, [any, any]>
): Record<string, [any, any]> {
    if (!extraProperties) return baseProperties;
    return { ...baseProperties, ...extraProperties };
}

/**
 * Animation presets library
 */
export const presets = {
    /**
     * Fade in animation
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    fadeIn: (target: any, config: PresetConfig = {}): Animation | AnimationDefinition => {
        const definition: AnimationDefinition = {
            target,
            properties: mergeProperties(
                { opacity: [0, 1] },
                config.extraProperties
            ),
            options: createDefaultOptions(config)
        };

        return config.autoplay ? new Animation(definition).play() : definition;
    },

    /**
     * Fade out animation
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    fadeOut: (target: any, config: PresetConfig = {}): Animation | AnimationDefinition => {
        const definition: AnimationDefinition = {
            target,
            properties: mergeProperties(
                { opacity: [1, 0] },
                config.extraProperties
            ),
            options: createDefaultOptions(config)
        };

        return config.autoplay ? new Animation(definition).play() : definition;
    },

    /**
     * Slide in animation
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    slideIn: (target: any, config: PresetConfig = {}): Animation | AnimationDefinition => {
        const direction = config.direction || 'left';
        const distance = config.distance || '100px';

        const transforms: Record<string, [string, string]> = {
            left: [`translateX(-${distance})`, 'translateX(0)'],
            right: [`translateX(${distance})`, 'translateX(0)'],
            up: [`translateY(-${distance})`, 'translateY(0)'],
            down: [`translateY(${distance})`, 'translateY(0)']
        };

        const definition: AnimationDefinition = {
            target,
            properties: mergeProperties(
                {
                    transform: transforms[direction],
                    opacity: [0, 1]
                },
                config.extraProperties
            ),
            options: createDefaultOptions(config)
        };

        return config.autoplay ? new Animation(definition).play() : definition;
    },

    /**
     * Slide out animation
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    slideOut: (target: any, config: PresetConfig = {}): Animation | AnimationDefinition => {
        const direction = config.direction || 'left';
        const distance = config.distance || '100px';

        const transforms: Record<string, [string, string]> = {
            left: ['translateX(0)', `translateX(-${distance})`],
            right: ['translateX(0)', `translateX(${distance})`],
            up: ['translateY(0)', `translateY(-${distance})`],
            down: ['translateY(0)', `translateY(${distance})`]
        };

        const definition: AnimationDefinition = {
            target,
            properties: mergeProperties(
                {
                    transform: transforms[direction],
                    opacity: [1, 0]
                },
                config.extraProperties
            ),
            options: createDefaultOptions(config)
        };

        return config.autoplay ? new Animation(definition).play() : definition;
    },

    /**
     * Zoom in animation
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    zoomIn: (target: any, config: PresetConfig = {}): Animation | AnimationDefinition => {
        const scale = config.scale || 0.5;

        const definition: AnimationDefinition = {
            target,
            properties: mergeProperties(
                {
                    transform: [`scale(${scale})`, 'scale(1)'],
                    opacity: [0, 1]
                },
                config.extraProperties
            ),
            options: createDefaultOptions(config)
        };

        return config.autoplay ? new Animation(definition).play() : definition;
    },

    /**
     * Zoom out animation
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    zoomOut: (target: any, config: PresetConfig = {}): Animation | AnimationDefinition => {
        const scale = config.scale || 0.5;

        const definition: AnimationDefinition = {
            target,
            properties: mergeProperties(
                {
                    transform: ['scale(1)', `scale(${scale})`],
                    opacity: [1, 0]
                },
                config.extraProperties
            ),
            options: createDefaultOptions(config)
        };

        return config.autoplay ? new Animation(definition).play() : definition;
    },

    /**
     * Flip animation
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    flip: (target: any, config: PresetConfig = {}): Animation | AnimationDefinition => {
        const direction = config.direction || 'x';
        const axis = direction === 'x' ? 'Y' : 'X';

        const definition: AnimationDefinition = {
            target,
            properties: mergeProperties(
                {
                    transform: [
                        `perspective(400px) rotate${axis}(0)`,
                        `perspective(400px) rotate${axis}(180deg)`
                    ]
                },
                config.extraProperties
            ),
            options: createDefaultOptions({
                ...config,
                easing: config.easing || EASINGS.easeInOutQuart
            })
        };

        return config.autoplay ? new Animation(definition).play() : definition;
    },

    /**
     * Shake animation
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    shake: (target: any, config: PresetConfig = {}): Animation | Timeline => {
        const intensity = config.intensity || 1;
        const distance = config.distance || '10px';
        const shakeDistance = `${parseInt(distance) * intensity}px`;

        // Shake is a timeline animation with multiple steps
        const timeline = new Timeline();

        timeline.add({
            target,
            properties: {
                transform: ['translateX(0)', `translateX(-${shakeDistance})`]
            },
            options: {
                duration: (config.duration || 500) / 6,
                easing: EASINGS.easeOutQuad
            }
        });

        timeline.add({
            target,
            properties: {
                transform: [`translateX(-${shakeDistance})`, `translateX(${shakeDistance})`]
            },
            options: {
                duration: (config.duration || 500) / 6,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        timeline.add({
            target,
            properties: {
                transform: [`translateX(${shakeDistance})`, `translateX(-${shakeDistance})`]
            },
            options: {
                duration: (config.duration || 500) / 6,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        timeline.add({
            target,
            properties: {
                transform: [`translateX(-${shakeDistance})`, `translateX(${shakeDistance})`]
            },
            options: {
                duration: (config.duration || 500) / 6,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        timeline.add({
            target,
            properties: {
                transform: [`translateX(${shakeDistance})`, `translateX(-${shakeDistance})`]
            },
            options: {
                duration: (config.duration || 500) / 6,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        timeline.add({
            target,
            properties: {
                transform: [`translateX(-${shakeDistance})`, 'translateX(0)']
            },
            options: {
                duration: (config.duration || 500) / 6,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        if (config.autoplay) {
            timeline.play();
        }

        return timeline;
    },

    /**
     * Pulse animation
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    pulse: (target: any, config: PresetConfig = {}): Animation | Timeline => {
        const intensity = config.intensity || 1;
        const scale = 1 + (0.1 * intensity);

        const timeline = new Timeline();

        timeline.add({
            target,
            properties: {
                transform: ['scale(1)', `scale(${scale})`]
            },
            options: {
                duration: (config.duration || 500) / 2,
                easing: EASINGS.easeOutQuad
            }
        });

        timeline.add({
            target,
            properties: {
                transform: [`scale(${scale})`, 'scale(1)']
            },
            options: {
                duration: (config.duration || 500) / 2,
                easing: EASINGS.easeInOutQuad
            }
        }, '+=0');

        if (config.autoplay) {
            timeline.play();
        }

        return timeline;
    },

    /**
     * Bounce animation
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    bounce: (target: any, config: PresetConfig = {}): Animation | Timeline => {
        const intensity = config.intensity || 1;
        const distance = config.distance || '30px';
        const bounceHeight = `${parseInt(distance) * intensity}px`;

        const timeline = new Timeline();

        // Initial down movement
        timeline.add({
            target,
            properties: {
                transform: ['translateY(0)', `translateY(${bounceHeight})`]
            },
            options: {
                duration: (config.duration || 800) * 0.25,
                easing: EASINGS.easeInQuad
            }
        });

        // Bounce up
        timeline.add({
            target,
            properties: {
                transform: [`translateY(${bounceHeight})`, 'translateY(0)']
            },
            options: {
                duration: (config.duration || 800) * 0.25,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        // Small bounce down
        timeline.add({
            target,
            properties: {
                transform: ['translateY(0)', `translateY(${bounceHeight}/2)`]
            },
            options: {
                duration: (config.duration || 800) * 0.15,
                easing: EASINGS.easeInQuad
            }
        }, '+=0');

        // Small bounce up
        timeline.add({
            target,
            properties: {
                transform: [`translateY(${bounceHeight}/2)`, 'translateY(0)']
            },
            options: {
                duration: (config.duration || 800) * 0.15,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        // Tiny bounce down
        timeline.add({
            target,
            properties: {
                transform: ['translateY(0)', `translateY(${bounceHeight}/4)`]
            },
            options: {
                duration: (config.duration || 800) * 0.1,
                easing: EASINGS.easeInQuad
            }
        }, '+=0');

        // Tiny bounce up
        timeline.add({
            target,
            properties: {
                transform: [`translateY(${bounceHeight}/4)`, 'translateY(0)']
            },
            options: {
                duration: (config.duration || 800) * 0.1,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        if (config.autoplay) {
            timeline.play();
        }

        return timeline;
    },

    /**
     * Swing animation
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    swing: (target: any, config: PresetConfig = {}): Animation | Timeline => {
        const intensity = config.intensity || 1;
        const rotation = (config.rotation || 15) * intensity;

        const timeline = new Timeline();

        timeline.add({
            target,
            properties: {
                transform: ['rotate(0deg)', `rotate(${rotation}deg)`]
            },
            options: {
                duration: (config.duration || 800) * 0.2,
                easing: EASINGS.easeOutQuad
            }
        });

        timeline.add({
            target,
            properties: {
                transform: [`rotate(${rotation}deg)`, `rotate(-${rotation * 0.8}deg)`]
            },
            options: {
                duration: (config.duration || 800) * 0.2,
                easing: EASINGS.easeInOutQuad
            }
        }, '+=0');

        timeline.add({
            target,
            properties: {
                transform: [`rotate(-${rotation * 0.8}deg)`, `rotate(${rotation * 0.6}deg)`]
            },
            options: {
                duration: (config.duration || 800) * 0.2,
                easing: EASINGS.easeInOutQuad
            }
        }, '+=0');

        timeline.add({
            target,
            properties: {
                transform: [`rotate(${rotation * 0.6}deg)`, `rotate(-${rotation * 0.4}deg)`]
            },
            options: {
                duration: (config.duration || 800) * 0.2,
                easing: EASINGS.easeInOutQuad
            }
        }, '+=0');

        timeline.add({
            target,
            properties: {
                transform: [`rotate(-${rotation * 0.4}deg)`, 'rotate(0deg)']
            },
            options: {
                duration: (config.duration || 800) * 0.2,
                easing: EASINGS.easeInOutQuad
            }
        }, '+=0');

        if (config.autoplay) {
            timeline.play();
        }

        return timeline;
    },

    /**
     * Tada animation (attention seeker)
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    tada: (target: any, config: PresetConfig = {}): Animation | Timeline => {
        const intensity = config.intensity || 1;
        const scale1 = 1 - (0.1 * intensity);
        const scale2 = 1 + (0.1 * intensity);
        const rotation = (3 * intensity);

        const timeline = new Timeline();

        // Initial small scale
        timeline.add({
            target,
            properties: {
                transform: ['scale(1) rotate(0deg)', `scale(${scale1}) rotate(0deg)`]
            },
            options: {
                duration: (config.duration || 800) * 0.1,
                easing: EASINGS.easeOutQuad
            }
        });

        // Scale up with rotation
        timeline.add({
            target,
            properties: {
                transform: [`scale(${scale1}) rotate(0deg)`, `scale(${scale2}) rotate(${rotation}deg)`]
            },
            options: {
                duration: (config.duration || 800) * 0.1,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        // Rotation sequence
        for (let i = 0; i < 5; i++) {
            const fromRotation = i % 2 === 0 ? rotation : -rotation;
            const toRotation = i % 2 === 0 ? -rotation : rotation;

            timeline.add({
                target,
                properties: {
                    transform: [`scale(${scale2}) rotate(${fromRotation}deg)`, `scale(${scale2}) rotate(${toRotation}deg)`]
                },
                options: {
                    duration: (config.duration || 800) * 0.1,
                    easing: EASINGS.easeOutQuad
                }
            }, '+=0');
        }

        // Return to normal
        timeline.add({
            target,
            properties: {
                transform: [`scale(${scale2}) rotate(${rotation}deg)`, 'scale(1) rotate(0deg)']
            },
            options: {
                duration: (config.duration || 800) * 0.1,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        if (config.autoplay) {
            timeline.play();
        }

        return timeline;
    },

    /**
     * Jello animation (wiggle effect)
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    jello: (target: any, config: PresetConfig = {}): Animation | Timeline => {
        const intensity = config.intensity || 1;
        const timeline = new Timeline();

        // Initial skew
        timeline.add({
            target,
            properties: {
                transform: ['skewX(0deg) skewY(0deg)', `skewX(-12.5deg * ${intensity}) skewY(-12.5deg * ${intensity})`]
            },
            options: {
                duration: (config.duration || 1000) * 0.15,
                easing: EASINGS.easeOutQuad
            }
        });

        // Alternating skews
        const skews = [
            [12.5, 12.5],
            [-6.25, -6.25],
            [3.125, 3.125],
            [-1.5625, -1.5625],
            [0.78125, 0.78125],
            [-0.390625, -0.390625]
        ];

        skews.forEach((skew, index) => {
            const [skewX, skewY] = skew.map(s => s * intensity);

            timeline.add({
                target,
                properties: {
                    transform: [
                        `skewX(${-skewX}deg) skewY(${-skewY}deg)`,
                        `skewX(${skewX}deg) skewY(${skewY}deg)`
                    ]
                },
                options: {
                    duration: (config.duration || 1000) * 0.1,
                    easing: EASINGS.easeOutQuad
                }
            }, '+=0');
        });

        // Return to normal
        timeline.add({
            target,
            properties: {
                transform: [`skewX(${skews[skews.length - 1][0] * intensity}deg) skewY(${skews[skews.length - 1][1] * intensity}deg)`, 'skewX(0deg) skewY(0deg)']
            },
            options: {
                duration: (config.duration || 1000) * 0.05,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        if (config.autoplay) {
            timeline.play();
        }

        return timeline;
    },

    /**
     * Heartbeat animation
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    heartbeat: (target: any, config: PresetConfig = {}): Animation | Timeline => {
        const intensity = config.intensity || 1;
        const scale1 = 1 + (0.14 * intensity);
        const scale2 = 1 + (0.30 * intensity);

        const timeline = new Timeline();

        // First beat
        timeline.add({
            target,
            properties: {
                transform: ['scale(1)', `scale(${scale1})`]
            },
            options: {
                duration: (config.duration || 1500) * 0.14,
                easing: EASINGS.easeOutQuad
            }
        });

        timeline.add({
            target,
            properties: {
                transform: [`scale(${scale1})`, 'scale(1)']
            },
            options: {
                duration: (config.duration || 1500) * 0.14,
                easing: EASINGS.easeInQuad
            }
        }, '+=0');

        // Slight pause
        timeline.add({
            target,
            properties: {
                transform: ['scale(1)', 'scale(1)']
            },
            options: {
                duration: (config.duration || 1500) * 0.14,
            }
        }, '+=0');

        // Second stronger beat
        timeline.add({
            target,
            properties: {
                transform: ['scale(1)', `scale(${scale2})`]
            },
            options: {
                duration: (config.duration || 1500) * 0.14,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        timeline.add({
            target,
            properties: {
                transform: [`scale(${scale2})`, 'scale(1)']
            },
            options: {
                duration: (config.duration || 1500) * 0.14,
                easing: EASINGS.easeInQuad
            }
        }, '+=0');

        // Rest period
        timeline.add({
            target,
            properties: {
                transform: ['scale(1)', 'scale(1)']
            },
            options: {
                duration: (config.duration || 1500) * 0.3,
            }
        }, '+=0');

        if (config.autoplay) {
            timeline.play();
        }

        return timeline;
    },

    /**
     * Hinge animation (fall and rotate out)
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    hinge: (target: any, config: PresetConfig = {}): Animation | Timeline => {
        const timeline = new Timeline();
        const duration = config.duration || 2000;

        // Set transform origin
        if (target instanceof HTMLElement) {
            target.style.transformOrigin = 'top left';
        }

        // First rotation
        timeline.add({
            target,
            properties: {
                transform: ['rotate(0deg)', 'rotate(80deg)'],
                opacity: [1, 1]
            },
            options: {
                duration: duration * 0.2,
                easing: EASINGS.easeOutQuad
            }
        });

        // Second rotation
        timeline.add({
            target,
            properties: {
                transform: ['rotate(80deg)', 'rotate(60deg)']
            },
            options: {
                duration: duration * 0.2,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        // Third rotation
        timeline.add({
            target,
            properties: {
                transform: ['rotate(60deg)', 'rotate(80deg)']
            },
            options: {
                duration: duration * 0.2,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        // Fall off
        timeline.add({
            target,
            properties: {
                transform: ['rotate(80deg)', 'translateY(700px) rotate(80deg)'],
                opacity: [1, 0]
            },
            options: {
                duration: duration * 0.4,
                easing: EASINGS.easeInQuad
            }
        }, '+=0');

        if (config.autoplay) {
            timeline.play();
        }

        return timeline;
    },

    /**
     * Roll in animation
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    rollIn: (target: any, config: PresetConfig = {}): Animation | AnimationDefinition => {
        const definition: AnimationDefinition = {
            target,
            properties: mergeProperties(
                {
                    transform: ['translateX(-100%) rotate(-120deg)', 'translateX(0) rotate(0)'],
                    opacity: [0, 1]
                },
                config.extraProperties
            ),
            options: createDefaultOptions({
                ...config,
                duration: config.duration || 800,
                easing: config.easing || EASINGS.easeOutQuad
            })
        };

        return config.autoplay ? new Animation(definition).play() : definition;
    },

    /**
     * Roll out animation
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    rollOut: (target: any, config: PresetConfig = {}): Animation | AnimationDefinition => {
        const definition: AnimationDefinition = {
            target,
            properties: mergeProperties(
                {
                    transform: ['translateX(0) rotate(0)', 'translateX(100%) rotate(120deg)'],
                    opacity: [1, 0]
                },
                config.extraProperties
            ),
            options: createDefaultOptions({
                ...config,
                duration: config.duration || 800,
                easing: config.easing || EASINGS.easeInQuad
            })
        };

        return config.autoplay ? new Animation(definition).play() : definition;
    },

    /**
     * Flash animation
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    flash: (target: any, config: PresetConfig = {}): Animation | Timeline => {
        const timeline = new Timeline();

        timeline.add({
            target,
            properties: { opacity: [1, 0] },
            options: { duration: (config.duration || 1000) * 0.25, easing: EASINGS.easeOutQuad }
        });

        timeline.add({
            target,
            properties: { opacity: [0, 1] },
            options: { duration: (config.duration || 1000) * 0.25, easing: EASINGS.easeOutQuad }
        }, '+=0');

        timeline.add({
            target,
            properties: { opacity: [1, 0] },
            options: { duration: (config.duration || 1000) * 0.25, easing: EASINGS.easeOutQuad }
        }, '+=0');

        timeline.add({
            target,
            properties: { opacity: [0, 1] },
            options: { duration: (config.duration || 1000) * 0.25, easing: EASINGS.easeOutQuad }
        }, '+=0');

        if (config.autoplay) {
            timeline.play();
        }

        return timeline;
    },

    /**
     * Rubber band animation
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    rubberBand: (target: any, config: PresetConfig = {}): Animation | Timeline => {
        const timeline = new Timeline();
        const intensity = config.intensity || 1;

        timeline.add({
            target,
            properties: {
                transform: ['scale3d(1, 1, 1)', `scale3d(${1.25 * intensity}, ${0.75 * intensity}, 1)`]
            },
            options: {
                duration: (config.duration || 1000) * 0.15,
                easing: EASINGS.easeOutQuad
            }
        });

        timeline.add({
            target,
            properties: {
                transform: [`scale3d(${1.25 * intensity}, ${0.75 * intensity}, 1)`, `scale3d(${0.75 * intensity}, ${1.25 * intensity}, 1)`]
            },
            options: {
                duration: (config.duration || 1000) * 0.15,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        timeline.add({
            target,
            properties: {
                transform: [`scale3d(${0.75 * intensity}, ${1.25 * intensity}, 1)`, `scale3d(${1.15 * intensity}, ${0.85 * intensity}, 1)`]
            },
            options: {
                duration: (config.duration || 1000) * 0.15,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        timeline.add({
            target,
            properties: {
                transform: [`scale3d(${1.15 * intensity}, ${0.85 * intensity}, 1)`, `scale3d(${0.95 * intensity}, ${1.05 * intensity}, 1)`]
            },
            options: {
                duration: (config.duration || 1000) * 0.15,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        timeline.add({
            target,
            properties: {
                transform: [`scale3d(${0.95 * intensity}, ${1.05 * intensity}, 1)`, 'scale3d(1, 1, 1)']
            },
            options: {
                duration: (config.duration || 1000) * 0.15,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        if (config.autoplay) {
            timeline.play();
        }

        return timeline;
    },

    /**
     * Wobble animation
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    wobble: (target: any, config: PresetConfig = {}): Animation | Timeline => {
        const timeline = new Timeline();
        const intensity = config.intensity || 1;

        timeline.add({
            target,
            properties: {
                transform: ['translate3d(0, 0, 0) rotate(0)', `translate3d(${-25 * intensity}%, 0, 0) rotate(${-5 * intensity}deg)`]
            },
            options: {
                duration: (config.duration || 1000) * 0.15,
                easing: EASINGS.easeOutQuad
            }
        });

        timeline.add({
            target,
            properties: {
                transform: [`translate3d(${-25 * intensity}%, 0, 0) rotate(${-5 * intensity}deg)`, `translate3d(${20 * intensity}%, 0, 0) rotate(${3 * intensity}deg)`]
            },
            options: {
                duration: (config.duration || 1000) * 0.15,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        timeline.add({
            target,
            properties: {
                transform: [`translate3d(${20 * intensity}%, 0, 0) rotate(${3 * intensity}deg)`, `translate3d(${-15 * intensity}%, 0, 0) rotate(${-3 * intensity}deg)`]
            },
            options: {
                duration: (config.duration || 1000) * 0.15,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        timeline.add({
            target,
            properties: {
                transform: [`translate3d(${-15 * intensity}%, 0, 0) rotate(${-3 * intensity}deg)`, `translate3d(${10 * intensity}%, 0, 0) rotate(${2 * intensity}deg)`]
            },
            options: {
                duration: (config.duration || 1000) * 0.15,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        timeline.add({
            target,
            properties: {
                transform: [`translate3d(${10 * intensity}%, 0, 0) rotate(${2 * intensity}deg)`, `translate3d(${-5 * intensity}%, 0, 0) rotate(${-1 * intensity}deg)`]
            },
            options: {
                duration: (config.duration || 1000) * 0.15,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        timeline.add({
            target,
            properties: {
                transform: [`translate3d(${-5 * intensity}%, 0, 0) rotate(${-1 * intensity}deg)`, 'translate3d(0, 0, 0) rotate(0)']
            },
            options: {
                duration: (config.duration || 1000) * 0.15,
                easing: EASINGS.easeOutQuad
            }
        }, '+=0');

        if (config.autoplay) {
            timeline.play();
        }

        return timeline;
    },

    /**
     * Light speed in animation
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    lightSpeedIn: (target: any, config: PresetConfig = {}): Animation | AnimationDefinition => {
        const definition: AnimationDefinition = {
            target,
            properties: mergeProperties(
                {
                    transform: ['translateX(100%) skewX(-30deg)', 'translateX(0) skewX(0)'],
                    opacity: [0, 1]
                },
                config.extraProperties
            ),
            options: createDefaultOptions({
                ...config,
                duration: config.duration || 1000,
                easing: config.easing || EASINGS.easeOutQuad
            })
        };

        return config.autoplay ? new Animation(definition).play() : definition;
    },

    /**
     * Light speed out animation
     * @param target - Element to animate
     * @param config - Animation configuration
     * @returns Animation instance or definition
     */
    lightSpeedOut: (target: any, config: PresetConfig = {}): Animation | AnimationDefinition => {
        const definition: AnimationDefinition = {
            target,
            properties: mergeProperties(
                {
                    transform: ['translateX(0) skewX(0)', 'translateX(100%) skewX(30deg)'],
                    opacity: [1, 0]
                },
                config.extraProperties
            ),
            options: createDefaultOptions({
                ...config,
                duration: config.duration || 1000,
                easing: config.easing || EASINGS.easeInQuad
            })
        };

        return config.autoplay ? new Animation(definition).play() : definition;
    }
};

/**
 * Helper for creating animation presets
 * @param name - Preset name
 * @param target - Target element
 * @param config - Animation configuration
 * @returns Animation or Timeline instance
 */
export function createPresetAnimation(
    name: PresetName,
    target: any,
    config: PresetConfig = {}
): Animation | Timeline | AnimationDefinition {
    if (!presets[name]) {
        throw new Error(`Animation preset "${name}" not found`);
    }

    return presets[name](target, config);
}