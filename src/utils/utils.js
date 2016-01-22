'use strict';

export function waitForFn (waitFn, callback, {delay: delay, timeout: timeout} = {delay: 10, timeout: 10 * 1000}) {
    var _ticInterval = 500;

    var interval;
    var lastError = '';
    var exectution = false;
    var startTimestamp = +(new Date());

    var intervalFn = function () {
        if ((+new Date() - startTimestamp) > timeout) {
            exectution = false;
            clearInterval(interval);
            return callback(`Out of time: ${timeout / 1000}s (${lastError})`);
        }

        if (!exectution) {
            try {
                exectution = true;
                waitFn((err, result) => {
                    if (!exectution) {
                        console.warn(`waitForFn(): Operation finished after time out.`);
                        return;
                    }
                    exectution = false;
                    if (err) {
                        lastError = err;
                    } else {
                        clearInterval(interval);
                        return callback(null, result);
                    }
                });
            } catch (e) {
                exectution = false;
                throw e;
            }
        }
    };

    setTimeout(() => {
        interval = setInterval(intervalFn, _ticInterval);
        intervalFn();
    }, delay);
}