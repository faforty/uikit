<template>
    <div class="drop-out__result" @mousedown.prevent="select">
        <div class="drop-out__result__content">
            <div class="drop-out__result__content__title">
                <div class='option' :class="{сhecked: true}">
                    <slot>{{ label }}</slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            required: true
        },
        label: {},
    },

    methods: {
        select() {
            this.$emit('select', this.value);
        }
    }
}
</script>