<template>
    <ui-label :filled="filled" :form-group="formGroup" :label-show="label" :label-align="labelAlign" :state="fieldState" :class="{'ui--disabled':disabled}">

        <template slot="label"><slot></slot></template>

        <div>
            <div class="ui-input-pos" :style="[shrink, { width: inputWidth }]">
                <div :class="['inner-addon', {'left-addon': iconAlign == 'left', 'right-addon': iconAlign == 'right' || icon, 'ui-input-group': group }]" v-show="hideField === null || hideField === true">
                    <i :class="['ico', icon]" v-show="icon"></i>
                    <input class="form-control" ref="input"
                        :autocomplete="autocomplete"
                        :type="type"
                        :name="name"
                        :placeholder="placeholder"
                        :disabled="disabled"
                        :value="mValue"
                        :size="size"
                        @input="updateValue"
                        @change="updateValue"
                        @keydown="onKeydown"
                        @blur="blurred"
                        @focus="onFocus"
                    >
                    <div :class="['ui-input-group__btn', { 'ui-input-group__btn--right': groupAlign == 'right', 'ui-input-group__btn--left': groupAlign == 'left' }]" v-show="group"><div class="text-color--gray ui-input-group__btn__hight">{{ group }}</div></div>

                </div>

                <div class="ui-input__help" v-if="info">
                    <ui-popover placement="right">
                        <a class="ui-action ui-input__help__action uikit-info"></a>
                        <div slot="content">{{info}}</div>
                    </ui-popover>
                </div>
            </div>

            <transition name="slide" mode="out-in">
                <div v-if="prompt" class="ui-hint" v-html="prompt"></div>
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
                'default': true
            },
            label: {
                type:      Boolean,
                'default': true
            },
            hideField: {
                type:      Boolean,
                'default': null
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
                default: ''
            },
            error: String,
            group: String,
            groupAlign: {
                type:      String,
                'default': 'right'
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
            returnEvent: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            updateValue (event) {
                if (this.returnEvent) {
                    this.$emit('input', event);
                    this.$emit('change', event);

                    return;
                }

                var value = event.target.value;

                value = this.formatValue(value);

                this.$emit('input', value)
                this.$emit('change', value)


                this.validationError = ''
                this.mValue          = value
            },
            onKeydown(e) {
                this.$emit('keydown', e);
            },
            onFocus() {
                this.$emit('focus');
            },
            blurred(e) {
                this.$emit('blur', e);
                this.$on('blurred');


                setTimeout(() => {
                    this.validate()
                }, 100)
            },
            focus() {
                this.$nextTick(() => {
                    this.$refs.input.focus()
                })
            }
        },

        data: () => ({
            mValue:    '',
            labelText: '',
        }),

        watch: {
            value(val) {
                this.mValue = val;
            }
        },

        computed: {
            filled () {
                return !!this.mValue
            },
            fieldState () {
                return this.validationError ? 'error' : this.state;
            },
            prompt () {
                let hint = this.hint

                if (this.validationError) {
                    hint = this.validationError
                } else if (typeof this.error == 'string') {
                   hint = this.error
                }

                return hint
            },
            shrink () {
                return (typeof this.flexShrink === 'number') ? { 'flex-shrink': this.flexShrink } : ''
            },
        },

        mounted () {
            if (this.value != this.mValue) {
                this.mValue = this.value;
            }

            if (this.autofocus) {
                this.focus();
            }

            if (this.mValue) {
                this.validate();
            }
        },
        mixins: [
            ValidatesInput
        ]
    }
</script>