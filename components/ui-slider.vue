<template>
    <div class="ui-slider">
        <div class="ui-slider-toggle">
            <a v-for="(item, index) in content" :class="{'active': index == currentSlide}" @click="selectSlide(index)"></a>
        </div>

        <template >
            <transition name="slide-appear" appear leave-active-class="fade-leave-active" mode="out-in">
                <div :key="currentSlide" v-html="content[currentSlide]"></div>
            </transition>
        </template>

        <!-- <slot name="slide"></slot> -->
    </div>
</template>

<script>
export default {
    props: {
        play: {
            type:    Boolean,
            default: true,
        },
        speed: {
            default: 5000,
        },
        active: {
            type:    Number,
            default: 0,
        },
        content: {
            type: [Array],
        },
    },

    data: () => ({
        currentSlide: 0,
        playSlide:    null,
    }),

    watch: {
        active(active) {
            this.currentSlide = active*1;
        }
    },

    methods: {
        start() {
            if (this.speed >= 1000) {
                setTimeout(function(){
                    if (this.playSlide) {
                        this.nextSlide();
                        this.start();
                    }
                }.bind(this), this.speed);
            }
        },

        stop() {
            this.playSlide = false;
        },

        nextSlide() {
            this.toSlide(this.currentSlide+1);
        },

        prevSlide() {
            this.toSlide(this.currentSlide-1);
        },

        toSlide(index) {
            if (index < 0) {
                index = this.content.length - 1;
            } else if (index > this.content.length - 1) {
                index = 0;
            }
            this.currentSlide = index;
        },

        selectSlide(index) {
            this.stop();
            this.toSlide(index);
        }
    },
    mounted() {
        this.currentSlide = this.active;
        this.playSlide    = this.play;

        if (this.playSlide) {
            this.start();
        }
    }
}
</script>