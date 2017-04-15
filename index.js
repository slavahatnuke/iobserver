function Observer() {
    this.subscribers = [];
}
Observer.prototype = {
    subscribe: function (subscriber) {
        if (subscriber instanceof Function) {
            this.subscribers.push(subscriber);
        }
        return this;
    },

    unsubscribe: function (subscriber) {
        this.subscribers = this.subscribers.filter((aSubscriber) => aSubscriber !== subscriber);
    },

    notify: function (event = null) {
        this.subscribers.forEach((subscriber) => subscriber(event));
    }
};

const observableSymbol = '__symbol_iobserver';
const isObject = (object) => object instanceof Object;
const isFunction = (object) => object instanceof Function;

const observable = (object = {}) => {
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

const observableObserver = (observableObject) => observable(observableObject)[observableSymbol];
const subscribe = (observableObject, subscriber) => observableObserver(observableObject).subscribe(subscriber);

const unsubscribe = (observableObject, subscriber) => observableObserver(observableObject).unsubscribe(subscriber);
const notify = (observableObject, event = null) => observableObserver(observableObject).notify(event);

const update = (observableObject, updater = () => null) => {
    const push = () => notify(observableObject, observableObject);
    const result = updater(observableObject);

    return Promise.resolve()
        .then(() => {

            if (isObject(result) && isFunction(result.then)) {
                push();

                return Promise.resolve(result)
                    .then(() => result)
                    .then((result) => {
                        push();
                        return result;
                    })
                    .catch((error) => {
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
    Observer,
    observable,
    subscribe,
    unsubscribe,
    notify,
    update,
    observableObserver,
    observableSymbol,
};