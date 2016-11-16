import uiSelect     from './components/ui-select'
import uiToggle     from './components/ui-toggle'
import uiInput      from './components/ui-input'
import uiInputAjax  from './components/ui-input-ajax'
import uiInputSpin  from './components/ui-input-spinner'
import uiTabs       from './components/ui-tabs'
import uiTab        from './components/ui-tab'
import uiSpinner    from './components/ui-spinner'
import uiBoxFilter  from './components/ui-box-filter'

export const components = {
    'ui-select': uiSelect,
    'ui-toggle': uiToggle,
    'ui-input': uiInput,
    'ui-input-ajax': uiInputAjax,
    'ui-input-spinner': uiInputSpin,
    'ui-tabs': uiTabs,
    'ui-tab': uiTab,
    'ui-spinner': uiSpinner,
    'ui-box-filter': uiBoxFilter
}

export const directives = {
    // uiKit,
}

export default {
    install (Vue) {
        Object.keys(components).forEach((name) => {
            console.log(name)
            Vue.component(name, components[name])
        })
        Object.keys(directives).forEach((name) => {
            Vue.directive(name, directives[name])
        })
    }
}