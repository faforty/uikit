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
            value: [Boolean, Number, String],
            name: {
                type: String
            },
            disabled: {
                type: Boolean
            }
        },
        data () {
            return {
                id: '',
            }
        },
        methods: {
            update (e) {
                var value = e.target.checked;
                if (!this.isBoolean) {
                    value = value ? 1 : 0;
                }
                this.$emit('input', value)
                this.$emit('change', value)
            }
        },
        computed: {
            isBoolean () {
                return typeof(this.value) === 'boolean';
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
