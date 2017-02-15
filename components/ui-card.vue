<template>
    <div :class="'card ' + className">
        <div class="card-info" v-if="info">
            <div class="info-text">{{ info.label }}</div>
            <div :class="{'info-icon': true, 'show-popup': showPopup }" @click="togglePopup">
                <i class="uikit-info" />
                <div class="info-popup" v-html="info.text" />
            </div>
        </div>

        <div class="card-content">
            <slot />
        </div>

        <div class="controls">
            <slot name="controls" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'ui-card',
    props: {
        className: {
            type: String,
            default: 'card-default'
        },
        info: {
            type: Object,
            validator: ({ text, label }) => {
                if (typeof text != 'string' || typeof label != 'string')
                    return false;

                return true;
            }
        }
    },
    data: () => ({
        preventHide: false,
        showPopup: false
    }),
    methods: {
        hidePopover() {
            if (this.preventHide)
                this.preventHide = false;
            else
                this.showPopup = false;
        },
        togglePopup() {
            this.showPopup = !this.showPopup;

            if (this.showPopup)
                this.preventHide = true;
        }
    },
    mounted() {
        document.body.addEventListener('click', this.hidePopover);
    },
    beforeDestroy() {
        document.body.removeEventListener('click', this.hidePopover);
    }
};
</script>