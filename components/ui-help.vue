<template>
    <div class="ui-help" :class="{'ui-help--active':isActive}">
        <ui-button @click="toggleHelp" class="ui-help-toggle ui-btn--green ui-btn--circle ui-btn--sm ui-btn--no-shadow">
            <i class="uikit-info"></i>
        </ui-button>

        <div v-if="label" class="ui-help-label">{{label}}</div>

        <!-- <div :class="{help: true, hide: !showTips }"> -->
            <!-- <div class="help-bg"></div> -->



            <transition name="slide-appear" appear leave-active-class="fade-leave-active" mode="out-in">
                <div class="ui-help-text">
                    <slot></slot>
                </div>
            </transition>
        <!-- </div> -->
    </div>
</template>

<script>
export default {
    props: {
        active: {
            type: Boolean,
            default: true
        },
        label: {
            default: 'Справка',
        }
        // showTips: {
        //     type: Boolean,
        //     default: true
        // }
    },
    data: () => ({
        isActive: false,
    }),
    watch: {
        active(active) {
            this.isActive = active;
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
    }
};
</script>

<style lang="sass">
.ui-help {
    background:   #fff7dd;
    // position:  absolute;
    position:     fixed;
    bottom:       0;
    top:          0;
    width:        30%;
    height:       100%;
    padding:      130px 50px;
    z-index:      1;
    transition:   all .4s;
    margin-right: -30%;
    right:        50px;

    &.ui-help--active {
        margin-right: 0;
        right:        0;
        box-shadow:   0 0 50px rgba(0,0,0,.1);

        .ui-help-label {
            opacity:    0;
            margin-top: 55px;
        }

        .ui-help-text {
            opacity:    1;
            transition: opacity 1s;
        }
    }

    .ui-help-toggle {
        position:    absolute;
        left:        0;
        top:         60px;
        margin-left: -20px
    }

    .ui-help-label {
        position:         absolute;
        right:            100%;
        font-weight:      300;
        color:            mix(#fff7dd, #000, 70);
        text-transform:   uppercase;
        transform:        rotate(-90deg);
        transform-origin: top right;
        white-space:      nowrap;
        font-size:        18px;
        letter-spacing:   1.6px;
        transition:       all .4s;
        margin:           5px -15px 0 0;
        opacity:          1;
    }

    .ui-help-text {
        opacity:     1;
        font-size:   18px;
        line-height: 28px;
        font-weight: 300;
        // padding:     0 50px;
        color:       #333;
        transition:  all .4s;
        opacity:     0;
    }

}

@media (max-width: 768px) {
    .ui-help {
        // position: relative;
        position:    static;
        padding:     0;
        width:       100%;
        margin:      0 0 30px;
        background:  transparent;
        max-height: 0;
        overflow: hidden;

        &.ui-help--active {
            box-shadow: none;
            max-height: 9999px;

            .ui-help-toggle {
                transition: all 0;
            }
            .ui-help-text {
                background: #fff7dd;
            }
        }

        .ui-help-text {
            padding: 30px;
        }

        .ui-help-label {
            display: none;
        }

        .ui-help-toggle {
            // position: fixed;
            // top:      60px;
            // right:    30px;
            // left:     auto;
            position:    absolute;
            top:         auto;
            left:        auto;
            right:       25px;
            margin-top: -60px;

        }
    }
}
</style>