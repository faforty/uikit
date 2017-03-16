<template>
    <ui-label :form-group="formGroup" :label-show="label" :label-align="labelAlign" :state="fieldState" :class="{'ui--disabled':disabled}">
        <template slot="label"><slot></slot></template>

        <div>
            <div class="ui-input-group">
                <a class="ui-input-group__btn ui-input-group__btn--left" @click="down" @mousedown="push('down')" @mouseup="stopPush">
                    <i class="uikit-minus" style="font-weight: bold;font-size: 12px;"></i>
                </a>
                <input type="number" class="form-control ui-input-updown"
                    :value="value"
                    :style="inputStyle"
                    @change="(e) => { this.$emit('input', e.target.value) }"
                >
                <a class="ui-input-group__btn ui-input-group__btn--right" @click="up" @mousedown="push('up')" @mouseup="stopPush">
                    <i class="uikit-plus" style="font-weight: bold;font-size: 12px;"></i>
                </a>
            </div>
        </div>

    </ui-label>
</template>
<script>
import uiLabel from './ui-label.vue';
export default {
    components: {
        uiLabel,
    },
    props: {
        value: {
            default: 0
        },
        min: {},
        max: {},
        size: {},
        speed: {
            default: 100
        },
        formGroup: {
            type:    Boolean,
            default: true
        },
        label: {
            type:    Boolean,
            default: true
        },
        labelAlign: String,
        disabled:   Boolean,
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
        $interval: null
    }),
    methods: {
        up() {
            if (this.max === undefined || this.value < this.max) {
                var value = this.value;
                value++;

                this.$emit('input', value);
            }
        },
        down() {
            if (this.min === undefined || this.value > this.min) {
                var value = this.value;
                value--;

                this.$emit('input', value);
            }
        },
        stopPush() {
            clearInterval(this.$interval)
        },
        push(direction) {
            this.stopPush()

            this.$interval = setInterval(() => {
                this[direction]();
            }, this.speed)
        }
    }
}

</script>