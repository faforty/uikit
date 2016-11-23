<template>
    <div v-bind:id="randomId" v-bind:style="Object.assign({width: size, height: size}, style)">
        <slot></slot>
    </div>
</template>

<script>
    var progressbar = require('progressbar.js')

    export default {
         props: {
            style: {
                type: Object
            },
            size: {
                type: String,
                default: '100px'
            },
             options: {
                type: Object,
                default () {
                    return {
                        color: '#000',
                        trailColor: '#d6dad9',

                        // This has to be the same size as the maximum width to
                        // prevent clipping
                        strokeWidth: 5,
                        trailWidth: 5,
                        easing: 'easeInOut',
                        duration: 1400,
                        text: {
                            autoStyleContainer: false
                        },
                        from: { color: '#1ac17b', width: 5 },
                        to: { color: '#1ac17b', width: 5 },
                        step: function(state, circle) {
                            circle.path.setAttribute('stroke', state.color);
                            circle.path.setAttribute('stroke-width', state.width);
                        }
                    }
                }
            },
            animate: {
              type: Object,
              default () {
                   return {
                        progress : 0 , //Number from 0.0 to 1.0
                   }
              }
            },
            type: {
              type: String,
              default: 'Line'
            }
        },
        data () {
            return {
                 circle: null,
            }
        },
        mounted () {
            this.drawProgressbar()
        },
        methods: {
            drawProgressbar () {

                this.circle = new progressbar.Circle(document.getElementById(this.randomId), this.options);


            }
        },


        beforeUpdate () {
            this.circle.set(this.animate.progress)
        },

        destroyed () {
            this.circle.destroy()
        },
        updated () {
            if (!this.cicle) {
              this.cicle = true

              this.circle.animate(this.animate.progress)
            }
        },

        computed: {
            animateNumber () {
                return this.animate
            },
            randomId () {
                return 'progressbar-js_' + Math.floor((1 + Math.random()) * 0x10000)
            }
        }
    }
</script>