<template>
    <div class="ui-accordion">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        events: {
            'collapsible::open': function (id, expendable) {
                return this.open(id)
            },
            'collapsible::close': function  (id) {
                return this.close(id)
            }
        },
        data () {
            return {}
        },
        methods: {
            open(id) {
                if (typeof this.opened != "undefined") {
                    if (this.expendable) {
                        this.opened.push(id);
                    }
                    else {
                        this.opened = id;
                    }
                }
                // propagate event to children
                this.$events.$emit('collapsible-item::open', id, this.expendable)

                return true
            },
            close(id) {
                if (typeof this.opened != "undefined") {
                    if (this.expendable) {
                        this.opened.$remove(id);
                    }
                    else {
                        this.opened = '';
                    }
                }
                // propagate event to children
                this.$events.$emit('collapsible-item::close', id)

                return true
            }
        }
    }
</script>
