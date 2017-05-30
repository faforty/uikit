<template id="ui-select">

    <ui-label :filled="filled" :label-show="label" :state="state">
        <template slot="label"><slot></slot></template>

        <div class="ui-select ui-input-pos">
            <div class="inner-addon">

                <div :class="{'ui-select__selected': true, 'form-control': true, 'ui-select__multi': multiple, 'ui-select__disabled': disabled }" @click="toggleDropdown($event, true)">
                    <template v-if="(search && !show) || !search">
                        <span style="color:#808080" v-if="showPlaceholder">{{ placeholder }}</span>
                        <span v-else>{{ selectedItems }}</span>

                        <span class="ui-select__selected__icon">
                            <i :class="{'uikit-chevron-down': true, rotate: show}"></i>
                        </span>
                    </template>

                    <!-- Search field -->
                    <ui-input
                        v-show="search && show"
                        class='ui-select__search'
                        ref="uiSelectSearch"
                        icon="uikit-search"
                        :form-group="false"
                        :label="false"
                        v-model="searchText"
                        @click.native.stop
                        @blur="hideDropdown"
                        @input="inputSearch"
                        @keydown="keydown"
                    />
                </div>

                <!-- Html select -->
                <div v-if="!isMobile" class="ui-select__options drop-out__results" style="display:block; max-height:400px; overflow-y:auto;" v-show="show" @click.stop>
                    <ui-select-option class='ui-select--optional' key="ui-optional" v-if="showOptional" @select="resetValue" @click.stop>
                        <i class="uikit-cross float-right"></i>
                        {{optionalLabel}}
                    </ui-select-option>
                    <ui-select-option key="ui-notFound" v-if="isNotFound" :label="notFoundMessage" @click.stop disabled></ui-select-option>
                    <ui-select-option :key="optionId(option)" v-for="(option, index) in filteredOptions" :label="optionLabel(option)" :checked="isSelected(option)" :active="isActive(index)" @select="select(option)"></ui-select-option>
                </div>

                <!-- Native (mobile) select -->
                <template v-if="isMobile">
                    <select v-if="multiple" v-model="nativeValue" :disabled="disabled" multiple>
                        <option v-for="(option, index) in filteredOptions" :key="index" :value="optionId(option)" >{{ optionLabel(option) }}</option>
                    </select>
                    <select v-else v-model="nativeValue" :disabled="disabled">
                        <option v-if="showOptional" :value="null">{{optionalLabel}}</option>
                        <option v-for="(option, index) in filteredOptions" :key="index" :value="optionId(option)" >{{ optionLabel(option) }}</option>
                    </select>
                </template>
            </div>

            <!-- Help button (i) -->
            <div class="ui-input__help" v-if="info">
                <ui-popover placement="right">
                    <a class="ui-action ui-input__help__action uikit-info"></a>
                    <div slot="content">{{info}}</div>
                </ui-popover>
            </div>

        </div>

        <!-- Hint text -->
        <transition name="fade" mode="out-in">
            <div v-if="hint" class="ui-hint" v-html="hint"></div>
        </transition>

    </ui-label>
</template>

<script>
    import isMobile from '../utils/isMobile.js';
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
                default: () => []
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
            /**
             * Close after select option
             * only works when multiple is false
             */
            closeonselect: {
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
            notFoundMessage: {
                type:    String,
                default: 'Ничего не найдено'
            },
            optionsIdKey: {
                type:    String,
                default: 'id'
            },
            optionsLabelKey: {
                type:    String,
                default: 'name'
            }
        },

        data: () => ({
            show:        false,
            searchText:  '',
            activeIndex: -1,
            isMobile:    isMobile(),
        }),

        watch: {
            /**
             * Trying autoselect when options loading after mounted
             */
            options(options) {
                this.tryAutoselect();
            },
        },

        methods: {
            nativeChange(e) {
                console.log('e => ', e);
            },

            isSelected(option) {
                return this.selectId.indexOf( this.optionId(option) ) > -1;
            },

            isActive(index) {
                return this.activeIndex === index;
            },

            select(option) {
                var value;
                var key        = this.optionId(option);
                var isSelected = this.isSelected(option);

                if (this.multiple) {
                    value = [...this.value];
                    isSelected ? value.splice(value.indexOf(key), 1) : value.push(key);
                } else {
                    if (!isSelected) {
                        value = this.makeValue(key);
                    }
                }

                this.emitValue(value);

                if (this.closeonselect && !this.multiple) {
                    this.hideDropdown();
                }
            },

            emitValue(value) {
                if (value !== undefined) {
                    this.$emit('input', value);
                    this.$emit('change', value);
                }
            },

            resetValue() {
                var emptyValue = this.makeValue(null);
                this.emitValue(emptyValue);
                this.hideDropdown();
            },

            makeValue(value) {
                if (value === null) {
                    return this.resultAsArray ? [] : null;
                }
                return this.resultAsArray ? [value] : value;
            },

            tryAutoselect() {
                if (this.autoselect && this.selectId.length === 0 && this.optionsArray.length) {
                    this.select(this.optionsArray[0]);
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
                this.searchText  = '';
                this.activeIndex = -1;

                if (this._lock) {
                    this._lock = false;
                } else {
                    this.show = false;
                }
            },

            inputSearch(value) {
                this.activeIndex = -1;
                this.$emit('input-value', value);
            },

            keydown(e) {
                var {keyCode} = e;

                if (this.filteredOptions.length === 0) {
                    return;
                }

                var activateByOffset = (offset) => {
                    var index        = this.activeIndex + offset;
                    var listLength   = this.filteredOptions.length - 1;
                    this.activeIndex = index > listLength ? 0 : index < 0 ? listLength : index;
                }

                switch (keyCode) {
                    case 40: //down
                        activateByOffset(+1);
                        e.preventDefault();
                        break;
                    case 38: //up
                        activateByOffset(-1);
                        e.preventDefault();
                        break;
                    case 13: //enter
                        if (this.activeIndex > -1) {
                            this.select( this.filteredOptions[this.activeIndex] );
                            e.preventDefault();
                        }
                        break;
                    case 27: //esc
                        this.hideDropdown();
                        break;
                }
            },

            optionLabel(option) {
                return option[this.optionsLabelKey];
            },

            optionId(option) {
                return option[this.optionsIdKey];
            }
        },

        computed: {
            filteredOptions() {
                return this.searchText ? this.foundOptions : this.optionsArray;
            },

            /**
             * Опции всегда хранятся как массив
             * @return {Array}
             */
            optionsArray() {
                if (Array.isArray(this.options)) {
                    return [...this.options];
                }
                var options = [];
                for (var key in this.options) {
                    options.push({id: key, name: this.options[key]});
                }

                return options;
            },

            foundOptions() {
                var result = [];

                if (this.searchText && this.search) {
                    var searchTextLower = this.searchText.toLowerCase();
                    for (var i = 0; i < this.optionsArray.length; i++) {
                        var option = this.optionsArray[i]

                        if (this.optionLabel(option).toLowerCase().indexOf(searchTextLower) >= 0) {
                            result.push(option)
                        }
                    }
                }

                return result;
            },

            isNotFound() {
                return this.searchText && Object.keys(this.foundOptions).length === 0;
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
                for (var j = 0; j < this.optionsArray.length; j++) {
                    var option   = this.optionsArray[j]
                    var optionId = this.optionId(option);

                    for (var i=0; i<this.selectId.length; i++) {
                        if (optionId == this.selectId[i]) {
                            foundItems.push( this.optionLabel(option) );
                            break;
                        }
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
            },

            showOptional() {
                return !this.multiple && (this.optional || this.optional === "");
            },

            withNative() {
                return !this.search;
            },

            nativeValue: {
                get() {
                    return this.selectId;
                },
                set(value) {
                    if (!this.multiple && value) {
                        value = this.makeValue(value);
                    }
                    this.emitValue(value);
                }
            },
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