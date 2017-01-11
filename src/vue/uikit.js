import VueResource from 'vue-resource'

import VueEvents from './vue-events'
import components from './components';
import untilDeclOfNum from './until/declOfNum';

function helpers () {
    let untils = {
        declOfNum: untilDeclOfNum
    }

    for(let i in untils) {
        if (!window[i]) {
            window[i] = untils[i]
        }
    }
}

export * from './components';

export default function plugin(Vue) {
    if (plugin.installed) return;

    helpers();
    Vue.use(VueResource);
    Vue.use(VueEvents);

    Object.keys(components).forEach(name => {
        Vue.component(name, components[name]);
    });
}