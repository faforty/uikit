<template>
  <span v-el:trigger>
    <slot></slot>
  </span>
    <div v-el:popover v-if="show"
         :class="['popover',placement]"
         :transition="effect"
    >
        <div class="arrow"></div>
        <h3 class="popover-title" v-if="title">
            <slot name="title">{{title}}</slot>
        </h3>
        <div class="popover-content">
            <slot name="content">{{{content}}}</slot>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {}
        }
    }
</script>
