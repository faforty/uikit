<template>
    <ul class="ui-pagination ui-pagination--between">
        <li :class="[ 'ui-pagination__prev', { 'ui-pagination--hide': !prevLink }]">
            <span class="ui-pagination__prev__link">
                <ui-button @click="prevClick" :href="prevHref" class="ui-btn--circle ui-pagination__prev__link">
                    <i class="uikit-arrow-back"></i>
                </ui-button>
            </span>
            <span class="ui-pagination__name">{{ prevName }}</span>
        </li>
        <li class="ui-pagination__step">
            Шаг {{ step }} из {{ stepAll }}
        </li>
        <li class="ui-pagination__next">
            <span class="ui-pagination__name">{{ nextName }}</span>
            <span class="ui-pagination__next__link">
                <ui-popover ref="nextPopover">
                    <template slot="content">{{nextError}}</template>
                    <ui-button @click="nextClick" :href="nextHref" class="ui-btn--circle" :class="nextClass">
                        <i class="uikit-arrow-forward"></i>
                    </ui-button>
                </ui-popover>
            </span>
        </li>
    </ul>
</template>

<script>
import uiButton from './ui-button.vue';
import uiPopover from './ui-popover.vue';

export default {
    name: 'UiPagination',

    components: {
        uiButton,
        uiPopover
    },

    props: {
        nextLink: {
            type: [String, Boolean],
            default: false,
            required: true
        },
        nextName:  String,
        nextError: [String, Boolean],

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

    computed: {
        prevHref() {
            return typeof this.prevLink === 'string' ? this.prevLink : null
        },
        nextHref() {
            return typeof this.nextLink === 'string' ? this.nextLink : null
        },
        nextClass() {
            return [this.nextLink && !this.nextError ? 'ui-btn--green' : 'ui-btn--gray'];
        }
    },

    methods: {
        prevClick(event) {
            this.$emit('prev-click', event);
        },
        nextClick(event) {
            this.$emit('next-click', event);
            event.stopPropagation();
            if (this.nextError) {
                event.preventDefault();
                this.$refs.nextPopover.showPopover();
            }
        },
    }
}
</script>
