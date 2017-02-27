<template>
    <div class="ui-toggleBox">
        <input :id="id" class="ui-toggleBox__field" :name="name" type="checkbox" v-model="isChecked" @change="update" :disabled="disabled">
        <label :for="id" :class="['ui-toggleBox__label', {'ui-toggleBox__label--disabled': disabled}]">
            <div><slot></slot></div>
            <transition name="fade" mode="out-in">
                <div v-if="hint" class="ui-hint" v-html="hint"></div>
            </transition>
        </label>
    </div>
</template>

<script>
    /**
    * name - attr name (String)
    * disabled
    */

    export default{
        props: {
            value: [Boolean, Number, String],
            name: {
                type: String
            },
            disabled: {
                type: Boolean
            },
            hint: String,
        },
        data () {
            return {
                id: ''
            }
        },
        methods: {
            update (e) {
                var value = e.target.checked;
                if (!this.isBoolean) {
                    value = value ? 1 : 0;
                }
                this.$emit('input',  value)
                this.$emit('change', value)
            }
        },
        computed: {
            isBoolean () {
                return typeof(this.value) === 'boolean';
            },
            isChecked () {
                return this.value;
            }
        },
        mounted () {
            this.id = 'ui-toggle-' + this._uid
        }
    }
</script>
