<template>
    <div class="ui-toggle" :class="[statusClass, {'ui-toggle--disabled': disabled}]" @click="toggleValue">
        <span v-if="info" class="float-right ui-radio-popover" @click.stop>
            <ui-popover placement="right">
                <a class="ui-action ui-input__help__action uikit-info"></a>
                <div slot="content" v-html="info"></div>
            </ui-popover>
        </span>

        <label>
            <slot></slot>
        </label>
        <transition name="fade" mode="out-in">
            <div v-if="hint" class="ui-hint" v-html="hint"></div>
        </transition>
    </div>
</template>

<script>
import uiPopover from './ui-popover.vue';

export default{
    components: {
        uiPopover
    },

    props: {
        value: [Boolean, Number, String],
        name: {
            type: String
        },
        disabled: {
            type: Boolean
        },
        hint: String,
        info: String,

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

            var value = this.value;

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
