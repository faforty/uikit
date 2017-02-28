<template>
    <div class="ui-toggleBox">
        <!-- <input :id="id" class="ui-toggleBox__field" :name="name" type="checkbox" v-model="isChecked" @change="update" :disabled="disabled"> -->
        <label class="ui-toggleBox__label" :class="[statusClass, {'ui-toggleBox__label--disabled': disabled}]" @click="toggleValue">
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
            nullable: Boolean
        },
        methods: {
            toggleValue (e) {
                if (this.disabled) {
                    return;
                }
                var value = this.value;

                if (this.nullable && value === null) {
                    value = this.isBoolean ? false : 0;
                } else if (value === true || value === 1 || value === '1') {
                    value = this.nullable ? null : (this.isBoolean ? false : 0);
                } else {
                    value = this.isBoolean ? true : 1;
                }

                this.$emit('input',  value)
                this.$emit('change', value)
            }
        },
        data: () => ({
            isBoolean: false,
        }),
        computed: {
            isChecked () {
                return this.value;
            },
            statusClass () {
                return this.value ? 'ui-toggleBox__label--active' : (this.nullable && this.value === null ? 'ui-toggleBox__label--default' : '');
            }
        },

        mounted() {
            this.isBoolean = typeof(this.value) === 'boolean';
        }
    }
</script>
