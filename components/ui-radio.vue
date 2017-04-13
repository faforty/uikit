<template>
    <div class="form-group">
        <span v-if="info" class="float-right ui-radio-popover" @click.stop>
            <ui-popover placement="right">
                <a class="ui-action ui-input__help__action uikit-info"></a>
                <div slot="content" v-html="info"></div>
            </ui-popover>
        </span>
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
import uiPopover from './ui-popover.vue';

export default {
    components: {
        uiPopover
    },
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
        info: String,
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