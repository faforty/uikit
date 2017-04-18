<template>
    <ui-overlay class="ui-animation-zoom enter" :show="show" @click="close">
        <div class="container">
            <div class="ui-modal" :class="modalClass" @click.stop>
                <div class="ui-modal--close" @click="close">
                    <i class="uikit-cross"></i>
                </div>

                <div class="ui-modal--body">

                    <div class="ui-modal--body--title" v-if="title || $slots.title">
                        <slot name='title'></slot>
                        {{ title }}
                    </div>

                    <slot></slot>
                </div>
            </div>
        </div>
    </ui-overlay>
</template>

<script>
    import uiOverlay from './ui-overlay.vue';

    export default {
        name: 'ui-modal',

        components: {
            uiOverlay
        },

        props: {
            title: {
                type:    [String, Boolean],
                default: false
            },
            show: {
                type:    Boolean,
                default: false
            },
            modalClass: String
        },

        methods: {
            close() {
                this.$emit('toggle');
            }
        },
    }
</script>