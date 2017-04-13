<template id="ui-select">
    <ui-label :filled="filled" :label-show="label">

        <template slot="label"><slot></slot></template>

        <div class="ui-select ui-input-pos">
            <div class="inner-addon">
                <div :class="{'ui-select__selected': true, 'form-control': true, 'ui-select__multi': multiple, 'ui-select__disabled': disabled }" @click="toggleDropdown($event, true)">
                    <template v-if="(search && !show) || !search">
                        <span>
                            {{ selectedItems }}
                            <span style="color: #808080" v-show="showPlaceholder">{{placeholder}}</span>
                        </span>

                        <span class="ui-select__selected__icon">
                            <i :class="{'uikit-chevron-down': true, rotate: show}"></i>
                        </span>
                    </template>
                    <div v-show="search && show" style="width: 100%">
                        <ui-input
                            ref="uiSelectSearch"
                            icon="uikit-search"
                            style="width:100%"
                            :form-group="false"
                            :label="false"
                            @click.native.stop
                            @blur="hideDropdown"
                            v-model="searchText"
                        />
                    </div>
                </div>

                <div class="ui-select__options drop-out__results" style="display:block; max-height:400px; overflow-y:auto;" v-show="show" @click.stop>
                    <a v-if="Object.keys(results).length == 0" class="drop-out__result" v-for="(option, key) in options" @mousedown="select(key)">
                        <div class="drop-out__result__content">
                            <div class="drop-out__result__content__title">
                                <div :class="{option: true, checked: isSelected(key)}" :id="key">{{ option }}</div>
                            </div>
                        </div>
                    </a>
                    <a v-if="Object.keys(results).length" class="drop-out__result" v-for="(option, key) in results" @mousedown="select(key)">
                        <div class="drop-out__result__content">
                            <div class="drop-out__result__content__title">
                                <div :class="{option: true, checked: isSelected(key)}" :id="key">{{ option }}</div>
                            </div>
                        </div>
                    </a>
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

    export default {
        components: {
            uiLabel,
            uiInput,
            uiPopover
        },
        props: {
            options:      {},
            optionsRules: Object,
            search:       Boolean,
            autoselect:   Boolean,
            hint:         String,
            info:         String,

            value: {
                type: [Array, String, Number],
                default: []
            },
            label: {
                type:      Boolean,
                'default': true
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
            }
        },
        data: function () {
            return {
                show: false,
                searchText: '',
                results: {},
                // selectId: [],
                // filled: false
            };
        },
        watch: {
            options(options) {
                this.tryAutoselect();
            },

            searchText (value) {
                this.$emit('input-value', value);

                if (value && this.search) {
                    this.results = {};

                    for (var item in this.options) {
                        if (this.options[item].toString().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                            this.results[item] = this.options[item]
                        }
                    }
                }
            }
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
                        // this.filled = true
                    } else {
                        this.$emit('input', this.resultAsArray ? [v] : v);
                        this.$emit('change', this.resultAsArray ? [v] : v)
                        // this.filled = true
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
                if (this._lock) {
                    this._lock = false;
                } else {
                    this.show = false;
                }
            },
        },
        computed: {
            filled() {
                return this.selectId.length > 0;
            },
            selectId() {
                return typeof this.value === 'object' ? this.value : [this.value];
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
                this.searchText = this.selectedItems
                return this.selectId.length === 0;
            },
            resultAsArray() {
                return Array.isArray(this.value) || this.value === null;
            }
        },

        mounted: function () {
            this.searchText = this.selectedItems
            this.tryAutoselect();

            document.body.addEventListener('click', this.hideDropdown);
        },
        beforeDestroy() {
            document.body.removeEventListener('click', this.hideDropdown);
        }
    }
</script>
