"use strict";

import uiKit from './uikit'
import VueEvents from './vue-events'



if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VueEvents)
    window.Vue.use(uiKit)
}

window.uiKit = uiKit
window.VueEvents = VueEvents

export {
    uiKit
}
