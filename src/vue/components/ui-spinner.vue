<template>
    <div :class="['ui-spinner', {'ui-spinner--fixed':fixed}]">
        <div class="ui-spinner__wrapper" v-show="active">
            <div :class="['loader-spinner', spinnerSize]"></div>
            <div class="ui-spinner__wrapper__text">{{text}}</div>
        </div>
        <slot></slot>
    </div>
</template>
<script>
    const MIN_WAIT = 500

    export default {
        props: {
            size: {
                type: String,
                'default': 'md'
            },
            text: {
                type: String,
                'default': ''
            },
            fixed: {
                type: Boolean,
                'default': false
            }
        },
         events: {
        },
        data: () => ({
            active: false
        }),
        computed: {
            spinnerSize () {
                return this.size ? 'ui-spinner--' + this.size : 'ui-spinner--sm'
            }
        },
        mounted () {
            this._body = document.querySelector('body')
            this._bodyOverflow = this._body.style.overflowY || ''

            this.$on('show::spinner', (options) => {
                this.show(options)
            })
            this.$on('hide::spinner', () => {
                this.hide()
            })
            this.$on('start::ajax', (options) => {
                this.show(options)
            })
            this.$on('end::ajax', () => {
                this.hide()
            })
        },
        methods: {
            getMinWait (delay) {
                delay = delay || 0
                return new Date().getTime() - this._started.getTime() < MIN_WAIT ? MIN_WAIT - parseInt(new Date().getTime() - this._started.getTime(), 10) + delay : 0 + delay
            },
            show (options) {
                if (options && options.text) {
                    this.text = options.text
                }
                if (options && options.size) {
                    this.size = options.size
                }
                if (options && options.fixed) {
                    this.fixed = options.fixed
                }

                // block scrolling when spinner is on
                if (this.fixed) {
                    this._body.style.overflowY = 'hidden'
                }

                // activate spinner
                this._started = new Date()
                this.active = true
                this.$root.$emit('shown::spinner')
            },
            hide () {
                const delay = 0

                this._spinnerAnimation = setTimeout(() => {
                    this.active = false
                    this._body.style.overflowY = this._bodyOverflow
                    this.$root.$emit('hidden::spinner')
                }, this.getMinWait(delay))
            }
        },
        beforeDestroy () {
            clearTimeout(this._spinnerAnimation)
            this._body.style.overflowY = this._bodyOverflow
        }
    }
</script>
