<template>
    <ui-label :filled="filled" :form-group="formGroup" :label-show="label" :label-align="labelAlign" :state="fieldState" :class="{'ui--disabled':disabled}">

        <template slot="label"><slot></slot></template>

        <div>
            <div class="ui-input-pos" :style="[shrink, { width: inputWidth }]">
                <div :class="['inner-addon', {'left-addon': iconAlign == 'left', 'right-addon': iconAlign == 'right' || icon, 'ui-input-group': group }]" v-show="showField">
                    <i :class="['ico', icon]" v-show="icon"></i>
                    <input class="form-control" ref="input"
                        :autocomplete="autocomplete"
                        :type="type"
                        :name="name"
                        :placeholder="placeholder"
                        :disabled="disabled"
                        :value="value"
                        :size="inputSize"
                        @input="updateValue"
                        @change="updateValue"
                        @keydown="onKeydown"
                        @blur="blurred"
                        @focus="onFocus"
                    >
                    <div :class="`ui-input-group__btn ui-input-group__btn--${groupAlign}`" v-show="group">
                        <div class="text-color--gray ui-input-group__btn__hight">{{ group }}</div>
                    </div>
                </div>

                <div v-if="$slots.past" class="ui-input-after">
                    <slot name="past" />
                </div>

                <div class="ui-input__help" v-if="info">
                    <ui-popover placement="right">
                        <a class="ui-action ui-input__help__action uikit-info"></a>
                        <div slot="content">{{info}}</div>
                    </ui-popover>
                </div>
            </div>

            <div v-if="$slots.dropdown">
                <slot name="dropdown" />
            </div>

            <transition name="fade" mode="out-in">
                <div v-if="prompt && showField" class="ui-hint" v-html="prompt"></div>
            </transition>

        </div>

    </ui-label>
</template>

<script>
    import ValidatesInput from './../mixins/ValidatesInput';
    import uiLabel from './ui-label.vue';
    import uiPopover from './ui-popover.vue';

    export default {
        components: {
            uiLabel,
            uiPopover
        },
        props: {
            autocomplete: {
                type: String,
                default: 'on'
            },
            type: {
                type:    String,
                default: 'text'
            },
            formGroup: {
                type:      Boolean,
                default: true
            },
            label: {
                type:      Boolean,
                default: true
            },
            hideField: {
                type:      Boolean,
                default: null
            },
            adaptive:    Boolean,
            info:        String,
            state:       String,
            labelAlign:  String,
            keyup:       Boolean,
            name:        String,
            placeholder: String,
            hint:        String,
            value:       {
                default: null
            },
            error: String,
            group: String,
            groupAlign: {
                type:      String,
                default: 'right'
            },
            icon:       String,
            iconAlign:  String,
            inputWidth: String,
            flexShrink: Number,
            disabled:   Boolean,
            autofocus:  Boolean,
            formatValue: {
                type: Function,
                default: value => value.trim()
            },
            size: {
                type: [Number, String]
            },
            maxSize: {
                type: [Number, String]
            },
            returnEvent: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            updateValue(event) {
                if (this.returnEvent) {
                    this.$emit(event.type, event);

                    return;
                }

                var value = this.formatValue(event.target.value);

                this.$emit('input', value);
                this.$emit('change', value);

                this.validationError = '';
            },

            onKeydown(e) {
                this.$emit('keydown', e);
            },

            onFocus(e) {
                this.$emit('focus', e);
            },

            blurred(e) {
                this.$emit('blur', e);
                this.$on('blurred');


                setTimeout(() => {
                    this.validate();
                }, 100)
            },

            focus() {
                this.$nextTick(() => {
                    this.$refs.input.focus();
                });
            }
        },

        computed: {
            filled () {
                return !!this.value;
            },

            fieldState () {
                return this.validationError ? 'error' : this.state;
            },

            prompt () {
                var hint = this.hint;

                if (this.validationError)
                    hint = this.validationError;
                else if (typeof this.error == 'string')
                   hint = this.error;

                return hint;
            },

            shrink () {
                return (typeof this.flexShrink === 'number') ? { 'flex-shrink': this.flexShrink } : '';
            },

            inputSize() {
                if (this.maxSize) {
                    var valueLength = this.value ? String(this.value).length + 1 : 0;
                    return Math.min(Math.max(this.size, valueLength), this.maxSize);
                }
                return this.size;
            },

            showField() {
                return this.hideField === null || this.hideField === true;
            }
        },

        mounted () {
            if (this.autofocus)
                this.focus();

            if (this.value)
                this.validate();
        },
        mixins: [
            ValidatesInput
        ]
    }
</script>