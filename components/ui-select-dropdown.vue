<template>
    <ui-label :filled="!!value" :label-show="label">

        <template slot="label">
            <slot></slot>
        </template>

        <div class="ui-select ui-input-pos">

            <div class="inner-addon">

                <div :class="optionRowClass" @click="toggleDropdown($event, true)">
                    <span>
                        <slot v-if="value" name="selected">{{ selectedItems }}</slot>
                        <span v-else class="ui-text--gray">{{placeholder}}</span>
                    </span>

                    <span class="ui-select__selected__icon">
                        <i :class="{'uikit-chevron-down': true, rotate: show}"></i>
                    </span>
                </div>

                <div class="ui-select__options drop-out__results" style="display:block; max-height:400px; overflow-y:auto;" v-show="show">
                    <slot name="options"></slot>
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

    export default {
        components: {
            uiLabel
        },

        props: {
            hint: String,
            info: String,

            value: {
                // required: true
            },
            label: {
                type:      Boolean,
                'default': true
            },
            placeholder: {
                type:    String,
                default: 'Ничего не выбрано'
            },
            disabled: {
                type:    Boolean,
                default: false
            },
        },

        data: () => ({
            show: false,
        }),

        methods: {
            toggleDropdown: function(e, lock = false) {
                var show = this.disabled ? false : !this.show;

                if (show) {
                    this._lock = lock;
                }

                this.show = show;
            },

            hideDropdown: function() {
                if (this._lock) {
                    this._lock = false;
                } else {
                    this.show = false;
                }
            }
        },

        computed: {
            optionRowClass() {
                return {
                    'ui-select__selected': true,
                    'form-control':        true,
                    // 'ui-select__multi': this.multiple,
                    'ui-select__disabled': this.disabled
                };
            }
        },

        mounted: function () {
            document.body.addEventListener('click', this.hideDropdown);
        },

        beforeDestroy() {
            document.body.removeEventListener('click', this.hideDropdown);
        }
    }
</script>