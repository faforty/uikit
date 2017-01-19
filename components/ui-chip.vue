<template>
    <div class="ui-chip" v-if="!hide">
        <img class="ui-chip__image" v-if="image" :src="image">
        <slot></slot>
        <a class="ui-chip__close uikit-close-empty" v-if="removable || removeByCallback" @click="remove"></a>
    </div>
</template>
<script>
    export default {
         props: {
            id: String,
            /**
             * @prop removable
             * @type {Boolean}
             * @default false
             * @description indicate this chip is removable or not
             */
            removable: {
                type: Boolean,
                default: false
            },
            /**
             * @prop image
             * @type {String}
             * @default ''
             * @description src of the chip image
             */
            image: {
                type: String,
                default: ''
            },
            removeByCallback: {
                type: Boolean,
                default: false
            }
        },
        data: () => ({
            hide: false
        }),
        methods: {
            remove () {
                if (this.removeByCallback) {
                    this.$emit('delete');
                    return;
                }

                this.hide = true

                if (this.$parent.removeItem && this.id) {
                    this.$parent.removeItem(this.id)
                }
            }
        }
    }
</script>
