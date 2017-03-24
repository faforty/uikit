<template>
  <ui-label :filled="filled" :label-show="true">
    <template slot="label"><slot /></template>
    <textarea
        ref="textarea"
        key="textarea"
        class="form-control ui-comment-field"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :rows="rows"
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
    rows:        String,
    value:       String,
    autofocus:   Boolean,
    placeholder: String
  },

  computed: {
    filled() {
      return !!this.value;
    }
  },

  methods: {
    focus() {
        this.$refs.textarea.focus();
    },

    handleChangeMessage(val) {
      this.$emit('input', val.target.value);
    }
  },
}
</script>