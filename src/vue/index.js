"use strict";

import uiKit from './uikit'

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(uiKit)
}

export default uiKit