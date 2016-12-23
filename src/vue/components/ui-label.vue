<template>
    <div :class="{ 'form-group': formGroup, 'has-danger': error || state == 'error', 'has-success': state == 'success',  'form-group--align': labelAlign, 'form-group--align--right': labelAlign == 'right', 'form-adaptive': adaptive }">
        <label :class="[colorObject.cls ]" :style="{color: !colorObject.cls ? colorObject.color : false}" v-show="labelShow">{{ label }}</label>
        <slot></slot>
    </div>
</template>
<script>
    export default {
        props: {
            filled: {
                type: Boolean,
                'default': false
            },
            formGroup: {
                type: Boolean,
                'default': true
            },
            labelShow: {
                type: Boolean,
                'default': true
            },
            adaptive: Boolean,
            label: String,
            color: String,
            error: String,
            state: String,
            labelAlign: String,
        },
        watch: {
            filled () {
                this.filling()
            }
        },
        methods: {
            filling () {
                if (this.filled) {
                    this.colorObject.cls = false
                    this.colorObject.color = '#989898'
                } else {
                    this.colorObject.color = '#000'
                }
            }
        },
        computed: {
            colorObject () {
                var isColor  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(this.color)
                return {
                    cls: isColor ? false : this.color,
                    color: this.color
                }
            }
        },
        mounted () {
            this.filling()
        }
    }
</script>
