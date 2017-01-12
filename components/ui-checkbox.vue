<template>
    <div class="form-group">
        <input :id="id" class="ui-checkbox" type="checkbox" :name="name" v-model="isChecked" @change="update" :disabled="disabled">
        <label class="text" :for="id">
        <slot></slot>
        </label>
    </div>
</template>
<script>
    export default{
         props: {
            value: Boolean,
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
                this.$emit('change', e.target.checked)
            }
        },
        computed: {
            colorObject () {
                var isColor  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(this.color)
                return {
                    cls: isColor ? false : this.color,
                    color: this.color
                }
            },
            isChecked () {
                return this.value
            }
        },
        mounted () {
            this.id = 'ui-checkbox-' + Math.random().toString(36).substr(2, 5)
        }
    }
</script>
