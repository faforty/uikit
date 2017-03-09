<template>
  <ui-label :filled="filled" :label-show="true">
    <template slot="label"><slot /></template>
    <textarea
        ref="textarea"
        class="form-control ui-comment-field"
        :autofocus="autofocus"
        :style="style"
        :value="value"
        @input="handleChangeMessage"
    />
  </ui-label>
</template>

<script>
import uiLabel from './ui-label.vue';

export default {
  components: {
    uiLabel
  },

  props: {
    height: [String],
    value: [String],
    autofocus: [Boolean]
  },

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
    focus() {
        this.$refs.textarea.focus();
    },

    handleChangeMessage(val) {
      this.$emit('input', val.target.value);
    }
  }
}
</script>