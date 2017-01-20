<template>
<div :class="{ 'ui-accordion__item': true, 'ui-accordion__item--active': show }">
    <h4 class="ui-accordion__item__head" @click="toggle">
            <slot name="header"></slot>
            <span :class="['down', { up: show }]"><i class="uikit-chevron-down"></i></span>
        </h4>
    <div ref="body" class="ui-accordion__item__content">
        <slot name="body"></slot>
    </div>
</div>
</template>

<script>
var Velocity = require('velocity-animate')

export default {
    props: {
        opened: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            show: false
        }
    },
    computed: {
        id() {
            return this._uid
        }
    },
    methods: {
        openThis(immediately = false) {
            if (!this.active) {
                this.active = true;
                if (immediately) {
                    this.show = false
                } else {
                    this.show = true
                    this.$nextTick(() => {
                        Velocity(this.$refs.body, 'slideDown', this._slideConfig());
                    });
                }
            }
        },
        open(id, expendable) {
            if (id === null || typeof id == "undefined") {
                this.openThis(true); // bulk open
            } else {
                if (id == this.id) {
                    this.openThis();
                } else {
                    if (!expendable) {
                        this.closeThis();
                    }
                }
            }
        },
        closeThis(immediately = false) {
            if (this.active) {
                this.active = false;
                if (immediately) {
                    this.$els.body.style.height = '';
                } else {
                    this.show = false
                    this.$nextTick(() => {
                        // this.$els.body.style.display = 'block';
                        Velocity(this.$refs.body, 'slideUp', this._slideConfig());
                    })
                }
            }
        },
        close(id) {
            if (id === null || typeof id == "undefined") {
                this.closeThis(true); // bulk close
            } else {
                if (id == this.id) {
                    this.closeThis();
                }
            }
        },
        toggle() {
            if (this.active) {
                this.$parent.close(this.id);
            } else {
                this.$parent.open(this.id);
            }
        },
        _slideConfig() {
            return {
                duration: 350,
                easing: "easeOutQuart",
                queue: false,
                complete: () => {
                    this.$refs.body.style.height = '';
                }
            }
        }
    },
    mounted() {
        this.$root.$on('collapsible-item::open', (id, expendable) => {
            this.open(id, expendable)
        })
        this.$root.$on('collapsible-item::close', id => {
            return this.close(id)
        })

        if (this.opened) {
            this.openThis(false)
        }
    }
}
</script>
