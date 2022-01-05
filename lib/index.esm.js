import React, { createContext, useContext, Component, useRef, useState, useEffect, useCallback, useMemo } from 'react';

/*! *****************************************************************************
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
/* global Reflect, Promise */

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

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var KeyValues = /** @class */ (function () {
    function KeyValues() {
        var _this = this;
        this.id = 0;
        this.data = {};
        this.add = function (key, value) {
            var newId = ++_this.id;
            if (!_this.data[key])
                _this.data[key] = {};
            _this.data[key][newId] = value;
            return function () {
                delete _this.data[key][newId];
            };
        };
        this.get = function (key) {
            return Object.values(_this.data[key]);
        };
        this.all = function () {
            return Object.keys(_this.data).reduce(function (accumulator, key) {
                Object.values(_this.data[key]).forEach(function (value) {
                    accumulator.push({ key: key, value: value });
                });
                return accumulator;
            }, []);
        };
    }
    return KeyValues;
}());
var FormContext = createContext({
    setDefaultValue: function () { },
    setValue: function () { },
    setOnValue: function () {
        return function () { };
    },
    setOnValidate: function () {
        return function () { };
    },
    setOnSubmit: function () {
        return function () { };
    },
    onBlur: function () { },
    errors: {},
});
function useForm() {
    return useContext(FormContext);
}
var FormError = /** @class */ (function (_super) {
    __extends(FormError, _super);
    function FormError(message, key) {
        var _this = _super.call(this, message) || this;
        _this.key = key;
        return _this;
    }
    return FormError;
}(Error));
function createForm(Wrapper) {
    return /** @class */ (function (_super) {
        __extends(Form, _super);
        function Form(props) {
            var _this = _super.call(this, props) || this;
            _this.state = {
                errors: {},
            };
            _this.defaultData = {};
            _this.data = {};
            _this.valueListeners = new KeyValues();
            _this.validateListeners = new KeyValues();
            _this.submitListeners = new KeyValues();
            _this.setDefaultValue = function (key, value) {
                if (!(key in _this.defaultData)) {
                    _this.defaultData[key] = value;
                    _this.data[key] = value;
                }
            };
            _this.setValue = function (key, value) {
                var _a, _b;
                _this.data[key] = value;
                if (typeof value === 'undefined') {
                    delete _this.data[key];
                }
                _this.valueListeners.get(key).forEach(function (listener) {
                    listener(value, _this.data);
                });
                (_b = (_a = _this.props).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, _this.data);
                if (_this.props.validate === 'onChange') {
                    _this.validate(key, true);
                }
            };
            _this.setOnValue = function (key, callback) {
                callback(_this.data[key], _this.data);
                return _this.valueListeners.add(key, callback);
            };
            _this.setOnValidate = function (key, callback) {
                return _this.validateListeners.add(key, callback);
            };
            _this.setOnSubmit = function (key, callback) {
                return _this.submitListeners.add(key, callback);
            };
            _this.validateTimeout = 500;
            _this.validate = function (key, throttle) { return __awaiter(_this, void 0, void 0, function () {
                var _i, _a, listener, error_1;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!throttle) return [3 /*break*/, 2];
                            if (this.validateTimer)
                                clearTimeout(this.validateTimer);
                            return [4 /*yield*/, new Promise(function (resolve) {
                                    _this.validateTimer = setTimeout(function () {
                                        _this.validate(key, false).then(resolve);
                                    }, _this.validateTimeout);
                                })];
                        case 1: return [2 /*return*/, _b.sent()];
                        case 2:
                            _b.trys.push([2, 7, , 8]);
                            _i = 0, _a = this.validateListeners.get(key);
                            _b.label = 3;
                        case 3:
                            if (!(_i < _a.length)) return [3 /*break*/, 6];
                            listener = _a[_i];
                            return [4 /*yield*/, listener(this.data[key], this.data)];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6:
                            this.setState(function (state) {
                                var errors = __assign({}, state.errors);
                                delete errors[key];
                                return { errors: errors };
                            });
                            return [2 /*return*/, true];
                        case 7:
                            error_1 = _b.sent();
                            this.setState(function (state) {
                                var errors = __assign({}, state.errors);
                                errors[key] = error_1;
                                return { errors: errors };
                            });
                            return [2 /*return*/, false];
                        case 8: return [2 /*return*/];
                    }
                });
            }); };
            _this.onBlur = function (key) {
                if (!_this.props.validate || _this.props.validate === 'onBlur') {
                    _this.validate(key, false);
                }
            };
            _this.onSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
                var hasErrors, errors, _i, _a, listener, error_2, _b, _c, listener, error_3, error, delta, key, err_1;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            this.setState({ loading: true, error: undefined, errors: {} });
                            hasErrors = false;
                            errors = {};
                            _i = 0, _a = this.validateListeners.all();
                            _d.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 6];
                            listener = _a[_i];
                            _d.label = 2;
                        case 2:
                            _d.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, listener.value(this.data[listener.key], this.data)];
                        case 3:
                            _d.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            error_2 = _d.sent();
                            errors[listener.key] = error_2;
                            hasErrors = true;
                            return [3 /*break*/, 5];
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6:
                            if (!!hasErrors) return [3 /*break*/, 12];
                            _b = 0, _c = this.submitListeners.all();
                            _d.label = 7;
                        case 7:
                            if (!(_b < _c.length)) return [3 /*break*/, 12];
                            listener = _c[_b];
                            _d.label = 8;
                        case 8:
                            _d.trys.push([8, 10, , 11]);
                            return [4 /*yield*/, listener.value(this.data[listener.key], this.data)];
                        case 9:
                            _d.sent();
                            return [3 /*break*/, 11];
                        case 10:
                            error_3 = _d.sent();
                            errors[listener.key] = error_3;
                            hasErrors = true;
                            return [3 /*break*/, 11];
                        case 11:
                            _b++;
                            return [3 /*break*/, 7];
                        case 12:
                            if (!!hasErrors) return [3 /*break*/, 16];
                            delta = __assign({}, this.data);
                            for (key in delta) {
                                if (delta[key] === this.defaultData[key]) {
                                    delete delta[key];
                                }
                            }
                            _d.label = 13;
                        case 13:
                            _d.trys.push([13, 15, , 16]);
                            return [4 /*yield*/, this.props.onSubmit(this.data, delta)];
                        case 14:
                            _d.sent();
                            return [3 /*break*/, 16];
                        case 15:
                            err_1 = _d.sent();
                            if (err_1 instanceof FormError) {
                                if (err_1.key)
                                    errors[err_1.key] = err_1;
                                else
                                    error = err_1;
                            }
                            else if (err_1 instanceof Error) {
                                error = err_1;
                            }
                            else {
                                error = new FormError('An error occurred');
                            }
                            return [3 /*break*/, 16];
                        case 16:
                            this.setState({ loading: false, error: error, errors: errors });
                            return [2 /*return*/];
                    }
                });
            }); };
            if (props.defaultValues) {
                _this.defaultData = __assign({}, props.defaultValues);
                _this.data = __assign({}, props.defaultValues);
            }
            return _this;
        }
        Form.prototype.render = function () {
            return (React.createElement(FormContext.Provider, { value: {
                    setDefaultValue: this.setDefaultValue,
                    setValue: this.setValue,
                    setOnValue: this.setOnValue,
                    setOnValidate: this.setOnValidate,
                    setOnSubmit: this.setOnSubmit,
                    onBlur: this.onBlur,
                    errors: this.state.errors,
                    loading: this.state.loading,
                } },
                React.createElement(Wrapper, __assign({}, this.props, { onSubmit: this.onSubmit, error: this.state.error, errors: this.state.errors, loading: this.state.loading }), this.props.children)));
        };
        return Form;
    }(Component));
}

function validateRequired(value, message) {
    if (!value || (Array.isArray(value) && value.length === 0)) {
        throw new FormError(message !== null && message !== void 0 ? message : 'Field is required');
    }
}
function validateEmail(value, message) {
    if (typeof value === 'string' && !value.includes('@')) {
        throw new FormError(message !== null && message !== void 0 ? message : 'Field is not an email');
    }
}
function validateRegex(value, regex, message) {
    if (typeof value === 'string' && !regex.test(value)) {
        throw new FormError(message !== null && message !== void 0 ? message : "Field doesn't match ".concat(regex.source));
    }
}
// More...

function createInputWrapper(Component) {
    return function (props) {
        return React.createElement(Component, __assign({}, props));
    };
}
var DefaultWrapperComponent = createInputWrapper(function (_a) {
    var children = _a.children;
    return children;
});
function createInput(Component, DefaultWrapper) {
    if (DefaultWrapper === void 0) { DefaultWrapper = DefaultWrapperComponent; }
    return function (props) {
        var _this = this;
        var eventRef = useRef(null);
        var _a = useForm(), setDefaultValue = _a.setDefaultValue, setFormValue = _a.setValue, setOnValue = _a.setOnValue, setOnValidate = _a.setOnValidate, setOnSubmit = _a.setOnSubmit, onFormBlur = _a.onBlur, errors = _a.errors, loading = _a.loading;
        var _b = useState(), data = _b[0], setData = _b[1];
        useEffect(function () {
            if (props.defaultValue !== undefined) {
                setDefaultValue(props.name, props.defaultValue);
            }
            var removeListener = setOnValue(props.name, function (value) {
                var _a;
                setData(value);
                (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, value);
            });
            return function () {
                removeListener();
            };
        }, [props.name, props.onChange]);
        useEffect(function () {
            return function () {
                setFormValue(props.name, undefined); // delete key if unmounted
            };
        }, [props.name]);
        useEffect(function () {
            return setOnValidate(props.name, function (value, data) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (props.required)
                                validateRequired(value);
                            return [4 /*yield*/, ((_b = (_a = eventRef.current) === null || _a === void 0 ? void 0 : _a.onValidate) === null || _b === void 0 ? void 0 : _b.call(_a, value, data))];
                        case 1:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }, [props.name, props.required]);
        useEffect(function () {
            return setOnSubmit(props.name, function (value, data) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, ((_b = (_a = eventRef.current) === null || _a === void 0 ? void 0 : _a.onSubmit) === null || _b === void 0 ? void 0 : _b.call(_a, value, data))];
                        case 1:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }, [props.name]);
        var setValue = useCallback(function (value) {
            setFormValue(props.name, value);
        }, [props.name]);
        var onBlur = useCallback(function () {
            onFormBlur(props.name);
        }, [props.name]);
        var error = useMemo(function () { return errors[props.name]; }, [errors, props.name]);
        var Wrapper = useMemo(function () {
            if (props.wrapper === null)
                return DefaultWrapperComponent;
            if (props.wrapper)
                return props.wrapper;
            return DefaultWrapper;
        }, [props.wrapper]);
        return (React.createElement(Wrapper, __assign({}, props, { value: data, setValue: setValue, onBlur: onBlur, disabled: loading, error: error, eventRef: eventRef, setOnValue: setOnValue }),
            React.createElement(Component, __assign({}, props, { value: data, setValue: setValue, onBlur: onBlur, disabled: loading, error: error, eventRef: eventRef, setOnValue: setOnValue }))));
    };
}

export { FormError, createForm, createInput, createInputWrapper, useForm, validateEmail, validateRegex, validateRequired };
