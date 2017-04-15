/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Observer = function () {
    function Observer() {
        _classCallCheck(this, Observer);

        this.subscribers = [];
    }

    _createClass(Observer, [{
        key: 'subscribe',
        value: function subscribe(subscriber) {
            if (subscriber instanceof Function) {
                this.subscribers.push(subscriber);
            }
            return this;
        }
    }, {
        key: 'unsubscribe',
        value: function unsubscribe(subscriber) {
            this.subscribers = this.subscribers.filter(function (aSubscriber) {
                return aSubscriber !== subscriber;
            });
        }
    }, {
        key: 'notify',
        value: function notify() {
            var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            this.subscribers.forEach(function (subscriber) {
                return subscriber(event);
            });
        }
    }]);

    return Observer;
}();

exports.Observer = Observer;

var observableKey = '__symbol_iobserver';
exports.observableKey = observableKey;

var observable = function observable() {
    var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!(object instanceof Object)) {
        throw new Error('Do not support this type: ' + (typeof object === 'undefined' ? 'undefined' : _typeof(object)));
    }

    if (object[observableKey]) {
        return object;
    } else {
        var observer = new Observer();

        Object.defineProperty(object, observableKey, {
            value: observer,
            enumerable: false,
            configurable: false
        });

        return object;
    }
};
exports.observable = observable;

var observableObserver = function observableObserver(observableObject) {
    return observable(observableObject)[observableKey];
};
exports.observableObserver = observableObserver;

var subscribe = function subscribe(observableObject, subscriber) {
    return observableObserver(observableObject).subscribe(subscriber);
};
exports.subscribe = subscribe;

var unsubscribe = function unsubscribe(observableObject, subscriber) {
    return observableObserver(observableObject).unsubscribe(subscriber);
};
exports.unsubscribe = unsubscribe;

var notify = function notify(observableObject) {
    var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return observableObserver(observableObject).notify(event);
};
exports.notify = notify;

var update = function update(observableObject) {
    var updater = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
        return null;
    };

    var push = function push() {
        return notify(observableObject, observableObject);
    };
    var result = updater(observableObject);

    if (result instanceof Object && result.then instanceof Function) {
        push();

        return Promise.resolve().then(function () {
            return result;
        }).then(function (result) {
            push();
            return result;
        }).catch(function (error) {
            push();
            return Promise.reject(error);
        });
    } else {
        return Promise.resolve().then(function () {
            return push();
        });
    }
};

exports.update = update;

/***/ })
/******/ ]);