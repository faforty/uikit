<template>
    <div class="ui-toggle" :class="[statusClass, {'ui-toggle--disabled': disabled}]" @click="toggleValue">
        <label><slot></slot></label>
        <transition name="fade" mode="out-in">
            <div v-if="hint" class="ui-hint" v-html="hint"></div>
        </transition>
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

            // Разрешает третье положение "null"
            nullable: Boolean
        },


        data: () => ({
            isBoolean: false,
        }),

        methods: {
            toggleValue (e) {
                if (this.disabled) {
                    return;
                }

                let value = this.value;

                if (this.nullable) {
                    value = value ? null : this.makeValue(value !== null);
                } else {
                    value = this.makeValue(!value);
                }

                this.$emit('input',  value)
                this.$emit('change', value)
            },

            makeValue(value) {
                if (this.isBoolean) {
                    return value ? true : false;
                }

                return value ? 1 : 0;
            }
        },

        computed: {
            isChecked () {
                return this.value;
            },
            statusClass () {
                return this.value ? 'ui-toggle--active' : (this.nullable && this.value === null ? 'ui-toggle--null' : '');
            }
        },

        mounted() {
            this.isBoolean = typeof(this.value) === 'boolean';
        }
    }
</script>
