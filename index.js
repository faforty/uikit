import components from './components';
import plugins from './plugins';

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

export default function plugin(Vue, options = { lang: 'ru' }) {
    if (plugin.installed) return;

    Vue.use(plugins, options);

    Object.keys(components).forEach(name => {
        Vue.component(name, components[name]);
    });
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}