<template>
    <div class="ui-input-group">
        <span class="ui-input-group__btn ui-input-group__btn--left">
            <a @click="down" v-on:mousedown="downLong('down')" v-on:mouseup="upLong()">
                <i class="uikit-minus" style="font-weight: bold;font-size: 12px;"></i>
            </a>
        </span>
        <input type="number" class="form-control ui-input-updown" v-model="number" :style="inputStyle">
        <span class="ui-input-group__btn ui-input-group__btn--right">
            <a @click="up" v-on:mousedown="downLong('up')" v-on:mouseup="upLong()">
                <i class="uikit-plus" style="font-weight: bold;font-size: 12px;"></i>
            </a>
        </span>
    </div>
</template>
<script>
    export default {
        props: {
            value: {
                default: 0
            },
            min: {},
            max: {},
            size: {},
            speed: {
                default: 100
            }
        },
        computed: {
            inputStyle() {
                var size = 4;
                if (this.size) {
                    size = this.size*1;
                } else if (this.max) {
                    size = (this.max+'').length + 1;
                }

                return {
                    width: size > 10 ? '100%' : `${size}em`
                }
            },
        },
        data: () => ({
            number: 0,
            $interval: null
        }),
        methods: {
            up () {
                if (this.max !== undefined && this.number < this.max) {
                    this.number++
                }
            },
            down () {
                if (this.min !== undefined && this.number > this.min) {
                    this.number--
                }
            },
            upLong () {
                clearInterval(this.$interval)
            },
            downLong (direction) {
                this.upLong()

                this.$interval = setInterval(() => {
                    this[direction]();
                }, this.speed)
            }
        },
        watch: {
            number (value) {
                this.$emit('input', value)
            },
            value (value) {
                this.number = value
            }
        },
        mounted () {
            if (this.value) {
                this.number = this.value
            }
        }
    }

</script>
