<template>
<div :class="{'ui-accordion__item': true, 'ui-accordion__item--active': show }">
    <h4 class="ui-accordion__item__head" @click="toggleContent">
        <slot name="header"></slot>
        <span :class="show ? 'down up' : 'down'"><i class="uikit-chevron-down"></i></span>
    </h4>
    <div ref="body" class="ui-accordion__item__content">
        <slot name="body"></slot>
    </div>
</div>
</template>

<script>
var Velocity = require('velocity-animate');

const VELOCITY_CONFIG = {
    duration: 350,
    easing:   'easeOutQuart',
    queue:    false,
};

export default {
    props: {
        opened: {
            type: Boolean,
            default: false,
        }
    },

    data: () => ({
        show: false
    }),

    methods: {
        toggleContent() {
            this.show ? this.hideContent() : this.showContent();
        },

        showContent() {
            this._lock = true;
            this.$parent.$emit('collapsible-item::show');
            this._lock = false;
            this.show  = true;
            Velocity(this.$refs.body, 'slideDown', VELOCITY_CONFIG);
        },

        hideContent() {
            if (this._lock) {
                return;
            }
            this.show = false;
            Velocity(this.$refs.body, 'slideUp', VELOCITY_CONFIG);
        },
    },

    mounted() {
        if (this.opened) {
            this.showContent();
        }

        this.$parent.$on('collapsible-item::show', this.hideContent);
    }
}
</script>
