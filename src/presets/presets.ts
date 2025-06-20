// src/presets/presets.ts

import { AnimationDefinition } from '../types/Animation.types';
import { EasingFunction } from '../easings/easings.interface';
import EASINGS from '../easings/easings.const';
import { Animation, Timeline } from '../core';
import { PresetName, PresetFunction, Presets} from '../types/Presets.types';
import { PRESETS } from './presets.const';

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
        delay: config.delay || 0,
        autoplay: config.autoplay || false,
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
 * Fade in animation
 * @param target - Element to animate
 * @param config - Animation configuration
 * @returns Animation instance or definition
 */
export const fadeIn: PresetFunction = (target: any, config: PresetConfig = {}) => {
    return new Animation({
        target,
        properties: {
            opacity: [0, 1]
        },
        options: createDefaultOptions(config),
    });
}

/**
 * Fade out animation
 * @param target - Element to animate
 * @param config - Animation configuration
 * @returns Animation instance or definition
 */
export const fadeOut: PresetFunction = (target: any, config: PresetConfig = {}) => {
    return new Animation({
        target,
        properties: {
            opacity: [0, 1]
        },
        options: createDefaultOptions(config),
    });
}

/**
 * Slide in animation
 * @param target - Element to animate
 * @param config - Animation configuration
 * @returns Animation instance or definition
 */
export const slideIn: PresetFunction = (target: any, config: PresetConfig = {}) => {
    const direction = config.direction || 'left';
    const distance = config.distance || '100px';

    const transforms: Record<string, [string, string]> = {
        left: [`translateX(-${distance})`, 'translateX(0)'],
        right: [`translateX(${distance})`, 'translateX(0)'],
        up: [`translateY(-${distance})`, 'translateY(0)'],
        down: [`translateY(${distance})`, 'translateY(0)']
    };

    return new Animation({
        target,
        properties: mergeProperties(
            {
                transform: transforms[direction],
                opacity: [0, 1]
            },
            config.extraProperties
        ),
        options: createDefaultOptions(config),
    });
}

/**
 * Slide out animation
 * @param target - Element to animate
 * @param config - Animation configuration
 * @returns Animation instance or definition
 */
export const slideOut: PresetFunction = (target: any, config: PresetConfig = {}) => {
    const direction = config.direction || 'left';
    const distance = config.distance || '100px';
    const transforms: Record<string, [string, string]> = {
        left: ['translateX(0)', `translateX(-${distance})`],
        right: ['translateX(0)', `translateX(${distance})`],
        up: ['translateY(0)', `translateY(-${distance})`],
        down: ['translateY(0)', `translateY(${distance})`]
    };
    return new Animation({
        target,
        properties: mergeProperties(
            {
                transform: transforms[direction],
                opacity: [1, 0]
            },
            config.extraProperties
        ),
        options: createDefaultOptions(config),
    });
}

/**
 * zoom in animation
 * @param target - Element to animate
 * @param config - Animation configuration: scale, duration, easing, autoplay, distance,
 * @returns Animation instance
 */
export const zoomIn: PresetFunction = (target: any, config: PresetConfig = {}) => {
    const scale = config.scale || 0.5;
    return new Animation({
        target,
        properties: mergeProperties(
            {
                transform: [`scale(${scale})`, 'scale(1)'],
                opacity: [0, 1]
            },
            config.extraProperties
        ),
        options: createDefaultOptions(config),
    })
}

/**
 * zoom out animation
 * @param target - Element to animate
 * @param config - Animation configuration: scale, duration, easing, autoplay, distance,
 * @returns Animation instance
 */
export const zoomOut: PresetFunction = (target: any, config: PresetConfig = {}) => {
    const scale = config.scale || 0.5;
    return new Animation({
        target,
        properties: mergeProperties(
            {
                transform: ['scale(1)', `scale(${scale})`],
                opacity: [1, 0]
            },
            config.extraProperties
        ),
        options: createDefaultOptions(config),
    })
}

/**
 * flip in animation
 * @param target - Element to animate
 * @param config - Animation configuration: direction, duration, easing, autoplay,
 * @returns Animation instance
 */
export const flipIn: PresetFunction = (target: any, config: PresetConfig = {}) => {
    const direction = config.direction || 'x';
    const axis = direction === 'x' ? 'Y' : 'X';
    return new Animation({
        target,
        properties: mergeProperties(
            {
                transform: [`perspective(400px) rotate${axis}(90deg)`, `perspective(400px) rotate${axis}(0deg)`],
                opacity: [0, 1]
            },
            config.extraProperties,
        ),
        options: createDefaultOptions(config),
    })
}

/**
 * flip out animation
 * @param target - Element to animate
 * @param config - Animation configuration: direction, duration, easing, autoplay,
 * @returns Animation instance
 */
export const flipOut: PresetFunction = (target: any, config: PresetConfig = {}) => {
    const direction = config.direction || 'x';
    const axis = direction === 'x' ? 'Y' : 'X';
    return new Animation({
        target,
        properties: mergeProperties(
            {
                transform: [`perspective(400px) rotate${axis}(0deg)`, `perspective(400px) rotate${axis}(90deg)`],
                opacity: [1, 0]
            },   config.extraProperties,
        ),
        options: createDefaultOptions(config),
    })
}

/**
 * Shake animation
 * @param target - Element to animate
 * @param config - Animation configuration: intensity, duration, easing, autoplay, distance
 * @returns Timeline
 */
export const shake: PresetFunction = (target: any, config: PresetConfig = {}) => {
    const intensity = config.intensity || 1;
    const distance = config.distance || '10px';
    const shakeDistance = `${parseInt(distance) * intensity}px`;
    const shakeTimeline = new Timeline({ autoplay: config.autoplay });
    shakeTimeline.add({
        target,
        properties: {
            transform: ['translateX(0)', `translateX(-${shakeDistance})`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 500) / 6,
        }
    });
    shakeTimeline.add({
        target,
        properties: {
            transform: [`translateX(-${shakeDistance})`, `translateX(${shakeDistance})`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 500) / 6,
        }
    }, '+=0');

    shakeTimeline.add({
        target,
        properties: {
            transform: [`translateX(${shakeDistance})`, `translateX(-${shakeDistance})`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 500) / 6,
        }
    }, '+=0');

    shakeTimeline.add({
        target,
        properties: {
            transform: [`translateX(-${shakeDistance})`, `translateX(${shakeDistance})`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 500) / 6,
        }
    }, '+=0');

    shakeTimeline.add({
        target,
        properties: {
            transform: [`translateX(${shakeDistance})`, `translateX(-${shakeDistance})`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 500) / 6,
        }
    }, '+=0');

    shakeTimeline.add({
        target,
        properties: {
            transform: [`translateX(-${shakeDistance})`, 'translateX(0)']
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 500) / 6,
        }
    }, '+=0');
    return shakeTimeline;
}

/**
 * Pulse animation
 * @param target - Element to animate
 * @param config - Animation configuration: intensity, duration, easing, autoplay
 * @returns Timeline
 */
export const pulse: PresetFunction = (target: any, config: PresetConfig = {}) => {
    const intensity = config.intensity || 1;
    const scale = 1 + (0.1 * intensity);
    const pulseTimeline = new Timeline({ autoplay: config.autoplay });
    pulseTimeline.add({
        target,
        properties: {
            transform: ['scale(1)', `scale(${scale})`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 500) / 2,
        }
    });

    pulseTimeline.add({
        target,
        properties: {
            transform: [`scale(${scale})`, 'scale(1)']
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 500) / 2,
        }
    }, '+=0');
    return pulseTimeline;
}

/**
 * Bounce animation
 * @param target - Element to animate
 * @param config - Animation configuration: intensity, duration, easing, autoplay, distance
 * @returns Timeline
 */
export const bounce: PresetFunction = (target: any, config: PresetConfig = {}) => {
    const intensity = config.intensity || 1;
    const distance = config.distance || '30px';
    const bounceHeight = `${parseInt(distance) * intensity}px`;
    const bounceTimeline = new Timeline({ autoplay: config.autoplay });
    bounceTimeline.add({
        target,
        properties: {
            transform: ['translateY(0)', `translateY(${bounceHeight})`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 800) * 0.25,
        }
    });
    bounceTimeline.add({
        target,
        properties: {
            transform: [`translateY(${bounceHeight})`, 'translateY(0)']
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 800) * 0.25,
        }
    });
    // Bounce up
    bounceTimeline.add({
        target,
        properties: {
            transform: [`translateY(${bounceHeight})`, 'translateY(0)']
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 800) * 0.25,
        }
    }, '+=0');

    // Small bounce down
    bounceTimeline.add({
        target,
        properties: {
            transform: ['translateY(0)', `translateY(${bounceHeight}/2)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 800) * 0.15,
        }
    }, '+=0');

    // Small bounce up
    bounceTimeline.add({
        target,
        properties: {
            transform: [`translateY(${bounceHeight}/2)`, 'translateY(0)']
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 800) * 0.15,
        }
    }, '+=0');

    // Tiny bounce down
    bounceTimeline.add({
        target,
        properties: {
            transform: ['translateY(0)', `translateY(${bounceHeight}/4)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 800) * 0.1,
        }
    }, '+=0');

    // Tiny bounce up
    bounceTimeline.add({
        target,
        properties: {
            transform: [`translateY(${bounceHeight}/4)`, 'translateY(0)']
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 800) * 0.1,
        }
    }, '+=0');

    return bounceTimeline;
}

/**
 * Swing animation
 * @param target - Element to animate
 * @param config - Animation configuration: intensity, duration, easing, autoplay
 * @returns Timeline
 */
export const swing: PresetFunction = (target: any, config: PresetConfig = {}) => {
    const intensity = config.intensity || 1;
    const rotation = (config.rotation || 15) * intensity;
    const swingTimeline = new Timeline({ autoplay: config.autoplay });
    swingTimeline.add({
        target,
        properties: {
            transform: ['rotate(0deg)', `rotate(${rotation}deg)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 800) * 0.2,
        }
    });

    swingTimeline.add({
        target,
        properties: {
            transform: [`rotate(${rotation}deg)`, `rotate(-${rotation * 0.8}deg)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 800) * 0.2,
        }
    }, '+=0');

    swingTimeline.add({
        target,
        properties: {
            transform: [`rotate(-${rotation * 0.8}deg)`, `rotate(${rotation * 0.6}deg)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 800) * 0.2,
        }
    }, '+=0');

    swingTimeline.add({
        target,
        properties: {
            transform: [`rotate(${rotation * 0.6}deg)`, `rotate(-${rotation * 0.4}deg)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 800) * 0.2,
        }
    }, '+=0');

    swingTimeline.add({
        target,
        properties: {
            transform: [`rotate(-${rotation * 0.4}deg)`, 'rotate(0deg)']
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 800) * 0.2,
        }
    }, '+=0');

    return swingTimeline;
}

/**
 * Tada animation (attention seeker)
 * @param target - Element to animate
 * @param config - Animation configuration: intensity, duration, easing, autoplay
 * @returns Timeline
 */
export const tada: PresetFunction = (target: any, config: PresetConfig = {}) => {
    const intensity = config.intensity || 1;
    const scale1 = 1 - (0.1 * intensity);
    const scale2 = 1 + (0.1 * intensity);
    const rotation = (3 * intensity);
    const tadaTimeline = new Timeline({ autoplay: config.autoplay });
    tadaTimeline.add({
        target,
        properties: {
            transform: ['scale(1) rotate(0deg)', `scale(${scale1}) rotate(0deg)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 800) * 0.1,
        }
    });

    // Scale up with rotation
    tadaTimeline.add({
        target,
        properties: {
            transform: [`scale(${scale1}) rotate(0deg)`, `scale(${scale2}) rotate(${rotation}deg)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 800) * 0.1,
        }
    }, '+=0');

    // Rotation sequence
    for (let i = 0; i < 5; i++) {
        const fromRotation = i % 2 === 0 ? rotation : -rotation;
        const toRotation = i % 2 === 0 ? -rotation : rotation;

        tadaTimeline.add({
            target,
            properties: {
                transform: [`scale(${scale2}) rotate(${fromRotation}deg)`, `scale(${scale2}) rotate(${toRotation}deg)`]
            },
            options: {
                ...createDefaultOptions(config),
                duration: (config.duration || 800) * 0.1,
            }
        }, '+=0');
    }

    // Return to normal
    tadaTimeline.add({
        target,
        properties: {
            transform: [`scale(${scale2}) rotate(${rotation}deg)`, 'scale(1) rotate(0deg)']
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 800) * 0.1,
        }
    }, '+=0');

    return tadaTimeline;
}

/**
 * Jello animation (wiggle effect)
 * @param target - Element to animate
 * @param config - Animation configuration: intensity, duration, easing, autoplay
 * @returns Timeline
 */
export const jello: PresetFunction = (target: any, config: PresetConfig = {}) => {
    const intensity = config.intensity || 1;
    const jelloTimeline = new Timeline({ autoplay: config.autoplay });
    const skews = [
        [12.5, 12.5],
        [-6.25, -6.25],
        [3.125, 3.125],
        [-1.5625, -1.5625],
        [0.78125, 0.78125],
        [-0.390625, -0.390625]
    ];
    jelloTimeline.add({
        target,
        properties: {
            transform: ['skewX(0deg) skewY(0deg)', `skewX(-12.5deg * ${intensity}) skewY(-12.5deg * ${intensity})`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.15,
        }
    });

    skews.forEach((skew, index) => {
        const [skewX, skewY] = skew.map(s => s * intensity);

        jelloTimeline.add({
            target,
            properties: {
                transform: [
                    `skewX(${-skewX}deg) skewY(${-skewY}deg)`,
                    `skewX(${skewX}deg) skewY(${skewY}deg)`
                ]
            },
            options: {
                ...createDefaultOptions(config),
                duration: (config.duration || 1000) * 0.1,
            }
        }, '+=0');
    });
    jelloTimeline.add({
        target,
        properties: {
            transform: [`skewX(${skews[skews.length - 1][0] * intensity}deg) skewY(${skews[skews.length - 1][1] * intensity}deg)`, 'skewX(0deg) skewY(0deg)']
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.05,
        }
    }, '+=0');

    return jelloTimeline;
}

/**
 * Heartbeat animation
 * @param target - Element to animate
 * @param config - Animation configuration
 * @returns Timeline
 */
export const heartbeat: PresetFunction = (target: any, config: PresetConfig = {}) => {
    const intensity = config.intensity || 1;
    const scale1 = 1 + (0.14 * intensity);
    const scale2 = 1 + (0.30 * intensity);
    const heartbeatTimeline = new Timeline({ autoplay: config.autoplay });

    heartbeatTimeline.add({
        target,
        properties: {
            transform: ['scale(1)', `scale(${scale1})`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1500) * 0.14,
        }
    });

    heartbeatTimeline.add({
        target,
        properties: {
            transform: [`scale(${scale1})`, 'scale(1)']
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1500) * 0.14,
        }
    }, '+=0');

    // Slight pause
    heartbeatTimeline.add({
        target,
        properties: {
            transform: ['scale(1)', 'scale(1)']
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1500) * 0.14,
        }
    }, '+=0');

    // Second stronger beat
    heartbeatTimeline.add({
        target,
        properties: {
            transform: ['scale(1)', `scale(${scale2})`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1500) * 0.14,
        }
    }, '+=0');

    heartbeatTimeline.add({
        target,
        properties: {
            transform: [`scale(${scale2})`, 'scale(1)']
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1500) * 0.14,
        }
    }, '+=0');

    // Rest period
    heartbeatTimeline.add({
        target,
        properties: {
            transform: ['scale(1)', 'scale(1)']
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1500) * 0.3,
        }
    }, '+=0');

    return heartbeatTimeline;
}

/**
 * Hinge animation (fall and rotate out)
 * @param target - Element to animate
 * @param config - Animation configuration: duration, autoplay
 * @returns Animation instance or definition
 */
export const hinge: PresetFunction = (target: any, config: PresetConfig = {}) => {
    const duration = config.duration || 2000;
    const hingeTimeline = new Timeline({ autoplay: config.autoplay });

    if (target instanceof HTMLElement) {
        target.style.transformOrigin = 'top left';
    }

    hingeTimeline.add({
        target,
        properties: {
            transform: ['rotate(0deg)', 'rotate(80deg)'],
            opacity: [1, 1]
        },
        options: {
            ...createDefaultOptions(config),
            duration: duration * 0.2,
        }
    });

    hingeTimeline.add({
        target,
        properties: {
            transform: ['rotate(80deg)', 'rotate(60deg)']
        },
        options: {
            ...createDefaultOptions(config),
            duration: duration * 0.2,
        }
    }, '+=0');

    hingeTimeline.add({
        target,
        properties: {
            transform: ['rotate(60deg)', 'rotate(80deg)']
        },
        options: {
            ...createDefaultOptions(config),
            duration: duration * 0.2,
        }
    }, '+=0');

    hingeTimeline.add({
        target,
        properties: {
            transform: ['rotate(80deg)', 'translateY(700px) rotate(80deg)'],
            opacity: [1, 0]
        },
        options: {
            ...createDefaultOptions(config),
            duration: duration * 0.4,
        }
    }, '+=0');
    return hingeTimeline;
}

/**
 * Roll in animation
 * @param target - Element to animate
 * @param config - Animation configuration: duration, easing, extraProperties
 * @returns Animation instance or definition
 */
export const rollIn: PresetFunction = (target: any, config: PresetConfig = {}) => {
    return new Animation({
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
    });
}

/**
 * Roll in animation
 * @param target - Element to animate
 * @param config - Animation configuration: duration, easing, extraProperties
 * @returns Animation instance or definition
 */
export const rollOut: PresetFunction = (target: any, config: PresetConfig = {}) => {
    return new Animation({
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
    });
}

/**
 * Flash animation
 * @param target - Element to animate
 * @param config - Animation configuration: duration, easing, extraProperties
 * @returns Animation instance or definition
 */
export const flash: PresetFunction = (target: any, config: PresetConfig = {}) => {
    const flashTimeline = new Timeline({ autoplay: config.autoplay });
    flashTimeline.add({
        target,
        properties: { opacity: [1, 0] },
        options: {
            duration: (config.duration || 1000) * 0.25,
            easing: EASINGS.easeOutQuad
        }
    });

    flashTimeline.add({
        target,
        properties: { opacity: [0, 1] },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.25,
        }
    }, '+=0');

    flashTimeline.add({
        target,
        properties: { opacity: [1, 0] },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.25,
        }
    }, '+=0');

    flashTimeline.add({
        target,
        properties: { opacity: [0, 1] },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.25,
        }
    }, '+=0');

    return flashTimeline;
}

/**
 * Rubber band animation
 * @param target - Element to animate
 * @param config - Animation configuration: duration, easing, intensity, autoplay
 * @returns Animation instance or definition
 */
export const rubberBand: PresetFunction = (target: any, config: PresetConfig = {}) => {
    const intensity = config.intensity || 1;
    const rubberBandTimeline = new Timeline({ autoplay: config.autoplay });

    rubberBandTimeline.add({
        target,
        properties: {
            transform: ['scale3d(1, 1, 1)', `scale3d(${1.25 * intensity}, ${0.75 * intensity}, 1)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.15,
        }
    });

    rubberBandTimeline.add({
        target,
        properties: {
            transform: [`scale3d(${1.25 * intensity}, ${0.75 * intensity}, 1)`, `scale3d(${0.75 * intensity}, ${1.25 * intensity}, 1)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.15,
        }
    }, '+=0');

    rubberBandTimeline.add({
        target,
        properties: {
            transform: [`scale3d(${0.75 * intensity}, ${1.25 * intensity}, 1)`, `scale3d(${1.15 * intensity}, ${0.85 * intensity}, 1)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.15,
        }
    }, '+=0');

    rubberBandTimeline.add({
        target,
        properties: {
            transform: [`scale3d(${1.15 * intensity}, ${0.85 * intensity}, 1)`, `scale3d(${0.95 * intensity}, ${1.05 * intensity}, 1)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.15,
        }
    }, '+=0');

    rubberBandTimeline.add({
        target,
        properties: {
            transform: [`scale3d(${0.95 * intensity}, ${1.05 * intensity}, 1)`, 'scale3d(1, 1, 1)']
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.15,
        }
    }, '+=0');

    return rubberBandTimeline;
}

export const wobble: PresetFunction = (target: any, config: PresetConfig = {}) => {
    const wobbleTimeline = new Timeline({ autoplay: config.autoplay });
    const intensity = config.intensity || 1;
    wobbleTimeline.add({
        target,
        properties: {
            transform: ['translate3d(0, 0, 0) rotate(0)', `translate3d(${-25 * intensity}%, 0, 0) rotate(${-5 * intensity}deg)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.15,
        }
    });

    wobbleTimeline.add({
        target,
        properties: {
            transform: [`translate3d(${-25 * intensity}%, 0, 0) rotate(${-5 * intensity}deg)`, `translate3d(${20 * intensity}%, 0, 0) rotate(${3 * intensity}deg)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.15,
        }
    }, '+=0');

    wobbleTimeline.add({
        target,
        properties: {
            transform: [`translate3d(${20 * intensity}%, 0, 0) rotate(${3 * intensity}deg)`, `translate3d(${-15 * intensity}%, 0, 0) rotate(${-3 * intensity}deg)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.15,
        }
    }, '+=0');

    wobbleTimeline.add({
        target,
        properties: {
            transform: [`translate3d(${-15 * intensity}%, 0, 0) rotate(${-3 * intensity}deg)`, `translate3d(${10 * intensity}%, 0, 0) rotate(${2 * intensity}deg)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.15,
        }
    }, '+=0');

    wobbleTimeline.add({
        target,
        properties: {
            transform: [`translate3d(${10 * intensity}%, 0, 0) rotate(${2 * intensity}deg)`, `translate3d(${-5 * intensity}%, 0, 0) rotate(${-1 * intensity}deg)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.15,
        }
    }, '+=0');

    wobbleTimeline.add({
        target,
        properties: {
            transform: [`translate3d(${-5 * intensity}%, 0, 0) rotate(${-1 * intensity}deg)`, 'translate3d(0, 0, 0) rotate(0)']
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.15,
        }
    }, '+=0');

    return wobbleTimeline;
}

/**
 * Light speed in animation
 * @param target - Element to animate
 * @param config - Animation configuration
 * @returns Animation instance or definition
 */
export const lightSpeedIn: PresetFunction = (target: any, config: PresetConfig = {}) => {
    return new Animation({
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
    });
}

/**
 * Light speed out animation
 * @param target - Element to animate
 * @param config - Animation configuration
 * @returns Animation instance or definition
 */
export const lightSpeedOut: PresetFunction = (target: any, config: PresetConfig = {}) => {
    return new Animation({
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
    });
}

/**
 * Animation presets library
 */
export const presets: Presets = {
    fadeIn,
    fadeOut,
    slideIn,
    slideOut,
    zoomIn,
    zoomOut,
    flipIn,
    flipOut,
    shake,
    pulse,
    bounce,
    swing,
    jello,
    heartbeat,
    hinge,
    rollIn,
    rollOut,
    flash,
    rubberBand,
    wobble,
    lightSpeedIn,
    lightSpeedOut,
};

/**
 * Helper for creating animation presets
 * @param name - Preset name
 * @param target - Target element
 * @param config - Animation configuration
 * @returns Animation or Timeline instance
 */
export function createPresetAnimation(
    name: string,
    target: any,
    config: PresetConfig = {}
): Animation | Timeline | AnimationDefinition {
    if (!(name in PRESETS)) {
        throw new Error(`Animation preset "${name}" not found`);
    }
    return presets[name](target, config);
}


export default presets;