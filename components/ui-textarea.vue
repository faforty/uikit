<template>
  <ui-label :filled="filled" :label-show="true">
  <template slot="label"><slot /></template>
    <textarea class="form-control ui-comment-field" :style="style" :value="value" @input="handleChangeMessage" />
  </ui-label>
</template>

<script>
import uiLabel from 'uikit-agro24/components/ui-label';

export default {
  components: {
    uiLabel
  },

  props: [
    'height',
    'value'
  ],

  computed: {
    style() {
      return {
        height: this.height
      };
    },
    filled() {
      return this.value != '';
    }
  },

  methods: {
    handleChangeMessage(val) {
      this.$emit('input', val.target.value);
    }
  }
}
</script>