(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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


function Observer() {
    this.subscribers = [];
}
Observer.prototype = {
    subscribe: function subscribe(subscriber) {
        if (subscriber instanceof Function) {
            this.subscribers.push(subscriber);
        }
        return this;
    },

    unsubscribe: function unsubscribe(subscriber) {
        this.subscribers = this.subscribers.filter(function (aSubscriber) {
            return aSubscriber !== subscriber;
        });
    },

    notify: function notify() {
        var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        this.subscribers.forEach(function (subscriber) {
            return subscriber(event);
        });
    }
};

var observableSymbol = '__symbol_iobserver';
var isObject = function isObject(object) {
    return object instanceof Object;
};
var isFunction = function isFunction(object) {
    return object instanceof Function;
};

var observable = function observable() {
    var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!isObject(object)) {
        throw new Error('Do not support this: ' + object);
    }

    if (object[observableSymbol]) {
        return object;
    } else {
        Object.defineProperty(object, observableSymbol, {
            value: new Observer(),
            enumerable: false,
            configurable: false
        });

        return object;
    }
};

var observableObserver = function observableObserver(observableObject) {
    return observable(observableObject)[observableSymbol];
};
var subscribe = function subscribe(observableObject, subscriber) {
    return observableObserver(observableObject).subscribe(subscriber);
};

var unsubscribe = function unsubscribe(observableObject, subscriber) {
    return observableObserver(observableObject).unsubscribe(subscriber);
};
var notify = function notify(observableObject) {
    var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return observableObserver(observableObject).notify(event);
};

var update = function update(observableObject) {
    var updater = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
        return null;
    };

    var push = function push() {
        return notify(observableObject, observableObject);
    };
    var result = updater(observableObject);

    return Promise.resolve().then(function () {

        if (isObject(result) && isFunction(result.then)) {
            push();

            return Promise.resolve(result).then(function () {
                return result;
            }).then(function (result) {
                push();
                return result;
            }).catch(function (error) {
                push();
                return Promise.reject(error);
            });
        } else {
            push();
            return result;
        }
    });
};

module.exports = {
    Observer: Observer,
    observable: observable,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    notify: notify,
    update: update,
    observableObserver: observableObserver,
    observableSymbol: observableSymbol,
    isObject: isObject,
    isFunction: isFunction
};

/***/ })
/******/ ]);
});