<template>
    <ui-pagination
        :same-buttons="sameButtons"
        :prev-link="prevLink"
        :next-link="nextLink"
        :prev-name="prevName"
        :next-name="nextName"
        :next-error="nextError"
        :next-icon="nextIcon"
        :prev-icon="prevIcon"
        :step="step"
        :step-all="stepAll"
        @prev-click.prevent="onPrevClick"
        @next-click.prevent="onNextClick"
    />
</template>

<script>
import uiPagination from './ui-pagination.vue';

export default {
    name: 'UiRouterPagination',

    props: {
        sameButtons: {
            type: Boolean,
            default: false
        },
        nextLink: {
            type: [String, Boolean],
            default: false,
            required: true
        },
        nextName: String,
        nextError: [String, Boolean],
        prevLink: {
            type: [String, Boolean],
            default: false
        },
        prevName: String,
        prevIcon: {type: String, default: 'uikit-arrow-back'},
        nextIcon: {type: String, default: 'uikit-arrow-forward'},
        step: {
            type: [String, Number],
            default: 0
        },
        stepAll: {
            type: [String, Number, Boolean],
            default: false
        }
    },

    components: {
        uiPagination
    },

    methods: {
        pushRoute(route) {
            if (this.$router)
                this.$router.push(route);
        },

        onPrevClick() {
            this.$emit('prev-click');

            this.pushRoute(this.prevLink);
        },

        onNextClick() {
            this.$emit('next-click');

            this.pushRoute(this.nextLink);
        }
    }
};
</script>