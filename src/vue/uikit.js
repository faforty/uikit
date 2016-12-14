import uiSelect     from './components/ui-select'
import uiButton     from './components/ui-button'
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
import uiInkRipple  from './components/ui-ink-ripple/ui-Ink-ripple'
import uiChip       from './components/ui-chip'
import uiGroup      from './components/ui-group'
import uiCollapsible from './components/collapsible/collapsible'
import uiCollapsibleItem from './components/collapsible/collapsible-item'
import uiRange       from './components/ui-range'
import uiPagination  from './components/ui-pagination'

import directiveInkBar from './components/ui-ink-ripple/directive'

import untilDeclOfNum from './until/declOfNum'

export const components = {
    'ui-select': uiSelect,
    'ui-button': uiButton,
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
    'ui-progress-bar': uiProgressBar,
    'ui-ink-ripple': uiInkRipple,
    'ui-chip': uiChip,
    'ui-group': uiGroup,
    'ui-collapsible': uiCollapsible,
    'ui-collapsible-item': uiCollapsibleItem,
    'ui-range': uiRange,
    'ui-pagination': uiPagination
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
    directiveInkBar,
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