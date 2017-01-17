<template>
    <div class="form-group form-group--align" style="justify-content:flex-start">
        <div class="ui-progressbar">
            <div ref="progressbar" :style="style"></div>
        </div>
        <label><slot></slot></label>
    </div>
</template>

<script>
    var progressbar = require('progressbar.js')

    export default {
         props: {
            value:    Number,
            maxValue: {
                type:    Number,
                default: 1,
            },
            size: {
                type:    Number,
                default: 40
            }
        },

        data: () => ({
            progressbar: null,
            options: {
                color:       '#989898',
                trailColor:  '#d6dad9',
                strokeWidth: 5,
                trailWidth:  5,

                easing:   'easeInOut',
                duration: 500,

                // text: {
                //     autoStyleContainer: false
                // },

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
                var size = this.size + 'px';
                return {width: size, height: size};
            },

            progress() {
                return this.maxValue ? this.value / this.maxValue : 0;
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
                this.progressbar.setText(this.value + '/' + this.maxValue);
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