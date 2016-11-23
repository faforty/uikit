<template>
    <div class="ui-tabs">
        <div class="ui-tabs-revers-1">
            <ul class="ui-tabs__bar">
                <slot></slot>
                <div ref="indicator" class="ui-tabs__indicator" :style="{ 'height': indicatorHeight + 'px', [align]: 0 }"></div>
            </ul>
        </div>
        <div class="ui-tabs__b" v-show="indicatorBorder"></div>
        <slot name="contents"></slot>
    </div>
</template>
<script>
    import throttle from '../until/throttle.js'

    var Velocity = require('velocity-animate')

    export default {
        props: {
            percent: {
                type: Number,
                'default': 100
            },
            active: {
                required: false,
                'default': null
            },
            indicatorHeight: {
                type: Number,
                'default': 1
            },
            indicatorBorder: {
                type: Boolean,
                'default': true
            },
            align: {
                type: String,
                'default': 'bottom'
            }
        },
        events: {
            'tabs::on-select' (tab) {
                this.select(tab)
            }
        },
        watch: {
            active (value) {
                this.tabSelect(value);
            }
        },
        data: () => ({
            activeTab: false,
            indicator: {
                left:  '0',
                right: '0'
            }
        }),
        methods: {
            isSelected (tab) {
                return this.activeTab === tab
            },
            select (tab) {
                if (event) {
                    event.preventDefault()
                }

                this.activeTab = tab

                let target = tab.$el,
                    parent = target.parentElement

                let indicator       = this.$refs.indicator,
                    indicatorLeft   = parseInt(indicator.style.left, 10) || this.indicator.left,
                    indicatorRight  = parseInt(indicator.style.right, 10) || this.indicator.right

                this.moveIndicator(
                    indicatorLeft, target.offsetLeft,
                    indicatorRight, parent.offsetWidth - target.offsetLeft - target.offsetWidth
                    )

                let minWidth        = 200,
                    tabWidth        = target.offsetWidth,
                    tabsWidth       = this.$el.getElementsByClassName('ui-tabs__bar')[0].offsetWidth,
                    tabsScrollWidth = this.$el.getElementsByClassName('ui-tabs__bar')[0].scrollWidth;

                this.$emit('change', true)

                this.choiceContent(tab.name || tab.index)
            },
            resizeIndicator() {
                if (!this.activeTab) {
                    return;
                }


                let indicator   = this.$refs.indicator,
                    index       = this.activeTab.index,
                    tab         = this.activeTab.$el,
                    tabs        = tab.parentElement,
                    tabs_width  = tabs.offsetWidth,
                    tab_width   = Math.max(tabs_width, tabs.scrollWidth) / this.tabsCount;

                let width = this.$el.offsetWidth - parseInt(indicator.style.right) - parseInt(indicator.style.left),
                    pWidth = width * (100 - this.percent) / 100;



                if (tab_width !== 0 && tabs_width !== 0) {
                    indicator.style.right = (tabs_width - ((index + 1) * tab_width)) + pWidth + "px";
                    //indicator.style.left = (index * tab_width) + "px";
                }
            },
            moveIndicator (left, newLeft, right, newRight) {
                var indicator = this.$refs.indicator

                let width = this.$el.offsetWidth - newRight - newLeft,
                    pWidth = width * (100 - this.percent) / 100;

                newRight += pWidth

                let tX = left * 100 / this.$el.offsetWidth;

                // Update indicator
                if ((newLeft - left) >= 0) {

                    Velocity(indicator,
                        {right: newRight},
                        {duration: 300, queue: false, easing: 'easeOutQuad'}
                    )
                    Velocity(indicator,
                        {left: newLeft},
                        {duration: 300, queue: false, easing: 'easeOutQuad', delay: 90}
                    )
                } else {
                    Velocity(indicator,
                        {left: newLeft},
                        {duration: 300, queue: false, easing: 'easeOutQuad'}
                    )
                    Velocity(indicator,
                        {right: newRight},
                        {duration: 300, queue: false, easing: 'easeOutQuad', delay: 90}
                    )
                }
            },
            tabSelect(value) {
                this.$events.$emit('tab::select', value);
            },
            choiceContent (tabId) {
                if (this.$slots.contents[0] && this.$slots.contents[0].elm) {
                    let slotContent = this.$slots.contents[0].elm;

                    [].forEach.call(slotContent.children, el => {
                        if (el.hasAttribute('tab-name')) {
                            if (el.getAttribute('tab-name') == tabId) {
                                el.style = 'display: block'
                            } else {
                                el.style = 'display: none'
                            }
                        }
                    })
                }
            }
        },
        computed: {
            tabsCount() {
                if (!this.$children) {
                    return 0;
                }
                else {
                    return this.$children.length;
                }
            }
        },
        mounted () {
            window.addEventListener("resize", this.resizeIndicator)

            if (this.active) {
                this.tabSelect(this.active);
            }
        }
    }
</script>
