<template>
    <div class="drop-out__result" :class="{'drop-out__result--active':active}" :disabled=disabled @mousedown.prevent="select" @click="stopForDisabled">
        <div class="drop-out__result__content">
            <div class="drop-out__result__content__title">
                <div class="option" :class="{checked: checked}">
                    <slot>{{ label }}</slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        value:    {},
        label:    {},
        active:   Boolean,
        checked:  Boolean,
        disabled: Boolean,
    },

    methods: {
        select(e) {
            if (!this.disabled) {
                this.$emit('select', this.value);
            }
        },

        stopForDisabled(e) {
            if (this.disabled) {
                e.stopPropagation();
            }
        }
    }
}
</script>