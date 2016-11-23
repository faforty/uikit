<template>
    <div :class="{ 'has-danger': error }">
        <label :class="[colorObject.cls]" :style="{color: !colorObject.cls ? colorObject.color : false}">
            <slot></slot>
        </label>
        <div :class="['inner-addon', {'left-addon': iconAlign == 'left', 'right-addon': iconAlign == 'right'}]">
            <i :class="['ico', icon]"></i>
            <input class="form-control" ref="input" :type="type" :name="name" :placeholder="placeholder" :value="value" v-on:input="updateValue($event.target.value)">
        </div>
        <div v-if="prompt">
            <small class="form-text text-color--gray" v-html="prompt"></small>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            type: {
                type: String,
                default: 'text'
            },
            keyup: Boolean,
            color: String,
            name: String,
            placeholder: String,
            hint: String,
            value: String,
            error: String,
            icon: String,
            iconAlign: {
                type: String,
                'default': 'right'
            }
        },
        methods: {
            updateValue (value) {
                value = value.trim()

                this.$emit('input', value)
                this.$emit('change', value)
            },
        },
        computed: {
            prompt () {
                let hint = this.hint

                if (typeof this.error == 'string') {
                   hint = `<span style="color: red">${this.error}</span>`
                }

                return hint
            },
            colorObject () {
                var isColor  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(this.color)
                return {
                    cls: isColor ? false : this.color,
                    color: this.color
                }
            }
        }
    }
</script>
