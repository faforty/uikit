<template>
    <div class="ui-input-group">
        <span class="ui-input-group__btn ui-input-group__btn--left">
            <a @click="down" v-on:mousedown="downLong('down')" v-on:mouseup="upLong()">
                <i class="uikit-minus" style="font-weight: bold;font-size: 12px;"></i>
            </a>
        </span>
        <input type="number" class="form-control ui-input-updown" v-model="number">
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
                'default': 0
            },
            speed: {
                'default': 100
            }
        },
        data: () => ({
            number: 0,
            $interval: null
        }),
        methods: {
            up () {
                this.number++
            },
            down () {
                this.number--
            },
            upLong () {
                clearInterval(this.$interval)
            },
            downLong (up) {
                this.upLong()

                this.$interval = setInterval(() => {
                    if (up == 'up') {
                        this.number++
                    } else {
                        this.number--
                    }
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
