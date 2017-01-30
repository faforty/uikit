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
                return {
                    'form-group':               this.formGroup,
                    'has-danger':               this.state == 'error',
                    'has-success':              this.state == 'success',
                    'form-group--align':        this.labelAlign,
                    'form-group--align--right': this.labelAlign == 'right',
                    'form-adaptive':            this.adaptive
                };
            },
            labelClass () {
                return {'ui-text--gray': this.filled};
            }
        },
    }
</script>
