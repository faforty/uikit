<template>
    <div>
        <div class="drop-out">
            <ui-input icon="uikit-search" icon-align="right" v-on:keyup="search"></ui-input>
            <div class="drop-out__results" v-show="opened">
                sdds
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data: () => ({
            opened: true
        }),
        methods: {
            search () {
                console.log(4343)
                this.opened = true
            }
        }
    }
</script>
п
