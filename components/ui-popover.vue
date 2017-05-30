<template>
    <div class="ui-popover-wrapper">
        <span ref="target" class="d-inline-block" @click.stop="togglePopover">
            <slot></slot>
        </span>

        <transition leave-active-class="fade-leave-active">
            <div v-if="show" ref="popover" class="ui-popover" :class="positionClass" :style="style" @click.stop>
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
        placement: {
            type:    String,
            default: 'top', // top, right, bottom, left
        },
        width: {
            type:    Number,
            default: 280
        },
        title: String
    },

    data: () => ({
        show:          false,
        autoPlacement: false,
    }),

    computed: {
        positionClass() {
            return 'ui-popover--' + (this.autoPlacement ? this.autoPlacement : this.placement);
        },
        style() {
            return {
                width: this.width + 'px',
            };
        },
        originPlacement() {
            var horizontal = false;
            var vertical   = false;

            if (this.placement) {
                var placements = this.placement.split('-');
                if (placements.length == 1) {
                    if (placements[0] === 'left' || placements[0] === 'right') {
                        horizontal = placements[0];
                    } else {
                        vertical = placements[0];
                    }
                } else {
                    vertical   = placements[0];
                    horizontal = placements[1];
                }
            }
            return {vertical, horizontal};
        },
    },

    watch: {
        active(active) {
            active ? this.showPopover() : this.hidePopover();
        },
    },

    methods: {
        togglePopover() {
            this.show ? this.hidePopover() : this.showPopover();
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
                window.removeEventListener('scroll', this.calculatePosition);
                window.removeEventListener('resize', this.calculatePosition);
                this.show = false;
            }
        },
        showPopover() {
            window.addEventListener('scroll', this.calculatePosition);
            window.addEventListener('resize', this.calculatePosition);
            this.calculatePosition();
            this.show = true;
        },
        calculatePosition() {
            var boundingRect = this.$refs.target.getBoundingClientRect();
            var vPlacement = boundingRect.top > window.innerHeight - boundingRect.bottom ? 'top' : 'bottom';
            if (window.innerWidth - boundingRect.right < this.width) {
                this.autoPlacement = vPlacement + '-left';
            } else if (this.originPlacement.vertical) {
                this.autoPlacement = vPlacement + (this.originPlacement.horizontal ? '-' + this.originPlacement.horizontal : '');
            } else {
                this.autoPlacement = false;
            }
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