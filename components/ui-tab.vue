<template>
    <li ref="ui-tab" class="ui-tabs__bar__tab" @click="handleTabClick" :class="{[classes]: true, 'ui-tabs-material__bar__tab--active': selected}">
        <slot></slot>
    </li>
</template>

<script>
    import getClosestVueParent from '../until/getClosestVueParent';

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
        data: () => ({
            selected2: false
        }),
        methods: {
            select (id) {
                if (this.id == id) {
                    this.selected2 = true

                    // console.log(id)

                    this.setAsSelected()
                } else {
                    this.selected2 = false
                }
            },
            setAsSelected() {
                if (this.parentTabs) {
                    this.parentTabs.select(this)
                }
            },
            handleTabClick() {
                if (!this.disabled) {
                    this.setAsSelected();
                    this.$emit('click');
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
                return this.$parent.isSelected ? this.$parent.isSelected(this) : false;
            },
            classes () {
                return this.disabled ? 'ui-tabs-material__bar__tab--disabled' : ''
            }
        },
        mounted () {
            console.log(this);

            this.parentTabs = getClosestVueParent(this.$parent, 'ui-tabs')

            if (!this.parentTabs) {
                throw new Error('You must wrap the md-tab in a ui-tabs');
            }

            this.parentTabs.tabSelect(this.parentTabs.active)
        }
    }
</script>
