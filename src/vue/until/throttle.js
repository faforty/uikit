export default function throttle (callback, limit, ctx) {
    var wait = false;
    var args;

    return function () {

        args = arguments;
        ctx = ctx || this;

        if (!wait) {
            callback.call(ctx, args);
            wait = true;
            setTimeout(function () {
                wait = false;
            }, limit);
        }
    }
}