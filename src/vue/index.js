"use strict";

import uiKit from './uikit'
import VueEvents from './vue-events'
import Validator from 'validatorjs';

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(uiKit)

    window.uiKit = uiKit
    window.VueEvents = VueEvents
    window.Validator = Validator
}

export default uiKit