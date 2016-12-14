<script>
import * as InkRipple from './InkRipple.js'

export default {
    props: {
      mdDisabled: Boolean
    },
    render(createElement) {
      return createElement('div', {
        staticClass: 'ui-ink-ripple'
      });
    },
    watch: {
      mdDisabled() {
        if (this.mdDisabled) {
          InkRipple.unregisterMouseEvent(this.$el.parentNode);
        } else {
          InkRipple.createRipple(this.$el.parentNode, this.$el);
        }
      }
    },
    mounted() {
      if (!this.mdDisabled) {
        InkRipple.createRipple(this.$el.parentNode, this.$el);
      }
    },
    destroyed() {
      InkRipple.unregisterMouseEvent(this.$el.parentNode);
    }

}
</script>
