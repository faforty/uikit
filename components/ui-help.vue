<template>
    <div class="ui-help-container" :class="{'ui-help--active':isActive}">

        <slot name="page-header"></slot>

        <div class="ui-help">
            <ui-button @click="toggleHelp" class="ui-help-toggle ui-btn--green ui-btn--circle ui-btn--sm ui-btn--no-shadow">
                <i class="uikit-info"></i>
            </ui-button>

            <div v-if="label" class="ui-help-label">{{label}}</div>

                <div class="ui-help-text">
                    <transition name="slide-appear" appear leave-active-class="fade-leave-active" mode="out-in">
                        <div :key="text" v-html="text"></div>
                    </transition>

                    <slot></slot>
                </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        active: {
            type:    Boolean,
            default: false
        },
        text: {
            type: [String, Array],
        },
        label: {
            default: 'Справка',
        }
    },
    data: () => ({
        isActive: false,
    }),
    watch: {
        active(active) {
            this.isActive = active;
        },
    },
    methods: {
        toggleHelp() {
            this.isActive = !this.isActive;
            this.$emit('toggle-help');
        }
    },
    mounted() {
        this.isActive = this.active;
    },
};
</script>