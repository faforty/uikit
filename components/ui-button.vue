<script>
import uiInkRipple from './ui-ink-ripple/ui-Ink-ripple.vue';

export default {
    components: {
        uiInkRipple
    },
    props: {
        href: String,
        type: String,
        disabled: Boolean
    },
    render(createElement) {
        let isDisabled = Boolean(this.disabled);
        let hasLink = Boolean(this.href);
        let tag = 'button';
        let options = {
            staticClass: 'ui-btn',
            attrs: {
                type: this.type || 'button',
                disabled: isDisabled
            },
            on: {
                click: ($event) => {
                    this.$emit('click', $event);
                }
            }
        };
        let ripple = createElement('ui-ink-ripple', {
            attrs: {
                mdDisabled: isDisabled
            }
        });
        if (hasLink) {
            tag = 'a';
            options.attrs.href = this.href;
            delete options.attrs.type;
        }

        var opt = [
            ripple
        ];

        if (this.$slots.default) {
            opt = opt.concat(this.$slots.default);
        }

        return createElement(tag, options, opt);
    }
};
</script>
