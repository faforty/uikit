<template>
    <div class="ui-toggleBox">
        <input :id="id" class="ui-toggleBox__field" :name="name" type="checkbox" @change="update" :disabled="disabled">
        <label :for="id" :class="['ui-toggleBox__label', colorObject.cls, {'ui-toggleBox__label--disabled': disabled}]" :style="{color: !colorObject.cls ? colorObject.color : false}">
            <slot></slot>
        </label>
    </div>
</template>
<script>
    /**
    * name - attr name (String)
    * color - color label (String: css class - color-grey, css style - #fff)
    * disabled
    */

    export default{
        props: {
            name: {
                type: String
            },
            color: {
                type: String
            },
            disabled: {
                type: Boolean
            }
        },
        data () {
            return {
                id: '',
                colorObject: {}
            }
        },
        methods: {
            update (e) {
                this.$emit('input', e.target.checked)
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
            this.id = 'ui-toggle-' + Math.random().toString(36).substr(2, 5)
        }
    }
</script>
