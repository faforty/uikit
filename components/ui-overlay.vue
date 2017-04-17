<template>
    <div class="ui-overlay" v-if="show" @click="click">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'ui-overlay',

    props: {
        show: {
            type:    Boolean,
            default: false
        }
    },

    watch: {
        show() {
            document.body.style.overflow = this.show ? 'hidden' : 'auto';
        }
    },

    methods: {
        click() {
            this.$emit('click');
        }
    }
}
</script>