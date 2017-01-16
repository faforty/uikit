import VueResource from 'vue-resource';
import Validator from 'validatorjs';

import VueEvents from './vue-events';
import untilDeclOfNum from '../until/declOfNum';

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

function useLang(lang = 'ru') {
    Validator.useLang(lang);
};

export default function plugin(Vue, { lang = 'ru' } = {}) {
    helpers();

    useLang('ru');

    Vue.useLang = useLang;
    Vue.validator = Validator;

    Vue.use(VueResource);
    Vue.use(VueEvents);
}