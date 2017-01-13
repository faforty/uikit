import components from './components';
import plugins from './plugins';

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