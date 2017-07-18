<template>
    <ul class="ui-pagination ui-pagination--between">
        <li :class="[ 'ui-pagination__prev', { 'ui-pagination--hide': !prevLink }]">
            <span class="ui-pagination__prev__link">
                <ui-button @click="prevClick" :href="prevHref" class="ui-btn--circle ui-pagination__prev__link">
                    <i :class="prevIcon"></i>
                </ui-button>
            </span>
            <span class="ui-pagination__name">{{ prevName }}</span>
        </li>
        <li class="ui-pagination__step" v-if="stepAll">
            <template v-if="mainStep">
                Шаг {{ mainStep }}. Подшаг {{ step }} из {{ stepAll }}.
            </template>
            <template v-else>
                Шаг {{ step }} из {{ stepAll }}
            </template>
        </li>
        <li class="ui-pagination__next">
            <span class="ui-pagination__name">{{ nextName }}</span>
            <span class="ui-pagination__next__link">
                <ui-popover v-if="nextError" ref="nextPopover" placement="top-left">
                    <div slot="content" v-html="nextError"></div>
                    <ui-button @click="nextClick" :href="nextHref" class="ui-btn--circle" :class="nextClass">
                        <i :class="nextIcon"></i>
                    </ui-button>
                </ui-popover>

                <ui-button v-else @click="nextClick" :href="nextHref" class="ui-btn--circle" :class="nextClass">
                    <i :class="nextIcon"></i>
                </ui-button>
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
        sameButtons: {
            type: Boolean,
            default: false
        },
        nextLink: {
            type: [String, Boolean],
            default: false,
            required: true
        },
        nextName:  String,
        nextError: {
            type:    [String, Boolean],
            default: false,
        },
        prevLink: {
            type: [String, Boolean],
            default: false
        },
        prevName: {
            type: String
        },
        prevIcon: {type: String, default: 'uikit-arrow-back'},
        nextIcon: {type: String, default: 'uikit-arrow-forward'},
        mainStep: {
            type: [String, Number, Boolean],
            default: false
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
            return [this.nextLink && !this.nextError ? !this.sameButtons && 'ui-btn--green' : 'ui-btn--gray'];
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
