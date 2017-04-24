<template id="ui-select">
    <ui-label :filled="filled" :label-show="label" :state="state">

        <template slot="label"><slot></slot></template>

        <div class="ui-select ui-input-pos">
            <div class="inner-addon">
                <div :class="{'ui-select__selected': true, 'form-control': true, 'ui-select__multi': multiple, 'ui-select__disabled': disabled }" @click="toggleDropdown($event, true)">
                    <template v-if="(search && !show) || !search">
                        <span>
                            {{ selectedItems }}
                            <span style="color:#808080" v-show="showPlaceholder">{{placeholder}}</span>
                        </span>

                        <span class="ui-select__selected__icon">
                            <i :class="{'uikit-chevron-down': true, rotate: show}"></i>
                        </span>
                    </template>
                    <div v-show="search && show" style="width:100%">
                        <ui-input
                            ref="uiSelectSearch"
                            icon="uikit-search"
                            style="width:100%"
                            :form-group="false"
                            :label="false"
                            @click.native.stop
                            @blur="hideDropdown"
                            @input="inputSearch"
                            v-model="searchText"
                        />
                    </div>
                </div>

                <div class="ui-select__options drop-out__results" style="display:block; max-height:400px; overflow-y:auto;" v-show="show" @click.stop>

                    <ui-select-option v-if="optional && !multiple" :label="optionalLabel" @select="resetValue" @click.stop></ui-select-option>

                    <ui-select-option v-for="(option, key) in filteredOptions" :label="option" :checked="isSelected(key)" @select="select(key)"></ui-select-option>

                </div>
            </div>

            <div class="ui-input__help" v-if="info">
                <ui-popover placement="right">
                    <a class="ui-action ui-input__help__action uikit-info"></a>
                    <div slot="content">{{info}}</div>
                </ui-popover>
            </div>

        </div>

        <transition name="fade" mode="out-in">
            <div v-if="hint" class="ui-hint" v-html="hint"></div>
        </transition>

    </ui-label>
</template>

<script>
    import uiLabel from './ui-label.vue';
    import uiInput from './ui-input.vue';
    import uiPopover from './ui-popover.vue';
    import uiSelectOption from './ui-select-option.vue';

    export default {
        components: {
            uiLabel,
            uiInput,
            uiPopover,
            uiSelectOption
        },
        props: {
            options:      {},
            optionsRules: Object,
            search:       Boolean,
            autoselect:   Boolean,
            hint:         String,
            info:         String,
            state:        String,
            value: {
                type: [Array, String, Number],
                default: []
            },
            optional: {
                type:    [Boolean, String],
                default: false
            },
            label: {
                type:    Boolean,
                default: true
            },
            placeholder: {
                type: String,
                default: 'Ничего не выбрано'
            },
            multiple: {
                type: Boolean,
                default: false
            },
            closeonselect: { // only works when multiple==false
                type: Boolean,
                default: true
            },
            disabled: {
                type: Boolean,
                default: false
            },
            limit: {
                type: Number,
                default: 1024
            },
        },

        data: () => ({
            show:       false,
            searchText: '',
        }),

        watch: {
            options(options) {
                this.tryAutoselect();
            },
        },

        methods: {
            isSelected (v) {
                return this.selectId.indexOf(v) > -1;
            },

            select (v) {
                if (this.selectId.indexOf(v) === -1) {
                    if (this.multiple) {
                        var m = [].concat(this.value);
                        m.push(v);
                        this.$emit('input', m);
                        this.$emit('change', m)
                    } else {
                        var value = this.makeValue(v);
                        this.$emit('input', value);
                        this.$emit('change', value)
                    }
                } else {
                    if (this.multiple) {
                        var _m = [ ...this.value];
                        _m.splice(_m.indexOf(v), 1);

                        this.$emit('input', _m);
                        this.$emit('change', _m);
                    }
                }

                if (this.closeonselect && !this.multiple) {
                    this.hideDropdown();
                }
            },

            resetValue () {
                var emptyValue = this.makeValue();
                this.$emit('input',  emptyValue);
                this.$emit('change', emptyValue);
                this.hideDropdown();
            },

            makeValue(value) {
                if (value === null) {
                    return this.resultAsArray ? [] : null;
                }
                return this.resultAsArray ? [value] : value;
            },

            selectFirstItem() {
                if (this.options) {
                    for (var k in this.options) {
                        this.select(k);
                        break;
                    }
                }
            },

            tryAutoselect() {
                if (this.autoselect && this.selectId.length === 0) {
                    this.selectFirstItem();
                }
            },

            toggleDropdown(e, lock = false) {
                var show = this.disabled ? false : !this.show;

                if (show) {
                    this._lock = lock;
                }

                this.show = show;

                if (this.search && this.show) {
                    this.$refs.uiSelectSearch.focus()
                }
            },

            hideDropdown() {
                this.searchText = '';
                if (this._lock) {
                    this._lock = false;
                } else {
                    this.show = false;
                }
            },

            inputSearch(value) {
                this.$emit('input-value', value);
            },
        },
        computed: {
            filteredOptions() {
                return this.searchText ? this.foundOptions : this.options;
            },
            foundOptions() {
                var result = {};

                if (this.searchText && this.search) {
                    var searchTextLower = this.searchText.toLowerCase();
                    for (var item in this.options) {
                        if (this.options[item].toString().toLowerCase().indexOf(searchTextLower) >= 0) {
                            result[item] = this.options[item]
                        }
                    }
                }

                return result;
            },
            filled() {
                return this.selectId.length > 0;
            },
            selectId() {
                return typeof this.value === 'object' ? (this.value ? this.value : '') : [this.value];
            },
            selectedItems() {
                if ( ! this.selectId.length) {
                    return '';
                }

                var foundItems = [];
                for (var i=0; i<this.selectId.length; i++) {
                    var selectId = this.selectId[i];
                    if (this.options[selectId]) {
                        foundItems.push(this.options[selectId]);
                    } else {
                        console.warn('ui-select: element "' + selectId + '" not found in options');
                    }
                }

                return foundItems.join(', ');
            },
            showPlaceholder() {
                return this.selectId.length === 0;
            },
            resultAsArray() {
                return Array.isArray(this.value);
            },
            optionalLabel() {
                return typeof(this.optional) === 'boolean' || !this.optional
                    ? this.placeholder
                    : this.optional;
            }
        },

        mounted: function () {
            this.tryAutoselect();

            document.body.addEventListener('click', this.hideDropdown);
        },
        beforeDestroy() {
            document.body.removeEventListener('click', this.hideDropdown);
        }
    }
</script>
