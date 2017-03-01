<template>
    <ui-pagination
        :prev-link="prevLink"
        :next-link="nextLink"
        :prev-name="prevName"
        :next-name="nextName"
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
        nextLink: {
            type: [String, Boolean],
            default: false,
            required: true
        },
        nextName: {
            type: String
        },
        prevLink: {
            type: [String, Boolean],
            default: false
        },
        prevName: {
            type: String
        },
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