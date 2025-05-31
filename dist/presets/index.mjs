import { Animation, Timeline } from '../core';

const BASE_EASING = {
    /**
     * Quadratic ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInQuad
     */
    easeInQuad: (t) => t * t,
    /**
     * Quadratic ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutQuad
     */
    easeOutQuad: (t) => t * (2 - t),
    /**
     * Quintic ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutQuint
     */
    easeOutQuint: (t) => 1 + (--t) * t * t * t * t};

/**
 * All available animation presets
 */
const PRESETS = {
    /** Fade in animation */
    fadeIn: 'fadeIn',
    /** Fade out animation */
    fadeOut: 'fadeOut',
    /** Slide in animation */
    slideIn: 'slideIn',
    /** Slide out animation */
    slideOut: 'slideOut',
    /** Zoom in animation */
    zoomIn: 'zoomIn',
    /** Zoom out animation */
    zoomOut: 'zoomOut',
    /** Flip animation */
    flipIn: 'flipIn',
    /** Flip animation */
    flipOut: 'flipOut',
    /** Shake animation */
    shake: 'shake',
    /** Pulse animation */
    pulse: 'pulse',
    /** Bounce animation */
    bounce: 'bounce',
    /** Swing animation */
    swing: 'swing',
    /** Tada animation */
    tada: 'tada',
    /** Jello animation */
    jello: 'jello',
    /** Heartbeat animation */
    heartbeat: 'heartbeat',
    /** Hinge animation */
    hinge: 'hinge',
    /** Roll in animation */
    rollIn: 'rollIn',
    /** Roll out animation */
    rollOut: 'rollOut',
    /** Flash animation */
    flash: 'flash',
    /** Rubber band animation */
    rubberBand: 'rubberBand',
    /** Wobble animation */
    wobble: 'wobble',
    /** Light speed in animation */
    lightSpeedIn: 'lightSpeedIn',
    /** Light speed out animation */
    lightSpeedOut: 'lightSpeedOut'
};

// src/presets/presets.ts
/**
 * Creates default animation options
 */
function createDefaultOptions(config) {
    return {
        duration: config.duration || 500,
        easing: config.easing || BASE_EASING.easeOutQuint,
        delay: config.delay || 0,
        autoplay: config.autoplay || false,
    };
}
/**
 * Merges additional properties with the base properties
 */
function mergeProperties(baseProperties, extraProperties) {
    if (!extraProperties)
        return baseProperties;
    return { ...baseProperties, ...extraProperties };
}
/**
 * Fade in animation
 * @param target - Element to animate
 * @param config - Animation configuration
 * @returns Animation instance or definition
 */
const fadeIn = (target, config = {}) => {
    return new Animation({
        target,
        properties: {
            opacity: [0, 1]
        },
        options: createDefaultOptions(config),
    });
};
/**
 * Fade out animation
 * @param target - Element to animate
 * @param config - Animation configuration
 * @returns Animation instance or definition
 */
const fadeOut = (target, config = {}) => {
    return new Animation({
        target,
        properties: {
            opacity: [0, 1]
        },
        options: createDefaultOptions(config),
    });
};
/**
 * Slide in animation
 * @param target - Element to animate
 * @param config - Animation configuration
 * @returns Animation instance or definition
 */
const slideIn = (target, config = {}) => {
    const direction = config.direction || 'left';
    const distance = config.distance || '100px';
    const transforms = {
        left: [`translateX(-${distance})`, 'translateX(0)'],
        right: [`translateX(${distance})`, 'translateX(0)'],
        up: [`translateY(-${distance})`, 'translateY(0)'],
        down: [`translateY(${distance})`, 'translateY(0)']
    };
    return new Animation({
        target,
        properties: mergeProperties({
            transform: transforms[direction],
            opacity: [0, 1]
        }, config.extraProperties),
        options: createDefaultOptions(config),
    });
};
/**
 * Slide out animation
 * @param target - Element to animate
 * @param config - Animation configuration
 * @returns Animation instance or definition
 */
const slideOut = (target, config = {}) => {
    const direction = config.direction || 'left';
    const distance = config.distance || '100px';
    const transforms = {
        left: ['translateX(0)', `translateX(-${distance})`],
        right: ['translateX(0)', `translateX(${distance})`],
        up: ['translateY(0)', `translateY(-${distance})`],
        down: ['translateY(0)', `translateY(${distance})`]
    };
    return new Animation({
        target,
        properties: mergeProperties({
            transform: transforms[direction],
            opacity: [1, 0]
        }, config.extraProperties),
        options: createDefaultOptions(config),
    });
};
/**
 * zoom in animation
 * @param target - Element to animate
 * @param config - Animation configuration: scale, duration, easing, autoplay, distance,
 * @returns Animation instance
 */
const zoomIn = (target, config = {}) => {
    const scale = config.scale || 0.5;
    return new Animation({
        target,
        properties: mergeProperties({
            transform: [`scale(${scale})`, 'scale(1)'],
            opacity: [0, 1]
        }, config.extraProperties),
        options: createDefaultOptions(config),
    });
};
/**
 * zoom out animation
 * @param target - Element to animate
 * @param config - Animation configuration: scale, duration, easing, autoplay, distance,
 * @returns Animation instance
 */
const zoomOut = (target, config = {}) => {
    const scale = config.scale || 0.5;
    return new Animation({
        target,
        properties: mergeProperties({
            transform: ['scale(1)', `scale(${scale})`],
            opacity: [1, 0]
        }, config.extraProperties),
        options: createDefaultOptions(config),
    });
};
/**
 * flip in animation
 * @param target - Element to animate
 * @param config - Animation configuration: direction, duration, easing, autoplay,
 * @returns Animation instance
 */
const flipIn = (target, config = {}) => {
    const direction = config.direction || 'x';
    const axis = direction === 'x' ? 'Y' : 'X';
    return new Animation({
        target,
        properties: mergeProperties({
            transform: [`perspective(400px) rotate${axis}(90deg)`, `perspective(400px) rotate${axis}(0deg)`],
            opacity: [0, 1]
        }, config.extraProperties),
        options: createDefaultOptions(config),
    });
};
/**
 * flip out animation
 * @param target - Element to animate
 * @param config - Animation configuration: direction, duration, easing, autoplay,
 * @returns Animation instance
 */
const flipOut = (target, config = {}) => {
    const direction = config.direction || 'x';
    const axis = direction === 'x' ? 'Y' : 'X';
    return new Animation({
        target,
        properties: mergeProperties({
            transform: [`perspective(400px) rotate${axis}(0deg)`, `perspective(400px) rotate${axis}(90deg)`],
            opacity: [1, 0]
        }, config.extraProperties),
        options: createDefaultOptions(config),
    });
};
/**
 * Shake animation
 * @param target - Element to animate
 * @param config - Animation configuration: intensity, duration, easing, autoplay, distance
 * @returns Timeline
 */
const shake = (target, config = {}) => {
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
};
/**
 * Pulse animation
 * @param target - Element to animate
 * @param config - Animation configuration: intensity, duration, easing, autoplay
 * @returns Timeline
 */
const pulse = (target, config = {}) => {
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
};
/**
 * Bounce animation
 * @param target - Element to animate
 * @param config - Animation configuration: intensity, duration, easing, autoplay, distance
 * @returns Timeline
 */
const bounce = (target, config = {}) => {
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
};
/**
 * Swing animation
 * @param target - Element to animate
 * @param config - Animation configuration: intensity, duration, easing, autoplay
 * @returns Timeline
 */
const swing = (target, config = {}) => {
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
};
/**
 * Tada animation (attention seeker)
 * @param target - Element to animate
 * @param config - Animation configuration: intensity, duration, easing, autoplay
 * @returns Timeline
 */
const tada = (target, config = {}) => {
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
};
/**
 * Jello animation (wiggle effect)
 * @param target - Element to animate
 * @param config - Animation configuration: intensity, duration, easing, autoplay
 * @returns Timeline
 */
const jello = (target, config = {}) => {
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
};
/**
 * Heartbeat animation
 * @param target - Element to animate
 * @param config - Animation configuration
 * @returns Timeline
 */
const heartbeat = (target, config = {}) => {
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
};
/**
 * Hinge animation (fall and rotate out)
 * @param target - Element to animate
 * @param config - Animation configuration: duration, autoplay
 * @returns Animation instance or definition
 */
const hinge = (target, config = {}) => {
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
};
/**
 * Roll in animation
 * @param target - Element to animate
 * @param config - Animation configuration: duration, easing, extraProperties
 * @returns Animation instance or definition
 */
const rollIn = (target, config = {}) => {
    return new Animation({
        target,
        properties: mergeProperties({
            transform: ['translateX(-100%) rotate(-120deg)', 'translateX(0) rotate(0)'],
            opacity: [0, 1]
        }, config.extraProperties),
        options: createDefaultOptions({
            ...config,
            duration: config.duration || 800,
            easing: config.easing || BASE_EASING.easeOutQuad
        })
    });
};
/**
 * Roll in animation
 * @param target - Element to animate
 * @param config - Animation configuration: duration, easing, extraProperties
 * @returns Animation instance or definition
 */
const rollOut = (target, config = {}) => {
    return new Animation({
        target,
        properties: mergeProperties({
            transform: ['translateX(0) rotate(0)', 'translateX(100%) rotate(120deg)'],
            opacity: [1, 0]
        }, config.extraProperties),
        options: createDefaultOptions({
            ...config,
            duration: config.duration || 800,
            easing: config.easing || BASE_EASING.easeInQuad
        })
    });
};
/**
 * Flash animation
 * @param target - Element to animate
 * @param config - Animation configuration: duration, easing, extraProperties
 * @returns Animation instance or definition
 */
const flash = (target, config = {}) => {
    const flashTimeline = new Timeline({ autoplay: config.autoplay });
    flashTimeline.add({
        target,
        properties: { opacity: [1, 0] },
        options: {
            duration: (config.duration || 1000) * 0.25,
            easing: BASE_EASING.easeOutQuad
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
};
/**
 * Rubber band animation
 * @param target - Element to animate
 * @param config - Animation configuration: duration, easing, intensity, autoplay
 * @returns Animation instance or definition
 */
const rubberBand = (target, config = {}) => {
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
};
const wobble = (target, config = {}) => {
    const wobbleTimeline = new Timeline({ autoplay: config.autoplay });
    const intensity = config.intensity || 1;
    wobbleTimeline.add({
        target,
        properties: {
            transform: ['translate3d(0, 0, 0) rotate(0)', `translate3d(${ -25 * intensity}%, 0, 0) rotate(${ -5 * intensity}deg)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.15,
        }
    });
    wobbleTimeline.add({
        target,
        properties: {
            transform: [`translate3d(${ -25 * intensity}%, 0, 0) rotate(${ -5 * intensity}deg)`, `translate3d(${20 * intensity}%, 0, 0) rotate(${3 * intensity}deg)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.15,
        }
    }, '+=0');
    wobbleTimeline.add({
        target,
        properties: {
            transform: [`translate3d(${20 * intensity}%, 0, 0) rotate(${3 * intensity}deg)`, `translate3d(${ -15 * intensity}%, 0, 0) rotate(${ -3 * intensity}deg)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.15,
        }
    }, '+=0');
    wobbleTimeline.add({
        target,
        properties: {
            transform: [`translate3d(${ -15 * intensity}%, 0, 0) rotate(${ -3 * intensity}deg)`, `translate3d(${10 * intensity}%, 0, 0) rotate(${2 * intensity}deg)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.15,
        }
    }, '+=0');
    wobbleTimeline.add({
        target,
        properties: {
            transform: [`translate3d(${10 * intensity}%, 0, 0) rotate(${2 * intensity}deg)`, `translate3d(${ -5 * intensity}%, 0, 0) rotate(${ -1 * intensity}deg)`]
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.15,
        }
    }, '+=0');
    wobbleTimeline.add({
        target,
        properties: {
            transform: [`translate3d(${ -5 * intensity}%, 0, 0) rotate(${ -1 * intensity}deg)`, 'translate3d(0, 0, 0) rotate(0)']
        },
        options: {
            ...createDefaultOptions(config),
            duration: (config.duration || 1000) * 0.15,
        }
    }, '+=0');
    return wobbleTimeline;
};
/**
 * Light speed in animation
 * @param target - Element to animate
 * @param config - Animation configuration
 * @returns Animation instance or definition
 */
const lightSpeedIn = (target, config = {}) => {
    return new Animation({
        target,
        properties: mergeProperties({
            transform: ['translateX(100%) skewX(-30deg)', 'translateX(0) skewX(0)'],
            opacity: [0, 1]
        }, config.extraProperties),
        options: createDefaultOptions({
            ...config,
            duration: config.duration || 1000,
            easing: config.easing || BASE_EASING.easeOutQuad
        })
    });
};
/**
 * Light speed out animation
 * @param target - Element to animate
 * @param config - Animation configuration
 * @returns Animation instance or definition
 */
const lightSpeedOut = (target, config = {}) => {
    return new Animation({
        target,
        properties: mergeProperties({
            transform: ['translateX(0) skewX(0)', 'translateX(100%) skewX(30deg)'],
            opacity: [1, 0]
        }, config.extraProperties),
        options: createDefaultOptions({
            ...config,
            duration: config.duration || 1000,
            easing: config.easing || BASE_EASING.easeInQuad
        })
    });
};
/**
 * Animation presets library
 */
const presets = {
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
function createPresetAnimation(name, target, config = {}) {
    if (!(name in PRESETS)) {
        throw new Error(`Animation preset "${name}" not found`);
    }
    return presets[name](target, config);
}

export { bounce, createPresetAnimation, presets as default, fadeIn, fadeOut, flash, flipIn, flipOut, heartbeat, hinge, jello, lightSpeedIn, lightSpeedOut, presets, pulse, rollIn, rollOut, rubberBand, shake, slideIn, slideOut, swing, tada, wobble, zoomIn, zoomOut };
//# sourceMappingURL=index.mjs.map
