<template>
    <div class="form-group">
        <input :id="id" :name="name" :checked="isChecked" @change="update" :disabled="disabled" class="ui-radio" type="radio">
        <label :for="id" class="text">
            <slot />
        </label>
        <transition name="fade" mode="out-in">
            <div v-if="hint" class="ui-hint" v-html="hint"></div>
        </transition>
    </div>
</template>

<script>
    export default{
         props: {
            value: {
                type:    [Number, String],
                default: ''
            },
            valueData: {
                type:    [Number, String],
                default: true
            },
            name: {
                type: String
            },
            color: {
                type: String
            },
            disabled: {
                type: Boolean
            },
            hint: String,
        },

        methods: {
            update (e) {
                this.$emit('input',  this.valueData)
                this.$emit('change', this.valueData)
            }
        },

        computed: {
            id () {
                return '_ui_radio_' + Math.random().toString(36).substr(2, 5);
            },
            isChecked () {
                return this.value == this.valueData
            },
        }
    }
</script>
