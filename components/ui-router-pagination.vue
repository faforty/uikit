<template>
    <ul :class="['ui-pagination', 'b-platform-pagination', 'ui-pagination--between']">
            <li :class="['ui-pagination__prev', { 'ui-pagination--hide': !prevLink }]">
                <router-link
                    class="ui-pagination__prev__link"
                    tag="span"
                    :to="{ path: prevLink }"
                    :title="prevName"
                >
                    <ui-button
                        @click="prevClick"
                        class="ui-btn--circle"
                    >
                            <i class="uikit-arrow-back" />
                    </ui-button>
                </router-link>
                <span class="b-platform-pagination__name">{{ prevName }}</span>
            </li>
            <li v-if="stepAll" class="ui-pagination__step">
                Шаг {{ step }} из {{ stepAll }}
            </li>
            <li class="ui-pagination__next">
                <span class="b-platform-pagination__name">{{ nextName }}</span>
                <router-link
                    class="ui-pagination__next__link"
                    tag="span"
                    :to="{ path: nextLink }"
                    :title="nextName"
                >
                    <ui-button
                        @click="nextClick"
                        :class="['ui-btn--circle', { 'ui-btn--green': nextLink, 'ui-btn--gray': !nextLink } ]"
                    >
                            <i class="uikit-arrow-forward" />
                    </ui-button>
                </router-link>
            </li>
    </ul>
</template>

<script>
import uiButton from './ui-button.vue';

export default {
    props: {
        nextLink: {
            type: String,
            required: true
        },
        nextName: {
            type: String,
            required: true
        },
        prevLink: {
            type: String,
            required: true
        },
        prevName: {
            type: String,
            required: true
        },
        step: {
            type: [String, Number],
            default: 0
        },
        stepAll: {
            type: [String, Number],
            default: false
        }
    },
    components: {
        uiButton
    },
    methods: {
        prevClick() {
            this.$emit('prev-click');
        },
        nextClick() {
            this.$emit('next-click');
        }
    },
    name: 'UiRouterPagination'
};
</script>