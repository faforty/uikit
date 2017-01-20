<template>
    <ui-label :filled="filled" :label-show="true">
        <template slot="label"><slot></slot></template>

        <textarea class="form-control ui-comment-field" v-model="message"></textarea>
    </ui-label>
</template>

<script>
import uiLabel from './ui-label.vue';

export default {
    components: {
        uiLabel
    },
    watch: {
        message (val) {
            this.filled = val ? true : false
            this.$emit('input', val)
        }
    },
    data: () => ({
        message: '',
        filled: false
    })
}
</script>