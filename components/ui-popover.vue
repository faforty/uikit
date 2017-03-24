<template>
    <div class="ui-popover-wrapper">
        <span @click.stop="togglePopover" ref="target" style="display:inline-block">
            <slot></slot>
        </span>
        <transition leave-active-class="fade-leave-active">
            <div ref="popover" v-show="show" class="ui-popover" :class="'ui-popover--' + placement" :style="style" @click.stop>
                <div class="ui-popover-triangle"></div>

                <div v-if="title" class="ui-popover-title">
                    {{title}}
                </div>

                <div class="ui-popover-scroll">
                    <div class='ui-popover-content'>
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
        // custom: {
        //     type:    Boolean,
        //     default: false,
        // },
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
        },
    },

    methods: {
        togglePopover() {
            this.show = !this.show;
            if (this.show) {
                this._lock = true;
            }
            if (this.show) {
                this.$root.$emit('ui-popover:close');
            }
        },
        hidePopover() {
            if (this._lock) {
                this._lock = false;
            } else {
                this.show = false;
            }
        },
        showPopover() {
            this.show = true;
        }
    },

    mounted() {
        this.show = this.active;
        this.$root.$on('ui-popover:close', this.hidePopover);
        document.body.addEventListener('click', this.hidePopover);
    },

    beforeDestroy() {
        document.body.removeEventListener('click', this.hidePopover);
    }
}
</script>