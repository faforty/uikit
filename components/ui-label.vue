<template>
    <div :class="componentClass">
        <label class='ui-label' :class="labelClass" v-show="labelShow">
            <slot name="label">{{ label }}</slot>
        </label>

        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            filled: {
                type:    Boolean,
                default: false
            },
            formGroup: {
                type:    Boolean,
                default: true
            },
            labelShow: {
                type:    Boolean,
                default: true
            },
            adaptive:   Boolean,
            label:      String,
            color:      String,
            error:      String,
            state:      String,
            labelAlign: String,
        },

        computed: {
            componentClass() {
                return [
                    this.formGroup        ? 'form-group' : null,
                    this.state == 'error' ? 'has-danger' : (this.state == 'success' ? 'has-success' : null),
                    this.labelAlign       ? 'form-group--align form-group--align--' + this.labelAlign : '',
                    this.adaptive         ? 'form-adaptive' : ''
                ];
            },
            labelClass () {
                return {'ui-text--gray': this.filled};
            }
        },
    }
</script>
