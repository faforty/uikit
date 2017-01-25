<template>
    <div class="ui-popover-wrapper">
        <span @click.stop="togglePopover" ref="target" style="display:inline-block">
            <slot></slot>
        </span>
        <transition name="fade-enter-active" leave-active-class="fade-leave-active" mode="out-in">
            <div ref="popover" v-show="show" class="ui-popover" :class="'ui-popover--' + placement" :style="style" @click.stop>
                <div class="ui-popover-triangle"></div>

                <div v-if="title" class="ui-popover-title">
                    {{title}}
                </div>

                <div class="ui-popover-scroll">
                    <div :class="custom ? 'ui-popover-custom' : 'ui-popover-content'">
                        <slot name="content"></slot>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: {
        active: {
            type:    Boolean,
            default: false,
        },
        custom: {
            type:    Boolean,
            default: false,
        },
        placement: {
            type:    String,
            default: 'top', // top, right, bottom, left
        },
        title: String
    },

    data: () => ({
        show: false,
        style: {}
    }),

    watch: {
        active(active) {
            this.show = active;
        }
    },

    methods: {
        togglePopover() {
            this.show = !this.show;
        },
        hidePopover() {
            this.show = false;
        }
    },

    mounted() {
        this.show = this.active;

        document.body.addEventListener('click', this.hidePopover.bind(this));
    },

    beforeDestroy() {
        document.body.removeEventListener('click', this.hidePopover);
    }
}
</script>
