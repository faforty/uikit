<template>
    <div ref="container" class="ui-help-container" :class="{'ui-help--active':isActive, 'ui-help--shadow':shadow}">

        <slot name="page-header"></slot>

        <div class="ui-help">
            <div class="ui-help-wrapper" :style="wrapperStyle">
                <ui-button @click="toggleHelp" class="ui-help-toggle ui-btn--green ui-btn--circle ui-btn--sm ui-btn--no-shadow">
                    <i class="uikit-info"></i>
                </ui-button>

                <div v-if="label" class="ui-help-label">{{label}}</div>

                <div class="ui-help-text">
                    <ui-slider v-if="useSlider" :content="content" nav-absolute></ui-slider>
                    <template v-else>
                        <transition name="slide-appear" appear leave-active-class="fade-leave-active" mode="out-in">
                            <div :key="content" v-html="content"></div>
                        </transition>
                    </template>

                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import uiSlider from './ui-slider.vue';

export default {
    components: {
        uiSlider
    },

    props: {
        active: {
            type:    Boolean,
            default: false
        },
        content: {
            type: [String, Array],
        },
        label: {
            default: '',
        },
        shadow: {
            type:    Boolean,
            default: false,
        },
        contentOffset: [Number, String],
        // Deprecated
        text: {type: [String, Array]},
    },
    data: () => ({
        isActive:          false,
        autoContentOffset: 0,
    }),
    watch: {
        text(text) {
            this.content = text;
        },
        active(active) {
            this.isActive = active;
        },
    },
    computed: {
        useSlider() {
            return Array.isArray(this.content);
        },
        wrapperStyle() {
            var top = this.contentOffset ? this.contentOffset : this.autoContentOffset;
            return top ? {top: top+'px'} : {};
        }
    },
    methods: {
        toggleHelp() {
            this.isActive = !this.isActive;
            this.$emit('toggle-help');
        }
    },
    mounted() {
        this.isActive = this.active;

        var elem = this.$refs.container;
        var offset = elem.offsetTop;
        do {
            offset += elem.offsetParent.offsetTop;
        } while (elem = elem.parent);

        this.autoContentOffset = offset < window.screen.height / 2 ? offset : 0;
    },
};
</script>