<template>
    <li class="ui-tabs__bar__tab" @click="setAsSelected" :class="{[classes]: true, 'ui-tabs-material__bar__tab--active': selected}">
        <slot></slot>
    </li>
</template>
<script>
    export default {
        props: {
            disabled: {
                type: Boolean,
                required: false,
                'default': false
            },
            name: {
                type: String,
                required: false,
                'default': null
            }
        },
        events: {
            'tab::select': function (id) {
                this.select(id);
            }
        },
        methods: {
            select (id) {
                if (this.id == id) {
                    this.setAsSelected()
                }
            },
            setAsSelected() {
                if (!this.disabled) {
                    this.$events.$emit('tabs::on-select', this)
                }
            }
        },
        computed: {
            id () {
                if (this.name) {
                    return this.name;
                } else {
                    return this.index;
                }
            },
            index () {
                return this.$parent.$children.indexOf(this)
            },
            selected () {
                return this.$parent.isSelected(this)
            },
            classes () {
                return this.disabled ? 'ui-tabs-material__bar__tab--disabled' : ''
            }
        }
    }
</script>
