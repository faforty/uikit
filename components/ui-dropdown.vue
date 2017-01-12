<template>
    <div :class="{ 'ui-dropdown': true, 'ui-dropdown--open': opened}">
        <div class="ui-dropdown__content">
            <div style="cursor: pointer;z-index: 2;position: relative;" @click="open">
                <slot></slot>
            </div>
            <div :class="{ 'ui-dropdown__overlay': true, 'ui-dropdown__overlay--list': true, 'ui-animation-zoom enter': opened }">
                <slot name="list"></slot>
            </div>
        </div>
        <div :class="{ 'ui-dropdown__overlay': true, 'ui-animation-zoom enter': opened }"></div>
    </div>
</template>

<script>
    export default {
        data: () => ({
            opened: false
        }),
        methods: {
            open () {
                this.opened = !this.opened
            }
        },
        mounted () {
            this.$el.addEventListener('click', function (event) {
                event.stopPropagation()
            })
            document.body.addEventListener('click', function () {
                this.opened = false
            }.bind(this))
        }
    }

</script>
