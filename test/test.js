const assert = require('assert');
const {observable, subscribe, unsubscribe, notify, update} = require('../index');

describe('iobserver', () => {
    it('subscribe/unsubscribe/notify', () => {
        let user = {
            name: 'slava',
            counter: 0
        };

        // mark it as observable
        observable(user);

        assert.deepEqual(user, {
            name: 'slava',
            counter: 0
        });

        let onNotify = (payload) => user.counter+=payload; // this is just for example, but will be called on notify
        subscribe(user, onNotify);

        assert.equal(user.counter, 0);
        // lets notify, it should inc call onNotify

        notify(user, 5);

        // yep counter updated
        assert.equal(user.counter, 5);

        // once again
        notify(user, 1);

        // updated
        assert.equal(user.counter, 6);

        // ok, lets unsubscribe, it should not receive calls now
        unsubscribe(user, onNotify);

        // fire
        notify(user, 1);

        //nothing changed
        assert.equal(user.counter, 6);

        // once again
        notify(user, 'it should not update');

        //nothing
        assert.equal(user.counter, 6);
    });

    it('subscribe/update sync', () => {
        let state = observable({
            name: 'slava'
        });

        let name = null;
        let iCounter = 0;

        let detector = (state) => {
            name = state.name;
            iCounter++;
        };

        subscribe(state, detector);

        assert.equal(iCounter, 0);
        assert.equal(name, null);

        return update(state, (state) => {
            state.name = 'eugene';
        }).then(() => {
            assert.equal(name, 'eugene');
            assert.equal(iCounter, 1);
        });
    });

    it('subscribe/update async', () => {
        let state = observable({
            name: 'slava'
        });

        let name = null;
        let iCounter = 0;

        let detector = (state) => {
            name = state.name;
            iCounter++;
        };

        subscribe(state, detector);

        assert.equal(iCounter, 0);
        assert.equal(name, null);

        return update(state, (state) => {
            let wait = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

            return Promise.resolve()
                .then(() => wait(10)) //do something async, 10ms just for ex.
                .then(() => {
                    state.name = 'eugene';
                })
        })
            .then(() => {
                assert.equal(name, 'eugene');
                assert.equal(iCounter, 2); // it will be called twice, #1 for sync, #2 for async
            });
    });

});