<template>
    <div class="form-group form-group--align" style="justify-content:flex-start">
        <div class="ui-progressbar" :class="{'ui-progressbar--complete': complete}">
            <div ref="progressbar" :style="style"></div>
        </div>

        <label>
            <slot />
        </label>
    </div>
</template>

<script>
    var progressbar = require('progressbar.js')

    export default {
         props: {
            value: {
                type:    Number,
                default: 0,
            },
            maxValue: {
                type:    Number,
                default: 1,
            },
            size: {
                type:    [Number, String],
                default: 40
            }
        },

        data: () => ({
            progressbar: null,
            options: {
                color:       null,
                trailColor:  'rgba(0,0,0,.1)',
                strokeWidth: 5,
                trailWidth:  5,

                easing:   'easeInOut',
                duration: 500,

                text: {
                    className: 'ui-progressbar-text',
                    style:     {}
                },

                from: {color: '#1ac17b', width: 5},
                to:   {color: '#1ac17b', width: 5},

                step: function(state, circle) {
                    circle.path.setAttribute('stroke',       state.color);
                    circle.path.setAttribute('stroke-width', state.width);
                }
            },
        }),

        computed: {
            style() {
                var size = parseInt(this.size) + 'px';
                return {width: size, height: size};
            },

            safeValue() {
                return Math.min(this.value*1, this.maxValue*1);
            },

            complete() {
                return  this.safeValue == this.maxValue;
            },

            progress() {
                return this.maxValue ? this.safeValue / (this.maxValue*1) : 0;
            }
        },

        watch: {
            progress(progress) {
                this.animate();
            }
        },

        methods: {
            drawProgressbar () {
                this.progressbar = new progressbar.Circle(this.$refs.progressbar, this.options);
            },
            animate() {
                this.progressbar.setText(this.safeValue + '/' + this.maxValue);
                this.progressbar.animate(this.progress);
            }
        },

        mounted () {
            this.drawProgressbar();
            this.animate();
        },

        destroyed () {
            this.progressbar.destroy()
        },
    }
</script>