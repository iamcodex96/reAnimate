import { interval, animationFrameScheduler, BehaviorSubject } from 'rxjs';

function isFunction(value) {
    return typeof value === 'function';
}

function hasLift(source) {
    return isFunction(source === null || source === void 0 ? void 0 : source.lift);
}
function operate(init) {
    return function (source) {
        if (hasLift(source)) {
            return source.lift(function (liftedSource) {
                try {
                    return init(liftedSource, this);
                }
                catch (err) {
                    this.error(err);
                }
            });
        }
        throw new TypeError('Unable to lift unknown Observable type');
    };
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function createErrorClass(createImpl) {
    var _super = function (instance) {
        Error.call(instance);
        instance.stack = new Error().stack;
    };
    var ctorFunc = createImpl(_super);
    ctorFunc.prototype = Object.create(Error.prototype);
    ctorFunc.prototype.constructor = ctorFunc;
    return ctorFunc;
}

var UnsubscriptionError = createErrorClass(function (_super) {
    return function UnsubscriptionErrorImpl(errors) {
        _super(this);
        this.message = errors
            ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ')
            : '';
        this.name = 'UnsubscriptionError';
        this.errors = errors;
    };
});

function arrRemove(arr, item) {
    if (arr) {
        var index = arr.indexOf(item);
        0 <= index && arr.splice(index, 1);
    }
}

var Subscription = (function () {
    function Subscription(initialTeardown) {
        this.initialTeardown = initialTeardown;
        this.closed = false;
        this._parentage = null;
        this._finalizers = null;
    }
    Subscription.prototype.unsubscribe = function () {
        var e_1, _a, e_2, _b;
        var errors;
        if (!this.closed) {
            this.closed = true;
            var _parentage = this._parentage;
            if (_parentage) {
                this._parentage = null;
                if (Array.isArray(_parentage)) {
                    try {
                        for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                            var parent_1 = _parentage_1_1.value;
                            parent_1.remove(this);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                else {
                    _parentage.remove(this);
                }
            }
            var initialFinalizer = this.initialTeardown;
            if (isFunction(initialFinalizer)) {
                try {
                    initialFinalizer();
                }
                catch (e) {
                    errors = e instanceof UnsubscriptionError ? e.errors : [e];
                }
            }
            var _finalizers = this._finalizers;
            if (_finalizers) {
                this._finalizers = null;
                try {
                    for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
                        var finalizer = _finalizers_1_1.value;
                        try {
                            execFinalizer(finalizer);
                        }
                        catch (err) {
                            errors = errors !== null && errors !== void 0 ? errors : [];
                            if (err instanceof UnsubscriptionError) {
                                errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
                            }
                            else {
                                errors.push(err);
                            }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            if (errors) {
                throw new UnsubscriptionError(errors);
            }
        }
    };
    Subscription.prototype.add = function (teardown) {
        var _a;
        if (teardown && teardown !== this) {
            if (this.closed) {
                execFinalizer(teardown);
            }
            else {
                if (teardown instanceof Subscription) {
                    if (teardown.closed || teardown._hasParent(this)) {
                        return;
                    }
                    teardown._addParent(this);
                }
                (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
            }
        }
    };
    Subscription.prototype._hasParent = function (parent) {
        var _parentage = this._parentage;
        return _parentage === parent || (Array.isArray(_parentage) && _parentage.includes(parent));
    };
    Subscription.prototype._addParent = function (parent) {
        var _parentage = this._parentage;
        this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
    };
    Subscription.prototype._removeParent = function (parent) {
        var _parentage = this._parentage;
        if (_parentage === parent) {
            this._parentage = null;
        }
        else if (Array.isArray(_parentage)) {
            arrRemove(_parentage, parent);
        }
    };
    Subscription.prototype.remove = function (teardown) {
        var _finalizers = this._finalizers;
        _finalizers && arrRemove(_finalizers, teardown);
        if (teardown instanceof Subscription) {
            teardown._removeParent(this);
        }
    };
    Subscription.EMPTY = (function () {
        var empty = new Subscription();
        empty.closed = true;
        return empty;
    })();
    return Subscription;
}());
Subscription.EMPTY;
function isSubscription(value) {
    return (value instanceof Subscription ||
        (value && 'closed' in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe)));
}
function execFinalizer(finalizer) {
    if (isFunction(finalizer)) {
        finalizer();
    }
    else {
        finalizer.unsubscribe();
    }
}

var timeoutProvider = {
    setTimeout: function (handler, timeout) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
    },
    clearTimeout: function (handle) {
        return (clearTimeout)(handle);
    },
    delegate: undefined,
};

function reportUnhandledError(err) {
    timeoutProvider.setTimeout(function () {
        {
            throw err;
        }
    });
}

function noop() { }

var Subscriber = (function (_super) {
    __extends(Subscriber, _super);
    function Subscriber(destination) {
        var _this = _super.call(this) || this;
        _this.isStopped = false;
        if (destination) {
            _this.destination = destination;
            if (isSubscription(destination)) {
                destination.add(_this);
            }
        }
        else {
            _this.destination = EMPTY_OBSERVER;
        }
        return _this;
    }
    Subscriber.create = function (next, error, complete) {
        return new SafeSubscriber(next, error, complete);
    };
    Subscriber.prototype.next = function (value) {
        if (this.isStopped) ;
        else {
            this._next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (this.isStopped) ;
        else {
            this.isStopped = true;
            this._error(err);
        }
    };
    Subscriber.prototype.complete = function () {
        if (this.isStopped) ;
        else {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (!this.closed) {
            this.isStopped = true;
            _super.prototype.unsubscribe.call(this);
            this.destination = null;
        }
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        try {
            this.destination.error(err);
        }
        finally {
            this.unsubscribe();
        }
    };
    Subscriber.prototype._complete = function () {
        try {
            this.destination.complete();
        }
        finally {
            this.unsubscribe();
        }
    };
    return Subscriber;
}(Subscription));
var ConsumerObserver = (function () {
    function ConsumerObserver(partialObserver) {
        this.partialObserver = partialObserver;
    }
    ConsumerObserver.prototype.next = function (value) {
        var partialObserver = this.partialObserver;
        if (partialObserver.next) {
            try {
                partialObserver.next(value);
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
    };
    ConsumerObserver.prototype.error = function (err) {
        var partialObserver = this.partialObserver;
        if (partialObserver.error) {
            try {
                partialObserver.error(err);
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
        else {
            handleUnhandledError(err);
        }
    };
    ConsumerObserver.prototype.complete = function () {
        var partialObserver = this.partialObserver;
        if (partialObserver.complete) {
            try {
                partialObserver.complete();
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
    };
    return ConsumerObserver;
}());
var SafeSubscriber = (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        var partialObserver;
        if (isFunction(observerOrNext) || !observerOrNext) {
            partialObserver = {
                next: (observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : undefined),
                error: error !== null && error !== void 0 ? error : undefined,
                complete: complete !== null && complete !== void 0 ? complete : undefined,
            };
        }
        else {
            {
                partialObserver = observerOrNext;
            }
        }
        _this.destination = new ConsumerObserver(partialObserver);
        return _this;
    }
    return SafeSubscriber;
}(Subscriber));
function handleUnhandledError(error) {
    {
        reportUnhandledError(error);
    }
}
function defaultErrorHandler(err) {
    throw err;
}
var EMPTY_OBSERVER = {
    closed: true,
    next: noop,
    error: defaultErrorHandler,
    complete: noop,
};

function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
    return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}
var OperatorSubscriber = (function (_super) {
    __extends(OperatorSubscriber, _super);
    function OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
        var _this = _super.call(this, destination) || this;
        _this.onFinalize = onFinalize;
        _this.shouldUnsubscribe = shouldUnsubscribe;
        _this._next = onNext
            ? function (value) {
                try {
                    onNext(value);
                }
                catch (err) {
                    destination.error(err);
                }
            }
            : _super.prototype._next;
        _this._error = onError
            ? function (err) {
                try {
                    onError(err);
                }
                catch (err) {
                    destination.error(err);
                }
                finally {
                    this.unsubscribe();
                }
            }
            : _super.prototype._error;
        _this._complete = onComplete
            ? function () {
                try {
                    onComplete();
                }
                catch (err) {
                    destination.error(err);
                }
                finally {
                    this.unsubscribe();
                }
            }
            : _super.prototype._complete;
        return _this;
    }
    OperatorSubscriber.prototype.unsubscribe = function () {
        var _a;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            var closed_1 = this.closed;
            _super.prototype.unsubscribe.call(this);
            !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
        }
    };
    return OperatorSubscriber;
}(Subscriber));

function map(project, thisArg) {
    return operate(function (source, subscriber) {
        var index = 0;
        source.subscribe(createOperatorSubscriber(subscriber, function (value) {
            subscriber.next(project.call(thisArg, value, index++));
        }));
    });
}

function takeWhile(predicate, inclusive) {
    return operate(function (source, subscriber) {
        var index = 0;
        source.subscribe(createOperatorSubscriber(subscriber, function (value) {
            var result = predicate(value, index++);
            (result || inclusive) && subscriber.next(value);
            !result && subscriber.complete();
        }));
    });
}

/**
 * Create an animation frame observable that emits progress values
 * @param duration - Animation duration in milliseconds
 * @param startTime - Animation start time
 * @param easing - Optional easing function
 * @returns Observable that emits progress values from 0 to 1
 */
function createAnimationObservable(duration, startTime, easing = t => t) {
    return interval(0, animationFrameScheduler).pipe(map(() => performance.now()), map(now => (now - startTime) / duration), map(progress => Math.min(Math.max(progress, 0), 1)), map(progress => easing(progress)), takeWhile(progress => progress < 1, true));
}
/**
 * Create animation state and progress subjects
 * @returns Object containing state and progress subjects and observables
 */
function createAnimationState() {
    const progress$ = new BehaviorSubject(0);
    const state$ = new BehaviorSubject('idle');
    return {
        progress$,
        state$,
        progress: progress$.asObservable(),
        state: state$.asObservable()
    };
}

/**
 * Linear interpolation between two values
 */
function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}
/**
 * Calculate the stagger point based on from position
 * @param index - Element index
 * @param total - Total number of elements
 * @param from - Position to start from
 * @returns Stagger point (0 to total-1)
 */
function calculateStaggerPoint(index, total, from) {
    if (from === 'first') {
        return index;
    }
    else if (from === 'last') {
        return total - index - 1;
    }
    else if (from === 'center') {
        return Math.abs((total - 1) / 2 - index);
    }
    else if (typeof from === 'number') {
        if (from >= 0 && from < total) {
            return Math.abs(from - index);
        }
        // Handle out of bounds
        const normalizedFrom = Math.max(0, Math.min(total - 1, from));
        return Math.abs(normalizedFrom - index);
    }
    return index; // Default to 'first'
}
/**
 * Apply direction to stagger point
 * @param point - Original stagger point
 * @param total - Total number of elements
 * @param direction - Direction to apply
 * @returns Modified stagger point
 */
function applyDirection(point, total, direction) {
    if (direction === 'reverse') {
        return total - point - 1;
    }
    else if (direction === 'alternate') {
        // Alternate directions for even/odd elements
        return point % 2 === 0 ? point : total - point - 1;
    }
    return point; // 'normal'
}
/**
 * Calculate grid position based stagger point
 * @param index - Element index
 * @param total - Total number of elements
 * @param options - Grid options
 * @returns Stagger point
 */
function calculateGridStaggerPoint(index, total, options) {
    const grid = options.grid;
    if (!grid || !grid.cols || grid.cols <= 0) {
        return calculateStaggerPoint(index, total, options.from || 'first');
    }
    const cols = grid.cols;
    const rows = Math.ceil(total / cols);
    const rowIndex = Math.floor(index / cols);
    const colIndex = index % cols;
    // Calculate base coordinates based on fromX and fromY
    const xPoint = calculateStaggerPoint(colIndex, cols, grid.fromX || options.from || 'first');
    const yPoint = calculateStaggerPoint(rowIndex, rows, grid.fromY || options.from || 'first');
    // Calculate final point based on grid direction
    if (grid.direction === 'column') {
        // Column-first traversal
        return yPoint * cols + xPoint;
    }
    else if (grid.direction === 'diagonal') {
        // Diagonal traversal - calculate distance from origin
        return xPoint + yPoint;
    }
    else {
        // Default: row-first traversal
        return yPoint * cols + xPoint;
    }
}
/**
 * Create a stagger delay function
 * @param value - Stagger delay value or range
 * @param options - Stagger options
 * @returns Function that calculates the delay for each element
 */
function stagger(value, options = {}) {
    const { start = 0, from = 'first', direction = 'normal', easing = (t) => t } = options;
    /**
     * Calculate stagger delay for a specific element
     * @param index - Element index
     * @param total - Total number of elements
     * @param element - Target element (optional)
     * @returns Calculated delay in milliseconds
     */
    return (index, total, element) => {
        // Handle edge cases
        if (total <= 1)
            return start;
        // Calculate stagger point (normalized position in the sequence)
        let staggerPoint;
        if (options.grid) {
            staggerPoint = calculateGridStaggerPoint(index, total, options);
        }
        else {
            staggerPoint = calculateStaggerPoint(index, total, from);
            staggerPoint = applyDirection(staggerPoint, total, direction);
        }
        // Calculate progress (0 to 1)
        const progress = total > 1 ? staggerPoint / (total - 1) : 0;
        // Apply easing to the distribution
        const easedProgress = easing(progress);
        // Calculate the actual delay
        let delay;
        if (Array.isArray(value)) {
            const [min, max] = value;
            delay = start + lerp(min, max, easedProgress);
        }
        else {
            delay = start + (value * easedProgress);
        }
        return delay;
    };
}
/**
 * Create a timeline from staggered animations
 * @param targets - Elements to animate
 * @param animationFactory - Function that creates animation for each element
 * @param staggerDelay - Stagger delay function
 * @returns Array of animations with staggered delays
 */
function createStaggeredAnimations(targets, animationFactory, staggerDelay) {
    return targets.map((target, index, array) => {
        const animation = animationFactory(target, index, array.length);
        // Apply stagger delay to the animation
        const delay = staggerDelay(index, array.length, target);
        // Update animation options with the stagger delay
        if (typeof animation === 'object' && animation.options) {
            animation.options.delay = (animation.options.delay || 0) + delay;
        }
        return animation;
    });
}

/**
 * Parse a timeline offset specification
 * @param offset - Offset specification (number or string like "+=100")
 * @param currentTime - Current timeline time (for relative offsets)
 * @returns Calculated offset in milliseconds
 */
function parseTimelineOffset(offset, currentTime) {
    if (typeof offset === 'number') {
        return offset;
    }
    // Handle relative positioning (+=100, -=100, etc)
    if (offset.startsWith('+=')) {
        return currentTime + parseFloat(offset.substring(2));
    }
    else if (offset.startsWith('-=')) {
        return Math.max(0, currentTime - parseFloat(offset.substring(2)));
    }
    // Default: treat as absolute time
    return parseFloat(offset) || 0;
}
/**
 * Get the end time of an animation based on its options
 * @param duration - Base duration
 * @param delay - Start delay
 * @param endDelay - End delay
 * @returns Total animation time
 */
function getAnimationEndTime(duration, delay = 0, endDelay = 0) {
    return duration + delay + endDelay;
}

/**
 *
 * @param element Target HTMLElement
 * @param property Target CSSProperty
 * @param value Target value or state
 */
const styleBinder = (element, property) => {
    return (value) => {
        element.style[property] =
            typeof value === 'number' ? `${value}px` : value;
    };
};

/**
 * Parse property animation value into a normalized format
 * @param value - The property animation value in any supported format
 * @param currentValue - Current value of the property (for implicit from values)
 * @returns Normalized property animation object
 */
function parsePropertyAnimation(value, currentValue = undefined) {
    // Case 1: [from, to] array format
    if (Array.isArray(value) && value.length === 2) {
        return { from: value[0], to: value[1] };
    }
    // Case 2: Single value format (implicit from)
    if (typeof value !== 'object' || value === null) {
        return { from: currentValue, to: value };
    }
    // Case 3: Object format with from/to properties
    if ('from' in value && 'to' in value) {
        const result = {
            from: value.from,
            to: value.to
        };
        if ('steps' in value && Array.isArray(value.steps)) {
            result.steps = value.steps;
        }
        return result;
    }
    // Case 4: Object format with value and custom timing
    if ('value' in value) {
        const result = {
            from: currentValue,
            to: value.value
        };
        if ('duration' in value && typeof value.duration === 'number') {
            result.duration = value.duration;
        }
        if ('delay' in value && typeof value.delay === 'number') {
            result.delay = value.delay;
        }
        return result;
    }
    // Default: treat as to-value
    return { from: currentValue, to: value };
}
/**
 * Parse CSS units from string values
 * @param value - String value potentially containing units
 * @returns Object with numeric value and unit
 */
function parseCssValue(value) {
    const match = String(value).match(/^([-+]?[\d.]+)([a-z%]*)$/i);
    if (match) {
        return {
            value: parseFloat(match[1]),
            unit: match[2] || ''
        };
    }
    return {
        value: 0,
        unit: ''
    };
}
/**
 * Detect if a value is a valid color
 * @param value - Value to check
 * @returns Boolean indicating if the value is a color
 */
function isColor(value) {
    if (typeof value !== 'string')
        return false;
    // Check for hex, rgb, rgba, hsl, hsla
    return (/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value) ||
        /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)$/.test(value) ||
        /^hsla?\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*(?:,\s*[\d.]+\s*)?\)$/.test(value));
}
/**
 * Detect if a value is a transform function
 * @param value - Value to check
 * @returns Boolean indicating if the value is a transform
 */
function isTransform(value) {
    if (typeof value !== 'string')
        return false;
    // Check for common transform functions
    return (/^(translate|rotate|scale|skew|matrix|perspective)/.test(value) ||
        value === 'none');
}
/**
 * Get the current computed value of a property on an element
 * @param target - Target element
 * @param property - CSS property name
 * @returns Current value of the property
 */
function getCurrentValue(target, property) {
    // For DOM elements
    if (target instanceof HTMLElement || target instanceof SVGElement) {
        // Get computed style for CSS properties
        if (property in target.style || isCustomCssProperty(property)) {
            const computedStyle = getComputedStyle(target);
            return computedStyle[property] || null;
        }
        // For transform properties, extract from the transform matrix
        if (isTransformProperty(property)) {
            return getComputedTransformValue();
        }
        // For attributes
        if (target.hasAttribute && target.hasAttribute(property)) {
            return target.getAttribute(property);
        }
    }
    // For regular objects
    if (property in target) {
        return target[property];
    }
    // Default: return undefined (will be replaced with sensible defaults later)
    return undefined;
}
/**
 * Check if a property is a CSS custom property
 */
function isCustomCssProperty(property) {
    return property.startsWith('--');
}
/**
 * Check if a property is a transform property
 */
function isTransformProperty(property) {
    const transformProps = [
        'translateX', 'translateY', 'translateZ', 'translate',
        'rotateX', 'rotateY', 'rotateZ', 'rotate',
        'scaleX', 'scaleY', 'scaleZ', 'scale',
        'skewX', 'skewY', 'skew'
    ];
    return transformProps.includes(property);
}
/**
 * Get computed transform value for an element
 * Simplified implementation - in a real library this would be more comprehensive
 */
function getComputedTransformValue(element, property) {
    // In a full implementation, this would extract specific transform values
    // from the computed transform matrix
    return '0';
}
/**
 * Get sensible default value for a property if current value is unknown
 */
function getDefaultValue(property) {
    // Common defaults for various properties
    const defaults = {
        opacity: 1,
        rotate: '0deg',
        scale: 1,
        translateX: '0px',
        translateY: '0px',
        translateZ: '0px',
        x: 0,
        y: 0,
        z: 0
    };
    return property in defaults ? defaults[property] : 0;
}

export { createAnimationObservable, createAnimationState, createStaggeredAnimations, getAnimationEndTime, getCurrentValue, getDefaultValue, isColor, isTransform, parseCssValue, parsePropertyAnimation, parseTimelineOffset, stagger, styleBinder };
//# sourceMappingURL=index.mjs.map
