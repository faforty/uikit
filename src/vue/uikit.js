import uiSelect     from './components/ui-select'
import uiToggle     from './components/ui-toggle'
import uiInput      from './components/ui-input'
import uiInputAjax  from './components/ui-input-ajax'
import uiInputSpin  from './components/ui-input-spinner'
import uiTabs       from './components/ui-tabs'
import uiTab        from './components/ui-tab'
import uiDropdown   from './components/ui-dropdown'
import uiSpinner    from './components/ui-spinner'
import uiPopup      from './components/ui-popup'
import uiBoxFilter  from './components/ui-box-filter'
import uiDatepicker  from './components/ui-datepicker'
import uiProgressBar from './components/ui-progress-bar'

import untilDeclOfNum from './until/declOfNum'

export const components = {
    'ui-select': uiSelect,
    'ui-toggle': uiToggle,
    'ui-input': uiInput,
    'ui-input-ajax': uiInputAjax,
    'ui-input-spinner': uiInputSpin,
    'ui-tabs': uiTabs,
    'ui-tab': uiTab,
    'ui-spinner': uiSpinner,
    'ui-box-filter': uiBoxFilter,
    'ui-popup': uiPopup,
    'ui-dropdown': uiDropdown,
    'ui-datepicker': uiDatepicker,
    'ui-progress-bar': uiProgressBar
}

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

export const directives = {
    // uiKit,
}

export default {
    install (Vue) {
        helpers()

        Object.keys(components).forEach((name) => {
            console.log(name)
            Vue.component(name, components[name])
        })
        Object.keys(directives).forEach((name) => {
            Vue.directive(name, directives[name])
        })
    }
}