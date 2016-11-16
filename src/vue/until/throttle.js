export default function throttle(fn, timeout, ctx) {
    var timer, args, needInvoke;

    return function () {

        args = arguments;
        needInvoke = true;
        ctx = ctx || this;

        if (!timer) {
            (function () {
                if (needInvoke) {
                    fn.apply(ctx, args);
                    needInvoke = false;
                    timer = setTimeout(arguments.callee, timeout);
                }
                else {
                    timer = null;
                }
            })();
        }
    }
};