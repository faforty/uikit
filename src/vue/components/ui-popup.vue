<template>
    <div :class="[ 'ui-popup', { 'ui-popup--center': positionCenter, 'ui-popup--fixed': positionFixed, 'ui-popup--hide': !show }]">
        <div ref="box" :class="[ 'ui-popup__box', 'ui-hide-show', { 'ui-popup__box--center': boxCenter }]" :style="{ width: boxWidth, height: boxHeight }">
            <a class="ui-action ui-action--close ui-action--close--circle uikit-close-empty ui-popup__box__close" @click="close"></a>
            <slot></slot>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            positionCenter: {
                type: Boolean,
                'default': false
            },
            positionFixed: {
                type: Boolean,
                'default': false
            },
            boxCenter: {
                type: Boolean,
                'default': true
            },
            boxWidth: {
                type: String,
                'default': 0
            },
            boxHeight: {
                type: String,
                'default': 0
            }
        },
        data: () => ({
            show: true
        }),
        methods: {
            close () {
                this.$refs.box.classList.remove('ui-hide-show')
                this.$refs.box.classList.add('ui-hide-remove')

                setTimeout(() => {
                    this.$refs.box.classList.remove('ui-hide-remove')
                    this.show = false
                }, 200)
            }
        },
        mounted () {
            this.$refs.box.addEventListener('click', function (event) {
				event.stopPropagation()
			})
			document.body.addEventListener('click', function () {
				this.show = false
			}.bind(this))
        }
    }
</script>
