Object.defineProperty(exports, "__esModule", { value: true });
exports.animate = exports.Presets = exports.EasingType = exports.easingUtils = exports.createEasings = exports.easings = exports.Timeline = exports.Animation = void 0;
const tslib_1 = require("tslib");
var animation_1 = require("./core/animation");
Object.defineProperty(exports, "Animation", { enumerable: true, get: function () { return animation_1.Animation; } });
var timeline_1 = require("./core/timeline");
Object.defineProperty(exports, "Timeline", { enumerable: true, get: function () { return timeline_1.Timeline; } });
var easings_1 = require("./easings/easings");
Object.defineProperty(exports, "easings", { enumerable: true, get: function () { return tslib_1.__importDefault(easings_1).default; } });
Object.defineProperty(exports, "createEasings", { enumerable: true, get: function () { return easings_1.createEasings; } });
Object.defineProperty(exports, "easingUtils", { enumerable: true, get: function () { return easings_1.easingUtils; } });
var easings_interface_1 = require("./easings/easings.interface");
Object.defineProperty(exports, "EasingType", { enumerable: true, get: function () { return easings_interface_1.EasingType; } });
const easings_2 = tslib_1.__importDefault(require("./easings/easings"));
const animation_2 = require("./core/animation");
const timeline_2 = require("./core/timeline");
/**
 * Common animation presets
 */
exports.Presets = {
    /**
     * Fade in animation
     * @param target - Element to animate
     * @param duration - Animation duration in milliseconds
     * @returns Animation definition
     */
    fadeIn: (target, duration = 500) => ({
        target,
        properties: {
            opacity: [0, 1]
        },
        options: {
            duration,
            easing: (0, easings_2.default)().easeInOutQuad
        }
    }),
    /**
     * Fade out animation
     * @param target - Element to animate
     * @param duration - Animation duration in milliseconds
     * @returns Animation definition
     */
    fadeOut: (target, duration = 500) => ({
        target,
        properties: {
            opacity: [1, 0]
        },
        options: {
            duration,
            easing: (0, easings_2.default)().easeInOutQuad
        }
    }),
    /**
     * Slide in animation
     * @param target - Element to animate
     * @param direction - Direction to slide from
     * @param distance - Distance to slide
     * @param duration - Animation duration in milliseconds
     * @returns Animation definition
     */
    slideIn: (target, direction = 'left', distance = '100px', duration = 500) => {
        const transforms = {
            left: [`translateX(-${distance})`, 'translateX(0)'],
            right: [`translateX(${distance})`, 'translateX(0)'],
            up: [`translateY(-${distance})`, 'translateY(0)'],
            down: [`translateY(${distance})`, 'translateY(0)']
        };
        return {
            target,
            properties: {
                transform: transforms[direction],
                opacity: [0, 1]
            },
            options: {
                duration,
                easing: (0, easings_2.default)().easeOutQuint
            }
        };
    }
};
// Create a more convenient API
exports.animate = {
    /**
     * Create and play an animation
     * @param target - Element to animate
     * @param properties - Properties to animate
     * @param options - Animation options
     * @returns Animation instance
     */
    create: (target, properties, options) => {
        const animation = new animation_2.Animation({
            target,
            properties,
            options
        });
        return animation;
    },
    /**
     * Create and play a timeline
     * @returns Timeline instance
     */
    timeline: () => {
        return new timeline_2.Timeline();
    },
    /**
     * Apply a preset animation
     * @param name - Preset name
     * @param target - Target element
     * @param options - Additional options
     * @returns Animation instance
     */
    preset: (name, target, options = {}) => {
        const preset = exports.Presets[name];
        if (!preset) {
            throw new Error(`Animation preset "${name}" not found`);
        }
        const definition = preset(target, options.duration);
        const animation = new animation_2.Animation(definition);
        if (options.autoplay !== false) {
            animation.play();
        }
        return animation;
    }
};
//# sourceMappingURL=index.mjs.map
