class Observer {
    constructor() {
        this.subscribers = [];
    }

    subscribe(subscriber) {
        if (subscriber instanceof Function) {
            this.subscribers.push(subscriber);
        }
        return this;
    }

    unsubscribe(subscriber) {
        this.subscribers = this.subscribers.filter((aSubscriber) => aSubscriber !== subscriber);
    }

    notify(event = null) {
        this.subscribers.forEach((subscriber) => subscriber(event));
    }
}

module.exports.Observer = Observer;

const observableSymbol = '__symbol_iobserver';
module.exports.observableSymbol = observableSymbol;

const observable = (object = {}) => {
    if (!(object instanceof Object)) {
        throw new Error('Do not support this type: ' + typeof object);
    }

    if (object[observableSymbol]) {
        return object;
    } else {
        const observer = new Observer();

        Object.defineProperty(object, observableSymbol, {
            get: () => observer,
            enumerable: false,
            configurable: false
        });

        return object;
    }
};
module.exports.observable = observable;

const observableObserver = (observableObject) => {
    return observable(observableObject)[observableSymbol];
};
module.exports.observableObserver = observableObserver;

const subscribe = (observableObject, subscriber) => observableObserver(observableObject).subscribe(subscriber);
module.exports.subscribe = subscribe;

const unsubscribe = (observableObject, subscriber) => observableObserver(observableObject).unsubscribe(subscriber);
module.exports.unsubscribe = unsubscribe;

const notify = (observableObject, event = null) => observableObserver(observableObject).notify(event);
module.exports.notify = notify;

const update = (observableObject, updater = () => null) => {
    const push = () => notify(observableObject, observableObject);
    const result = updater(observableObject);

    if (result instanceof Object && result.then instanceof Function) {
        push();

        return Promise.resolve()
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
        return Promise.resolve().then(() => push());
    }
};

module.exports.update = update;