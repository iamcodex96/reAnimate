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

function identity(x) {
    return x;
}

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

function finalize(callback) {
    return operate(function (source, subscriber) {
        try {
            source.subscribe(subscriber);
        }
        finally {
            subscriber.add(callback);
        }
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

function tap(observerOrNext, error, complete) {
    var tapObserver = isFunction(observerOrNext) || error || complete
        ?
            { next: observerOrNext, error: error, complete: complete }
        : observerOrNext;
    return tapObserver
        ? operate(function (source, subscriber) {
            var _a;
            (_a = tapObserver.subscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
            var isUnsub = true;
            source.subscribe(createOperatorSubscriber(subscriber, function (value) {
                var _a;
                (_a = tapObserver.next) === null || _a === void 0 ? void 0 : _a.call(tapObserver, value);
                subscriber.next(value);
            }, function () {
                var _a;
                isUnsub = false;
                (_a = tapObserver.complete) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
                subscriber.complete();
            }, function (err) {
                var _a;
                isUnsub = false;
                (_a = tapObserver.error) === null || _a === void 0 ? void 0 : _a.call(tapObserver, err);
                subscriber.error(err);
            }, function () {
                var _a, _b;
                if (isUnsub) {
                    (_a = tapObserver.unsubscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
                }
                (_b = tapObserver.finalize) === null || _b === void 0 ? void 0 : _b.call(tapObserver);
            }));
        })
        :
            identity;
}

/**
 * Interpolate between two values based on progress
 * @param from - Starting value
 * @param to - Ending value
 * @param progress - Current progress (0 to 1)
 * @returns Interpolated value
 */
// Add this to the interpolation.ts file
function interpolateTransform(from, to, progress) {
    // Extract transform function names and values
    const fromMatches = from.match(/(\w+)\(([^)]+)\)/g) || [];
    const toMatches = to.match(/(\w+)\(([^)]+)\)/g) || [];
    // If both are the same transform function
    if (fromMatches.length === 1 && toMatches.length === 1) {
        const fromFn = fromMatches[0].match(/(\w+)\(([^)]+)\)/);
        const toFn = toMatches[0].match(/(\w+)\(([^)]+)\)/);
        if (fromFn && toFn && fromFn[1] === toFn[1]) {
            const fnName = fromFn[1];
            const fromValue = fromFn[2];
            const toValue = toFn[2];
            // Extract values and units
            const fromValueMatch = fromValue.match(/^([-+]?[\d.]+)([a-z%]*)$/i);
            const toValueMatch = toValue.match(/^([-+]?[\d.]+)([a-z%]*)$/i);
            if (fromValueMatch && toValueMatch && fromValueMatch[2] === toValueMatch[2]) {
                const fromNum = parseFloat(fromValueMatch[1]);
                const toNum = parseFloat(toValueMatch[1]);
                const unit = fromValueMatch[2];
                const interpolatedValue = fromNum + (toNum - fromNum) * progress;
                return `${fnName}(${interpolatedValue}${unit})`;
            }
        }
    }
    // If transforms don't match, fall back to discrete animation
    return progress < 0.5 ? from : to;
}
// Then modify the interpolate function to include transform handling
function interpolate(from, to, progress) {
    // Handle numeric values
    if (typeof from === 'number' && typeof to === 'number') {
        return from + (to - from) * progress;
    }
    // Handle string values with units (px, %, etc.)
    if (typeof from === 'string' && typeof to === 'string') {
        const fromMatch = from.match(/^([-+]?[\d.]+)([a-z%]*)$/i);
        const toMatch = to.match(/^([-+]?[\d.]+)([a-z%]*)$/i);
        if (fromMatch && toMatch && fromMatch[2] === toMatch[2]) {
            const fromValue = parseFloat(fromMatch[1]);
            const toValue = parseFloat(toMatch[1]);
            const unit = fromMatch[2];
            return (fromValue + (toValue - fromValue) * progress) + unit;
        }
    }
    // Handle colors (hex, rgb, rgba)
    if (typeof from === 'string' && typeof to === 'string') {
        const isColor = (val) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(val) ||
            /^rgba?\((\d+,\s*){2,3}\d+\)$/.test(val);
        if (isColor(from) && isColor(to)) {
            return interpolateColors(from, to, progress);
        }
    }
    // Handle CSS transforms
    if (typeof from === 'string' && typeof to === 'string') {
        if (from.includes('translate') || from.includes('rotate') || from.includes('scale')) {
            return interpolateTransform(from, to, progress);
        }
    }
    // Default: use discrete values (no interpolation)
    return progress < 0.5 ? from : to;
}
/**
 * Interpolate between two colors
 * Supports hex (#fff, #ffffff) and rgb/rgba formats
 */
function interpolateColors(from, to, progress) {
    // Convert colors to rgba
    const fromRgba = colorToRgba(from);
    const toRgba = colorToRgba(to);
    // Interpolate each component
    const r = Math.round(fromRgba[0] + (toRgba[0] - fromRgba[0]) * progress);
    const g = Math.round(fromRgba[1] + (toRgba[1] - fromRgba[1]) * progress);
    const b = Math.round(fromRgba[2] + (toRgba[2] - fromRgba[2]) * progress);
    const a = fromRgba[3] + (toRgba[3] - fromRgba[3]) * progress;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}
/**
 * Convert color string to rgba array [r, g, b, a]
 */
function colorToRgba(color) {
    // Handle hex colors
    if (color.startsWith('#')) {
        let hex = color.substring(1);
        // Convert shorthand hex (#fff) to full form (#ffffff)
        if (hex.length === 3) {
            hex = hex.split('').map(h => h + h).join('');
        }
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return [r, g, b, 1];
    }
    // Handle rgb/rgba colors
    if (color.startsWith('rgb')) {
        const values = color.match(/\d+(\.\d+)?/g) || [];
        // Check if values exist before parsing
        const r = values[0] !== undefined ? parseInt(values[0], 10) : 0;
        const g = values[1] !== undefined ? parseInt(values[1], 10) : 0;
        const b = values[2] !== undefined ? parseInt(values[2], 10) : 0;
        const a = values.length > 3 ? parseFloat(values[3]) : 1;
        return [r, g, b, a];
    }
    // Default: return black
    return [0, 0, 0, 1];
}
/**
 * Update target properties based on current values
 * @param target - Target element or object
 * @param properties - Map of property names to values
 */
function updateTargetProperties(target, properties) {
    Object.entries(properties).forEach(([prop, value]) => {
        // Handle DOM elements
        if (target instanceof HTMLElement) {
            if (prop === 'transform') {
                target.style.transform = value;
            }
            else if (prop in target.style) {
                target.style[prop] = value;
            }
            else {
                target[prop] = value;
            }
        }
        else {
            // Handle regular objects
            target[prop] = value;
        }
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

class Animation {
    /**
     * Create a new animation
     * @param definition - Animation definition
     */
    constructor(definition) {
        this.definition = definition;
        this.animationState = createAnimationState();
        this.animationSubscription = null;
        this.startTime = 0;
        this.pausedTime = 0;
        if (this.definition.options.autoplay) {
            setTimeout(() => this.play(), 0);
        }
    }
    /**
     * Play the animation
     * @returns This animation for chaining
     */
    play() {
        if (this.animationState.state$.value === 'running')
            return this;
        if (this.animationState.state$.value === 'paused') {
            this.startTime = performance.now() - this.pausedTime;
        }
        else {
            this.startTime = performance.now() + (this.definition.options.delay || 0);
        }
        this.animationState.state$.next('running');
        // Unsubscribe from previous animation if any
        this.cleanup();
        // Create and subscribe to animation observable
        const { duration, easing = t => t } = this.definition.options;
        this.animationSubscription = createAnimationObservable(duration, this.startTime, easing).pipe(tap(progress => {
            this.animationState.progress$.next(progress);
            this.updateProperties(progress);
        }), finalize(() => {
            if (this.animationState.state$.value === 'running') {
                this.animationState.state$.next('completed');
            }
        })).subscribe({
            error: this.handleError.bind(this)
        });
        return this;
    }
    /**
     * Pause the animation
     * @returns This animation for chaining
     */
    pause() {
        if (this.animationState.state$.value !== 'running')
            return this;
        this.pausedTime = performance.now() - this.startTime;
        this.animationState.state$.next('paused');
        this.cleanup();
        return this;
    }
    /**
     * Stop and reset the animation
     * @returns This animation for chaining
     */
    stop() {
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
    seek(progress) {
        const boundedProgress = Math.min(Math.max(progress, 0), 1);
        this.animationState.progress$.next(boundedProgress);
        this.updateProperties(boundedProgress);
        return this;
    }
    /**
     * Get the progress observable
     * @returns Observable that emits progress values (0 to 1)
     */
    progress() {
        return this.animationState.progress;
    }
    /**
     * Get the animationState observable
     * @returns Observable that emits animation animationState
     */
    state() {
        return this.animationState.state;
    }
    /**
     * Get the total duration of this animation (including delays)
     */
    get duration() {
        const { duration, delay = 0, endDelay = 0 } = this.definition.options;
        return duration + delay + endDelay;
    }
    /**
     * Clean up any active subscriptions
     */
    cleanup() {
        if (this.animationSubscription) {
            this.animationSubscription.unsubscribe();
            this.animationSubscription = null;
        }
    }
    /**
     * Handle animation errors
     */
    handleError(error) {
        console.error('Animation error:', error);
        this.animationState.state$.next('idle');
        this.cleanup();
    }
    /**
     * Update properties based on current progress
     */
    updateProperties(progress) {
        const { target, properties } = this.definition;
        // Calculate interpolated values for all properties
        const interpolatedValues = {};
        Object.entries(properties).forEach(([prop, propAnimation]) => {
            // Get current value if needed for implicit "from" values
            const currentValue = getCurrentValue(target, prop) || getDefaultValue(prop);
            // Parse the property animation into a normalized format
            const normalized = parsePropertyAnimation(propAnimation, currentValue);
            // Apply property-specific duration/delay if defined
            const propertyProgress = progress;
            // Handle multi-step animations if defined
            if (normalized.steps && normalized.steps.length > 0) {
                interpolatedValues[prop] = this.interpolateSteps([normalized.from, ...normalized.steps, normalized.to], propertyProgress);
            }
            else {
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
    interpolateSteps(steps, progress) {
        if (steps.length < 2)
            return steps[0];
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
    static stagger(targets, properties, options, staggerValue, staggerOptions = {}) {
        // Create a stagger delay function
        const staggerFn = stagger(staggerValue, staggerOptions);
        // Create staggered animations
        return createStaggeredAnimations(targets, (target, index, total) => new Animation({
            target,
            properties,
            options: { ...options }
        }), staggerFn);
    }
    /**
     * Convert the animation to a Promise that resolves when the animation completes
     * @returns Promise that resolves when the animation completes or rejects on error
     */
    toPromise() {
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
    then(onFulfilled, onRejected) {
        return this.toPromise().then(onFulfilled, onRejected);
    }
    /**
     * Add catch method for Promise-like error handling
     */
    catch(onRejected) {
        return this.toPromise().catch(onRejected);
    }
    /**
     * Add finally method for Promise-like cleanup
     */
    finally(onFinally) {
        return this.toPromise().finally(onFinally);
    }
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

class Timeline {
    /**
     * Create a new timeline
     * @param options - Optional timeline configuration
     */
    constructor(options = {}) {
        var _a;
        this.animations = [];
        this.animationState = createAnimationState();
        this.timelineSubscription = null;
        this.startTime = 0;
        this.pausedTime = 0;
        this._duration = 0;
        this._autoplay = (_a = options.autoplay) !== null && _a !== void 0 ? _a : false;
        // If autoplay is enabled, start the timeline after construction
        if (this._autoplay) {
            // Use setTimeout to ensure constructor finishes before play() is called
            setTimeout(() => this.play(), 0);
        }
    }
    /**
     * Add an animation to the timeline
     * @param animation - Animation or animation definition to add
     * @param timeOffset - When to start the animation
     * @returns This timeline for chaining
     */
    add(animation, timeOffset = '+=0') {
        // Convert AnimationDefinition to Animation if needed
        const anim = animation instanceof Animation ?
            animation : new Animation(animation);
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
    play() {
        if (this.animationState.state$.value === 'running')
            return this;
        if (this.animationState.state$.value === 'paused') {
            this.startTime = performance.now() - this.pausedTime;
        }
        else {
            this.startTime = performance.now();
        }
        this.animationState.state$.next('running');
        // Cleanup previous subscription if any
        this.cleanup();
        // Create and subscribe to timeline observable
        this.timelineSubscription = createAnimationObservable(this._duration, this.startTime).pipe(tap(progress => {
            this.animationState.progress$.next(progress);
            this.updateAnimations(progress);
        }), finalize(() => {
            if (this.animationState.state$.value === 'running') {
                this.animationState.state$.next('completed');
            }
        })).subscribe({
            error: this.handleError.bind(this)
        });
        return this;
    }
    /**
     * Pause the timeline
     * @returns This timeline for chaining
     */
    pause() {
        if (this.animationState.state$.value !== 'running')
            return this;
        this.pausedTime = performance.now() - this.startTime;
        this.animationState.state$.next('paused');
        this.cleanup();
        return this;
    }
    /**
     * Stop and reset the timeline
     * @returns This timeline for chaining
     */
    stop() {
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
    seek(progress) {
        const boundedProgress = Math.min(Math.max(progress, 0), 1);
        this.animationState.progress$.next(boundedProgress);
        this.updateAnimations(boundedProgress);
        return this;
    }
    /**
     * Restart the timeline from the beginning
     * @returns This timeline for chaining
     */
    restart() {
        this.seek(0);
        return this.play();
    }
    /**
     * Get the progress observable
     * @returns Observable that emits progress values (0 to 1)
     */
    progress() {
        return this.animationState.progress;
    }
    /**
     * Get the animationState observable
     * @returns Observable that emits timeline animationState
     */
    state() {
        return this.animationState.state;
    }
    /**
     * Get the timeline duration
     */
    get duration() {
        return this._duration;
    }
    /**
     * Clean up any active subscriptions
     */
    cleanup() {
        if (this.timelineSubscription) {
            this.timelineSubscription.unsubscribe();
            this.timelineSubscription = null;
        }
    }
    /**
     * Handle timeline errors
     */
    handleError(error) {
        console.error('Timeline error:', error);
        this.animationState.state$.next('idle');
        this.cleanup();
    }
    /**
     * Update animations based on timeline progress
     */
    updateAnimations(progress) {
        const currentTime = progress * this._duration;
        this.animations.forEach(({ animation, timeOffset }) => {
            // Calculate local animation progress
            const animationDuration = animation.duration;
            const animationStart = timeOffset;
            const animationEnd = animationStart + animationDuration;
            if (currentTime < animationStart) {
                // Animation hasn't started yet
                animation.seek(0);
            }
            else if (currentTime > animationEnd) {
                // Animation is complete
                animation.seek(1);
            }
            else {
                // Animation is in progress
                const localProgress = (currentTime - animationStart) / animationDuration;
                animation.seek(localProgress);
            }
        });
    }
    /**
     * Convert the timeline to a Promise that resolves when the timeline completes
     * @returns Promise that resolves when the timeline completes or rejects on error
     */
    toPromise() {
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
            // If the timeline is not running, start it
            if (this.animationState.state$.value !== 'running') {
                this.play();
            }
        });
    }
    /**
     * Make the Timeline class "thenable" to support Promise-like usage
     */
    then(onFulfilled, onRejected) {
        return this.toPromise().then(onFulfilled, onRejected);
    }
    /**
     * Add catch method for Promise-like error handling
     */
    catch(onRejected) {
        return this.toPromise().catch(onRejected);
    }
    /**
     * Add finally method for Promise-like cleanup
     */
    finally(onFinally) {
        return this.toPromise().finally(onFinally);
    }
}

var Animation_types = /*#__PURE__*/Object.freeze({
    __proto__: null
});

var PropertyAnimation_types = /*#__PURE__*/Object.freeze({
    __proto__: null
});

var Presets_types = /*#__PURE__*/Object.freeze({
    __proto__: null
});

var Stagger_types = /*#__PURE__*/Object.freeze({
    __proto__: null
});

const BASE_EASING = {
    /**
     * Linear easing
     * @param t - Progress from 0 to 1
     * @returns Linear interpolation (no easing)
     * @see https://easings.net/#linear
     */
    linear: (t) => t,
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
     * Quadratic ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutQuad
     */
    easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    /**
     * Cubic ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInCubic
     */
    easeInCubic: (t) => t * t * t,
    /**
     * Cubic ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutCubic
     */
    easeOutCubic: (t) => (--t) * t * t + 1,
    /**
     * Cubic ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutCubic
     */
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    /**
     * Quartic ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInQuart
     */
    easeInQuart: (t) => t * t * t * t,
    /**
     * Quartic ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutQuart
     */
    easeOutQuart: (t) => 1 - (--t) * t * t * t,
    /**
     * Quartic ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutQuart
     */
    easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    /**
     * Quintic ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInQuint
     */
    easeInQuint: (t) => t * t * t * t * t,
    /**
     * Quintic ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutQuint
     */
    easeOutQuint: (t) => 1 + (--t) * t * t * t * t,
    /**
     * Quintic ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutQuint
     */
    easeInOutQuint: (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
    /**
     * Sinusoidal ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInSine
     */
    easeInSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
    /**
     * Sinusoidal ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutSine
     */
    easeOutSine: (t) => Math.sin((t * Math.PI) / 2),
    /**
     * Sinusoidal ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutSine
     */
    easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    /**
     * Exponential ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInExpo
     */
    easeInExpo: (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
    /**
     * Exponential ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutExpo
     */
    easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    /**
     * Exponential ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutExpo
     */
    easeInOutExpo: (t) => {
        if (t === 0)
            return 0;
        if (t === 1)
            return 1;
        if (t < 0.5)
            return Math.pow(2, 20 * t - 10) / 2;
        return (2 - Math.pow(2, -20 * t + 10)) / 2;
    },
    /**
     * Circular ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity
     * @see https://easings.net/#easeInCirc
     */
    easeInCirc: (t) => 1 - Math.sqrt(1 - t * t),
    /**
     * Circular ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity
     * @see https://easings.net/#easeOutCirc
     */
    easeOutCirc: (t) => Math.sqrt(1 - (--t) * t),
    /**
     * Circular ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration
     * @see https://easings.net/#easeInOutCirc
     */
    easeInOutCirc: (t) => t < 0.5
        ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
        : (Math.sqrt(1 - 4 * (t - 1) * (t - 1)) + 1) / 2,
    /**
     * Back ease-in - Overshooting cubic easing
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity with overshoot
     * @see https://easings.net/#easeInBack
     */
    easeInBack: (t) => {
        const s = 1.70158;
        return t * t * ((s + 1) * t - s);
    },
    /**
     * Back ease-out - Overshooting cubic easing
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity with overshoot
     * @see https://easings.net/#easeOutBack
     */
    easeOutBack: (t) => {
        const s = 1.70158;
        return --t * t * ((s + 1) * t + s) + 1;
    },
    /**
     * Back ease-in-out - Overshooting cubic easing
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration with overshoot in both directions
     * @see https://easings.net/#easeInOutBack
     */
    easeInOutBack: (t) => {
        const s = 1.70158 * 1.525;
        if (t < 0.5) {
            return t * t * ((s + 1) * 2 * t - s) / 2;
        }
        return ((t - 1) * t * ((s + 1) * 2 * t + s) + 2) / 2;
    },
    /**
     * Elastic ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity with elastic effect
     * @see https://easings.net/#easeInElastic
     */
    easeInElastic: (t) => {
        if (t === 0)
            return 0;
        if (t === 1)
            return 1;
        return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
    },
    /**
     * Elastic ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity with elastic effect
     * @see https://easings.net/#easeOutElastic
     */
    easeOutElastic: (t) => {
        if (t === 0)
            return 0;
        if (t === 1)
            return 1;
        return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
    },
    /**
     * Elastic ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration with elastic effect
     * @see https://easings.net/#easeInOutElastic
     */
    easeInOutElastic: (t) => {
        if (t === 0)
            return 0;
        if (t === 1)
            return 1;
        t *= 2;
        if (t < 1) {
            return -0.5 * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
        }
        return 0.5 * Math.pow(2, -10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) + 1;
    },
    /**
     * Bounce ease-in
     * @param t - Progress from 0 to 1
     * @returns Accelerating from zero velocity with bouncing effect
     * @see https://easings.net/#easeInBounce
     */
    easeInBounce: (t) => 1 - BASE_EASING.easeOutBounce(1 - t),
    /**
     * Bounce ease-out
     * @param t - Progress from 0 to 1
     * @returns Decelerating to zero velocity with bouncing effect
     * @see https://easings.net/#easeOutBounce
     */
    easeOutBounce: (t) => {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        }
        else if (t < 2 / 2.75) {
            t -= 1.5 / 2.75;
            return 7.5625 * t * t + 0.75;
        }
        else if (t < 2.5 / 2.75) {
            t -= 2.25 / 2.75;
            return 7.5625 * t * t + 0.9375;
        }
        else {
            t -= 2.625 / 2.75;
            return 7.5625 * t * t + 0.984375;
        }
    },
    /**
     * Bounce ease-in-out
     * @param t - Progress from 0 to 1
     * @returns Acceleration until halfway, then deceleration with bouncing effect
     * @see https://easings.net/#easeInOutBounce
     */
    easeInOutBounce: (t) => t < 0.5
        ? BASE_EASING.easeInBounce(t * 2) * 0.5
        : BASE_EASING.easeOutBounce(t * 2 - 1) * 0.5 + 0.5,
};

const createEasing = {
    /**
     * Creates a set of back easing functions with configurable overshoot
     * @param s - Overshoot amount (default: 1.70158). Higher values create more pronounced overshoot
     * @returns Object containing easeIn, easeOut, and easeInOut functions
     * @see https://easings.net/#easeInBack
     */
    backEasing: (s = 1.70158) => ({
        /**
         * Back ease-in with configurable overshoot
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating overshoot effect
         */
        easeIn: (t) => Number(t * t * ((s + 1) * t - s)) || 0,
        /**
         * Back ease-out with configurable overshoot
         * @param t - Progress from 0 to 1
         * @returns Value with decelerating overshoot effect
         */
        easeOut: (t) => --t * t * ((s + 1) * t + s) + 1,
        /**
         * Back ease-in-out with configurable overshoot
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating and decelerating overshoot effect
         */
        easeInOut: (t) => {
            const s2 = s * 1.525;
            t *= 2;
            if (t < 1)
                return 0.5 * (t * t * ((s2 + 1) * t - s2));
            return 0.5 * ((t -= 2) * t * ((s2 + 1) * t + s2) + 2);
        }
    }),
    /**
     * Creates a set of elastic easing functions with configurable parameters
     * @param amplitude - Amplitude of the elastic effect (default: 1). Higher values create larger oscillations
     * @param period - Period of the elastic effect (default: 0.3). Lower values create faster oscillations
     * @returns Object containing easeIn, easeOut, and easeInOut functions
     * @see https://easings.net/#easeInElastic
     */
    elasticEasing: (amplitude = 1, period = 0.3) => ({
        /**
         * Elastic ease-in with configurable amplitude and period
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating elastic effect
         */
        easeIn: (t) => {
            if (t === 0 || t === 1)
                return t;
            return -amplitude * Math.pow(2, 10 * (t - 1)) *
                Math.sin((t - 1 - period / (2 * Math.PI) * Math.asin(1 / amplitude)) *
                    (2 * Math.PI) / period);
        },
        /**
         * Elastic ease-out with configurable amplitude and period
         * @param t - Progress from 0 to 1
         * @returns Value with decelerating elastic effect
         */
        easeOut: (t) => {
            if (t === 0 || t === 1)
                return t;
            return amplitude * Math.pow(2, -10 * t) *
                Math.sin((t - period / (2 * Math.PI) * Math.asin(1 / amplitude)) *
                    (2 * Math.PI) / period) + 1;
        },
        /**
         * Elastic ease-in-out with configurable amplitude and period
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating and decelerating elastic effect
         */
        easeInOut: (t) => {
            if (t === 0 || t === 1)
                return t;
            t *= 2;
            if (t < 1) {
                return -0.5 * amplitude * Math.pow(2, 10 * (t - 1)) *
                    Math.sin((t - 1 - period / 4) * (2 * Math.PI) / period);
            }
            return amplitude * Math.pow(2, -10 * (t - 1)) *
                Math.sin((t - 1 - period / 4) * (2 * Math.PI) / period) * 0.5 + 1;
        }
    }),
    /**
     * Creates a set of bounce easing functions with configurable strength
     * @param strength - Strength of the bounce effect (default: 7.5625). Higher values create stronger bounces
     * @returns Object containing easeIn, easeOut, and easeInOut functions
     * @see https://easings.net/#easeInBounce
     */
    bouncyEasing: (strength = 7.5625) => ({
        /**
         * Bounce ease-in with configurable strength
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating bounce effect
         */
        easeIn: (t) => 1 - BASE_EASING.easeOutBounce(1 - t),
        /**
         * Bounce ease-out with configurable strength
         * @param t - Progress from 0 to 1
         * @returns Value with decelerating bounce effect
         */
        easeOut: (t) => {
            if (t < 1 / 2.75)
                return strength * t * t;
            if (t < 2 / 2.75) {
                t -= 1.5 / 2.75;
                return strength * t * t + 0.75;
            }
            if (t < 2.5 / 2.75) {
                t -= 2.25 / 2.75;
                return strength * t * t + 0.9375;
            }
            t -= 2.625 / 2.75;
            return strength * t * t + 0.984375;
        },
        /**
         * Bounce ease-in-out with configurable strength
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating and decelerating bounce effect
         */
        easeInOut: (t) => t < 0.5
            ? (1 - BASE_EASING.easeOutBounce(1 - 2 * t)) / 2
            : (1 + BASE_EASING.easeOutBounce(2 * t - 1)) / 2
    }),
    /**
     * Creates a set of exponential easing functions with configurable base
     * @param base - Base for exponential calculation (default: 2). Higher values create steeper curves
     * @returns Object containing easeIn, easeOut, and easeInOut functions
     * @see https://easings.net/#easeInExpo
     */
    expoEasing: (base = 2) => ({
        /**
         * Exponential ease-in with configurable base
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating exponential effect
         */
        easeIn: (t) => t === 0 ? 0 : Math.pow(base, 10 * (t - 1)),
        /**
         * Exponential ease-out with configurable base
         * @param t - Progress from 0 to 1
         * @returns Value with decelerating exponential effect
         */
        easeOut: (t) => t === 1 ? 1 : 1 - Math.pow(base, -10 * t),
        /**
         * Exponential ease-in-out with configurable base
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating and decelerating exponential effect
         */
        easeInOut: (t) => {
            if (t === 0)
                return 0;
            if (t === 1)
                return 1;
            if (t < 0.5)
                return Math.pow(base, 20 * t - 10) / 2;
            return (2 - Math.pow(base, -20 * t + 10)) / 2;
        }
    }),
    /**
     * Creates a set of circular easing functions with configurable radius
     * @param radius - Radius for circular calculation (default: 1). Affects the curvature of the easing
     * @returns Object containing easeIn, easeOut, and easeInOut functions
     * @see https://easings.net/#easeInCirc
     */
    circEasing: (radius = 1) => ({
        /**
         * Circular ease-in with configurable radius
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating circular effect
         */
        easeIn: (t) => 1 - Math.sqrt(1 - Math.pow(t, 2) / radius),
        /**
         * Circular ease-out with configurable radius
         * @param t - Progress from 0 to 1
         * @returns Value with decelerating circular effect
         */
        easeOut: (t) => Math.sqrt(1 - Math.pow(t - 1, 2) / radius),
        /**
         * Circular ease-in-out with configurable radius
         * @param t - Progress from 0 to 1
         * @returns Value with accelerating and decelerating circular effect
         */
        easeInOut: (t) => {
            t *= 2;
            if (t < 1)
                return -0.5 * (Math.sqrt(1 - t * t) - 1);
            t -= 2;
            return 0.5 * (Math.sqrt(1 - t * t) + 1);
        }
    })
};

/**
 * Creates a collection of easing functions with optional configuration
 * @param config - Configuration for customizable easing functions
 * @returns Object containing all easing functions (base and configurable)
 */
const createEasings = (config = {}) => {
    const { overshoot = 1.70158, amplitude = 1, period = 0.3, bounceStrength = 7.5625 } = config;
    // Create configurable easings
    const backEasings = createEasing.backEasing(overshoot);
    const elasticEasings = createEasing.elasticEasing(amplitude, period);
    const bounceEasings = createEasing.bouncyEasing(bounceStrength);
    // Combine base easings with configurable ones
    return {
        ...BASE_EASING,
        // Configurable back easings
        configBackEaseIn: backEasings.easeIn,
        configBackEaseOut: backEasings.easeOut,
        configBackEaseInOut: backEasings.easeInOut,
        // Configurable elastic easings
        configElasticEaseIn: elasticEasings.easeIn,
        configElasticEaseOut: elasticEasings.easeOut,
        configElasticEaseInOut: elasticEasings.easeInOut,
        // Configurable bounce easings
        configBounceEaseIn: bounceEasings.easeIn,
        configBounceEaseOut: bounceEasings.easeOut,
        configBounceEaseInOut: bounceEasings.easeInOut
    };
};
/**
 * Utility functions that can be applied to any easing function
 */
const easingUtils = {
    /**
     * Reverses the easing function
     * @param easingFn - Original easing function
     * @returns Reversed easing function
     */
    reverse: (easingFn) => (t) => easingFn(1 - t),
    /**
     * Creates a mirrored version of the easing function
     * @param easingFn - Original easing function
     * @returns Mirrored easing function
     */
    mirror: (easingFn) => (t) => t <= 0.5 ? easingFn(2 * t) / 2 : (2 - easingFn(2 * (1 - t))) / 2,
    /**
     * Mixes two easing functions with a balance factor
     * @param easingFn1 - First easing function
     * @param easingFn2 - Second easing function
     * @param balance - Balance between the two functions (0 to 1)
     * @returns Mixed easing function
     */
    mix: (easingFn1, easingFn2, balance) => (t) => (1 - balance) * easingFn1(t) + balance * easingFn2(t)
};
/**
 * Creates enhanced easing functions with utility methods
 * @param config - Configuration for customizable easing functions
 * @returns Enhanced easing functions with utility methods
 */
const easings = (config) => {
    const baseEasings = config ? createEasings(config) : BASE_EASING;
    return Object.entries(baseEasings).reduce((acc, [name, fn]) => ({
        ...acc,
        [name]: Object.assign(fn, {
            reverse: () => easingUtils.reverse(fn),
            mirror: () => easingUtils.mirror(fn),
            mix: (other, balance) => easingUtils.mix(fn, other, balance)
        })
    }), {});
};

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

// Import and re-export core functionality
// Create a default export object
const animate = {
    Animation,
    Timeline,
    easings,
    stagger,
    createStaggeredAnimations,
    presets,
    // Convenience methods
    /**
     * Create an animation instance
     * @param target - Target element or object to animate
     * @param properties - Properties to animate with from/to values
     * @param options - Animation options
     * @returns Animation instance
     */
    create: (target, properties, options) => {
        var _a;
        return new Animation({
            target,
            properties,
            options: {
                ...options,
                autoplay: (_a = options.autoplay) !== null && _a !== void 0 ? _a : false // Default to false if not specified
            }
        });
    },
    /**
     * Create and play an animation
     * @param target - Target element or object to animate
     * @param properties - Properties to animate with from/to values
     * @param options - Animation options
     * @returns Animation instance
     */
    play: (target, properties, options) => {
        return new Animation({
            target,
            properties,
            options: {
                ...options,
                autoplay: true // Override autoplay to true
            }
        });
    },
    /**
     * Create and play an animation, returning a Promise
     * @param target - Target element or object to animate
     * @param properties - Properties to animate with from/to values
     * @param options - Animation options
     * @returns Promise that resolves when animation completes
     */
    playAndWait: (target, properties, options) => {
        return new Animation({
            target,
            properties,
            options: {
                ...options,
                autoplay: true // Override autoplay to true
            }
        }).toPromise();
    },
    /**
     * Create a timeline instance
     * @param options - Timeline options
     * @returns Timeline instance
     */
    createTimeline: (options = {}) => {
        var _a;
        return new Timeline({
            autoplay: (_a = options.autoplay) !== null && _a !== void 0 ? _a : false // Default to false if not specified
        });
    },
    /**
     * Apply a preset animation
     * @param name - Preset animation name
     * @param target - Target element or object
     * @param config - Preset configuration
     * @returns Animation or Timeline instance
     */
    preset: (name, target, config = {}) => {
        var _a;
        // Get the function name from PRESETS using the constant key
        const presetFunctionName = PRESETS[name];
        return presets[presetFunctionName](target, {
            ...config,
            autoplay: (_a = config.autoplay) !== null && _a !== void 0 ? _a : true // Default to true for backwards compatibility
        });
    },
    /**
     * Apply a preset animation and wait for completion
     * @param name - Preset animation name
     * @param target - Target element or object
     * @param config - Preset configuration
     * @returns Promise that resolves when animation completes
     */
    presetAndWait: (name, target, config = {}) => {
        // Get the function name from PRESETS using the constant key
        const presetFunctionName = PRESETS[name];
        return presets[presetFunctionName](target, {
            ...config,
            autoplay: true // Override autoplay to true
        }).toPromise();
    },
    /**
     * Create staggered animations
     * @param targets - Array of elements to animate
     * @param properties - Properties to animate
     * @param options - Animation options
     * @param staggerValue - Stagger delay value
     * @param staggerOptions - Stagger configuration options
     * @returns Array of Animation instances
     */
    staggerAnimation: (targets, properties, options, staggerValue, staggerOptions = {}) => {
        var _a;
        const autoplay = (_a = options.autoplay) !== null && _a !== void 0 ? _a : false;
        return Animation.stagger(targets, properties, { ...options, autoplay }, staggerValue, staggerOptions);
    },
    /**
     * Create staggered animations and wait for all to complete
     * @param targets - Array of elements to animate
     * @param properties - Properties to animate
     * @param options - Animation options
     * @param staggerValue - Stagger delay value
     * @param staggerOptions - Stagger configuration options
     * @returns Promise that resolves when all animations complete
     */
    staggerAnimationAndWait: (targets, properties, options, staggerValue, staggerOptions = {}) => {
        const animations = Animation.stagger(targets, properties, { ...options, autoplay: true }, staggerValue, staggerOptions);
        // Return a promise that resolves when all animations complete
        return Promise.all(animations.map(anim => anim.toPromise())).then(() => { });
    },
    staggerPreset: (name, targets, config = {}, staggerValue = 50, staggerOptions = {}) => {
        // Get the function name from PRESETS using the constant key
        const presetFunctionName = PRESETS[name];
        // Create a stagger delay function
        const staggerFn = stagger(staggerValue, staggerOptions);
        // Create staggered animations
        return createStaggeredAnimations(targets, (target, index, total) => {
            var _a;
            return presets[presetFunctionName](target, {
                ...config,
                autoplay: (_a = config.autoplay) !== null && _a !== void 0 ? _a : false // Default to false for manual control
            });
        }, staggerFn);
    },
    /**
     * Apply a preset animation with stagger and wait for all to complete
     * @param name - Preset animation name
     * @param targets - Array of elements to animate
     * @param config - Preset configuration
     * @param staggerValue - Stagger delay value
     * @param staggerOptions - Stagger configuration options
     * @returns Promise that resolves when all animations complete
     */
    staggerPresetAndWait: (name, targets, config = {}, staggerValue = 50, staggerOptions = {}) => {
        const animations = animate.staggerPreset(name, targets, { ...config, autoplay: true }, // Force autoplay for promise-based execution
        staggerValue, staggerOptions);
        // Return a promise that resolves when all animations complete
        return Promise.all(animations.map(animation => animation.toPromise())).then(() => { });
    }
};

export { Animation, Animation_types as AnimationTypes, Presets_types as PresetsTypes, PropertyAnimation_types as PropertyAnimationTypes, Stagger_types as StaggerTypes, Timeline, bounce, createAnimationObservable, createAnimationState, createEasings, createPresetAnimation, createStaggeredAnimations, animate as default, easingUtils, easings, fadeIn, fadeOut, flash, flipIn, flipOut, getAnimationEndTime, getCurrentValue, getDefaultValue, heartbeat, hinge, interpolate, isColor, isTransform, jello, lightSpeedIn, lightSpeedOut, parseCssValue, parsePropertyAnimation, parseTimelineOffset, presets, pulse, rollIn, rollOut, rubberBand, shake, slideIn, slideOut, stagger, styleBinder, swing, tada, updateTargetProperties, wobble, zoomIn, zoomOut };
//# sourceMappingURL=index.mjs.map
