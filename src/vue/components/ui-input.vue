<template>
    <div :class="{ 'form-group': formGroup, 'has-danger': error || state == 'error', 'has-success': state == 'success',  'form-group--align': labelAlign, 'form-group--align--right': labelAlign == 'right', 'form-adaptive': adaptive }">
        <label :class="[colorObject.cls ]" :style="{color: !colorObject.cls ? colorObject.color : false}" v-if="label">
            <slot></slot>
        </label>
        <div class="ui-input-pos" :style="[shrink, { width: inputWidth }]">
            <div :class="['inner-addon', {'left-addon': iconAlign == 'left', 'right-addon': iconAlign == 'right' || icon, 'ui-input-group': group }]" v-show="hideField === null || hideField === true">
                <i :class="['ico', icon]" v-show="icon"></i>
                <input class="form-control" ref="input" :type="type" :name="name" :placeholder="placeholder" v-model="value" v-on:input="updateValue($event.target.value)" @blur="blurred">
                <div :class="['ui-input-group__btn', { 'ui-input-group__btn--right': groupAlign == 'right', 'ui-input-group__btn--left': groupAlign == 'left' }]" v-show="group"><div class="text-color--gray ui-input-group__btn__hight">{{ group }}</div></div>
                <div v-if="prompt">
                    <small class="form-text text-color--gray" v-html="prompt"></small>
                </div>
            </div>
            <div class="ui-input__help" v-show="info">
                <a class="ui-action ui-input__help__action uikit-info"></a>
            </div>
        </div>
    </div>
</template>
<script>
    import ValidatesInput from './../mixins/ValidatesInput'

    export default {
        props: {
            type: {
                type: String,
                default: 'text'
            },
            formGroup: {
                type: Boolean,
                'default': true
            },
            label: {
                type: Boolean,
                'default': true
            },
            hideField: {
                type: Boolean,
                'default': null
            },
            adaptive: Boolean,
            info: String,
            state: String,
            labelAlign: String,
            keyup: Boolean,
            color: String,
            name: String,
            placeholder: String,
            hint: String,
            value: {
                'default': ''
            },
            error: String,
            group: String,
            groupAlign: {
                type: String,
                'default': 'right'
            },
            icon: String,
            iconAlign: {
                type: String,
            },
            inputWidth: String,
            flexShrink: Number
        },
        watch: {
            value () {
                if (!this.dirty) {
                    this.dirty = true;
                }

                //if (!this.validateOnBlur) {
                    this.validate();
                //}
            }
        },
        methods: {
            updateValue (value) {
                value = value.trim()

                this.$emit('input', value)
                this.$emit('change', value)

                this.validationError = ''
                this.mValue = value
            },
            blurred() {
                if (!this.dirty) {
                    this.dirty = true;
                }

                this.$on('blurred');
                this.validate();

                this.error = this.validationError
            },
        },
        data: () => ({
            mValue: ''
        }),
        computed: {
            prompt () {
                let hint = this.hint

                if (typeof this.error == 'string') {
                   hint = this.error
                }

                return hint
            },
            colorObject () {
                var isColor  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(this.color)
                return {
                    cls: isColor ? false : this.color,
                    color: this.color
                }
            },
            shrink () {
                return (typeof this.flexShrink === 'number') ? { 'flex-shrink': this.flexShrink } : ''
            }
        },
        mounted () {
            if (this.mValue != this.value) {
                this.mValue = this.value
            }
        },
        mixins: [
            ValidatesInput
        ]
    }
</script>
